#!/usr/bin/env python3
"""Audit coverage or merge source-verified user counts; no network requests."""

import argparse
import calendar
from copy import deepcopy
from datetime import date
import json
from pathlib import Path
import re
import sys
from urllib.parse import urlsplit

BLOCK = re.compile(r'<script\b[^>]*\bid=["\']ai-data["\'][^>]*>(.*?)</script\s*>', re.S | re.I)
REQUIRED = {'date', 'value', 'relation', 'tier', 'metric', 'scope', 'timeLabel', 'provider', 'url'}


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f'JSON 重复字段：{key}')
        result[key] = value
    return result


def load_json(text):
    return json.loads(text, object_pairs_hook=unique_object)


def iso_date(value):
    if not isinstance(value, str) or not re.fullmatch(r'\d{4}-\d{2}-\d{2}', value):
        raise ValueError(f'日期须为 YYYY-MM-DD：{value}')
    return date.fromisoformat(value)


def read_page(path):
    html = path.read_text(encoding='utf-8')
    matches = list(BLOCK.finditer(html))
    if len(matches) != 1:
        raise ValueError('页面必须包含唯一的 #ai-data JSON')
    block = matches[0]
    data = load_json(block.group(1))
    validate(data)
    return html, block, data


def validate_point(point, start, end):
    if not isinstance(point, dict) or not REQUIRED <= point.keys():
        raise ValueError('记录缺少必填字段')
    if type(point['value']) is not int or point['value'] <= 0:
        raise ValueError('value 必须为大于 0 的原始计数整数，不是万或 M')
    if point['relation'] not in ('eq', 'gt', 'approx') or point['tier'] not in ('official', 'third-party'):
        raise ValueError('relation 或 tier 无效')
    for key in ('metric', 'scope', 'timeLabel', 'provider', 'url'):
        if not isinstance(point[key], str) or not point[key].strip():
            raise ValueError(f'{key} 必须是非空文本')
    when = iso_date(point['date'])
    if not start <= when <= end:
        raise ValueError(f'{when} 超出图表统计范围 {start} 至 {end}')
    url = urlsplit(point['url'])
    if url.scheme != 'https' or not url.hostname or url.username or url.password:
        raise ValueError('来源必须是无内嵌凭据的 HTTPS 链接')
    if 'period' in point:
        period = point['period']
        if not isinstance(period, str) or not re.fullmatch(r'\d{4}-\d{2}', period):
            raise ValueError('period 须为 YYYY-MM')
        month = iso_date(period + '-01')
        last = date(month.year, month.month, calendar.monthrange(month.year, month.month)[1])
        if when != last or period.replace('-', '.') not in point['timeLabel']:
            raise ValueError('月度记录必须按统计月末定位，标签须对应统计月份')
    published = iso_date(point['publishedOn']) if 'publishedOn' in point else None
    verified = iso_date(point['verifiedOn']) if 'verifiedOn' in point else None
    if published and not when <= published <= end:
        raise ValueError('披露日期不能早于统计日期或晚于核对日期')
    if verified and not (published or when) <= verified <= end:
        raise ValueError('核验日期须介于统计/披露日期和页面核对日期之间')
    if 'sourceNote' in point and (not isinstance(point['sourceNote'], str) or not point['sourceNote'].strip()):
        raise ValueError('sourceNote 须为非空来源定位说明')


