FINAL Aldar Weekly Entry-Only Photo to Excel Website

Purpose:
- Creates a NEW Excel file with ONLY one new data entry row.
- No previous/old records are included.
- Output follows the Weekly_Inspections column order.
- Copy row 4 values into your original master Weekly_Inspections sheet.

Final updates:
- Area_or_Villa is kept blank unless a clear Villa number is detected from the photo.
- Inspection Date is taken only from the uploaded photo/OCR.
- Week_No is calculated from the photo date.
- Month is calculated from the photo date.
- Your_Name / Inspector defaults to Javed Iqbal.
- Evidence_Link_or_Photo is set to: A site reference provided.
- Repeat_Issue_Seen defaults to YES.
- Action_Owner defaults to Construction Manager.

GitHub Pages:
1. Upload all files to the root of your GitHub Pages repository.
2. Open the GitHub Pages link.
3. Upload the scorecard photo.
4. Review extracted fields.
5. Click Generate Entry Only Excel.
6. Copy row 4 values into the original master Excel file using Paste Values only.

Local use:
1. Extract ZIP.
2. Double-click start_local_server.bat.
3. Open http://localhost:8000 in Chrome or Edge.
