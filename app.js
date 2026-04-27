
const CLUSTERS = [{"package": "2", "cluster": "Cluster 7A", "contractor": "TAJV", "pd": "Hicham Adel Narch", "pm": "Ghaidh Alfaour", "cm": "George Deeb", "hsem": "Timur", "se": "Liqat"}, {"package": "2", "cluster": "Cluster 7B", "contractor": "TAJV", "pd": "Hicham Adel Narch", "pm": "Ghaidh Alfaour", "cm": "George Deeb", "hsem": "Timur", "se": "Eyad"}, {"package": "2", "cluster": "Cluster 8A", "contractor": "TAJV", "pd": "Hicham Adel Narch", "pm": "Ghaidh Alfaour", "cm": "Mohamed Salama", "hsem": "Timur", "se": "Ahmad Adel"}, {"package": "2", "cluster": "Cluster 8B", "contractor": "TAJV", "pd": "Hicham Adel Narch", "pm": "Ghaidh Alfaour", "cm": "Mohamed Salama", "hsem": "Timur", "se": "Ahmad Adel"}, {"package": "2", "cluster": "Cluster 8C", "contractor": "TAJV", "pd": "Hicham Adel Narch", "pm": "Ghaidh Alfaour", "cm": "George Deeb", "hsem": "Timur", "se": "Ahmad Adel"}, {"package": "2", "cluster": "Cluster 8D", "contractor": "TAJV", "pd": "Hicham Adel Narch", "pm": "Ghaidh Alfaour", "cm": "George Deeb", "hsem": "Timur", "se": "Ahmad Adel"}, {"package": "3", "cluster": "Cluster 3", "contractor": "INNOVO", "pd": "Kahtan Tikriti", "pm": "Aiman Abdullah", "cm": "Salama Al Samdy", "hsem": "Mazen Al Atwani", "se": ""}, {"package": "3", "cluster": "Cluster 4", "contractor": "INNOVO", "pd": "Kahtan Tikriti", "pm": "Aiman Abdullah", "cm": "Baha Basheer", "hsem": "Mazen Al Atwani", "se": ""}, {"package": "3", "cluster": "Cluster 5", "contractor": "INNOVO", "pd": "Kahtan Tikriti", "pm": "Michael Ghali", "cm": "Robair Louies", "hsem": "Mazen Al Atwani", "se": ""}, {"package": "3", "cluster": "Cluster 6", "contractor": "INNOVO", "pd": "Kahtan Tikriti", "pm": "Michael Ghali", "cm": "Remon Karas", "hsem": "Mazen Al Atwani", "se": ""}, {"package": "4", "cluster": "Cluster 1A", "contractor": "TAJV", "pd": "Hicham Adel Narch", "pm": "Ghaidh Alfaour", "cm": "Alaa Hegab", "hsem": "Timur Terakopov", "se": "Amr Taha"}, {"package": "4", "cluster": "Cluster 1B", "contractor": "TAJV", "pd": "Hicham Adel Narch", "pm": "Ghaidh Alfaour", "cm": "Hossam Ali Maher", "hsem": "Timur Terakopov", "se": "Md Ramadan / Osama Said"}, {"package": "4", "cluster": "Cluster 2A", "contractor": "TAJV", "pd": "Hicham Adel Narch", "pm": "Ghaidh Alfaour", "cm": "Ahmed Salah Hassan Dewidar", "hsem": "Timur Terakopov", "se": "Rami Issa"}, {"package": "4", "cluster": "Cluster 2B", "contractor": "TAJV", "pd": "Hicham Adel Narch", "pm": "Ghaidh Alfaour", "cm": "Ahmed Salah Hassan Dewidar", "hsem": "Timur Terakopov", "se": "Rami Issa"}, {"package": "4", "cluster": "Cluster 2C", "contractor": "TAJV", "pd": "Hicham Adel Narch", "pm": "Ghaidh Alfaour", "cm": "Ahmed Salah Hassan Dewidar", "hsem": "Timur Terakopov", "se": "Salah Nayef"}];
const KPI_WEIGHTS = [{"name": "Work at Height Control", "weight": 0.12}, {"name": "Edge Protection", "weight": 0.12}, {"name": "Falling Object Prevention", "weight": 0.05}, {"name": "Excavation Safety", "weight": 0.08}, {"name": "Scaffolding Compliance", "weight": 0.1}, {"name": "PTW Implementation", "weight": 0.08}, {"name": "PTW Field Verification", "weight": 0.06}, {"name": "MSRA Quality", "weight": 0.03}, {"name": "Lifting/Precast Installation", "weight": 0.1}, {"name": "Traffic & Man-Machine Interface", "weight": 0.06}, {"name": "Housekeeping/Waste Management", "weight": 0.03}, {"name": "Welfare Arrangement", "weight": 0.03}, {"name": "Fire Readiness", "weight": 0.05}, {"name": "Supervision & Subcontractor Control", "weight": 0.03}, {"name": "Temporary Electrical & Tool Safety", "weight": 0.06}];

