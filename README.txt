ALDAR FINAL KPI EXCEL UPDATER - DEEP PHOTO AUTO-FILL UPDATE

Only website photo reading has been improved in this version.

What is fixed:
1. Original Excel writing/settings remain the same as the previous accepted version.
2. Deep photo scan now runs multiple OCR modes: original, enlarged soft contrast, high contrast, and crop contrast.
3. The website auto-fills whatever it can read from the photo: date, week, package, cluster, contractor, inspector, role, stop work, activity, and KPI scores.
4. Any unread field is left blank / unchanged so it can be entered manually.
5. Excel output still writes to the same mapped cell locations and preserves the template row style.

How to use:
1. Open index.html.
2. Upload the photo/screenshot.
3. Click Option A: Auto Read Photo.
4. Review the auto-filled website fields.
5. Manually complete any blank/unread fields.
6. Click Option B: Review + Update Excel.


FINAL UPDATE - MATCH ALDAR FORMULA EXACTLY
1. Month value is now written in column E, not column D.
2. Column AJ is calculated exactly as SUM of KPI scores U:AI.
3. Column AK is calculated exactly as AJ / 75.
4. Column AL is calculated exactly as weighted score: SUMPRODUCT(U:AI, KPI_Weights weights) / 5.
5. AJ, AK, AL are written as final calculated values, matching the existing Aldar sheet logic.
6. All other accepted Excel writing, style matching, and photo auto-fill settings remain unchanged.

FINAL SMART OCR SYSTEM - NOOR UPDATE 05-05-2026
Additional fixes included in this package:
1. ALDAR logo updated as aldar.png and linked in index.html.
2. Added dedicated ALDAR printed checklist score-column OCR logic.
3. The score-column OCR crops the SCORE column separately, enlarges it, converts it to high contrast, and reads only numbers 0-5 and decimals.
4. The parser then maps the 15 detected scores in exact KPI order:
   Work at Height, Edge Protection, Falling Object, Excavation, Scaffolding, PTW Implementation, PTW Field Verification, MSRA, Lifting/Precast, Traffic, Housekeeping, Welfare, Fire, Supervision, Electrical.
5. Normal multi-mode OCR is still used for date, package, cluster, contractor, role, inspector, and any remaining values.
6. Review before Excel update is still mandatory because browser OCR cannot guarantee 100% reading of handwriting.

NOOR SAFETY PATCH - WRONG DATA PROTECTION
1. The website now blocks KPI auto-fill if fewer than 10 KPI score values are confidently detected.
2. This prevents date/week/package/cluster numbers from being wrongly mapped as KPI scores.
3. The system will still fill readable fields, but it will leave uncertain KPI values blank for manual review.
4. Important: a static browser website using Tesseract.js cannot read photos with the same intelligence as ChatGPT Vision. For near-ChatGPT accuracy, the website must use a server/API vision OCR engine.
