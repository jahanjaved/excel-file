ALDAR AI VISION OCR - NOOR FINAL

Why this version is different:
- The old website used browser Tesseract OCR only.
- Tesseract cannot reliably read handwritten values from photos.
- This version adds an optional AI Vision backend using the OpenAI image input API.
- This is the same type of image understanding used in ChatGPT.

How to run:
1. Install Node.js if not installed.
2. Open .env.example and copy it as .env.
3. Paste your OpenAI API key in .env:
   OPENAI_API_KEY=your_key_here
4. Double-click start_ai_server.bat.
5. Open http://localhost:8000
6. Upload photo.
7. Click Option A1: AI Vision Read Photo.
8. Review fields.
9. Click Option B: Review + Update Excel.

Important:
- Do not put your API key inside app.js or index.html.
- GitHub Pages static hosting cannot safely run AI Vision because it cannot protect the API key.
- For public hosting, deploy server.js to a backend service and keep the key in server environment variables.
- Browser OCR backup is still available as Option A2, but handwritten values may still fail there.
