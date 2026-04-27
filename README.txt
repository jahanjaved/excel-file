FINAL Aldar Weekly Entry-Only Photo to Excel Website

Purpose:
- Creates a NEW Excel file with ONLY one new data entry row.
- No previous/old records are included.
- The output has the exact same Weekly_Inspections column order from the supplied master Excel file.
- You can copy row 4 from the generated file and paste values into your original master Weekly_Inspections sheet.

Files included:
- index.html
- styles.css
- app.js
- template.xlsx (reference master file only)
- start_local_server.bat
- .nojekyll

Important updates:
- Evidence_Link_or_Photo is set to: A site reference provided
- Your_Name / Inspector is set to: Javed Iqbal
- Week_No is calculated from Inspection_Date
- Month is calculated from Inspection_Date
- Repeat_Issue_Seen defaults to YES
- Action_Owner defaults to Construction Manager
- Output is entry-only, not the full master workbook

GitHub Pages:
1. Upload all files to your GitHub Pages repository root.
2. Open the GitHub Pages link.
3. Upload the photo.
4. Review extracted fields.
5. Click Generate Entry Only Excel.
6. Copy row 4 values into the original master Excel sheet.

Local use:
1. Extract ZIP.
2. Double-click start_local_server.bat.
3. Open http://localhost:8000 in Chrome or Edge.
