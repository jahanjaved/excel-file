const KPI_LIST = [
  ["Work_at_Height", ["work at height", "work_at_height", "wah"]],
  ["Edge_Protection", ["edge protection", "edge_protection"]],
  ["Falling_Object_Prevention", ["falling object", "falling_object"]],
  ["Excavation_Safety", ["excavation safety", "excavation"]],
  ["Scaffolding_Compliance", ["scaffolding compliance", "scaffold", "scaffolding"]],
  ["PTW_Implementation", ["ptw implementation", "permit to work implementation"]],
  ["PTW_Field_Verification", ["ptw field verification", "field verification"]],
  ["MSRA_Quality", ["msra quality", "msra"]],
  ["Lifting/Precast Installation", ["lifting/precast", "lifting precast", "precast installation", "lifting"]],
  ["Traffic_Interface", ["traffic interface", "traffic & man", "traffic and man", "man-machine"]],
  ["Housekeeping/Waste Management", ["housekeeping", "waste management"]],
  ["Welfare Arrangement", ["welfare"]],
  ["Fire_Readiness", ["fire readiness", "fire"]],
  ["Supervision_Subcontractor", ["supervision", "subcontractor control", "sub-contractor control"]],
  ["Electrical_Tool_Safety", ["electrical tool", "temporary electrical", "tool safety"]]
];

const CLUSTERS = {
  "Cluster 7A": { package:"2", contractor:"TAJV" }, "Cluster 7B": { package:"2", contractor:"TAJV" },
  "Cluster 8A": { package:"2", contractor:"TAJV" }, "Cluster 8B": { package:"2", contractor:"TAJV" },
  "Cluster 8C": { package:"2", contractor:"TAJV" }, "Cluster 8D": { package:"2", contractor:"TAJV" },
  "Cluster 3": { package:"3", contractor:"INNOVO" }, "Cluster 4": { package:"3", contractor:"INNOVO" },
  "Cluster 5": { package:"3", contractor:"INNOVO" }, "Cluster 6": { package:"3", contractor:"INNOVO" },
  "Cluster 1A": { package:"4", contractor:"TAJV" }, "Cluster 1B": { package:"4", contractor:"TAJV" },
  "Cluster 2A": { package:"4", contractor:"TAJV" }, "Cluster 2B": { package:"4", contractor:"TAJV" },
  "Cluster 2C": { package:"4", contractor:"TAJV" }
};

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

function setStatus(msg, tone="normal") {
  const el = $("#status");
  el.textContent = msg;
  el.style.borderColor = tone === "error" ? "#ef9a9a" : tone === "success" ? "#8ed0a8" : "#d8e1ee";
  el.style.background = tone === "error" ? "#fff3f3" : tone === "success" ? "#f3fff7" : "#fff";
}

function setOcrStatus(msg, tone="normal") {
  const el = $("#ocrStatus");
  el.textContent = msg;
  el.style.borderColor = tone === "error" ? "#ef9a9a" : tone === "success" ? "#8ed0a8" : "#d8e1ee";
  el.style.background = tone === "error" ? "#fff3f3" : tone === "success" ? "#f3fff7" : "#fff";
}

function renderKpis() {
  $("#kpiGrid").innerHTML = KPI_LIST.map(([key], i) => `
    <div class="kpi-card">
      <h3>${i + 1}. ${key.replaceAll("_", " ")}</h3>
      <input class="score-input" data-kpi="${key}" placeholder="Score from photo" />
    </div>
  `).join("");
  $$(".score-input").forEach(x => x.addEventListener("input", updateIntelligence));
}

