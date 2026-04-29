const HEADERS = [
  "Inspection_ID","Inspection_Date","Week_No",null,"Month","Package","Cluster","Package_Cluster_Check","Contractor","Project Director (PD)","Project Manager (PM)","Construction Manager (CM)","HSE Manager (HSEM)","Section Engineer (SE)","Your_Name","Your_Role","Area_or_Villa","Workers_Observed","Main_High_Risk_Activity","Stop_Work","Work_at_Height","Edge_Protection","Falling_Object_Prevention","Excavation_Safety","Scaffolding_Compliance","PTW_Implementation","PTW_Field_Verification","MSRA_Quality","Lifting/Precast Installation","Traffic_Interface","Housekeeping/Waste Management","Welfare Arrangement","Fire_Readiness","Supervision_Subcontractor","Electrical_Tool_Safety","Total_Score","Raw_Score_%","Weighted_Score_%","Critical_Red_Flag","Award_Eligible","Rating_Band","Repeat_Issue_Seen","Likely_Root_Cause","Top_3_Gaps_Observed","Immediate_Action_Taken","Preventive_Action_Required","Positive_Observations","Action_Owner","Target_Closeout_Date","Evidence_Link_or_Photo","KPI_for_PD_Attention","KPI_for_PM_Attention","KPI_for_CM_Attention","KPI_for_HSEM_Followup","KPI_for_SE_Supervision","Leadership_Visible_Effective","Unsafe_Work_Corrected_Immediately","Best_Improved_Cluster_this_Week","Cluster_Needing_Immediate_Intervention"
];

const KPI_WEIGHTS = [
  ["Work_at_Height",0.12,"Work at Height Control"],
  ["Edge_Protection",0.12,"Edge Protection"],
  ["Falling_Object_Prevention",0.05,"Falling Object Prevention"],
  ["Excavation_Safety",0.08,"Excavation Safety"],
  ["Scaffolding_Compliance",0.10,"Scaffolding Compliance"],
  ["PTW_Implementation",0.08,"PTW Implementation"],
  ["PTW_Field_Verification",0.06,"PTW Field Verification"],
  ["MSRA_Quality",0.03,"MSRA Quality"],
  ["Lifting/Precast Installation",0.10,"Lifting/Precast Installation"],
  ["Traffic_Interface",0.06,"Traffic & Man-Machine Interface"],
  ["Housekeeping/Waste Management",0.03,"Housekeeping/Waste Management"],
  ["Welfare Arrangement",0.03,"Welfare Arrangement"],
  ["Fire_Readiness",0.05,"Fire Readiness"],
  ["Supervision_Subcontractor",0.03,"Supervision & Subcontractor Control"],
  ["Electrical_Tool_Safety",0.06,"Temporary Electrical & Tool Safety"]
];

const KPI_ALIASES = {
  "Work_at_Height":["work at height","work at hight","wah","height control"],
  "Edge_Protection":["edge protection","edge protaction","open edge"],
  "Falling_Object_Prevention":["falling object","dropped object","falling materials"],
  "Excavation_Safety":["excavation","trench","open excavation"],
  "Scaffolding_Compliance":["scaffolding","scaffold","mobile scaffold"],
  "PTW_Implementation":["ptw implementation","permit to work implementation","permit implementation","work permit"],
  "PTW_Field_Verification":["ptw field verification","field verification","permit verification"],
  "MSRA_Quality":["msra","method statement","risk assessment"],
  "Lifting/Precast Installation":["lifting","precast","a-frame","a frame"],
  "Traffic_Interface":["traffic","man-machine","man machine","vehicle movement"],
  "Housekeeping/Waste Management":["housekeeping","waste","debris"],
  "Welfare Arrangement":["welfare","drinking water","toilet"],
  "Fire_Readiness":["fire readiness","fire","extinguisher"],
  "Supervision_Subcontractor":["supervision","subcontractor","sub-contractor","supervisor"],
  "Electrical_Tool_Safety":["electrical","tool safety","temporary electrical","db","cable"]
};