const KPI_ALIASES = {
  "Work at Height Control": ["work at height control","work at hight control","work at height"],
  "Edge Protection": ["edge protection"],
  "Falling Object Prevention": ["falling object prevention","falling object"],
  "Excavation Safety": ["excavation safety","excavation"],
  "Scaffolding Compliance": ["scaffolding compliance","scaffold compliance","scaffolding"],
  "PTW Implementation": ["ptw implementation"],
  "PTW Field Verification": ["ptw field verification"],
  "MSRA Quality": ["msra quality"],
  "Lifting/Precast Installation": ["lifting/precast installation","lifting precast installation","lifting / precast installation","lifting /precast installation","precast installation"],
  "Traffic & Man-Machine Interface": ["traffic & man-machine interface","traffic and man-machine interface","traffic & man machine interface","traffic man-machine"],
  "Housekeeping/Waste Management": ["housekeeping/waste management","housekeeping waste management","housekeeping"],
  "Welfare Arrangement": ["welfare arrangement","welfare"],
  "Fire Readiness": ["fire readiness","fire"],
  "Supervision & Subcontractor Control": ["supervision & subcontractor control","supervision and subcontractor control","supervision"],
  "Temporary Electrical & Tool Safety": ["temporary electrical & tool safety","temporary electrical and tool safety","temporary electrical"]
};

const SCORE_COLS = {
  Work_at_Height: "U",
  Edge_Protection: "V",
  Falling_Object_Prevention: "W",
  Excavation_Safety: "X",
  Scaffolding_Compliance: "Y",
  PTW_Implementation: "Z",
  PTW_Field_Verification: "AA",
  MSRA_Quality: "AB",
  "Lifting/Precast Installation": "AC",
  Traffic_Interface: "AD",
  "Housekeeping/Waste Management": "AE",
  "Welfare Arrangement": "AF",
  Fire_Readiness: "AG",
  Supervision_Subcontractor: "AH",
  Electrical_Tool_Safety: "AI"
};

const KPI_KEY_MAP = {
  "Work at Height Control":"Work_at_Height",
  "Edge Protection":"Edge_Protection",
  "Falling Object Prevention":"Falling_Object_Prevention",
  "Excavation Safety":"Excavation_Safety",
  "Scaffolding Compliance":"Scaffolding_Compliance",
  "PTW Implementation":"PTW_Implementation",
  "PTW Field Verification":"PTW_Field_Verification",
  "MSRA Quality":"MSRA_Quality",
  "Lifting/Precast Installation":"Lifting/Precast Installation",
  "Traffic & Man-Machine Interface":"Traffic_Interface",
  "Housekeeping/Waste Management":"Housekeeping/Waste Management",
  "Welfare Arrangement":"Welfare Arrangement",
  "Fire Readiness":"Fire_Readiness",
  "Supervision & Subcontractor Control":"Supervision_Subcontractor",
  "Temporary Electrical & Tool Safety":"Electrical_Tool_Safety"
};

const $ = (s) => document.querySelector(s);
const kpiGrid = $("#kpiGrid");
const statusBox = $("#status");
const ocrStatus = $("#ocrStatus");
const summaryBox = $("#summaryBox");

function setStatus(msg, tone="normal") {
  statusBox.textContent = msg;
  statusBox.style.borderColor = tone === "error" ? "#f1a3a3" : tone === "success" ? "#90d5aa" : "#d7dfeb";
  statusBox.style.background = tone === "error" ? "#fff3f3" : tone === "success" ? "#f3fff7" : "#fff";
}

function setOcrStatus(msg, tone="normal") {
  ocrStatus.textContent = msg;
  ocrStatus.style.borderColor = tone === "error" ? "#f1a3a3" : tone === "success" ? "#90d5aa" : "#d7dfeb";
  ocrStatus.style.background = tone === "error" ? "#fff3f3" : tone === "success" ? "#f3fff7" : "#fff";
}

function fillBasics() {
  const packageSet = [...new Set(CLUSTERS.map(x => x.package))];
  $("#package").innerHTML = '<option value="">Select package</option>' + packageSet.map(x => `<option value="${x}">Package ${x}</option>`).join("");
  $("#cluster").innerHTML = '<option value="">Select cluster</option>' + CLUSTERS.map(x => `<option value="${x.cluster}">${x.cluster}</option>`).join("");
  $("#stopWork").value = "YES";
  setCloseoutFromInspectionDate();
}