function normalizeText(text) {
  return String(text || "")
    .replace(/[|]/g, "I")
    .replace(/[—–]/g, "-")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function extractDate(text) {
  const t = normalizeText(text);
  let m = t.match(/\b(\d{1,2})[\/\-.](\d{1,2})[\/\-.](20\d{2})\b/);
  if (m) return `${m[3]}-${m[2].padStart(2,"0")}-${m[1].padStart(2,"0")}`;
  m = t.match(/\b(20\d{2})[\/\-.](\d{1,2})[\/\-.](\d{1,2})\b/);
  if (m) return `${m[1]}-${m[2].padStart(2,"0")}-${m[3].padStart(2,"0")}`;
  return "";
}

function extractPackageCluster(text) {
  const t = normalizeText(text).toLowerCase();
  let cluster = "";
  const code = t.match(/\bcluster\s*[:\-]?\s*(1a|1b|2a|2b|2c|3|4|5|6|7a|7b|8a|8b|8c|8d)\b/i) ||
               t.match(/\b(1a|1b|2a|2b|2c|7a|7b|8a|8b|8c|8d)\b/i);
  if (code) cluster = `Cluster ${code[1].toUpperCase()}`;
  else {
    const simple = t.match(/\bcluster\s*[:\-]?\s*([3-6])\b/i);
    if (simple) cluster = `Cluster ${simple[1]}`;
  }
  let pkg = "";
  const pm = t.match(/\bpackage\s*[:\-]?\s*([234])\b/i);
  if (pm) pkg = pm[1];
  if (!pkg && cluster && CLUSTERS[cluster]) pkg = CLUSTERS[cluster].package;
  return { pkg, cluster };
}

function normalizeScore(token) {
  if (!token) return "";
  let s = String(token).trim().toUpperCase().replace(",", ".");
  if (/^N\s*\/?\s*A$/.test(s)) return "na";
  s = s.replace(/O/g, "0").replace(/[IL]/g, "1").replace(/S/g, "5");
  if (/^[0-5](\.0|\.5)?$/.test(s)) return String(Number(s));
  if (/^[0-5][05]$/.test(s)) return `${s[0]}.${s[1]}`;
  return "";
}

function scoreFromLine(line) {
  const tokens = String(line || "").match(/N\s*\/?\s*A|[0-5](?:[\.,][05])?|[0-5][05]/gi) || [];
  for (let i = tokens.length - 1; i >= 0; i--) {
    const v = normalizeScore(tokens[i]);
    if (v) return v;
  }
  return "";
}

function detectScores(text) {
  const rawLines = normalizeText(text).split(/\n+/).map(x => x.trim()).filter(Boolean);
  const lowerLines = rawLines.map(x => x.toLowerCase());
  const scores = {};
  KPI_LIST.forEach(([key, aliases]) => {
    let found = "";
    for (let i = 0; i < lowerLines.length; i++) {
      if (!aliases.some(a => lowerLines[i].includes(a))) continue;
      found = scoreFromLine(rawLines[i]) || scoreFromLine(rawLines[i + 1]) || scoreFromLine(rawLines[i + 2]);
      if (found) break;
    }
    scores[key] = found;
  });
  const filled = Object.values(scores).filter(Boolean).length;
  if (filled < 8) {
    const candidates = rawLines.map(scoreFromLine).filter(Boolean);
    KPI_LIST.forEach(([key], i) => { if (!scores[key] && candidates[i]) scores[key] = candidates[i]; });
  }
  return scores;
}

function extractAsiteRef(text) {
  const t = normalizeText(text);
  const ref = t.match(/\bSIDP[A-Z0-9\-\/]+/i) || t.match(/\b[A-Z0-9]{3,}[-][A-Z0-9\-]{8,}\b/i);
  return ref ? ref[0].replace(/[.,;:]$/, "") : "";
}

function extractArea(text) {
  const t = normalizeText(text);
  let m = t.match(/\b(villa|villas)\s*[:\-]?\s*([0-9,\s&to\-]+)\b/i);
  if (m) return `${m[1]} ${m[2]}`.replace(/\s+/g, " ").trim();
  m = t.match(/\barea\s*[:\-]?\s*([A-Za-z0-9 ,\-\/]+)\b/i);
  if (m) return m[1].split(/\n/)[0].trim();
  return "";
}

function extractWorkers(text) {
  const t = normalizeText(text);
  const m = t.match(/\b(workers?|manpower|persons?)\s*(observed)?\s*[:\-]?\s*(\d{1,4})\b/i);
  return m ? m[3] : "";
}

function getScoresFromInputs() {
  const out = {};
  $$(".score-input").forEach(x => out[x.dataset.kpi] = x.value.trim());
  return out;
}

function numericScore(v) {
  if (!v || String(v).toLowerCase() === "na") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function lowItems(scores, limit=3) {
  return KPI_LIST.map(([key]) => ({ key, value: numericScore(scores[key]) }))
    .filter(x => x.value !== null)
    .sort((a,b) => a.value - b.value || a.key.localeCompare(b.key))
    .slice(0, limit);
}

function nice(k) {
  return k.replaceAll("_", " ");
}

function updateIntelligence() {
  const scores = getScoresFromInputs();
  const lows = lowItems(scores, 3);
  const critical = lows.some(x => x.value <= 1);
  const lowNames = lows.map(x => nice(x.key));
  if (!$("#mainActivity").value && lows[0]) $("#mainActivity").value = nice(lows[0].key);
  $("#stopWork").value = critical ? "YES" : "NO";
  if (!$("#repeatIssue").value) {
    const ocr = $("#ocrText").value.toLowerCase();
    $("#repeatIssue").value = /repeat|repeating|again|previous|recurring/.test(ocr) ? "YES" : "";
  }
  if (!$("#rootCause").value) {
    const joined = lowNames.join(" ").toLowerCase();
    $("#rootCause").value = joined.includes("supervision") ? "Poor supervision" :
      joined.includes("ptw") ? "PTW failure" :
      joined.includes("housekeeping") || joined.includes("traffic") || joined.includes("excavation") ? "Poor planning" :
      joined.includes("scaffold") || joined.includes("lifting") ? "Inadequate competence" :
      lows.length ? "Poor supervision" : "";
  }
  if (!$("#actionOwner").value && lows.length) $("#actionOwner").value = "Construction Manager";
  if (!$("#evidence").value && /asite|a site|reference/i.test($("#ocrText").value)) $("#evidence").value = "Asite Ref Provided";
  if (!$("#topGaps").value && lows.length) {
    $("#topGaps").value = lows.map((x,i) => `${i+1}. ${nice(x.key)} scored ${x.value}, indicating weak implementation at the inspected location.`).join("\n");
  }
  if (!$("#immediateAction").value && lows.length) {
    $("#immediateAction").value = critical ? "Unsafe activity was stopped and the responsible construction team was instructed to rectify the condition immediately." : "Findings were discussed with the responsible site team for immediate correction and follow-up.";
  }
  if (!$("#preventiveAction").value && lows.length) {
    $("#preventiveAction").value = lows.map(x => `Strengthen ${nice(x.key).toLowerCase()} through improved planning, field verification, supervision, and closeout evidence.`).join("\n");
  }
  const scoreCount = Object.values(scores).filter(Boolean).length;
  const total = Object.values(scores).map(numericScore).filter(x => x !== null).reduce((a,b) => a + b, 0);
  const cls = critical ? "bad" : scoreCount >= 10 ? "good" : "warn";
  $("#summaryBox").className = `summary ${cls}`;
  $("#summaryBox").innerHTML = scoreCount ? `<b>Detected KPI Scores:</b> ${scoreCount}/15 &nbsp; | &nbsp; <b>Total:</b> ${total} &nbsp; | &nbsp; <b>Lowest items:</b> ${lowNames.join(", ") || "—"}` : "Upload and read the photo to detect KPI scores.";
}

async function fileToBlobVariants(file) {
  const img = await createImageBitmap(file);
  const variants = [];
  const make = (scale, mode) => {
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * scale);
    c.height = Math.round(img.height * scale);
    const ctx = c.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, c.width, c.height);
    if (mode) {
      const imageData = ctx.getImageData(0, 0, c.width, c.height);
      const d = imageData.data;
      for (let i = 0; i < d.length; i += 4) {
        const g = 0.299*d[i] + 0.587*d[i+1] + 0.114*d[i+2];
        const v = mode === "threshold" ? (g > 178 ? 255 : 0) : Math.max(0, Math.min(255, (g - 128) * 1.55 + 128));
        d[i] = d[i+1] = d[i+2] = v;
      }
      ctx.putImageData(imageData, 0, 0);
    }
    return new Promise(resolve => c.toBlob(blob => resolve(blob), "image/png"));
  };
  variants.push(await make(1, ""));
  variants.push(await make(2, "gray"));
  variants.push(await make(2.3, "threshold"));
  return variants.filter(Boolean);
}

