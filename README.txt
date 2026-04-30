ALDAR WEEKLY KPI PHOTO TO ORIGINAL EXCEL ROW - FINAL DIRECT UPDATE VERSION

What changed:
1. Redesigned full website with ALDAR logo and clearer workflow.
2. Reads photo using OCR and auto-fills date, package, cluster, villa/area, workers if visible, and KPI scores where OCR can read them.
3. Any value not read from the photo stays empty/manual on the website.
4. Updates the original Excel file directly as XLSX/XML.
5. It writes only the next empty pre-formatted row in Weekly_Inspections.
6. It preserves the same workbook design, formulas, charts, sheets, column widths, row heights, fonts and cell styles.
7. Columns filled are aligned to the original sequence: B, F, G, O to AX, including the KPI score columns U to AI.

Use:
1. Open index.html from a local server, or use start_local_server.bat.
2. Upload/select your latest original Excel file if needed.
3. Upload the KPI photo.
4. Review all auto-filled fields and complete blanks manually.
5. Click Generate Updated Excel.

Important:
Browsers cannot overwrite a local Excel file directly. The updated workbook will be downloaded as a new file.
