"""Behavior checks for the offline user-scale import tool."""

from copy import deepcopy
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / '.agents/skills/update-ai-user-scale/scripts/update_user_scale.py'


def codex_record(**changes):
    record = {'brand': 'codex', 'date': '2026-04-21', 'value': 4000000,
              'relation': 'gt', 'tier': 'official', 'metric': '周活用户（WAU）',
              'scope': 'codex-wau', 'timeLabel': '2026.04.21 披露', 'provider': 'OpenAI',
              'url': 'https://openai.com/index/scaling-codex-to-enterprises-worldwide/',
              'publishedOn': '2026-04-21', 'verifiedOn': '2026-10-09',
              'sourceNote': '正文披露每周使用人数超过400万。'}
    record.update(changes)
    return record


class UserScaleImportTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.page = Path(self.tmp.name) / 'ai-user-scale.html'
        self.batch = Path(self.tmp.name) / 'input.json'
        original = codex_record(date='2026-03-19', value=2000000, publishedOn='2026-03-19', timeLabel='2026.03.19 披露')
        original.pop('brand')
        kimi = {'date': '2025-01-31', 'period': '2025-01', 'value': 19430000,
                'relation': 'eq', 'tier': 'third-party', 'metric': 'App 月活（MAU）',
                'scope': 'app', 'timeLabel': '2025.01', 'provider': 'AICPB',
                'url': 'https://www.aicpb.com/zh/ai-rankings/products/china-ai-rankings/apps'}
        self.data = {'usersStart': '2025-01-01', 'checkedOn': '2026-10-09',
                     'users': {'codex': {'name': 'Codex', 'metric': '周活用户（WAU）', 'points': [original]},
                               'kimi': {'name': 'Kimi', 'metric': 'Kimi App 月活', 'points': [kimi]}},
                     'companies': {'valuation': [{'name': 'preserve this', 'value': 852}]}}
        self.prefix = '<main>保留页面内容<time datetime="2026-10-09">2026.10.09</time></main>\n<script type="application/json" id="ai-data">'
        self.suffix = '</script>\n<footer>其它内容</footer>'
        self.page.write_text(self.prefix + json.dumps(self.data, ensure_ascii=False) + self.suffix, encoding='utf-8')

    def run_cli(self, *args, records=None):
        if records is not None:
            self.batch.write_text(json.dumps(records, ensure_ascii=False), encoding='utf-8')
        return subprocess.run([sys.executable, str(SCRIPT), '--page', str(self.page), *args], text=True, capture_output=True)

    def read_data(self):
        text = self.page.read_text(encoding='utf-8')
        return json.loads(text.split('<script type="application/json" id="ai-data">')[1].split('</script>')[0])

    def test_audit_reports_gaps_without_filling_them(self):
        before = self.page.read_bytes()
        result = self.run_cli('audit', '--json')
        self.assertEqual(result.returncode, 0, result.stderr)
        rows = json.loads(result.stdout)
        self.assertIsNone(rows[0]['monthlyMissing'])
        self.assertNotIn('2025-01', rows[1]['monthlyMissing'])
        self.assertIn('2025-02', rows[1]['monthlyMissing'])
        self.assertNotIn('2026-10', rows[1]['monthlyMissing'])
        self.assertEqual(self.page.read_bytes(), before)

    def test_preview_write_and_repeat_preserve_other_content(self):
        before = self.page.read_bytes()
        preview = self.run_cli('merge', str(self.batch), records=[codex_record()])
        self.assertEqual(preview.returncode, 0, preview.stderr)
        self.assertEqual(self.page.read_bytes(), before)
        written = self.run_cli('merge', str(self.batch), '--write')
        self.assertEqual(written.returncode, 0, written.stderr)
        self.assertEqual(len(self.read_data()['users']['codex']['points']), 2)
        self.assertEqual(self.read_data()['companies'], self.data['companies'])
        self.assertTrue(self.page.read_text(encoding='utf-8').startswith(self.prefix))
        self.assertTrue(self.page.read_text(encoding='utf-8').endswith(self.suffix))
        after = self.page.read_bytes()
        repeated = self.run_cli('merge', str(self.batch), '--write')
        self.assertEqual(repeated.returncode, 0, repeated.stderr)
        self.assertEqual(self.page.read_bytes(), after)

    def test_invalid_batch_never_partially_writes(self):
        before = self.page.read_bytes()
        result = self.run_cli('merge', str(self.batch), '--write', records=[codex_record(), codex_record(brand='qwen')])
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(self.page.read_bytes(), before)

    def test_independent_disclosure_never_enters_trend_series(self):
        record = codex_record(date='2026-02-02', value=1000000,
                              publishedOn='2026-02-02', timeLabel='2026.02.02 披露',
                              scope='codex-trailing-month', metric='过去一个月使用的开发者',
                              url='https://openai.com/index/introducing-the-codex-app/')
        before = self.page.read_bytes()
        preview = self.run_cli('merge', str(self.batch), '--disclosures', records=[record])
        self.assertEqual(preview.returncode, 0, preview.stderr)
        self.assertEqual(self.page.read_bytes(), before)
        written = self.run_cli('merge', str(self.batch), '--disclosures', '--write')
        self.assertEqual(written.returncode, 0, written.stderr)
        self.assertEqual(self.read_data()['users'], self.data['users'])
        self.assertEqual(self.read_data()['disclosures'], [record])
        audit = self.run_cli('audit', '--json')
        row = json.loads(audit.stdout)[0]
        self.assertEqual((row['points'], row['disclosures']), (1, 1))
        after = self.page.read_bytes()
        self.assertEqual(self.run_cli('merge', str(self.batch), '--disclosures', '--write').returncode, 0)
        self.assertEqual(self.page.read_bytes(), after)
        self.assertNotEqual(self.run_cli('merge', str(self.batch), '--write').returncode, 0)
        self.assertEqual(self.page.read_bytes(), after)
        merged = self.run_cli('merge', str(self.batch), '--write', records=[codex_record()])
        self.assertEqual(merged.returncode, 0, merged.stderr)
        self.assertEqual(self.read_data()['disclosures'], [record])

    def test_disclosures_cannot_duplicate_a_trend_scope_or_partially_write(self):
        before = self.page.read_bytes()
        invalid = self.run_cli('merge', str(self.batch), '--disclosures', '--write', records=[codex_record()])
        self.assertNotEqual(invalid.returncode, 0)
        self.assertEqual(self.page.read_bytes(), before)
        new = codex_record(date='2026-02-02', publishedOn='2026-02-02',
                           scope='codex-trailing-month', metric='过去一个月使用的开发者')
        invalid = self.run_cli('merge', str(self.batch), '--disclosures', '--write', records=[new, codex_record(brand='qwen')])
        self.assertNotEqual(invalid.returncode, 0)
        self.assertEqual(self.page.read_bytes(), before)

    def test_conflicting_point_needs_explicit_replace(self):
        self.run_cli('merge', str(self.batch), '--write', records=[codex_record()])
        before = self.page.read_bytes()
        result = self.run_cli('merge', str(self.batch), '--write', records=[codex_record(value=4100000)])
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(self.page.read_bytes(), before)
        replacement = self.run_cli('merge', str(self.batch), '--write', '--replace-existing')
        self.assertEqual(replacement.returncode, 0, replacement.stderr)
        self.assertEqual(self.read_data()['users']['codex']['points'][-1]['value'], 4100000)

    def test_bad_units_dates_evidence_and_scope_are_rejected(self):
        before = self.page.read_bytes()
        invalid = [codex_record(value=0), codex_record(value=True), codex_record(url='javascript:alert(1)'),
                   codex_record(sourceNote=''), codex_record(verifiedOn='2026-03-01'),
                   codex_record(date='2026-02-30'), codex_record(period='2026-04'),
                   codex_record(scope='chatgpt-wau'), codex_record(provider='QuestMobile'),
                   codex_record(tier='third-party')]
        for record in invalid:
            with self.subTest(record=record):
                result = self.run_cli('merge', str(self.batch), '--write', records=[record])
                self.assertNotEqual(result.returncode, 0)
                self.assertEqual(self.page.read_bytes(), before)

    def test_monthly_dates_and_duplicate_batch(self):
        point = deepcopy(self.data['users']['kimi']['points'][0])
        point.update(brand='kimi', date='2025-02-28', period='2025-02', timeLabel='2025.02',
                     verifiedOn='2026-10-09', sourceNote='核验2月原始App MAU表。')
        result = self.run_cli('merge', str(self.batch), '--write', records=[point])
        self.assertEqual(result.returncode, 0, result.stderr)
        before = self.page.read_bytes()
        result = self.run_cli('merge', str(self.batch), '--write', records=[codex_record(), codex_record()])
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(self.page.read_bytes(), before)

    def test_checked_on_updates_label_without_changing_company_snapshot(self):
        result = self.run_cli('merge', str(self.batch), '--write', '--checked-on', '2026-10-10', records=[codex_record()])
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(self.read_data()['checkedOn'], '2026-10-10')
        self.assertIn('<time datetime="2026-10-10">2026.10.10</time>', self.page.read_text(encoding='utf-8'))
        self.assertEqual(self.read_data()['companies'], self.data['companies'])


if __name__ == '__main__':
    unittest.main()