const CLUSTERS = {
  "Cluster 7A":{pkg:2, contractor:"TAJV"},"Cluster 7B":{pkg:2, contractor:"TAJV"},"Cluster 8A":{pkg:2, contractor:"TAJV"},"Cluster 8B":{pkg:2, contractor:"TAJV"},"Cluster 8C":{pkg:2, contractor:"TAJV"},"Cluster 8D":{pkg:2, contractor:"TAJV"},
  "Cluster 3":{pkg:3, contractor:"INNOVO"},"Cluster 4":{pkg:3, contractor:"INNOVO"},"Cluster 5":{pkg:3, contractor:"INNOVO"},"Cluster 6":{pkg:3, contractor:"INNOVO"},
  "Cluster 1A":{pkg:4, contractor:"TAJV"},"Cluster 1B":{pkg:4, contractor:"TAJV"},"Cluster 2A":{pkg:4, contractor:"TAJV"},"Cluster 2B":{pkg:4, contractor:"TAJV"},"Cluster 2C":{pkg:4, contractor:"TAJV"}
};

const $ = s => document.querySelector(s);
const excelEpoch = Date.UTC(1899,11,30);
function isoDateSerial(iso){ if(!iso) return ""; const d = new Date(iso+"T00:00:00"); return Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-excelEpoch)/86400000); }
function weekNo(iso){ if(!iso) return ""; const d = new Date(iso+"T00:00:00"); const t = new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())); const n = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate()+4-n); const y = new Date(Date.UTC(t.getUTCFullYear(),0,1)); return Math.ceil((((t-y)/86400000)+1)/7); }
function addDays(iso,days){ if(!iso) return ""; const d = new Date(iso+"T00:00:00"); d.setDate(d.getDate()+days); return d.toISOString().slice(0,10); }
function setStatus(msg,tone="normal"){ const box=$("#status"); box.textContent=msg; box.style.background=tone==="error"?"#fff3f3":tone==="success"?"#f3fff7":"#fff"; }
function setOcrStatus(msg,tone="normal"){ const box=$("#ocrStatus"); box.textContent=msg; box.style.background=tone==="error"?"#fff3f3":tone==="success"?"#f3fff7":"#fff"; }
function cleanText(s){ return String(s||"").replace(/[|]/g,"I").replace(/[—–]/g,"-").replace(/\r/g,"").replace(/[ \t]{2,}/g," "); }
function normalize(s){ return cleanText(s).toLowerCase().replace(/[^a-z0-9\/.:\-\s&]/g," ").replace(/\s+/g," ").trim(); }

