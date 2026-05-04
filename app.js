const $=s=>document.querySelector(s);
const CLUSTERS={"Cluster 7A":{pkg:2,contractor:"TAJV"},"Cluster 7B":{pkg:2,contractor:"TAJV"},"Cluster 8A":{pkg:2,contractor:"TAJV"},"Cluster 8B":{pkg:2,contractor:"TAJV"},"Cluster 8C":{pkg:2,contractor:"TAJV"},"Cluster 8D":{pkg:2,contractor:"TAJV"},"Cluster 3":{pkg:3,contractor:"INNOVO"},"Cluster 4":{pkg:3,contractor:"INNOVO"},"Cluster 5":{pkg:3,contractor:"INNOVO"},"Cluster 6":{pkg:3,contractor:"INNOVO"},"Cluster 1A":{pkg:4,contractor:"TAJV"},"Cluster 1B":{pkg:4,contractor:"TAJV"},"Cluster 2A":{pkg:4,contractor:"TAJV"},"Cluster 2B":{pkg:4,contractor:"TAJV"},"Cluster 2C":{pkg:4,contractor:"TAJV"}};
const KPI=[["U","Work_at_Height","Work at Height Control"],["V","Edge_Protection","Edge Protection"],["W","Falling_Object_Prevention","Falling Object Prevention"],["X","Excavation_Safety","Excavation Safety"],["Y","Scaffolding_Compliance","Scaffolding Compliance"],["Z","PTW_Implementation","PTW Implementation"],["AA","PTW_Field_Verification","PTW Field Verification"],["AB","MSRA_Quality","MSRA Quality"],["AC","Lifting/Precast Installation","Lifting/Precast Installation"],["AD","Traffic_Interface","Traffic & Man-Machine Interface"],["AE","Housekeeping/Waste Management","Housekeeping/Waste Management"],["AF","Welfare Arrangement","Welfare Arrangement"],["AG","Fire_Readiness","Fire Readiness"],["AH","Supervision_Subcontractor","Supervision & Subcontractor Control"],["AI","Electrical_Tool_Safety","Temporary Electrical & Tool Safety"]];
const ALIAS={Work_at_Height:["work at height","height control","wah"],Edge_Protection:["edge protection","open edge","edge"],Falling_Object_Prevention:["falling object","dropped object"],Excavation_Safety:["excavation","trench"],Scaffolding_Compliance:["scaffold","scaffolding"],PTW_Implementation:["ptw implementation","permit to work","work permit"],PTW_Field_Verification:["field verification","permit verification"],MSRA_Quality:["msra","risk assessment","method statement"],"Lifting/Precast Installation":["lifting","precast","a-frame","a frame"],Traffic_Interface:["traffic","man-machine","man machine"],"Housekeeping/Waste Management":["housekeeping","waste","debris"],"Welfare Arrangement":["welfare"],Fire_Readiness:["fire","extinguisher"],Supervision_Subcontractor:["supervision","subcontractor"],Electrical_Tool_Safety:["electrical","cable","tool safety","db"]};
let excelFile=null; const excelEpoch=Date.UTC(1899,11,30);
function status(id,s,t=""){const e=$(id); if(e){e.textContent=s; e.style.background=t==="error"?"#fff3f3":t==="success"?"#f3fff7":"#fff"}}
function esc(s){return String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function colNum(c){let n=0; for(const ch of c)n=n*26+ch.charCodeAt(0)-64; return n}
function serial(iso){if(!iso)return""; const d=new Date(iso+"T00:00:00"); return Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-excelEpoch)/86400000)}
function weekNo(iso){if(!iso)return""; const d=new Date(iso+"T00:00:00"); const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())); const day=t.getUTCDay()||7; t.setUTCDate(t.getUTCDate()+4-day); const y=new Date(Date.UTC(t.getUTCFullYear(),0,1)); return Math.ceil((((t-y)/86400000)+1)/7)}
function addDays(iso,days){if(!iso)return""; const d=new Date(iso+"T00:00:00"); d.setDate(d.getDate()+days); return d.toISOString().slice(0,10)}
function norm(s){return String(s||"").toLowerCase().replace(/[^a-z0-9\/.:\-\s&]/g," ").replace(/\s+/g," ").trim()}
function extractDate(t){const s=String(t||""); let m=s.match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](20\d{2})/); if(m)return `${m[3]}-${m[2].padStart(2,"0")}-${m[1].padStart(2,"0")}`; m=s.match(/(20\d{2})[\/\-.](\d{1,2})[\/\-.](\d{1,2})/); return m?`${m[1]}-${m[2].padStart(2,"0")}-${m[3].padStart(2,"0")}`:""}
function extractCluster(t){const n=norm(t).replace(/clustar|claster|clusfer/g,"cluster"); let cluster="",pkg=""; for(const code of ["1A","1B","2A","2B","2C","7A","7B","8A","8B","8C","8D"]){const re=new RegExp('\\b(?:cluster|cl|c)?\\s*'+code.toLowerCase().replace(/([0-9])([a-z])/,'$1\\s*$2')+'\\b'); if(re.test(n)){cluster="Cluster "+code; break}} const sm=n.match(/(?:cluster|cl)\s*[:\-]?\s*([3456])\b/); if(!cluster&&sm)cluster="Cluster "+sm[1]; const pm=n.match(/(?:package|pkg|pack)\s*[:\-]?\s*([234])\b/); if(pm)pkg=pm[1]; if(!pkg&&cluster&&CLUSTERS[cluster])pkg=String(CLUSTERS[cluster].pkg); return {cluster,pkg}}
function scoreToken(x){let r=String(x||"").toUpperCase().replace(/,/g,".").replace(/[OS]/g,"0").replace(/[IL|]/g,"1").trim(); if(/^(NA|N\/A)$/.test(r))return""; let m=r.match(/^([0-5])(?:\.([05]))?$/); if(m)return m[2]?`${m[1]}.${m[2]}`:String(Number(m[1])); m=r.match(/^([0-5])([05])$/); return m?`${m[1]}.${m[2]}`:""}
function scoreLine(line){const a=String(line||"").match(/[0-5](?:[\.,][05])?|[0-5][05]|N\/?A|NA/gi)||[]; for(let i=a.length-1;i>=0;i--){const v=scoreToken(a[i]); if(v)return v} return""}
function extractScores(text){
  // OPTION A: best automatic extraction from OCR text.
  // Handles normal text OCR AND table-row screenshots where the labels may not be read.
  const raw=String(text||"");
  const lines=raw.split(/\n+/).map(x=>x.trim()).filter(Boolean);
  const out={};

  // 1) First try keyword based extraction around KPI labels.
  for(const [key,aliases] of Object.entries(ALIAS)){
    for(let i=0;i<lines.length;i++){
      const l=norm(lines[i]);
      if(aliases.some(a=>l.includes(norm(a)))){
        const v=scoreLine(lines[i])||scoreLine(lines[i+1]||"")||scoreLine(lines[i+2]||"");
        if(v){out[key]=v; break}
      }
    }
  }

  // 2) Find likely Excel data rows and extract sequential scores U:AI.
  // This is for screenshots like your row 98 where KPI labels are not visible but the 15 numbers are visible.
  const candidateRows=[];
  for(const line of lines){
    const clean=line.replace(/[•·]/g," ").replace(/,/g,".");
    const tokens=(clean.match(/\b(?:[0-5](?:\.5)?|[0-5])\b/g)||[]).map(scoreToken).filter(Boolean);
    const hasCluster=/cluster\s*\d+[a-d]?/i.test(clean)||/\b7a\b|\b7b\b|\b8a\b|\b8b\b|\b8c\b|\b8d\b/i.test(clean);
    const hasDate=/20\d{2}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i.test(clean);
    if(tokens.length>=8 || (tokens.length>=5 && (hasCluster||hasDate))) candidateRows.push(tokens);
  }
  const longest=candidateRows.sort((a,b)=>b.length-a.length)[0]||[];
  if(longest.length>=10){
    // Keep the last 15 likely KPI scores from the row because early numbers are row/date/week/package.
    const kpiNums=longest.slice(-15);
    KPI.forEach((k,i)=>{if(!out[k[1]] && kpiNums[i]) out[k[1]]=kpiNums[i];});
  }

  // 3) If OCR text contains only a block of numbers, map sequentially as a last best-guess.
  const allNums=(raw.replace(/,/g,".").match(/\b(?:[0-5](?:\.5)?|[0-5])\b/g)||[]).map(scoreToken).filter(Boolean);
  if(Object.keys(out).length<5 && allNums.length>=15){
    const kpiNums=allNums.slice(-15);
    KPI.forEach((k,i)=>{if(kpiNums[i]) out[k[1]]=kpiNums[i];});
  }
  return out;
}

