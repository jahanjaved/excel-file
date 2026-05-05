ALDAR OFFLINE REFINED FINAL - NO API / NO PAYMENT

Use this version when you cannot pay for AI Vision.

What is updated:
1. Removed dependency on paid AI Vision.
2. Improved offline OCR for handwritten score values.
3. Reads the SCORE column with multiple crop positions.
4. Cuts the SCORE column into 15 KPI cells and OCRs each cell separately.
5. Uses digit-only OCR and voting to reduce wrong score upload.
6. If a handwritten value is not reliable, it should remain blank for manual correction.
7. Original Excel mapping and row-style preservation are kept.

How to use on GitHub Pages:
1. Upload index.html, app.js, styles.css, aldar.png, original.xlsx to your GitHub repository.
2. Open your GitHub Pages website.
3. Upload the photo.
4. Click Option A: Auto Read Photo.
5. Review the KPI values.
6. Correct any blank/wrong value manually.
7. Click Option B: Review + Update Excel.

Important truth:
Browser OCR is not equal to ChatGPT Vision. This offline version is the strongest no-cost version possible in the browser, but bad handwriting may still need manual correction.