function setCloseoutFromInspectionDate() {
  const base = $("#inspectionDate").value ? new Date($("#inspectionDate").value + "T00:00:00") : new Date();
  base.setDate(base.getDate() + 7);
  $("#targetCloseoutDate").value = base.toISOString().slice(0,10);
}

function updateAreaText(force = false) {
  const pkg = $("#package").value;
  const cluster = $("#cluster").value;
  if (!pkg || !cluster) return;
  if (force || !$("#areaText").value.trim()) {
    $("#areaText").value = `Package ${pkg} - ${cluster} scorecard walk`;
  }
}

function renderKpis() {
  kpiGrid.innerHTML = KPI_WEIGHTS.map((k, i) => `
    <div class="kpi-card">
      <h3>${i+1}. ${k.name}</h3>
      <input class="score-input" data-kpi="${k.name}" placeholder="Auto-detected score" />
    </div>
  `).join("");
  document.querySelectorAll(".score-input").forEach(inp => inp.addEventListener("input", recalc));
}

function clusterMeta(cluster) {
  return CLUSTERS.find(x => x.cluster === cluster) || null;
}

function syncClusterPackage(forceAreaText = false) {
  const cluster = $("#cluster").value;
  const meta = clusterMeta(cluster);
  if (meta) {
    $("#package").value = meta.package;
    $("#contractor").value = meta.contractor || "TAJV";
    $("#actionOwner").value = meta.contractor || "TAJV";
    updateAreaText(forceAreaText);
  }
  recalc();
}

function parseNumericScore(val) {
  const clean = String(val || "").trim().toUpperCase();
  if (!clean || clean === "N/A" || clean === "NA") return null;
  const n = Number(clean);
  return Number.isFinite(n) ? n : null;
}

function gatherScores() {
  const out = {};
  document.querySelectorAll(".score-input").forEach(inp => out[inp.dataset.kpi] = inp.value.trim());
  return out;
}

function lowScoreItems(scores) {
  return KPI_WEIGHTS
    .map(k => ({ name:k.name, value:parseNumericScore(scores[k.name]) }))
    .filter(x => x.value !== null)
    .sort((a,b) => a.value - b.value || a.name.localeCompare(b.name))
    .slice(0,3);
}

function rootCauseFromScores(scores) {
  const lows = lowScoreItems(scores).map(x => x.name.toLowerCase());
  if (lows.some(x => x.includes("supervision"))) return "Poor supervision";
  if (lows.some(x => x.includes("ptw") || x.includes("permit"))) return "PTW failure";
  if (lows.some(x => x.includes("housekeeping") || x.includes("traffic") || x.includes("excavation"))) return "Poor planning";
  if (lows.some(x => x.includes("scaffold") || x.includes("lifting"))) return "Inadequate competence";
  return "Poor supervision";
}

function mainActivityFromScores(scores) {
  const low = lowScoreItems(scores)[0];
  return low ? low.name : "";
}

function summaryTexts(scores) {
  const low3 = lowScoreItems(scores);
  const gaps = low3.map((x, i) => `${i+1}. Weak control was observed in ${x.name}, where the recorded score of ${x.value} indicates that the required site arrangements, supervision, or implementation controls were not at the expected level during the walk.`);
  const immediate = low3.length
    ? `The scorecard findings were reviewed immediately with the responsible site team, and the low-scoring KPI items related to ${low3.map(x => x.name).join(", ")} were highlighted for urgent rectification and close follow-up at the work front.`
    : "";
  const preventive = low3.map(x => {
    const n = x.name.toLowerCase();
    if (n.includes("work at height") || n.includes("edge protection")) return "All work-at-height areas and exposed edges shall be rechecked to ensure adequate protection, safe access, and close supervision are maintained before the activity continues.";
    if (n.includes("scaffold")) return "All scaffolding and temporary access arrangements shall be inspected by a competent person and brought fully in line with the approved requirements before further use.";
    if (n.includes("ptw")) return "Permit-to-work implementation and field verification shall be strengthened so that no activity proceeds without valid approval, physical verification, and continuous supervision.";
    if (n.includes("housekeeping") || n.includes("waste")) return "Housekeeping and waste management controls shall be improved immediately, with routine monitoring to keep all work areas clean, safe, and free from access obstructions.";
    if (n.includes("traffic")) return "Traffic and man-machine interface controls shall be reviewed to ensure proper segregation, route control, and safe movement of plant and personnel.";
    if (n.includes("electrical")) return "Temporary electrical systems and tools shall be inspected by competent personnel to ensure continued compliance and safe use on site.";
    if (n.includes("excavation")) return "Excavation areas shall be reviewed to ensure adequate barricading, access, inspection, and supervision are maintained in accordance with project requirements.";
    return `Control measures related to ${x.name} shall be strengthened through better planning, supervision, inspection, and close monitoring by the responsible team.`;
  });
  return { gaps: gaps.join("\n"), immediate, preventive: [...new Set(preventive)].join("\n\n") };
}