async function readPhoto() {
  const file = $("#imageInput").files?.[0];
  if (!file) { setOcrStatus("Please choose a photo first.", "error"); return; }
  try {
    setOcrStatus("Reading photo deeply. Please wait...", "normal");
    const variants = await fileToBlobVariants(file);
    const results = [];
    for (let i = 0; i < variants.length; i++) {
      const result = await Tesseract.recognize(variants[i], "eng", {
        logger: m => {
          if (m.status === "recognizing text" && typeof m.progress === "number") {
            setOcrStatus(`Reading photo pass ${i+1}/${variants.length}: ${Math.round(m.progress * 100)}%`, "normal");
          }
        },
        tessedit_pageseg_mode: Tesseract.PSM.AUTO,
        preserve_interword_spaces: "1"
      });
      const text = normalizeText(result.data.text || "");
      const scores = detectScores(text);
      results.push({ text, scores, count: Object.values(scores).filter(Boolean).length });
    }
    const best = results.sort((a,b) => b.count - a.count)[0] || { text:"", scores:{} };
    $("#ocrText").value = best.text;
    const date = extractDate(best.text);
    const pc = extractPackageCluster(best.text);
    if (date) $("#inspectionDate").value = date;
    if (pc.pkg) $("#package").value = pc.pkg;
    if (pc.cluster) $("#cluster").value = pc.cluster;
    $("#asiteRef").value = extractAsiteRef(best.text);
    $("#area").value = extractArea(best.text);
    $("#workers").value = extractWorkers(best.text);
    Object.entries(best.scores).forEach(([key, val]) => {
      const input = document.querySelector(`[data-kpi="${CSS.escape(key)}"]`);
      if (input) input.value = val;
    });
    updateIntelligence();
    setOcrStatus(`Photo reading completed. Detected ${Object.values(best.scores).filter(Boolean).length}/15 KPI scores. Please review before generating Excel.`, "success");
    setStatus("Photo data extracted. Review the fields, then click Generate Excel.", "success");
  } catch (err) {
    console.error(err);
    setOcrStatus("Photo reading failed. Please try a clearer image.", "error");
    setStatus("OCR failed.", "error");
  }
}

