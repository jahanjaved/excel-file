import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });
const PORT = process.env.PORT || 8000;
const MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

app.use(express.static(__dirname));

function cleanJsonText(text) {
  return String(text || '').replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
}

app.post('/api/vision-ocr', upload.single('photo'), async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY missing. Add it inside .env, then restart start_ai_server.bat.' });
    if (!req.file) return res.status(400).json({ error: 'No photo received.' });

    const mime = req.file.mimetype || 'image/jpeg';
    const base64 = req.file.buffer.toString('base64');
    const prompt = `You are reading an ALDAR / Saadiyat Lagoons HSE KPI inspection photo. Extract handwritten and printed values carefully.
Return ONLY valid JSON. No markdown. Use empty string if not visible.
Important: Read the 15 KPI score values in this exact order and map them to these exact keys:
1 Work_at_Height
2 Edge_Protection
3 Falling_Object_Prevention
4 Excavation_Safety
5 Scaffolding_Compliance
6 PTW_Implementation
7 PTW_Field_Verification
8 MSRA_Quality
9 Lifting/Precast Installation
10 Traffic_Interface
11 Housekeeping/Waste Management
12 Welfare Arrangement
13 Fire_Readiness
14 Supervision_Subcontractor
15 Electrical_Tool_Safety
Allowed score values are 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5. Do not guess uncertain scores; use empty string.
Return this JSON shape exactly:
{
  "inspectionDate":"YYYY-MM-DD",
  "package":"",
  "cluster":"Cluster 1A/1B/2A/2B/2C/3/4/5/6/7A/7B/8A/8B/8C/8D",
  "contractor":"TAJV or INNOVO",
  "inspectorName":"",
  "role":"KEO",
  "stopWork":"YES or NO",
  "area":"",
  "mainActivity":"",
  "repeatIssue":"YES or NO",
  "actionOwner":"",
  "evidence":"",
  "scores":{
    "Work_at_Height":"",
    "Edge_Protection":"",
    "Falling_Object_Prevention":"",
    "Excavation_Safety":"",
    "Scaffolding_Compliance":"",
    "PTW_Implementation":"",
    "PTW_Field_Verification":"",
    "MSRA_Quality":"",
    "Lifting/Precast Installation":"",
    "Traffic_Interface":"",
    "Housekeeping/Waste Management":"",
    "Welfare Arrangement":"",
    "Fire_Readiness":"",
    "Supervision_Subcontractor":"",
    "Electrical_Tool_Safety":""
  },
  "lowest3":[]
}`;

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: MODEL,
        input: [{
          role: 'user',
          content: [
            { type: 'input_text', text: prompt },
            { type: 'input_image', image_url: `data:${mime};base64,${base64}`, detail: 'high' }
          ]
        }]
      })
    });

    const raw = await response.text();
    if (!response.ok) return res.status(response.status).json({ error: raw });
    const parsed = JSON.parse(raw);
    const text = parsed.output_text || parsed.output?.flatMap(o => o.content || []).map(c => c.text || '').join('\n') || '';
    const data = JSON.parse(cleanJsonText(text));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

app.listen(PORT, () => console.log(`ALDAR AI Vision OCR server running: http://localhost:${PORT}`));
