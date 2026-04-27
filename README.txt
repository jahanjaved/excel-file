FINAL Aldar Weekly Entry-Only Photo to Excel Website

Purpose:
- Creates a NEW Excel file with ONLY one new data entry row.
- No previous/old records are included.
- Output follows the Weekly_Inspections column order from the supplied master Excel file.
- Copy row 4 from the generated file and paste values into the original master Weekly_Inspections sheet.

Final updates:
- Deep OCR reading with multiple image passes.
- KPI scores are filled from the photo where readable.
- Any KPI that cannot be confidently read is marked as N/A for manual entry.
- Root cause is generated from the lowest readable KPI scores.
- Top 3 gaps are generated from the lowest readable KPI scores.
- Immediate action and preventive action are generated based on the lowest KPI categories.
- Action_Owner is set to: Project Manager and Construction Manager.
- Evidence_Link_or_Photo is set to: A site reference provided.
- Your_Name / Inspector is set to: Javed Iqbal.
- Week_No is calculated from the Inspection_Date taken from the photo.
- Month is calculated from the Inspection_Date.
- Area/Villa stays blank unless a clear Villa number is detected from the photo.

Files included:
- index.html
- styles.css
- app.js
- template.xlsx (reference master file only)
- start_local_server.bat
- .nojekyll

GitHub Pages:
1. Upload all files to your GitHub Pages repository root.
2. Open the GitHub Pages link.
3. Upload the photo.
4. Review extracted fields and N/A KPI values.
5. Click Generate Entry Only Excel.
6. Copy row 4 values into the original master Excel sheet using Paste Values.

Local use:
1. Extract ZIP.
2. Double-click start_local_server.bat.
3. Open http://localhost:8000 in Chrome or Edge.