function recalc() {
  const scores = gatherScores();
  let total = 0, weighted = 0, count = 0;
  KPI_WEIGHTS.forEach(k => {
    const n = parseNumericScore(scores[k.name]);
    if (n !== null) { total += n; weighted += n * k.weight; count += 1; }
  });
  const weightedPct = count ? weighted / 5 : 0;
  const rawPct = count ? total / 75 : 0;
  const criticalRedFlag = ["Work at Height Control","Excavation Safety","Scaffolding Compliance","PTW Implementation","Lifting/Precast Installation"]
    .some(name => {
      const n = parseNumericScore(scores[name]);
      return n !== null && n <= 1;
    });
  let band = "";
  if (!count) band = "";
  else if (weightedPct < 0.4) band = "Critical";
  else if (weightedPct < 0.6) band = "Poor";
  else if (weightedPct < 0.75) band = "Needs Improvement";
  else if (weightedPct < 0.9) band = "Good";
  else band = "Excellent";

  $("#mainActivity").value = mainActivityFromScores(scores);
  $("#rootCause").value = count ? rootCauseFromScores(scores) : "";
  $("#ratingBand").value = band;
  const texts = summaryTexts(scores);
  $("#topGaps").value = texts.gaps;
  $("#immediateAction").value = texts.immediate;
  $("#preventiveAction").value = texts.preventive;

  const cls = band === "Excellent" || band === "Good" ? "good" : band === "Needs Improvement" ? "warn" : "bad";
  summaryBox.className = "summary " + (count ? cls : "");
  summaryBox.innerHTML = count ? `
    <strong>Total Score:</strong> ${total.toFixed(1)} &nbsp; | &nbsp;
    <strong>Raw Score %:</strong> ${(rawPct*100).toFixed(1)}% &nbsp; | &nbsp;
    <strong>Weighted Score %:</strong> ${(weightedPct*100).toFixed(1)}% &nbsp; | &nbsp;
    <strong>Critical Red Flag:</strong> ${criticalRedFlag ? "YES" : "NO"} &nbsp; | &nbsp;
    <strong>Award Eligible:</strong> ${(!criticalRedFlag && weightedPct >= 0.75) ? "YES" : "NO"} &nbsp; | &nbsp;
    <strong>Rating Band:</strong> ${band || "—"}
  ` : "Upload and read the scorecard to calculate the row automatically.";
}

function normalizeOcrText(text) {
  return String(text || "")
    .replace(/[|]/g, "I")
    .replace(/[—–]/g, "-")
    .replace(/[\t]+/g, " ")
    .replace(/\r/g, "")
    .replace(/[ ]{2,}/g, " ");
}

function normalizeForSearch(text) {
  return normalizeOcrText(text)
    .toLowerCase()
    .replace(/[\[\]{}()]/g, " ")
    .replace(/[^a-z0-9:\/.\-\s&]/g, " ")
    .replace(/[ ]{2,}/g, " ");
}

function extractDate(text) {
  const candidates = [...String(text).matchAll(/(\d{1,2})[-\/.](\d{1,2})[-\/.](20\d{2})/g)];
  if (!candidates.length) return "";
  const best = candidates[0];
  const dd = best[1].padStart(2,"0");
  const mm = best[2].padStart(2,"0");
  const yy = best[3];
  return `${yy}-${mm}-${dd}`;
}

function normalizeTimeValue(v) {
  const m = String(v).replace(".", ":").match(/(\d{1,2}):(\d{2})/);
  if (!m) return "09:30";
  return `${m[1].padStart(2,"0")}:${m[2]}`;
}

function extractTime(text) {
  const labeled = text.match(/time\s*[:\-]?\s*([0-9]{1,2}[:\.]?[0-9]{2})/i);
  if (labeled) return normalizeTimeValue(labeled[1]);
  const all = [...String(text).matchAll(/\b([0-9]{1,2}[:\.]?[0-9]{2})\b/g)].map(m => m[1]);
  if (!all.length) return "09:30";
  const good = all.find(x => x.includes(":") || x.includes("."));
  return normalizeTimeValue(good || all[0]);
}

function normalizeClusterCode(code) {
  if (!code) return "";
  const cleaned = String(code).toUpperCase().replace(/[^0-9A-Z]/g, "");
  const m = cleaned.match(/(1A|1B|2A|2B|2C|7A|7B|8A|8B|8C|8D)$/);
  return m ? m[1] : "";
}