function extractDate(text){
  const matches=[...String(text).matchAll(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](20\d{2})/g)];
  if(!matches.length) return "";
  const m=matches[0];
  return `${m[3]}-${m[2].padStart(2,"0")}-${m[1].padStart(2,"0")}`;
}
function extractClusterPackage(text){
  const n=normalize(text); let cluster="", pkg="";
  const codes=["1A","1B","2A","2B","2C","7A","7B","8A","8B","8C","8D"];
  for(const code of codes){ const lc=code.toLowerCase(); if(new RegExp(`\\bcluster\\s*${lc}\\b`).test(n)||new RegExp(`\\b${lc}\\b`).test(n)){ cluster=`Cluster ${code}`; break; } }
  const simple=n.match(/cluster\s*[:\-]?\s*([3456])\b/); if(!cluster && simple) cluster=`Cluster ${simple[1]}`;
  const p=n.match(/package\s*[:\-]?\s*([234])\b/); if(p) pkg=p[1];
  if(!pkg && cluster && CLUSTERS[cluster]) pkg=String(CLUSTERS[cluster].pkg);
  return {cluster,pkg};
}
function extractVilla(text){
  const m = String(text||"").match(/\b(?:villa|vila|vl)\s*[:\-]?\s*(\d{1,4}[A-Z]?)\b/i);
  return m ? `Villa ${m[1]}` : "";
}
function normalizeScoreToken(token){
  const raw=String(token||"").trim().toUpperCase().replace(/,/g,".");
  if(!raw) return "";
  if(/^(NA|N\/A|N\.A)$/.test(raw)) return "N/A";
  let s=raw.replace(/[OS]/g,"0").replace(/[IL]/g,"1").replace(/B/g,"8");
  if(/^[0-5](\.0|\.5)?$/.test(s)) return String(Number(s));
  const m=s.match(/^([0-5])([05])$/); if(m) return `${m[1]}.${m[2]}`;
  return "";
}
function scoreFromLine(line){
  const tokens=String(line||"").replace(/N\s*\/\s*A/gi,"N/A").match(/N\/?A|NA|[0-5](?:[\.,][05])?|[0-5][05]/gi)||[];
  for(let i=tokens.length-1;i>=0;i--){ const v=normalizeScoreToken(tokens[i]); if(v) return v; }
  return "";
}
function extractScores(text){
  const lines=cleanText(text).split(/\n+/).map(x=>x.trim()).filter(Boolean);
  const scores={};
  for(const [key,aliases] of Object.entries(KPI_ALIASES)){
    for(let i=0;i<lines.length;i++){
      const l=lines[i].toLowerCase();
      if(!aliases.some(a=>l.includes(a))) continue;
      const v=scoreFromLine(lines[i])||scoreFromLine(lines[i+1]||"")||scoreFromLine(lines[i+2]||"");
      if(v){ scores[key]=v; break; }
    }
  }
  // If the photo is a scorecard table and OCR misses labels, use sequential score fallback only when enough scores are visible.
  if(Object.keys(scores).length<8){
    const candidate=[];
    for(const line of lines){ const v=scoreFromLine(line); if(v && v!=="N/A") candidate.push(v); }
    if(candidate.length>=10) KPI_WEIGHTS.forEach((k,i)=>{ if(!scores[k[0]] && candidate[i]) scores[k[0]]=candidate[i]; });
  }
  // User instruction: unreadable KPI must be N/A for manual entry.
  KPI_WEIGHTS.forEach(k=>{ if(!scores[k[0]]) scores[k[0]]="N/A"; });
  return scores;
}
function scoreVal(v){ const s=String(v||"").trim().toUpperCase(); if(!s || s==="N/A" || s==="NA") return null; const n=Number(s); return Number.isFinite(n)?n:null; }
function allScores(){ const o={}; document.querySelectorAll(".score-input").forEach(x=>{ o[x.dataset.key]=x.value.trim() || "N/A"; }); return o; }
function lowKpis(scores){
  return KPI_WEIGHTS.map(k=>({key:k[0], label:k[2], value:scoreVal(scores[k[0]])}))
    .filter(x=>x.value!==null)
    .sort((a,b)=>a.value-b.value || a.label.localeCompare(b.label))
    .slice(0,3);
}
function rootCauseFor(lows){
  const labels=lows.map(x=>x.label.toLowerCase()).join(" | ");
  if(!lows.length) return "Pending manual review after KPI scores are entered.";
  if(labels.includes("ptw") || labels.includes("permit")) return "PTW failure / inadequate field verification.";
  if(labels.includes("supervision")) return "Poor supervision and subcontractor control.";
  if(labels.includes("excavation") || labels.includes("traffic")) return "Poor planning and inadequate work-front control.";
  if(labels.includes("height") || labels.includes("edge") || labels.includes("falling")) return "Inadequate fall prevention planning and supervision.";
  if(labels.includes("scaffold") || labels.includes("lifting") || labels.includes("electrical")) return "Inadequate competence, inspection, and supervision.";
  return "Poor supervision and weak implementation of project OSH controls.";
}
function actionTextFor(label, type){
  const l=label.toLowerCase();
  if(type==="immediate"){
    if(l.includes("height")||l.includes("edge")) return `${label}: stop affected work-at-height activity, restrict access to the unsafe area, and provide safe access/edge protection before restart.`;
    if(l.includes("excavation")) return `${label}: stop unsafe excavation activity, provide safe access/egress and rigid barricading/edge protection, and verify excavation controls at site.`;
    if(l.includes("ptw")) return `${label}: suspend the activity until a valid PTW is approved, physically verified, and communicated to the work crew.`;
    if(l.includes("scaffold")) return `${label}: prevent scaffold use until competent inspection, correction, and valid tagging are completed.`;
    if(l.includes("lifting")||l.includes("precast")) return `${label}: stop lifting/precast activity until lifting plan, exclusion zone, rigging, and supervision are verified.`;
    if(l.includes("traffic")) return `${label}: segregate plant/personnel immediately and reinstate signage, banksman control, and safe access routes.`;
    if(l.includes("housekeeping")) return `${label}: remove obstruction/waste immediately and restore safe access at the work front.`;
    if(l.includes("electrical")) return `${label}: isolate unsafe electrical/tool setup and arrange competent inspection before reuse.`;
    if(l.includes("fire")) return `${label}: reinstate fire protection resources, access, and emergency readiness immediately.`;
    return `${label}: discuss the low KPI with the responsible site team and rectify the unsafe condition before continuing the activity.`;
  }
  if(l.includes("height")||l.includes("edge")) return `${label}: Project Manager and Construction Manager shall ensure WAH planning, permit verification, safe access, edge protection, and daily supervision are implemented before similar work starts.`;
  if(l.includes("excavation")) return `${label}: Project Manager and Construction Manager shall ensure excavation inspection, access/egress, barricading, permit controls, and daily closeout verification are implemented.`;
  if(l.includes("ptw")) return `${label}: Project Manager and Construction Manager shall strengthen PTW ownership by the main contractor, including field verification before approval and monitoring during execution.`;
  if(l.includes("scaffold")) return `${label}: Project Manager and Construction Manager shall ensure scaffold planning, competent erection/inspection, tagging, and routine monitoring are enforced.`;
  if(l.includes("lifting")||l.includes("precast")) return `${label}: Project Manager and Construction Manager shall verify approved lifting/precast MSRA, lifting plan, exclusion zones, rigging checks, and competent supervision.`;
  if(l.includes("traffic")) return `${label}: Project Manager and Construction Manager shall review traffic layout, pedestrian routes, signage, banksman arrangements, and man-machine segregation.`;
  if(l.includes("housekeeping")) return `${label}: Project Manager and Construction Manager shall implement routine housekeeping inspections, waste removal schedule, and access route monitoring.`;
  if(l.includes("electrical")) return `${label}: Project Manager and Construction Manager shall ensure temporary electrical/tool inspections, cable management, DB protection, and defective tool removal.`;
  if(l.includes("supervision")) return `${label}: Project Manager and Construction Manager shall assign competent supervision at the work front and verify subcontractor compliance continuously.`;
  return `${label}: Project Manager and Construction Manager shall implement a corrective action plan with supervision, inspection, and closeout evidence.`;
}
function updateTextFields(force=false){
  const lows=lowKpis(allScores());
  const gaps = lows.length ? lows.map((x,i)=>`${i+1}. ${x.label} is one of the lowest scoring KPIs (${x.value}/5), requiring immediate site-level corrective action and management follow-up.`).join("\n") : "KPI scores are pending / unreadable. Update N/A scores manually, then review the top gaps.";
  const immediate = lows.length ? lows.map(x=>actionTextFor(x.label,"immediate")).join("\n") : "Pending manual review after KPI scores are entered.";
  const preventive = lows.length ? lows.map(x=>actionTextFor(x.label,"preventive")).join("\n") : "Pending manual review after KPI scores are entered.";
  if(force || !$("#rootCause").value.trim()) $("#rootCause").value=rootCauseFor(lows);
  if(force || !$("#topGaps").value.trim()) $("#topGaps").value=gaps;
  if(force || !$("#immediateAction").value.trim()) $("#immediateAction").value=immediate;
  if(force || !$("#preventiveAction").value.trim()) $("#preventiveAction").value=preventive;
  if(force || !$("#mainActivity").value.trim()) $("#mainActivity").value=lows[0]?.label || "";
}
function updateDerived(){
  const d=$("#inspectionDate").value;
  $("#weekNo").value=weekNo(d);
  $("#monthText").value=d?d.slice(0,7):"";
  if(d) $("#targetCloseoutDate").value=addDays(d,7);
  recalc(false);
}
function renderKpis(){
  const grid=$("#kpiGrid");
  grid.innerHTML=KPI_WEIGHTS.map((k,i)=>`<div class="kpi-card"><h3>${i+1}. ${k[2]}</h3><input class="score-input" data-key="${k[0]}" placeholder="Score from photo or N/A" /></div>`).join("");
  document.querySelectorAll(".score-input").forEach(x=>x.addEventListener("input",()=>recalc(true)));
}
function recalc(userEdited=false){
  const scores=allScores(); let total=0, weighted=0, count=0;
  for(const k of KPI_WEIGHTS){ const n=scoreVal(scores[k[0]]); if(n!==null){ total+=n; weighted+=n*k[1]; count++; } }
  const raw=count?total/75:""; const wp=count?weighted/5:"";
  const critical=["Work_at_Height","Excavation_Safety","Scaffolding_Compliance","PTW_Implementation","Lifting/Precast Installation"].some(k=>scoreVal(scores[k])!==null && scoreVal(scores[k])<=1);
  let band=""; if(count){ band=wp<0.4?"Critical":wp<0.6?"Poor":wp<0.75?"Needs Improvement":wp<0.9?"Good":"Excellent"; }
  $("#ratingBand").value=band;
  updateTextFields(userEdited);
  $("#summaryBox").innerHTML=count?`<strong>Readable KPI scores:</strong> ${count}/15 | <strong>Total:</strong> ${total} | <strong>Raw %:</strong> ${(raw*100).toFixed(1)}% | <strong>Weighted %:</strong> ${(wp*100).toFixed(1)}% | <strong>Critical Red Flag:</strong> ${critical?"YES":"NO"} | <strong>Band:</strong> ${band}`:"No readable KPI scores yet. Unreadable KPI fields will remain N/A for manual entry.";
}
async function fileToBitmap(file){ if(window.createImageBitmap) return await createImageBitmap(file); return await new Promise((res,rej)=>{ const img=new Image(); img.onload=()=>res(img); img.onerror=rej; img.src=URL.createObjectURL(file); }); }
function canvasBlob(canvas){ return new Promise(res=>canvas.toBlob(res,"image/png")); }
async function variants(file){
  const img=await fileToBitmap(file); const out=[];
  for(const scale of [1,2,2.5,3]){
    const c=document.createElement("canvas"); c.width=Math.round(img.width*scale); c.height=Math.round(img.height*scale);
    const ctx=c.getContext("2d",{willReadFrequently:true}); ctx.drawImage(img,0,0,c.width,c.height);
    if(scale>1){ const id=ctx.getImageData(0,0,c.width,c.height); for(let i=0;i<id.data.length;i+=4){ const g=0.299*id.data[i]+0.587*id.data[i+1]+0.114*id.data[i+2]; const v=Math.max(0,Math.min(255,(g-128)*1.55+128)); id.data[i]=id.data[i+1]=id.data[i+2]=v; } ctx.putImageData(id,0,0); }
    out.push(await canvasBlob(c));
  }
  return out;
}
async function readImage(){
  const file=$("#imageInput").files?.[0]; if(!file){ setOcrStatus("Choose a photo first.","error"); return; }
  setOcrStatus("Reading photo deeply...","normal");
  try{
    let best={text:"",score:-1}; const vars=await variants(file);
    for(let i=0;i<vars.length;i++){
      const result=await Tesseract.recognize(vars[i],"eng",{logger:m=>{ if(m.status==="recognizing text") setOcrStatus(`OCR pass ${i+1}/${vars.length}: ${Math.round(m.progress*100)}%`); }});
      const text=result.data.text||""; const sc=Object.values(extractScores(text)).filter(v=>v!=="N/A").length+(extractDate(text)?3:0)+(extractClusterPackage(text).cluster?3:0);
      if(sc>best.score) best={text,score:sc};
    }
    const ocr=cleanText(best.text); $("#ocrText").value=ocr;
    const date=extractDate(ocr); if(date) $("#inspectionDate").value=date;
    const info=extractClusterPackage(ocr); if(info.pkg) $("#package").value=info.pkg; if(info.cluster) $("#cluster").value=info.cluster;
    const villa=extractVilla(ocr); $("#areaText").value=villa; // blank if no clear villa is detected
    const scores=extractScores(ocr); document.querySelectorAll(".score-input").forEach(x=>{ x.value=scores[x.dataset.key]||"N/A"; });
    $("#yourName").value="Javed Iqbal"; $("#yourRole").value="KEO"; $("#evidence").value="A site reference provided"; $("#repeatIssue").value="YES"; $("#actionOwner").value="Project Manager and Construction Manager";
    $("#rootCause").value=""; $("#topGaps").value=""; $("#immediateAction").value=""; $("#preventiveAction").value=""; $("#mainActivity").value="";
    updateDerived(); updateTextFields(true);
    const readable=Object.values(scores).filter(v=>v!=="N/A").length;
    setOcrStatus(`Photo reading complete. ${readable}/15 KPI scores detected. Unreadable KPI fields are marked N/A for manual entry.`, readable?"success":"error");
    setStatus("Review the extracted fields, low-KPI gaps, immediate action and preventive action, then generate the entry-only Excel.","success");
  }catch(e){ console.error(e); setOcrStatus("OCR failed. Please try a clearer photo.","error"); setStatus("OCR failed.","error"); }
}
function buildRow(){
  const d=$("#inspectionDate").value, cluster=$("#cluster").value.trim(), pkg=$("#package").value.trim(), scores=allScores();
  let total=0, weighted=0, count=0; for(const k of KPI_WEIGHTS){ const n=scoreVal(scores[k[0]]); if(n!==null){ total+=n; weighted+=n*k[1]; count++; } }
  const raw=count?total/75:"", wp=count?weighted/5:"";
  const critical=["Work_at_Height","Excavation_Safety","Scaffolding_Compliance","PTW_Implementation","Lifting/Precast Installation"].some(k=>scoreVal(scores[k])!==null && scoreVal(scores[k])<=1);
  const band=count?(wp<0.4?"Critical":wp<0.6?"Poor":wp<0.75?"Needs Improvement":wp<0.9?"Good":"Excellent"):"";
  const award=count?(!critical && wp>=0.75?"YES":"NO"):"";
  const row=new Array(HEADERS.length).fill(""); const set=(h,v)=>{ const i=HEADERS.indexOf(h); if(i>=0) row[i]=v; };
  set("Inspection_ID", d&&cluster?`${d.replaceAll("-","")}-${cluster.replace(/\s+/g,"")}-01`:"");
  set("Inspection_Date", d?isoDateSerial(d):""); set("Week_No", weekNo(d)); set("Month", d?d.slice(0,7):""); set("Package", pkg?Number(pkg):""); set("Cluster", cluster);
  set("Package_Cluster_Check", cluster&&pkg&&CLUSTERS[cluster]&&String(CLUSTERS[cluster].pkg)===String(pkg)?"OK":(cluster||pkg?"CHECK":""));
  set("Contractor", CLUSTERS[cluster]?.contractor||"");
  set("Your_Name", $("#yourName").value.trim()||"Javed Iqbal"); set("Your_Role", $("#yourRole").value.trim()||"KEO"); set("Area_or_Villa", $("#areaText").value.trim());
  set("Main_High_Risk_Activity", $("#mainActivity").value.trim()); set("Stop_Work", $("#stopWork").value);
  KPI_WEIGHTS.forEach(k=>set(k[0], scoreVal(scores[k[0]]) ?? "N/A"));
  set("Total_Score", count?total:""); set("Raw_Score_%", raw); set("Weighted_Score_%", wp); set("Critical_Red_Flag", count?(critical?"YES":"NO"):""); set("Award_Eligible", award); set("Rating_Band", band);
  set("Repeat_Issue_Seen", $("#repeatIssue").value); set("Likely_Root_Cause", $("#rootCause").value.trim()); set("Top_3_Gaps_Observed", $("#topGaps").value.trim()); set("Immediate_Action_Taken", $("#immediateAction").value.trim()); set("Preventive_Action_Required", $("#preventiveAction").value.trim()); set("Positive_Observations", $("#positiveObservations").value.trim());
  set("Action_Owner", $("#actionOwner").value.trim()||"Project Manager and Construction Manager"); set("Target_Closeout_Date", $("#targetCloseoutDate").value?isoDateSerial($("#targetCloseoutDate").value):""); set("Evidence_Link_or_Photo", $("#evidence").value.trim()||"A site reference provided");
  return row;
}
function generateWorkbook(){
  const row=buildRow(); const aoa=[["Weekly Inspection Entry Sheet - Google Form Ready"],["Entry-only file generated from photo. Copy row 4 values into the original master Weekly_Inspections sheet."],HEADERS,row];
  const ws=XLSX.utils.aoa_to_sheet(aoa); ws["!cols"]=HEADERS.map(h=>({wch: h===null?4:Math.min(Math.max(String(h||"").length+2,10),42)}));
  ["B4","AW4"].forEach(a=>{ if(ws[a]){ ws[a].t="n"; ws[a].z="yyyy-mm-dd"; }}); ["AK4","AL4"].forEach(a=>{ if(ws[a]) ws[a].z="0.0%"; });
  const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,"Weekly_Inspections");
  XLSX.writeFile(wb,`Weekly_Inspection_New_Entry_Only_${$("#inspectionDate").value||"date"}.xlsx`);
  setStatus("Entry-only Excel generated. Copy row 4 into your original master file using Paste Values.","success");
}
document.addEventListener("DOMContentLoaded",()=>{
  renderKpis(); $("#actionOwner").value="Project Manager and Construction Manager"; $("#evidence").value="A site reference provided"; $("#repeatIssue").value="YES";
  $("#inspectionDate").addEventListener("change",updateDerived); $("#readBtn").addEventListener("click",readImage); $("#generateBtn").addEventListener("click",generateWorkbook);
  $("#imageInput").addEventListener("change",e=>{ const file=e.target.files?.[0]; if(!file) return; const r=new FileReader(); r.onload=ev=>{ $("#imagePreview").src=ev.target.result; $("#imagePreview").style.display="block"; $("#imagePlaceholder").style.display="none"; setOcrStatus("Photo loaded. Reading will start automatically.","success"); setTimeout(readImage,250); }; r.readAsDataURL(file); });
  document.querySelectorAll("input, textarea, select").forEach(el=>el.addEventListener("change",()=>{ if(el.classList.contains("score-input")) recalc(true); }));
  updateDerived();
});
