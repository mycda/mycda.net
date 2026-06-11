# Order Form Spam Hardening — 2026-06-10

Work log for the mycda.net residential/commercial order forms and their Google Apps Script backend.

## Problem
- Apps Script `/exec` endpoint was hardcoded in page source; bots scraped it and POSTed directly, flooding the "CDA Form Submissions" sheet with crypto/sextortion spam.
- Submissions also went to the wrong inbox and landed in one scrambled, conflated table.

## What we did
1. **Rotated the endpoint** — new Apps Script deployment URL; archived the old one to orphan the active bot wave.
2. **Split the sheet** into two tabs (`Residential`, `Commercial`), each with its own friendly-labelled columns. Deleted the old scrambled `Submissions` tab.
3. **Reformatted the lead email** to a clean HTML table with human labels.
4. **Added a layered anti-spam filter** (see below).
5. **Stress-tested**: 22-payload attack sim (replay, volume burst, evasion, faked-token bypass) → **0 got through**; real browser submissions land fine.

## Security defenses added (server-side `isLegit()` in Apps Script)
| Layer | Blocks |
|---|---|
| Honeypot field `your-website` | bots that fill hidden inputs |
| `form-source` allowlist | malformed/forged posts |
| Email-format check | junk submissions |
| Content blocklist (graph.org, GET ACCESS, BALANCE-\d, …) | known spam payloads |
| JS-token `cda-jsk` + time-trap (`cda-elapsed` ≥ 2s) | direct-POST / URL-scraper bots (no JS) |
| **reCAPTCHA v3** (server-verified, score ≥ 0.1) | automated bots incl. disguised "inquiry" spam |

Client side (form HTML): reCAPTCHA v3 loader + token injection, honeypot + hidden token/timing fields.

## Notes
- reCAPTCHA + Sheet + Apps Script are under the maintainer's **personal Google account**. Secret key lives only in Apps Script (never in repo); site key is public in the form HTML.
- Score floor kept low (0.1) so privacy browsers (Brave scored 0.9) aren't dropped. Real submissions need only a normal browser with JS — no checkbox/puzzle.
- Residual risk: a full headless-browser bot that solves reCAPTCHA could theoretically pass — rare and not the threat that hit this form.

## Pending
- Delete remaining test rows from both tabs.
- Flip `NOTIFY_EMAIL` from the maintainer's address to `accounting@mycda.net` and redeploy.