function cloneStyle(style) {
  return style ? JSON.parse(JSON.stringify(style)) : {};
}

function adjustFormula(formula, sourceRow, targetRow) {
  if (!formula) return formula;
  return formula.replace(new RegExp(`(?<![A-Za-z])${sourceRow}(?![0-9])`, "g"), String(targetRow));
}

function headerMap(ws) {
  const map = {};
  const row = ws.getRow(3);
  row.eachCell({ includeEmpty:false }, (cell, col) => {
    const v = String(cell.value || "").trim();
    if (v) map[v] = col;
  });
  return map;
}

function findLastDataRow(ws) {
  let last = 3;
  for (let r = 4; r <= ws.rowCount; r++) {
    const date = ws.getCell(r, 2).value;
    const cluster = ws.getCell(r, 7).value;
    if (date || cluster) last = r;
  }
  return last;
}

function copyPatternRow(ws, targetRowNum) {
  const styleRow = ws.getRow(4);
  const target = ws.getRow(targetRowNum);
  target.height = styleRow.height;
  for (let c = 1; c <= ws.columnCount; c++) {
    const srcStyle = styleRow.getCell(c);
    const dst = target.getCell(c);
    dst.style = cloneStyle(srcStyle.style);
    dst.numFmt = srcStyle.numFmt;
    dst.alignment = cloneStyle(srcStyle.alignment);
    dst.border = cloneStyle(srcStyle.border);
    dst.fill = cloneStyle(srcStyle.fill);
    dst.font = cloneStyle(srcStyle.font);
    dst.protection = cloneStyle(srcStyle.protection);
    if (srcStyle.dataValidation) dst.dataValidation = cloneStyle(srcStyle.dataValidation);
    const srcVal = srcStyle.value;
    if (srcVal && typeof srcVal === "object" && srcVal.formula) {
      dst.value = { formula: adjustFormula(srcVal.formula, 4, targetRowNum) };
    } else {
      dst.value = null;
    }
  }
}

function setByHeader(ws, h, name, value) {
  if (value === "" || value === null || value === undefined) return;
  const col = h[name];
  if (!col) return;
  ws.getCell(ws.__targetRow, col).value = value;
}