async function preprocessForOcr(file){
  // Scale + high contrast improves Tesseract reading of Excel screenshots.
  const img=await new Promise((resolve,reject)=>{const im=new Image(); im.onload=()=>resolve(im); im.onerror=reject; im.src=URL.createObjectURL(file)});
  const scale=Math.min(4, Math.max(2, 1800/img.width));
  const canvas=document.createElement('canvas'); canvas.width=Math.round(img.width*scale); canvas.height=Math.round(img.height*scale);
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  ctx.imageSmoothingEnabled=false; ctx.drawImage(img,0,0,canvas.width,canvas.height);
  const data=ctx.getImageData(0,0,canvas.width,canvas.height);
  for(let i=0;i<data.data.length;i+=4){
    const r=data.data[i],g=data.data[i+1],b=data.data[i+2];
    let y=0.299*r+0.587*g+0.114*b;
    y=y<185?0:255;
    data.data[i]=data.data[i+1]=data.data[i+2]=y;
  }
  ctx.putImageData(data,0,0);
  return await new Promise(res=>canvas.toBlob(res,'image/png'));
}

function monthNameToNumber(m){
  const map={jan:1,january:1,feb:2,february:2,mar:3,march:3,apr:4,april:4,may:5,jun:6,june:6,jul:7,july:7,aug:8,august:8,sep:9,sept:9,september:9,oct:10,october:10,nov:11,november:11,dec:12,december:12};
  return map[String(m||"").toLowerCase()]||0;
}
function extractDateDeep(t){
  const s=String(t||"").replace(/[–—]/g,"-");
  let d=extractDate(s); if(d)return d;
  let m=s.match(/\b(\d{1,2})\s*[-\s]\s*(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t|tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s*[-\s,]*\s*(20\d{2})\b/i);
  if(m){const mo=monthNameToNumber(m[2]); if(mo)return `${m[3]}-${String(mo).padStart(2,"0")}-${m[1].padStart(2,"0")}`;}
  m=s.match(/\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t|tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2}),?\s+(20\d{2})\b/i);
  if(m){const mo=monthNameToNumber(m[1]); if(mo)return `${m[3]}-${String(mo).padStart(2,"0")}-${m[2].padStart(2,"0")}`;}
  return "";
}
function extractInspectorDeep(t){
  const s=String(t||"").replace(/\s+/g," ");
  if(/javed\s*iqbal/i.test(s)||/javed\s*i?qbal/i.test(s))return "Javed Iqbal";
  const m=s.match(/\b([A-Z][a-z]+\s+[A-Z][a-z]+)\b/);
  return m?m[1]:"";
}
function extractContractorDeep(t,cluster){
  const s=String(t||"").toUpperCase();
  if(/TAJV|TAJ\s*V|TAVJ|TJAV/.test(s))return "TAJV";
  if(/INNOVO|INOVO/.test(s))return "INNOVO";
  if(cluster&&CLUSTERS[cluster])return CLUSTERS[cluster].contractor;
  return "";
}
function extractRoleDeep(t){return /\bKEO\b|K E O/i.test(String(t||""))?"KEO":"";}
function extractStopWorkDeep(t){
  const s=String(t||"").toUpperCase();
  if(/STOP\s*WORK[^\n]{0,25}\bYES\b|\bYES\b[^\n]{0,25}STOP\s*WORK/.test(s))return "YES";
  if(/STOP\s*WORK[^\n]{0,25}\bNO\b|\bNO\b[^\n]{0,25}STOP\s*WORK/.test(s))return "NO";
  const yn=s.match(/\b(YES|NO)\b/); return yn?yn[1]:"";
}
function extractMainActivityDeep(t,foundScores){
  const s=norm(t);
  for(const [key,aliases] of Object.entries(ALIAS)) if(aliases.some(a=>s.includes(norm(a)))) return KPI.find(k=>k[1]===key)?.[2]||"";
  const lows=KPI.map(k=>({label:k[2],v:val(foundScores&&foundScores[k[1]])})).filter(x=>x.v!==null).sort((a,b)=>a.v-b.v);
  return lows[0]?.label||"";
}
async function preprocessForOcrVariants(file){
  const img=await new Promise((resolve,reject)=>{const im=new Image(); im.onload=()=>resolve(im); im.onerror=reject; im.src=URL.createObjectURL(file)});
  const makeBlob=async(mode,cropTop=0,cropBottom=1)=>{
    const sx=0, sy=Math.round(img.height*cropTop), sw=img.width, sh=Math.max(1,Math.round(img.height*(cropBottom-cropTop)));
    const scale=Math.min(5, Math.max(2.5, 2600/sw));
    const canvas=document.createElement('canvas'); canvas.width=Math.round(sw*scale); canvas.height=Math.round(sh*scale);
    const ctx=canvas.getContext('2d',{willReadFrequently:true}); ctx.imageSmoothingEnabled=false; ctx.drawImage(img,sx,sy,sw,sh,0,0,canvas.width,canvas.height);
    const data=ctx.getImageData(0,0,canvas.width,canvas.height);
    for(let i=0;i<data.data.length;i+=4){
      const r=data.data[i],g=data.data[i+1],b=data.data[i+2];
      let y=0.299*r+0.587*g+0.114*b;
      if(mode==='contrast') y=y<190?0:255;
      if(mode==='soft') y=Math.max(0,Math.min(255,(y-128)*1.65+128));
      if(mode==='gray') y=y;
      data.data[i]=data.data[i+1]=data.data[i+2]=y;
    }
    ctx.putImageData(data,0,0);
    return await new Promise(res=>canvas.toBlob(res,'image/png'));
  };
  const arr=[{name:'original',blob:file}];
  arr.push({name:'soft enlarged',blob:await makeBlob('soft')});
  arr.push({name:'high contrast',blob:await makeBlob('contrast')});
  if(img.height>250){arr.push({name:'middle crop contrast',blob:await makeBlob('contrast',0.05,0.95)});}
  return arr.filter(x=>x.blob);
}
function applyDetectedFields(text,found){
  let filled=[];
  const d=extractDateDeep(text); if(d){$("#inspectionDate").value=d; filled.push('Date');}
  const cp=extractCluster(text); if(cp.cluster){$("#cluster").value=cp.cluster; filled.push('Cluster');}
  if(cp.pkg){$("#package").value=cp.pkg; filled.push('Package');}
  const contractor=extractContractorDeep(text,cp.cluster||$("#cluster").value); if(contractor){$("#contractor").value=contractor; filled.push('Contractor');}
  const role=extractRoleDeep(text); if(role){$("#yourRole").value=role; filled.push('Role');}
  const name=extractInspectorDeep(text); if(name){$("#yourName").value=name; filled.push('Inspector');}
  const sw=extractStopWorkDeep(text); if(sw){$("#stopWork").value=sw; filled.push('Stop Work');}
  const m=String(text).match(/\b(?:villa|vila|vl|area)\s*[:\-]?\s*(\d{1,4}[A-Z]?)\b/i); if(m){$("#areaText").value=/area/i.test(m[0])?m[1]:`Villa ${m[1]}`; filled.push('Area');}
  let kcount=0;
  document.querySelectorAll(".score-input").forEach(x=>{ if(found[x.dataset.key]){x.value=found[x.dataset.key]; kcount++;} });
  const act=extractMainActivityDeep(text,found); if(act){$("#mainActivity").value=act; filled.push('Main Activity');}
  updateDerived(); calc(true);
  return {filled,kcount};
}