def validate(data):
    start, end = iso_date(data['usersStart']), iso_date(data['checkedOn'])
    if start > end or not isinstance(data['users'], dict) or not data['users']:
        raise ValueError('用户数据或时间范围无效')
    all_keys = set()
    for brand, entry in data['users'].items():
        if not isinstance(entry['points'], list):
            raise ValueError(f'{brand} 的 points 必须是数组')
        seen = set()
        for point in entry['points']:
            validate_point(point, start, end)
            key = (point['date'], point['scope'])
            if key in seen:
                raise ValueError(f'{brand} 重复统计日期与范围：{key}')
            seen.add(key)
            all_keys.add((brand, *key))
    disclosures = data.get('disclosures', [])
    if not isinstance(disclosures, list):
        raise ValueError('disclosures 必须是数组')
    for point in disclosures:
        if not isinstance(point, dict) or point.get('brand') not in data['users']:
            raise ValueError('独立披露只能引用已收录品牌')
        validate_point(point, start, end)
        if not point.get('sourceNote') or not point.get('verifiedOn'):
            raise ValueError('独立披露须有来源定位与核验日期')
        key = (point['brand'], point['date'], point['scope'])
        if key in all_keys:
            raise ValueError(f'重复趋势/独立披露记录：{key}')
        if any(p['scope'] == point['scope'] for p in data['users'][point['brand']]['points']):
            raise ValueError('已有趋势范围不能重复收于独立披露')
        all_keys.add(key)


def audit(data):
    start, end = iso_date(data['usersStart']), iso_date(data['checkedOn'])
    month, months = start.replace(day=1), []
    while month <= end:
        last = date(month.year, month.month, calendar.monthrange(month.year, month.month)[1])
        if last >= start and last <= end:
            months.append(month.strftime('%Y-%m'))
        month = date(month.year + (month.month == 12), month.month % 12 + 1, 1)
    rows = []
    for brand, entry in data['users'].items():
        points = entry['points']
        covered = {p['period'] for p in points if 'period' in p}
        rows.append({'brand': brand, 'name': entry['name'], 'metric': entry['metric'],
                     'points': len(points), 'official': sum(p['tier'] == 'official' for p in points),
                     'disclosures': sum(p['brand'] == brand for p in data.get('disclosures', [])),
                     'latest': max((p['date'] for p in points), default=None),
                     'monthlyMissing': [m for m in months if m not in covered] if covered else None,
                     'withoutEvidenceNote': sum(not p.get('sourceNote') or not p.get('verifiedOn') for p in points)})
    return rows