function extractPackageCluster(raw) {
  const text = normalizeForSearch(raw).replace(/\s+/g, " ");
  let pkg = "";
  let cluster = "";

  const packageLabel = text.match(/package\s*[:\-]?\s*([234])\s*[-\s]?\s*(1a|1b|2a|2b|2c|7a|7b|8a|8b|8c|8d)/i);
  if (packageLabel) {
    pkg = packageLabel[1];
    cluster = "Cluster " + packageLabel[2].toUpperCase();
    return { pkg, cluster };
  }

  const clusterLabel = text.match(/cluster\s*[:\-]?\s*(1a|1b|2a|2b|2c|7a|7b|8a|8b|8c|8d)/i);
  if (clusterLabel) {
    cluster = "Cluster " + clusterLabel[1].toUpperCase();
  }

  const packageOnly = text.match(/package\s*[:\-]?\s*([234])/i);
  if (packageOnly) pkg = packageOnly[1];

  if (!cluster) {
    const loose = text.match(/\b(1a|1b|2a|2b|2c|7a|7b|8a|8b|8c|8d)\b/i);
    if (loose) cluster = "Cluster " + loose[1].toUpperCase();
  }

  if (!pkg && cluster) {
    const meta = clusterMeta(cluster);
    if (meta) pkg = meta.package;
  }
  return { pkg, cluster };
}

function normalizeScoreToken(token) {
  const raw = String(token || "").trim().toUpperCase().replace(/,/g, ".");
  if (!raw) return "";
  if (["NA", "N/A", "N.A", "N8", "NB", "N B"].includes(raw)) return "N/A";
  let s = raw
    .replace(/[OS]/g, "0")
    .replace(/[IL]/g, "1")
    .replace(/B/g, "8");
  s = s.replace(/^(\d)0$/, "$1.0");
  s = s.replace(/^(\d)5$/, "$1.5");
  const direct = s.match(/^[0-5](?:\.0|\.5)?$/);
  if (direct) return String(Number(s)).includes(".") ? Number(s).toFixed(1).replace(/\.0$/, "") : String(Number(s));
  const compact = s.match(/^([0-5])([05])$/);
  if (compact) return `${compact[1]}.${compact[2]}`;
  return "";
}

function extractScoreFromLine(line) {
  const cleaned = String(line || "")
    .replace(/\bN\s*\/\s*A\b/gi, " N/A ")
    .replace(/\bN\s*A\b/gi, " NA ")
    .replace(/[|]/g, " ")
    .replace(/O/g, "0");
  const tokens = cleaned.match(/N\/?A|NA|[0-5](?:[\.,][05])?|[0-5][05]|\b[0-5]0\b|\b[0-5]5\b/gi) || [];
  for (let i = tokens.length - 1; i >= 0; i--) {
    const normalized = normalizeScoreToken(tokens[i]);
    if (normalized) return normalized;
  }
  return "";
}

function detectScoresByAlias(lines) {
  const scores = {};
  Object.entries(KPI_ALIASES).forEach(([kpi, aliases]) => {
    let found = "";
    for (let i = 0; i < lines.length; i++) {
      const lineLower = lines[i].toLowerCase();
      if (!aliases.some(alias => lineLower.includes(alias))) continue;
      found = extractScoreFromLine(lines[i]);
      if (!found && lines[i+1]) found = extractScoreFromLine(lines[i+1]);
      if (!found && lines[i+2]) found = extractScoreFromLine(lines[i+2]);
      if (found) break;
    }
    scores[kpi] = found;
  });
  return scores;
}

function detectScoresByOrder(lines) {
  const orderedLines = [];
  for (const line of lines) {
    const m = line.match(/^\s*(\d{1,2})\s+(.+)$/);
    if (!m) continue;
    const idx = Number(m[1]);
    if (idx < 1 || idx > 15) continue;
    orderedLines[idx - 1] = line;
  }

  if (orderedLines.filter(Boolean).length < 10) {
    const start = lines.findIndex(line => /work at height|edge protection|falling object|excavation|scaffolding/i.test(line));
    if (start >= 0) {
      for (let i = 0; i < 15; i++) {
        orderedLines[i] = orderedLines[i] || lines[start + i] || "";
      }
    }
  }

  const scores = {};
  KPI_WEIGHTS.forEach((kpi, idx) => {
    scores[kpi.name] = extractScoreFromLine(orderedLines[idx] || "");
  });
  return scores;
}


function detectScoresByLooseSequence(lines) {
  const scoreCandidates = [];
  for (const line of lines) {
    const score = extractScoreFromLine(line);
    if (score) scoreCandidates.push(score);
  }
  const scores = {};
  KPI_WEIGHTS.forEach((kpi, idx) => {
    scores[kpi.name] = scoreCandidates[idx] || "";
  });
  return scores;
}