function renderKpis(){const g=$("#kpiGrid"); g.innerHTML=KPI.map((k,i)=>`<div class="kpi-card"><h3>${i+1}. ${k[2]}</h3><input class="score-input" data-key="${k[1]}" inputmode="decimal" placeholder="blank if not read"></div>`).join(""); document.querySelectorAll(".score-input").forEach(x=>{x.addEventListener("input",()=>calc(true));x.addEventListener("change",()=>calc(true))})}
function scores(){const o={}; document.querySelectorAll(".score-input").forEach(x=>o[x.dataset.key]=x.value.trim()); return o}
function val(v){const n=Number(String(v||"").replace(",",".")); return Number.isFinite(n)?n:null}
function low(){return KPI.map(k=>({key:k[1],label:k[2],v:val(scores()[k[1]])})).filter(x=>x.v!==null).sort((a,b)=>a.v-b.v).slice(0,3)}
function calc(force=false){const sc=scores(); let total=0,count=0; KPI.forEach(k=>{const n=val(sc[k[1]]); if(n!==null){total+=n; count++}}); const weights=[.12,.12,.05,.08,.10,.08,.06,.03,.10,.06,.03,.03,.05,.03,.06]; let weighted=0; KPI.forEach((k,i)=>{const n=val(sc[k[1]]); if(n!==null) weighted+=n*weights[i]}); weighted=weighted/5; const critical=["Work_at_Height","Edge_Protection","Excavation_Safety","Scaffolding_Compliance","PTW_Implementation","Lifting/Precast Installation"].some(k=>val(sc[k])!==null&&val(sc[k])<=1.5); const band=count?(weighted<.4?"Critical":weighted<.6?"Poor":weighted<.75?"Needs Improvement":weighted<.9?"Good":"Excellent"):""; $("#ratingBand").value=band; const lows=low(); if(force||!$("#mainActivity").value)$("#mainActivity").value=lows[0]?.label||""; if(force||!$("#rootCause").value)$("#rootCause").value=lows.length?(critical?"Critical control failure / poor supervision":"Poor supervision / weak implementation of KPI controls"):""; if(force||!$("#topGaps").value)$("#topGaps").value=lows.map((x,i)=>`${i+1}. ${x.label} scored ${x.v}/5 and requires management action.`).join("\n"); if(force||!$("#immediateAction").value)$("#immediateAction").value=lows.map(x=>`${x.label}: stop/hold affected activity where required and rectify immediate unsafe condition.`).join("\n"); if(force||!$("#preventiveAction").value)$("#preventiveAction").value=lows.map(x=>`${x.label}: Project Manager and Construction Manager shall implement corrective action, supervision and closeout evidence.`).join("\n"); const d=$("#inspectionDate").value; if(d){$("#weekNo").value=weekNo(d); $("#targetCloseoutDate").value=addDays(d, critical||band==="Critical"?3:(band==="Good"||band==="Excellent"?14:7))} $("#summary").innerHTML=count?`Scores completed: ${count}/15 | Total: ${total} | Weighted: ${(weighted*100).toFixed(1)}% | Critical: ${critical?"YES":"NO"} | Band: ${band}`:"No scores yet."}
async function readImage(){
  const f=$("#imageInput").files?.[0];
  if(!f){status("#ocrStatus","Choose photo first","error");return}
  status("#ocrStatus","Deep scan started. Reading the photo in multiple OCR modes...");
  try{
    const variants=await preprocessForOcrVariants(f).catch(()=>[{name:'original',blob:f}]);
    let combined="";
    const foundFinal={};
    for(let i=0;i<variants.length;i++){
      const v=variants[i];
      status("#ocrStatus",`Deep OCR ${i+1}/${variants.length}: ${v.name}...`);
      const r=await Tesseract.recognize(v.blob||f,"eng",{
        tessedit_pageseg_mode: i===0?6:11,
        preserve_interword_spaces: '1',
        logger:m=>{if(m.status==="recognizing text")status("#ocrStatus",`Deep OCR ${i+1}/${variants.length}: ${Math.round(m.progress*100)}%`)}
      });
      const t=r.data.text||"";
      combined += `\n\n--- ${v.name} ---\n` + t;
      const part=extractScores(t);
      for(const [k,valx] of Object.entries(part)) if(!foundFinal[k]) foundFinal[k]=valx;
      if(Object.keys(foundFinal).length>=15) break;
    }
    $("#ocrText").value=combined.trim();
    const result=applyDetectedFields(combined,foundFinal);
    const totalFields=result.filled.length + result.kcount;
    const msg=`Deep scan completed. Auto-filled ${result.kcount}/15 KPI scores and ${result.filled.length} other fields: ${result.filled.join(', ')||'none'}. Unread fields are left blank for manual entry.`;
    status("#ocrStatus",msg,totalFields?"success":"error");
  }catch(e){
    status("#ocrStatus","Deep OCR failed: "+e.message+". Please enter unread values manually and update Excel.","error")
  }
}
function updateDerived(){const d=$("#inspectionDate").value; $("#weekNo").value=weekNo(d); const cl=$("#cluster").value.trim(); if(CLUSTERS[cl]){$("#package").value=String(CLUSTERS[cl].pkg);$("#contractor").value=CLUSTERS[cl].contractor} calc(true)}
async function loadZip(){if(excelFile)return await JSZip.loadAsync(await excelFile.arrayBuffer()); const b=await fetch("original.xlsx"); if(!b.ok)throw new Error("original.xlsx not found. Upload original Excel."); return await JSZip.loadAsync(await b.arrayBuffer())}
async function getText(zip,p){const f=zip.file(p); if(!f)throw new Error(p+" missing"); return await f.async("text")}
function findWeeklySheetPath(workbook,rels){const m=workbook.match(/<sheet[^>]*name="Weekly_Inspections"[^>]*r:id="([^"]+)"/); if(!m)throw new Error("Weekly_Inspections sheet not found"); const rid=m[1]; const rel=[...rels.matchAll(/<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"/g)].find(x=>x[1]===rid); if(!rel)throw new Error("Weekly relationship not found"); return "xl/"+rel[2].replace(/^\.\.\//,"")}
function getRows(xml){return [...xml.matchAll(/<row r="(\d+)"[^>]*>.*?<\/row>/gs)].map(m=>({r:Number(m[1]),xml:m[0],start:m.index,end:m.index+m[0].length}))}
function cellIn(row,col){const m=row.xml.match(new RegExp(`<c\\s+[^>]*r="${col}${row.r}"[^>]*(?:>.*?<\\/c>|\\/>)`,"s")); return m?m[0]:""}
function hasValue(row,col){return /<v>\s*[^<\s]+\s*<\/v>/.test(cellIn(row,col))}
function firstEmptyDataRow(rows){for(const row of rows){if(row.r>=4&&!hasValue(row,"B"))return row} throw new Error("No empty pre-formatted row found.")}
function appendSharedString(files,s){let xml=files.shared||'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="0" uniqueCount="0"></sst>'; const idx=(xml.match(/<si>/g)||[]).length; xml=xml.replace(/<\/sst>/,`<si><t>${esc(s)}</t></si></sst>`).replace(/count="\d+"/,`count="${idx+1}"`).replace(/uniqueCount="\d+"/,`uniqueCount="${idx+1}"`); files.shared=xml; return idx}
function cellStyleId(old){const m=String(old||"").match(/\s+s="(\d+)"/); return m?Number(m[1]):0}
function styleSourceCell(row,templateRow,col){return cellIn(row,col)||cellIn(templateRow,col)||""}
function forceCalibriFonts(styles){return String(styles||"").replace(/<font>([\s\S]*?)<\/font>/g,(m,inner)=>{if(/<name\s+val="[^"]*"\s*\/>/.test(inner))inner=inner.replace(/<name\s+val="[^"]*"\s*\/>/,'<name val="Calibri"/>'); else inner='<name val="Calibri"/>'+inner; return '<font>'+inner+'</font>'})}
function ensureCenterStyle(files,baseId){const key="center_"+(baseId||0); if(files.styleCache[key]!==undefined)return files.styleCache[key]; let styles=files.styles; const m=styles.match(/<cellXfs([^>]*)count="(\d+)"([^>]*)>([\s\S]*?)<\/cellXfs>/); if(!m)return baseId||0; const xfs=[...m[4].matchAll(/<xf[^>]*(?:\/>|>[\s\S]*?<\/xf>)/g)].map(x=>x[0]); let base=xfs[baseId]||xfs[0]; base=base.replace(/\sapplyAlignment="[^"]*"/g,"").replace(/<alignment[^>]*\/>/g,"").replace(/<alignment[\s\S]*?<\/alignment>/g,""); let xf=/\/\>\s*$/.test(base)?base.replace(/\/\>\s*$/,' applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>'):base.replace(/<\/xf>\s*$/,'<alignment horizontal="center" vertical="center" wrapText="1"/></xf>').replace('<xf','<xf applyAlignment="1"'); const newId=xfs.length; styles=styles.replace(/<cellXfs([^>]*)count="\d+"([^>]*)>/,'<cellXfs$1count="'+(newId+1)+'"$2>').replace('</cellXfs>',xf+'</cellXfs>'); files.styles=styles; return files.styleCache[key]=newId}
function setCell(row,col,value,type,files,templateRow){if(value===null||value===undefined)return; const r=row.r,ref=col+r,old=cellIn(row,col); let v=value,attrs=""; if(type==="s"){v=appendSharedString(files,String(value)); attrs=' t="s"'} else v=String(value); const source=styleSourceCell(row,templateRow,col); const sid=cellStyleId(source); const newCell=`<c r="${ref}" s="${sid}"${attrs}><v>${esc(v)}</v></c>`; if(old){row.xml=row.xml.replace(old,newCell);return} const cells=[...row.xml.matchAll(/<c\s+[^>]*r="([A-Z]+)\d+"[^>]*(?:>.*?<\/c>|\/>)/gs)]; let inserted=false; for(const c of cells){if(colNum(c[1])>colNum(col)){row.xml=row.xml.replace(c[0],newCell+c[0]); inserted=true; break}} if(!inserted)row.xml=row.xml.replace(/<\/row>/,newCell+"</row>")}
function aldarExactFormulaValues(sc){
  // Exact Aldar sheet logic:
  // AJ = Total score = SUM(U:AI)
  // AK = Total percentage = AJ / 75
  // AL = Weighted percentage = SUMPRODUCT(U:AI, KPI_Weights!B4:B18) / 5
  const weights=[.12,.12,.05,.08,.10,.08,.06,.03,.10,.06,.03,.03,.05,.03,.06];
  let total=0, weighted=0;
  KPI.forEach((k,i)=>{
    const n=val(sc[k[1]]);
    if(n!==null){
      total+=n;
      weighted+=n*weights[i];
    }
  });
  return {
    total: total || "",
    percent: total ? total/75 : "",
    weighted: weighted ? weighted/5 : ""
  };
}
function dataMap(rowNo){const d=$("#inspectionDate").value,cl=$("#cluster").value.trim(),pkg=$("#package").value.trim(),sc=scores(),ym=d?d.slice(0,7):""; const inspId=d&&cl?`${d.replace(/-/g,"")}-${cl.replace(/\s+/g,"")}-${String(rowNo).padStart(2,"0")}`:""; const exact=aldarExactFormulaValues(sc); return [["A",inspId,"s"],["B",d?serial(d):"","n"],["C",d?weekNo(d):"","n"],["E",ym,"s"],["F",pkg?Number(pkg):"","n"],["G",cl,"s"],["I",$("#contractor").value,"s"],["O",$("#yourName").value,"s"],["P",$("#yourRole").value,"s"],["Q",$("#areaText").value,"s"],["S",$("#mainActivity").value,"s"],["T",$("#stopWork").value,"s"],["U",sc.Work_at_Height,"n"],["V",sc.Edge_Protection,"n"],["W",sc.Falling_Object_Prevention,"n"],["X",sc.Excavation_Safety,"n"],["Y",sc.Scaffolding_Compliance,"n"],["Z",sc.PTW_Implementation,"n"],["AA",sc.PTW_Field_Verification,"n"],["AB",sc.MSRA_Quality,"n"],["AC",sc["Lifting/Precast Installation"],"n"],["AD",sc.Traffic_Interface,"n"],["AE",sc["Housekeeping/Waste Management"],"n"],["AF",sc["Welfare Arrangement"],"n"],["AG",sc.Fire_Readiness,"n"],["AH",sc.Supervision_Subcontractor,"n"],["AI",sc.Electrical_Tool_Safety,"n"],["AJ",exact.total,"n"],["AK",exact.percent,"n"],["AL",exact.weighted,"n"],["AO",$("#ratingBand").value,"s"],["AP",$("#repeatIssue").value,"s"],["AQ",$("#rootCause").value,"s"],["AR",$("#topGaps").value,"s"],["AS",$("#immediateAction").value,"s"],["AT",$("#preventiveAction").value,"s"],["AU",$("#positiveObservations").value,"s"],["AV",$("#actionOwner").value,"s"],["AW",$("#targetCloseoutDate").value?serial($("#targetCloseoutDate").value):"","n"],["AX",$("#evidence").value,"s"]]}
async function updateExcel(){try{calc(true); status("#status","Opening original xlsx and writing website data..."); const zip=await loadZip(); const workbook=await getText(zip,"xl/workbook.xml"),rels=await getText(zip,"xl/_rels/workbook.xml.rels"); const sheetPath=findWeeklySheetPath(workbook,rels); let sheet=await getText(zip,sheetPath); let shared=zip.file("xl/sharedStrings.xml")?await getText(zip,"xl/sharedStrings.xml"):""; let styles=await getText(zip,"xl/styles.xml"); const files={shared,styles,styleCache:{}}; const rows=getRows(sheet),row=firstEmptyDataRow(rows); const templateRow=rows.filter(x=>x.r<row.r).sort((a,b)=>b.r-a.r)[0]||row; dataMap(row.r).forEach(([c,v,t])=>setCell(row,c,v,t,files,templateRow)); sheet=sheet.slice(0,row.start)+row.xml+sheet.slice(row.end); zip.file(sheetPath,sheet); zip.file("xl/sharedStrings.xml",files.shared); zip.file("xl/styles.xml",files.styles); const blob=await zip.generateAsync({type:"blob",compression:"DEFLATE"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=`Saadiyat_Lagoons_HSE_Weekly_KPI_FINAL_ROW_${row.r}.xlsx`; document.body.appendChild(a); a.click(); a.remove(); status("#status",`Done. Month is written in column E. AJ, AK and AL are calculated with the exact Aldar formula logic and pasted as values. All updated cells copy the exact same style ID from the previous/template row, including font, text colour, fill colour, borders and alignment. Row ${row.r} updated.`,"success")}catch(e){console.error(e); status("#status","Failed: "+e.message,"error")}}
document.addEventListener("DOMContentLoaded",()=>{renderKpis(); $("#imageInput").onchange=e=>{const f=e.target.files?.[0]; if(!f)return; const r=new FileReader(); r.onload=ev=>{$("#preview").src=ev.target.result;$("#preview").style.display="block";$("#ph").style.display="none";setTimeout(readImage,200)}; r.readAsDataURL(f)}; $("#excelInput").onchange=e=>{excelFile=e.target.files?.[0]||null; status("#excelStatus",excelFile?`Selected original file: ${excelFile.name}`:"Included original.xlsx ready.",excelFile?"success":"")}; $("#readBtn").onclick=readImage; $("#updateBtn").onclick=updateExcel; ["inspectionDate","cluster","package","contractor","yourName","yourRole","areaText","stopWork","repeatIssue","actionOwner","evidence"].forEach(id=>{const el=$("#"+id); if(el){el.addEventListener("input",updateDerived);el.addEventListener("change",updateDerived)}}); updateDerived(); calc(false)});
