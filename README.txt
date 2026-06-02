ALDAR SMART OCR EXCEL UPDATER - REFERENCE SUFFIX ONLY UPDATE

What is changed in this version:
1. Website shows ONLY one reference field: Reference Number.
2. You enter the last digits only, for example 290.
3. The system automatically creates the full reference internally using:
   SIDPW-BW-KEO-ZZ-ZZ-XX-RP-HS-000290
4. Excel saves the FULL reference number in column A / Inspection_ID.
5. The full reference number is NOT displayed on the website.
6. The original workbook structure, formulas, formatting, charts and styles are preserved.

Use:
- Open index.html or upload all files to GitHub Pages.
- Upload photo.
- Enter Reference Number last digits only, for example 290.
- Review detected data and scores.
- Click Review + Update Excel.


NEW COPY DATA BUTTON UPDATE
7. Added Option C: Copy Data for Excel.
8. This button copies the website data as tab-separated Excel row data from column A to AX.
9. Open the main Excel workbook, go to the first empty row in the Weekly_Inspections sheet, click column A, then press Ctrl+V.
10. No new Excel file will be downloaded when using Option C.
11. The pasted data follows the same column pattern used by the Excel update/download function.