function mergeDetectedScores(...scoreSets) {
  const merged = {};
  KPI_WEIGHTS.forEach(k => {
    for (const set of scoreSets) {
      const value = set?.[k.name];
      if (normalizeScoreToken(value)) {
        merged[k.name] = normalizeScoreToken(value);
        break;
      }
    }
    if (!merged[k.name]) merged[k.name] = "";
  });
  return merged;
}

function countFilledScores(scores) {
  return KPI_WEIGHTS.reduce((n, k) => n + (normalizeScoreToken(scores[k.name]) ? 1 : 0), 0);
}

async function fileToImageBitmap(file) {
  if (window.createImageBitmap) return await createImageBitmap(file);
  return await new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}

function canvasToBlob(canvas) {
  return new Promise(resolve => canvas.toBlob(resolve, "image/png"));
}

async function buildOcrVariants(file) {
  const img = await fileToImageBitmap(file);
  const variants = [];

  function makeCanvas(scale = 1) {
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return { canvas, ctx };
  }

  function grayscaleThreshold(canvas, ctx, threshold = 180, contrast = 1.35) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      let value = (gray - 128) * contrast + 128;
      value = value >= threshold ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = value;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  function grayscaleSharpen(canvas, ctx) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const adjusted = Math.max(0, Math.min(255, (gray - 128) * 1.55 + 128));
      data[i] = data[i + 1] = data[i + 2] = adjusted;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  {
    const { canvas } = makeCanvas(1);
    variants.push({ name: "original", blob: await canvasToBlob(canvas) });
  }

  {
    const { canvas, ctx } = makeCanvas(2);
    grayscaleSharpen(canvas, ctx);
    variants.push({ name: "gray-2x", blob: await canvasToBlob(canvas) });
  }

  {
    const { canvas, ctx } = makeCanvas(2.3);
    grayscaleThreshold(canvas, ctx, 176, 1.4);
    variants.push({ name: "threshold-2.3x", blob: await canvasToBlob(canvas) });
  }

  return variants.filter(v => v.blob);
}

async function runOcrOnVariant(blob, onProgress) {
  return await Tesseract.recognize(blob, "eng", {
    logger: m => {
      if (m.status === "recognizing text" && typeof m.progress === "number") onProgress?.(m.progress);
    },
    tessedit_pageseg_mode: Tesseract.PSM.AUTO,
    preserve_interword_spaces: "1"
  });
}

function parseOneOcrText(rawText) {
  const raw = normalizeOcrText(rawText || "");
  const lines = raw.split(/\n+/).map(l => l.trim()).filter(Boolean);
  const info = extractPackageCluster(raw);
  const aliasScores = detectScoresByAlias(lines);
  const orderScores = detectScoresByOrder(lines);
  const looseScores = detectScoresByLooseSequence(lines);
  const scores = mergeDetectedScores(aliasScores, orderScores, looseScores);

  return {
    raw,
    info,
    date: extractDate(raw),
    time: extractTime(raw),
    scores,
    count: countFilledScores(scores)
  };
}

function chooseBestOcrResult(results) {
  return results.sort((a, b) => {
    const aScore = a.count + (a.info.cluster ? 2 : 0) + (a.info.pkg ? 1 : 0) + (a.date ? 1 : 0);
    const bScore = b.count + (b.info.cluster ? 2 : 0) + (b.info.pkg ? 1 : 0) + (b.date ? 1 : 0);
    return bScore - aScore;
  })[0];
}

async function readImage() {
  const file = $("#imageInput").files?.[0];
  if (!file) {
    setOcrStatus("Please choose an image first.", "error");
    return;
  }

  setOcrStatus("Reading image deeply. Please wait...", "normal");

  try {
    const variants = await buildOcrVariants(file);
    const parsedResults = [];

    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      setOcrStatus(`Reading image deeply... pass ${i + 1} of ${variants.length} (${variant.name})`, "normal");
      const result = await runOcrOnVariant(variant.blob, progress => {
        setOcrStatus(`Reading image deeply... pass ${i + 1} of ${variants.length} (${variant.name}) ${Math.round(progress * 100)}%`, "normal");
      });
      parsedResults.push(parseOneOcrText(result.data.text || ""));
    }

    const best = chooseBestOcrResult(parsedResults);
    $("#ocrText").value = best.raw;

    if (best.date) $("#inspectionDate").value = best.date;
    $("#inspectionTime").value = best.time || "09:30";
    setCloseoutFromInspectionDate();

    if (best.info.cluster) $("#cluster").value = best.info.cluster;
    if (best.info.pkg) $("#package").value = best.info.pkg;
    syncClusterPackage(true);

    const selectedMeta = clusterMeta($("#cluster").value);
    $("#contractor").value = selectedMeta?.contractor || "TAJV";
    $("#actionOwner").value = selectedMeta?.contractor || "TAJV";
    $("#yourName").value = "Javed Iqbal";
    $("#yourRole").value = "KEO";
    $("#stopWork").value = "YES";

    document.querySelectorAll(".score-input").forEach(inp => {
      inp.value = best.scores[inp.dataset.kpi] || "";
    });

    recalc();
    const scoreCount = countFilledScores(best.scores);
    if (scoreCount < 10) {
      setOcrStatus(`Image read finished, but only ${scoreCount}/15 KPI scores were confidently detected. Please review the OCR text and fill any missing score manually.`, "error");
      setStatus(`Partial OCR only: ${scoreCount}/15 KPI scores detected.`, "error");
    } else {
      setOcrStatus(`Image read completed successfully. Detected ${scoreCount}/15 KPI scores.`, "success");
      setStatus("Auto-filled from image. Review and click Generate Updated Excel.", "success");
    }
  } catch (err) {
    console.error(err);
    setOcrStatus("OCR failed. Please try another image or refresh the page.", "error");
    setStatus("OCR failed. Please try another image.", "error");
  }
}

