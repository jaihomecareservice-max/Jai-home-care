# JAI Home Care Services

**Claude chat:** Jaishiv medical assistance website  
**Client:** Aakash Upadhyay / Jaishiv registration in progress

## What this is

Static one-page medical / home-care services landing site with animations and WhatsApp enquiry flow.

## Stack

- Static HTML / CSS / JavaScript (ES modules)
- anime.js v4 (vendored)
- Python `serve.py` for local dev

## Run locally

```powershell
cd projects/jai-home-care
python serve.py
# Open http://127.0.0.1:4173
```

> Use `serve.py`, not `python -m http.server` — see project README for cache reasons.

## Before launch

- Set `ENQUIRY_ENDPOINT` in `assets/config.js` (Formspree recommended)
- See full checklist in original `README.md` in this folder

## Status

Imported from `laptop/CLAUDE KA KAAM/AAKASH UPADHYAY/jai-home-care`.
