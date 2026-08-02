/* ============================================================
   Site configuration — the few things worth changing without
   touching any other file.
   ============================================================ */

/* Phone number in international form, no +, no spaces.
   Used for both the wa.me links and tel: links. */
export const PHONE = '919990302693';

/* ------------------------------------------------------------
   ENQUIRY LOGGING
   ------------------------------------------------------------
   Every enquiry currently opens WhatsApp and nothing else. If the
   phone is busy, or the visitor closes WhatsApp without pressing
   send, that lead is gone with no record of it.

   Set ENQUIRY_ENDPOINT to a form endpoint and every submission is
   ALSO posted there, so there is a permanent list of who asked for
   what. WhatsApp still opens exactly as before — this only adds a
   copy, and a failed post never blocks the WhatsApp handover.

   Free options, pick one:

   1. Formspree — easiest.  https://formspree.io
      Sign up, create a form, copy the URL. It emails you every
      enquiry and keeps a searchable list. Free tier: 50/month.
        ENQUIRY_ENDPOINT = 'https://formspree.io/f/abcdwxyz'

   2. Google Sheets — free and unlimited, ~10 minutes to set up.
      Extensions ▸ Apps Script in a new Sheet, paste a doPost that
      appends e.parameter to the sheet, Deploy ▸ Web app ▸ access
      "Anyone", then copy the /exec URL here.

   Leave it as '' to keep WhatsApp-only behaviour.
------------------------------------------------------------ */
export const ENQUIRY_ENDPOINT = '';