function excelDateSerial(dateStr) {
  if (!dateStr) return null;
  const dt = new Date(dateStr + "T00:00:00");
  const epoch = Date.UTC(1899,11,30);
  const utc = Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate());
  return Math.floor((utc - epoch) / 86400000);
}

function formattedMonth(dateStr) {
  return dateStr ? dateStr.slice(0,7) : "";
}

function weekNo(dateStr) {
  const date = new Date(dateStr + "T00:00:00");
  const temp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(),0,1));
  return Math.ceil((((temp - yearStart) / 86400000) + 1) / 7);
}

function inspectionId(dateStr, cluster, existingRows) {
  const compact = dateStr.replaceAll("-", "");
  const base = cluster.replace(/\s+/g, "");
  const same = existingRows.filter(r => String(r.cluster || "") === cluster && String(r.date || "") === dateStr).length + 1;
  return `${compact}-${base}-${String(same).padStart(2,"0")}`;
}


async function loadWorkbookBuffer() {
  try {
    const res = await fetch("template.xlsx", { cache: "no-store" });
    if (res.ok) return await res.arrayBuffer();
  } catch (e) {
    console.warn("Template fetch failed:", e);
  }
  throw new Error("Template workbook could not be loaded. Please run from GitHub Pages or a local server.");
}

function clonePlain(obj) {
  return obj ? JSON.parse(JSON.stringify(obj)) : obj;
}

function shiftFormulaRows(formula, sourceRow, targetRow) {
  if (!formula) return formula;
  const diff = targetRow - sourceRow;
  return String(formula).replace(/(\$?[A-Z]{1,3})(\$?)(\d+)/g, (m, col, dollar, rowText) => {
    const rowNo = Number(rowText);
    if (!Number.isFinite(rowNo)) return m;
    if (rowNo === sourceRow) return `${col}${dollar}${targetRow}`;
    if (rowNo > sourceRow) return `${col}${dollar}${rowNo + diff}`;
    return m;
  });
}

function excelJsDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function findNextWeeklyRow(ws) {
  let row = 4;
  while (true) {
    const v = ws.getCell(`B${row}`).value;
    if (v === null || v === undefined || v === "") return row;
    row++;
    if (row > 5000) throw new Error("No empty row found in Weekly_Inspections.");
  }
}

function copyTemplateRowExactly(ws, sourceRowNo, targetRowNo) {
  const sourceRow = ws.getRow(sourceRowNo);
  const targetRow = ws.getRow(targetRowNo);
  targetRow.height = sourceRow.height;
  targetRow.hidden = false;
  for (let c = 1; c <= 59; c++) {
    const src = sourceRow.getCell(c);
    const dst = targetRow.getCell(c);
    dst.style = clonePlain(src.style);
    dst.numFmt = src.numFmt;
    dst.alignment = clonePlain(src.alignment);
    dst.border = clonePlain(src.border);
    dst.fill = clonePlain(src.fill);
    dst.font = clonePlain(src.font);
    dst.protection = clonePlain(src.protection);
    if (src.dataValidation) dst.dataValidation = clonePlain(src.dataValidation);
    if (src.note) dst.note = clonePlain(src.note);

    if (src.formula) {
      dst.value = { formula: shiftFormulaRows(src.formula, sourceRowNo, targetRowNo) };
    } else if (src.value && typeof src.value === "object" && src.value.formula) {
      dst.value = { formula: shiftFormulaRows(src.value.formula, sourceRowNo, targetRowNo) };
    } else {
      dst.value = "";
    }
  }
  targetRow.commit?.();
}

function setExcelCell(ws, addr, value, numFmt = null) {
  const cell = ws.getCell(addr);
  cell.value = value;
  if (numFmt) cell.numFmt = numFmt;
}

