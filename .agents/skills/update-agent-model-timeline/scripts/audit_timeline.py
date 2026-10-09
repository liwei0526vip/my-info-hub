#!/usr/bin/env python3
"""Read-only validation and per-brand coverage summary for the separate model and Agent timeline pages."""

import argparse
import json
import re
import subprocess
from datetime import date
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parents[4]


def audit(page, as_of, check_js=False):
    errors = []
    if not page.is_file():
        return {"page": str(page), "errors": ["page does not exist"]}
    html = page.read_text(encoding="utf-8")
    data = {}
    for name in ("timeline-products", "timeline-data"):
        matches = re.findall(
            r'<script\b(?=[^>]*\bid="' + name + r'")(?=[^>]*\btype="application/json")[^>]*>(.*?)</script>',
            html, re.S,
        )
        if len(matches) != 1:
            errors.append(f"{name}: expected one JSON block, found {len(matches)}")
            continue
        try:
            value = json.loads(matches[0])
            if not isinstance(value, list):
                raise ValueError("expected an array")
            data[name] = value
        except (ValueError, TypeError) as exc:
            errors.append(f"{name}: {exc}")
    if len(data) != 2:
        return {"errors": errors}

    kind_match = re.search(r'\bdata-timeline-kind="(model|agent)"', html)
    page_kind = kind_match[1] if kind_match else None
    expected_kind = {"ai-model-timeline.html": "model", "ai-agent-timeline.html": "agent"}.get(page.name)
    if not page_kind or (expected_kind and page_kind != expected_kind):
        errors.append("missing or mismatched page event type")
    products = data["timeline-products"]
    events = data["timeline-data"]
    if re.search(r'\bid="timeline-user-history"', html):
        errors.append("user-scale records belong in ai-user-scale.html, not the timeline")
    ids = set()
    for row in products:
        if not isinstance(row, dict) or not all(isinstance(row.get(k), str) and row[k].strip() for k in ("id", "name", "company")):
            errors.append(f"invalid product: {row}")
            continue
        if row["id"] in ids:
            errors.append(f"duplicate product: {row['id']}")
        ids.add(row["id"])

    def validate_rows(rows, fields, date_key, key_fields):
        seen = set()
        for index, row in enumerate(rows):
            if not isinstance(row, dict) or not all(isinstance(row.get(k), str) and row[k].strip() for k in fields):
                errors.append(f"{date_key} row {index}: missing/non-string fields")
                continue
            if row["brand"] not in ids:
                errors.append(f"unknown brand: {row['brand']}")
            raw = row[date_key]
            precision = row.get("datePrecision", "day") if date_key == "date" else "month"
            if precision not in ("day", "month"):
                errors.append(f"invalid datePrecision: {precision} ({row['brand']})")
            pattern = r"\d{4}-\d{2}" if precision == "month" else r"\d{4}-\d{2}-\d{2}"
            try:
                if not re.fullmatch(pattern, raw):
                    raise ValueError("invalid date format")
                parsed = date.fromisoformat(raw + "-01" if precision == "month" else raw)
                if parsed > as_of:
                    errors.append(f"future {date_key}: {raw} ({row['brand']})")
            except ValueError:
                errors.append(f"invalid {date_key}: {raw}")
            if date_key == "date" and row["kind"] != page_kind:
                errors.append(f"{page.name}: wrong event kind {row['kind']} (expected {page_kind})")
            try:
                url = urlsplit(row["source" if date_key == "date" else "url"])
                valid_url = url.scheme in ("https", "http") and bool(url.netloc)
            except ValueError:
                valid_url = False
            if not valid_url:
                errors.append(f"invalid source URL in {row['brand']} / {raw}")
            key = tuple(row[k] for k in key_fields)
            if key in seen:
                errors.append(f"duplicate record: {key}")
            seen.add(key)

    validate_rows(events, ("brand", "kind", "date", "title", "desc", "source", "tag"), "date", ("brand", "kind", "date", "title"))
    count_match = re.search(r"[·]\s*([一二三四五六七八九十\d]+)家关键事件选编", html)
    if count_match:
        raw_count = count_match[1]
        count = int(raw_count) if raw_count.isdigit() else {c: i for i, c in enumerate("一二三四五六七八九十", 1)}.get(raw_count)
        if count != len(ids):
            errors.append(f"footer product count {raw_count} differs from {len(ids)}")
    else:
        errors.append("footer product count is missing")
    if check_js:
        for attrs, code in re.findall(r"<script\b([^>]*)>(.*?)</script>", html, re.S):
            if "application/json" in attrs:
                continue
            source = re.search(r'\bsrc="([^"]+)"', attrs)
            if source:
                script_file = page.parent / source[1]
                if not script_file.is_file():
                    errors.append(f"missing script: {source[1]}")
                    continue
                code = script_file.read_text(encoding="utf-8")
            if not code.strip():
                continue
            try:
                result = subprocess.run(["node", "--check"], input=code, text=True, capture_output=True)
                if result.returncode:
                    errors.append("JavaScript: " + result.stderr.strip())
            except FileNotFoundError:
                errors.append("Node is required for --check-js")
                break
    coverage = []
    for row in products:
        if not isinstance(row, dict) or not isinstance(row.get("id"), str) or row["id"] not in ids:
            continue
        rows = [e for e in events if isinstance(e, dict) and e.get("brand") == row["id"]]
        dates = [e["date"] for e in rows if isinstance(e.get("date"), str)]
        coverage.append({"brand": row["id"], "events": len(rows), "latest": max(dates, default=None)})
    return {"page": page.name, "kind": page_kind, "asOf": as_of.isoformat(), "products": len(ids), "events": len(events), "coverage": coverage, "errors": errors}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--page", type=Path, help="Check only this page; default checks both timelines")
    parser.add_argument("--as-of", required=True, type=date.fromisoformat)
    parser.add_argument("--check-js", action="store_true")
    args = parser.parse_args()
    pages = [args.page] if args.page else [ROOT / "ai-model-timeline.html", ROOT / "ai-agent-timeline.html"]
    results = [audit(page, args.as_of, args.check_js) for page in pages]
    errors = [error for result in results for error in result["errors"]]
    if not args.page and not errors:
        brand_sets = []
        for page in pages:
            html = page.read_text(encoding="utf-8")
            products = json.loads(re.search(r'<script\b[^>]*id="timeline-products"[^>]*>(.*?)</script>', html, re.S)[1])
            brand_sets.append({product["id"] for product in products})
        if brand_sets[0] != brand_sets[1]:
            errors.append("timeline pages have different registered brands")
    print(json.dumps({"pages": results, "errors": errors}, ensure_ascii=False, indent=2))
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
