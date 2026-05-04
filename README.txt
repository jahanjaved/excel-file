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