function jsDateFromInput(dateStr) {
  if (!dateStr) return "";
  const [y,m,d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function numericOrText(v) {
  if (v === "" || v === null || v === undefined) return "";
  if (String(v).toLowerCase() === "na") return "na";
  const n = Number(v);
  return Number.isFinite(n) ? n : v;
}

function nextCloseout(dateStr, days=7) {
  if (!dateStr) return "";
  const [y,m,d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return dt;
}

async function loadTemplate() {
  const res = await fetch("template.xlsx");
  if (!res.ok) throw new Error("template.xlsx could not be loaded. Use GitHub Pages or start_local_server.bat.");
  const buffer = await res.arrayBuffer();
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer);
  return wb;
}

async function generateExcel() {
  try {
    setStatus("Generating Excel from photo data and template pattern...", "normal");
    const wb = await loadTemplate();
    const ws = wb.getWorksheet("Weekly_Inspections");
    if (!ws) throw new Error("Weekly_Inspections sheet was not found.");
    const h = headerMap(ws);
    const last = findLastDataRow(ws);
    const row = last + 1;
    ws.__targetRow = row;
    copyPatternRow(ws, row);

    const date = $("#inspectionDate").value;
    const pkg = $("#package").value.trim();
    let cluster = $("#cluster").value.trim();
    if (cluster && !/^Cluster/i.test(cluster)) cluster = `Cluster ${cluster.toUpperCase()}`;
    const scores = getScoresFromInputs();
    const lows = lowItems(scores, 3);
    const lowNames = lows.map(x => nice(x.key)).join(", ");
    const asiteRef = $("#asiteRef").value.trim();
    const evidenceText = $("#evidence").value.trim() || (asiteRef ? "Asite Ref Provided" : "");

    setByHeader(ws, h, "Inspection_Date", jsDateFromInput(date));
    setByHeader(ws, h, "Package", numericOrText(pkg));
    setByHeader(ws, h, "Cluster", cluster);
    setByHeader(ws, h, "Your_Name", $("#inspector").value.trim());
    setByHeader(ws, h, "Your_Role", $("#role").value.trim());
    setByHeader(ws, h, "Area_or_Villa", $("#area").value.trim());
    setByHeader(ws, h, "Workers_Observed", numericOrText($("#workers").value.trim()));
    setByHeader(ws, h, "Main_High_Risk_Activity", $("#mainActivity").value.trim());
    setByHeader(ws, h, "Stop_Work", $("#stopWork").value);
    KPI_LIST.forEach(([key]) => setByHeader(ws, h, key, numericOrText(scores[key])));
    setByHeader(ws, h, "Repeat_Issue_Seen", $("#repeatIssue").value);
    setByHeader(ws, h, "Likely_Root_Cause", $("#rootCause").value.trim());
    setByHeader(ws, h, "Top_3_Gaps_Observed", $("#topGaps").value.trim());
    setByHeader(ws, h, "Immediate_Action_Taken", $("#immediateAction").value.trim());
    setByHeader(ws, h, "Preventive_Action_Required", $("#preventiveAction").value.trim());
    setByHeader(ws, h, "Positive_Observations", $("#positiveObservations").value.trim());
    setByHeader(ws, h, "Action_Owner", $("#actionOwner").value.trim());
    setByHeader(ws, h, "Target_Closeout_Date", nextCloseout(date, 7));
    setByHeader(ws, h, "Evidence_Link_or_Photo", evidenceText || asiteRef);
    setByHeader(ws, h, "KPI_for_PD_Attention", lows.some(x => x.value <= 1) ? lowNames : "");
    setByHeader(ws, h, "KPI_for_PM_Attention", lows.some(x => x.value <= 2) ? lowNames : "");
    setByHeader(ws, h, "KPI_for_CM_Attention", lowNames);
    setByHeader(ws, h, "KPI_for_HSEM_Followup", lowNames);
    setByHeader(ws, h, "KPI_for_SE_Supervision", lowNames);
    setByHeader(ws, h, "Leadership_Visible_Effective", lows.length ? (lows.some(x => x.key.includes("Supervision")) ? "NO" : "YES") : "");
    setByHeader(ws, h, "Unsafe_Work_Corrected_Immediately", $("#stopWork").value === "YES" ? "YES" : "");
    setByHeader(ws, h, "Cluster_Needing_Immediate_Intervention", lows.some(x => x.value <= 1) ? cluster : "");

    const out = await wb.xlsx.writeBuffer();
    const blob = new Blob([out], { type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const safeCluster = (cluster || "Cluster").replace(/\s+/g, "_");
    const fileDate = date || new Date().toISOString().slice(0,10);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Saadiyat_Lagoons_Weekly_Inspection_${safeCluster}_${fileDate}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
    setStatus("Excel generated successfully. Template design and existing data are retained.", "success");
  } catch (err) {
    console.error(err);
    setStatus(err.message || "Excel generation failed.", "error");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderKpis();
  $("#readBtn").addEventListener("click", readPhoto);
  $("#generateBtn").addEventListener("click", generateExcel);
  $("#imageInput").addEventListener("change", e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      $("#imagePreview").src = ev.target.result;
      $("#imagePreview").style.display = "block";
      $("#imagePlaceholder").style.display = "none";
      setOcrStatus("Photo loaded. Click Read Photo.", "success");
    };
    reader.readAsDataURL(file);
  });
  ["inspectionDate","package","cluster","asiteRef","area","workers","inspector","role","mainActivity","stopWork","repeatIssue","rootCause","actionOwner","evidence","topGaps","immediateAction","preventiveAction","positiveObservations"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", updateIntelligence);
  });
});