def merge(data, records, replace_existing=False, checked_on=None, disclosures=False):
    updated = deepcopy(data)
    if checked_on:
        if iso_date(checked_on) < iso_date(data['checkedOn']):
            raise ValueError('不能把页面核对日期倒退')
        updated['checkedOn'] = checked_on
    if not isinstance(records, list) or not records:
        raise ValueError('导入文件须为非空 JSON 数组')
    added = changed = skipped = 0
    incoming = set()
    for record in records:
        if not isinstance(record, dict) or record.get('brand') not in updated['users']:
            raise ValueError('导入只能引用当前已收录品牌')
        point = {key: value for key, value in record.items() if key != 'brand'}
        if not point.get('sourceNote') or not point.get('verifiedOn'):
            raise ValueError('导入记录须包含 verifiedOn 和 sourceNote，先核验来源')
        validate_point(point, iso_date(updated['usersStart']), iso_date(updated['checkedOn']))
        brand = record['brand']
        key = (brand, point['date'], point['scope'])
        if key in incoming:
            raise ValueError(f'导入批次内有重复记录：{key}')
        incoming.add(key)
        points = updated.setdefault('disclosures', []) if disclosures else updated['users'][brand]['points']
        if disclosures:
            point = {'brand': brand, **point}
        peers = [] if disclosures else [p for p in points if p['scope'] == point['scope']]
        if not disclosures and points and not peers:
            raise ValueError(f'{brand} 的统计范围发生变化，不能自动接入已有曲线')
        if peers and point['metric'] not in {p['metric'] for p in peers}:
            raise ValueError(f'{brand} 的统计指标与已有口径不一致')
        if peers and point['tier'] not in {p['tier'] for p in peers}:
            raise ValueError(f'{brand} 的来源性质与已有统计系列不一致')
        families = {p['provider'].split(' · ')[0] for p in peers}
        if families and point['provider'].split(' · ')[0] not in families:
            raise ValueError(f'{brand} 的统计机构变化，不能拼接为同一条曲线')
        existing = next((p for p in points if p['date'] == point['date'] and p['scope'] == point['scope'] and (not disclosures or p['brand'] == brand)), None)
        if existing == point:
            skipped += 1
        elif existing is not None:
            if not replace_existing:
                raise ValueError(f'{key} 与已有记录冲突；核实后才使用 --replace-existing')
            points[points.index(existing)] = point
            changed += 1
        else:
            points.append(point)
            added += 1
    for entry in updated['users'].values():
        entry['points'].sort(key=lambda p: (p['date'], p['scope']))
    if 'disclosures' in updated:
        updated['disclosures'].sort(key=lambda p: (p['date'], p['brand'], p['scope']))
    validate(updated)
    return updated, added, changed, skipped


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--page', type=Path, default=Path(__file__).resolve().parents[4] / 'ai-user-scale.html')
    commands = parser.add_subparsers(dest='command', required=True)
    check = commands.add_parser('audit', help='检查格式、重复记录及完整月份缺口')
    check.add_argument('--json', action='store_true')
    update = commands.add_parser('merge', help='预览或导入已核实的记录')
    update.add_argument('input', type=Path)
    update.add_argument('--write', action='store_true')
    update.add_argument('--replace-existing', action='store_true')
    update.add_argument('--disclosures', action='store_true', help='仅写入来源表的独立披露，不进入趋势曲线')
    update.add_argument('--checked-on')
    args = parser.parse_args()
    try:
        html, block, data = read_page(args.page)
        if args.command == 'audit':
            rows = audit(data)
            if args.json:
                print(json.dumps(rows, ensure_ascii=False, indent=2))
            else:
                print(f"格式有效 · {len(rows)} 个品牌 · {sum(r['points'] for r in rows)} 个趋势点 · {sum(r['disclosures'] for r in rows)} 条独立披露")
                for row in rows:
                    missing = ', '.join(row['monthlyMissing']) if row['monthlyMissing'] is not None else '时点披露，不按缺月补值'
                    print(f"{row['name']}: {row['points']} 点 / 官方 {row['official']} / 独立披露 {row['disclosures']} / 最近 {row['latest']}")
                    print(f"  缺月：{missing or '无'}；缺来源定位或核验日：{row['withoutEvidenceNote']} 点")
            return 0
        records = load_json(args.input.read_text(encoding='utf-8'))
        updated, added, changed, skipped = merge(data, records, args.replace_existing, args.checked_on, args.disclosures)
        print(f"新增 {added} / 修正 {changed} / 跳过 {skipped}")
        for record in records:
            print(f"  {record['brand']} {record['date']} {record['value']} ({record['relation']}, {record['tier']})")
        if not args.write:
            print('仅预览；加 --write 后写入。')
            return 0
        if updated == data:
            print('无变化，未写入。')
            return 0
        encoded = json.dumps(updated, ensure_ascii=False, indent=2).replace('<', '\\u003c')
        result = html[:block.start(1)] + '\n' + encoded + '\n  ' + html[block.end(1):]
        if updated['checkedOn'] != data['checkedOn']:
            old, new = data['checkedOn'], updated['checkedOn']
            old_time = f'<time datetime="{old}">{old.replace("-", ".")}</time>'
            new_time = f'<time datetime="{new}">{new.replace("-", ".")}</time>'
            if result.count(old_time) != 1:
                raise ValueError('页面核对日期标签不唯一，需人工定位')
            result = result.replace(old_time, new_time, 1)
        if args.page.read_text(encoding='utf-8') != html:
            raise ValueError('页面在读取后发生变化，请重新预览')
        args.page.write_text(result, encoding='utf-8')
        print('已写入；公司数据与其它页面内容保留。')
        return 0
    except (ValueError, KeyError, TypeError, OSError) as exc:
        print(f'错误：{exc}', file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
