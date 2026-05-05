ALDAR TRUE AI VISION EXCEL UPDATER - FINAL

Important truth:
- Browser OCR/Tesseract cannot read handwriting like ChatGPT.
- This final version makes AI Vision the main reader.
- Uploading a photo automatically calls AI Vision when the local server is running.
- Browser OCR remains only as Option A2 backup.

How to run:
1. Open .env.example and copy it as .env if the system did not create it.
2. Paste your OpenAI API key in .env:
   OPENAI_API_KEY=sk-...
3. Double-click start_ai_server.bat.
4. Keep the black server window open.
5. Open the website from the address shown by the server, normally:
   http://localhost:8000
6. Upload your photo. It will automatically start TRUE AI Vision reading.
7. Review the detected values.
8. Click Option B: Review + Update Excel.

Do not open index.html directly if you want AI Vision. Direct file opening will only run browser mode and cannot use the OpenAI Vision backend.

Files included:
- index.html
- app.js
- styles.css
- server.js
- package.json
- .env.example
- original.xlsx
- aldar.png
- start_ai_server.bat
- start_browser_only_backup.bat
