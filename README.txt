FINAL Aldar Weekly Scorecard OCR Website - Exact Weekly_Inspections Row Version

Files included:
- index.html
- styles.css
- app.js
- template.xlsx
- start_local_server.bat
- .nojekyll

What this version does:
- Uses only the Weekly_Inspections sheet from template.xlsx.
- Finds the next empty row based on column B.
- Copies the exact template row structure/style/formulas from row 4.
- Populates only the required Weekly_Inspections row fields.
- Does not create any extra sheet.
- Does not add extra columns or unrelated data.

GitHub Pages use:
1. Upload all files to the root of your GitHub Pages repository.
2. Keep the file names exactly the same.
3. Open the published GitHub Pages link.
4. Upload the scanned KPI scorecard image.
5. Review auto-detected fields and scores.
6. Click Generate Updated Excel.

Local use:
1. Extract this ZIP folder.
2. Double-click start_local_server.bat.
3. Open http://localhost:8000 in Chrome or Edge.

Important:
Do not open index.html directly by double-clicking, because the browser may block loading template.xlsx.