async function generateWorkbook() {
  const inspectionDate = $("#inspectionDate").value;
  const cluster = $("#cluster").value;
  const pkg = $("#package").value;
  if (!inspectionDate || !cluster || !pkg) {
    setStatus("Inspection date, package, and cluster are required.", "error");
    return;
  }

  const scores = gatherScores();
  const hasScore = KPI_WEIGHTS.some(k => parseNumericScore(scores[k.name]) !== null);
  if (!hasScore) {
    setStatus("No KPI scores detected. Please read the image first or fill the score(s).", "error");
    return;
  }

  setStatus("Building workbook using only the Weekly_Inspections sheet and the exact template row structure...", "normal");

  try {
    const buffer = await loadWorkbookBuffer();
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buffer);

    const ws = wb.getWorksheet("Weekly_Inspections");
    if (!ws) throw new Error("Weekly_Inspections sheet was not found in template.xlsx.");

    const row = findNextWeeklyRow(ws);
    copyTemplateRowExactly(ws, 4, row);

    const scoreMap = {};
    Object.entries(KPI_KEY_MAP).forEach(([label, key]) => {
      scoreMap[key] = parseNumericScore(scores[label]);
    });

    const texts = summaryTexts(scores);
    const rootCause = rootCauseFromScores(scores);
    const mainActivity = mainActivityFromScores(scores);

    setExcelCell(ws, `B${row}`, excelJsDate(inspectionDate), "yyyy-mm-dd");
    setExcelCell(ws, `D${row}`, "");
    setExcelCell(ws, `F${row}`, Number(pkg));
    setExcelCell(ws, `G${row}`, cluster);
    setExcelCell(ws, `O${row}`, $("#yourName").value || "Javed Iqbal");
    setExcelCell(ws, `P${row}`, $("#yourRole").value || "KEO");
    setExcelCell(ws, `Q${row}`, $("#areaText").value || `Package ${pkg} - ${cluster} scorecard walk`);

    const workers = $("#workersObserved").value;
    setExcelCell(ws, `R${row}`, workers ? Number(workers) : "");
    setExcelCell(ws, `S${row}`, mainActivity);
    setExcelCell(ws, `T${row}`, $("#stopWork").value || "YES");

    Object.entries(SCORE_COLS).forEach(([key, col]) => {
      const v = scoreMap[key];
      setExcelCell(ws, `${col}${row}`, (v !== null && v !== undefined) ? v : "");
    });

    setExcelCell(ws, `AP${row}`, "");
    setExcelCell(ws, `AQ${row}`, rootCause);
    setExcelCell(ws, `AR${row}`, texts.gaps);
    setExcelCell(ws, `AS${row}`, texts.immediate);
    setExcelCell(ws, `AT${row}`, texts.preventive);
    setExcelCell(ws, `AU${row}`, "");
    setExcelCell(ws, `AV${row}`, $("#actionOwner").value || "");
    const closeout = $("#targetCloseoutDate").value;
    setExcelCell(ws, `AW${row}`, closeout ? excelJsDate(closeout) : "", "yyyy-mm-dd");
    setExcelCell(ws, `AX${row}`, "");

    ["AY","AZ","BA","BB","BC","BD","BE","BF","BG"].forEach(col => setExcelCell(ws, `${col}${row}`, ""));

    ws.getRow(row).commit?.();

    const out = await wb.xlsx.writeBuffer();
    const blob = new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const fileName = `Weekly_Inspections_Updated_${cluster.replace(/\s+/g,'_')}_${inspectionDate}.xlsx`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);

    setStatus(`Updated workbook generated successfully. Only row ${row} in Weekly_Inspections was populated. No extra sheets or extra columns were added.`, "success");
  } catch (err) {
    console.error(err);
    setStatus(err.message || "Workbook generation failed.", "error");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fillBasics();
  if (!$("#inspectionDate").value) {
    $("#inspectionDate").value = new Date().toISOString().slice(0,10);
    setCloseoutFromInspectionDate();
  }
  renderKpis();
  recalc();

  $("#cluster").addEventListener("change", () => syncClusterPackage(false));
  $("#inspectionDate").addEventListener("change", setCloseoutFromInspectionDate);
  $("#readBtn").addEventListener("click", readImage);
  $("#generateBtn").addEventListener("click", generateWorkbook);

  $("#imageInput").addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      $("#imagePreview").src = ev.target.result;
      $("#imagePreview").style.display = "block";
      $("#imagePlaceholder").style.display = "none";
      setOcrStatus("Image loaded successfully. Reading will start automatically in a moment, or click Read Image now.", "success");
      setTimeout(() => { if ($("#imageInput").files?.[0] === file) readImage(); }, 250);
    };
    reader.onerror = () => setOcrStatus("Image could not be loaded.", "error");
    reader.readAsDataURL(file);
  });
});
