const $=s=>document.querySelector(s);

const CLUSTERS={
 "Cluster 7A":{pkg:2,contractor:"TAJV"},"Cluster 7B":{pkg:2,contractor:"TAJV"},"Cluster 8A":{pkg:2,contractor:"TAJV"},"Cluster 8B":{pkg:2,contractor:"TAJV"},"Cluster 8C":{pkg:2,contractor:"TAJV"},"Cluster 8D":{pkg:2,contractor:"TAJV"},
 "Cluster 3":{pkg:3,contractor:"INNOVO"},"Cluster 4":{pkg:3,contractor:"INNOVO"},"Cluster 5":{pkg:3,contractor:"INNOVO"},"Cluster 6":{pkg:3,contractor:"INNOVO"},
 "Cluster 1A":{pkg:4,contractor:"TAJV"},"Cluster 1B":{pkg:4,contractor:"TAJV"},"Cluster 2A":{pkg:4,contractor:"TAJV"},"Cluster 2B":{pkg:4,contractor:"TAJV"},"Cluster 2C":{pkg:4,contractor:"TAJV"}
};

const KPI=[
 ["U","Work_at_Height","Work at Height Control"],
 ["V","Edge_Protection","Edge Protection"],
 ["W","Falling_Object_Prevention","Falling Object Prevention"],
 ["X","Excavation_Safety","Excavation Safety"],
 ["Y","Scaffolding_Compliance","Scaffolding Compliance"],
 ["Z","PTW_Implementation","PTW Implementation"],
 ["AA","PTW_Field_Verification","PTW Field Verification"],
 ["AB","MSRA_Quality","MSRA Quality"],
 ["AC","Lifting/Precast Installation","Lifting / Precast Installation"],
 ["AD","Traffic_Interface","Traffic / Man-Machine Interface"],
 ["AE","Housekeeping/Waste Management","Housekeeping / Waste Management"],
 ["AF","Welfare Arrangement","Welfare Arrangement"],
 ["AG","Fire_Readiness","Fire Readiness"],
 ["AH","Supervision_Subcontractor","Supervision / Subcontractor Control"],
 ["AI","Electrical_Tool_Safety","Temporary Electrical / Tool Safety"]
];

const ALIAS={
 "Work_at_Height":["work at height","wah","height control","working at height"],
 "Edge_Protection":["edge protection","open edge","edge","fall edge"],
 "Falling_Object_Prevention":["falling object","falling materials","dropped object","object prevention"],
 "Excavation_Safety":["excavation","trench","deep excavation"],
 "Scaffolding_Compliance":["scaffold","scaffolding","mobile scaffold"],
 "PTW_Implementation":["ptw implementation","permit implementation","permit to work","work permit","ptw"],
 "PTW_Field_Verification":["field verification","permit verification","ptw field"],
 "MSRA_Quality":["msra","risk assessment","method statement","ra quality"],
 "Lifting/Precast Installation":["lifting","precast","a-frame","a frame","crane"],
 "Traffic_Interface":["traffic","man-machine","man machine","interface"],
 "Housekeeping/Waste Management":["housekeeping","waste","debris","waste management"],
 "Welfare Arrangement":["welfare","rest area","drinking water"],
 "Fire_Readiness":["fire","extinguisher","fire readiness"],
 "Supervision_Subcontractor":["supervision","subcontractor","sub contractor"],
 "Electrical_Tool_Safety":["electrical","db","cable","tool safety","temporary electrical"]
};

let excelFile=null;
const excelEpoch=Date.UTC(1899,11,30);

function setStatus(s,t=""){const e=$("#status");e.textContent=s;e.style.background=t==="error"?"#fff3f3":t==="success"?"#f3fff7":"#fff";}
function setOcr(s,t=""){const e=$("#ocrStatus");e.textContent=s;e.style.background=t==="error"?"#fff3f3":t==="success"?"#f3fff7":"#fff";}
function setExcel(s,t=""){const e=$("#excelStatus");e.textContent=s;e.style.background=t==="error"?"#fff3f3":t==="success"?"#f3fff7":"#fff";}
function esc(s){return String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function colNum(col){let n=0;for(const ch of col)n=n*26+ch.charCodeAt(0)-64;return n;}
function norm(s){return String(s||"").toLowerCase().replace(/[^a-z0-9\/.:\-\s&]/g," ").replace(/\s+/g," ").trim();}
function serial(iso){if(!iso)return"";const d=new Date(iso+"T00:00:00");return Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-excelEpoch)/86400000);}
function weekNo(iso){if(!iso)return"";const d=new Date(iso+"T00:00:00");const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const n=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-n);const y=new Date(Date.UTC(t.getUTCFullYear(),0,1));return Math.ceil((((t-y)/86400000)+1)/7);}
function addDays(iso,days){if(!iso)return"";const d=new Date(iso+"T00:00:00");d.setDate(d.getDate()+days);return d.toISOString().slice(0,10);}
function monthValue(iso){return iso?iso.slice(0,7):"";}
function pad(n){return String(n).padStart(2,"0");}
function monthNo(m){const a={jan:1,january:1,feb:2,february:2,mar:3,march:3,apr:4,april:4,may:5,jun:6,june:6,jul:7,july:7,aug:8,august:8,sep:9,sept:9,september:9,oct:10,october:10,nov:11,november:11,dec:12,december:12};return a[String(m||"").toLowerCase()]||"";}

function extractDate(t){
 const s=String(t||"");
 let m=[...s.matchAll(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](20\d{2})/g)][0];
 if(m)return `${m[3]}-${pad(m[2])}-${pad(m[1])}`;
 m=s.match(/(\d{1,2})\s*[- ]?\s*(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t|tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s*[- ]?\s*(20\d{2})/i);
 if(m)return `${m[3]}-${pad(monthNo(m[2]))}-${pad(m[1])}`;
 m=s.match(/(20\d{2})[\/\-.](\d{1,2})[\/\-.](\d{1,2})/);
 return m?`${m[1]}-${pad(m[2])}-${pad(m[3])}`:"";
}

function extractCluster(t){
 const n=norm(t).replace(/clustar|clusfer|clustcr|claster|clusterl/g,"cluster").replace(/packagc|packaqe|pkg|pckg/g,"package");
 let cluster="",pkg="";
 for(const code of ["1A","1B","2A","2B","2C","7A","7B","8A","8B","8C","8D"]){
   const c=code.toLowerCase().replace(/([0-9])([a-z])/,'$1\\s*$2');
   if(new RegExp('\\b(?:cluster|cl|c)\\s*[:\\-]?\\s*'+c+'\\b').test(n)||new RegExp('\\b'+c+'\\b').test(n)){cluster="Cluster "+code;break;}
 }
 const simple=n.match(/(?:cluster|cl|c)\s*[:\-]?\s*([3456])\b/);
 if(!cluster&&simple)cluster="Cluster "+simple[1];
 const p=n.match(/(?:package|pack|pkg)\s*[:\-]?\s*([234])\b/);
 if(p)pkg=p[1];
 if(!pkg&&cluster&&CLUSTERS[cluster])pkg=String(CLUSTERS[cluster].pkg);
 return{cluster,pkg};
}

function extractContractor(t,cluster,pkg){
 const n=norm(t);
 if(/innovo|inovo|invovo/.test(n))return"INNOVO";
 if(/tajv|ta jv|trojan|acc|joint venture|t a j v/.test(n))return"TAJV";
 if(cluster&&CLUSTERS[cluster])return CLUSTERS[cluster].contractor;
 if(String(pkg)==="3")return"INNOVO";
 if(["2","4"].includes(String(pkg)))return"TAJV";
 return"";
}

function extractInspector(t){
 const s=String(t||"");
 const m=s.match(/(?:inspector|name|raised by|submitted by)\s*[:\-]?\s*([A-Za-z .]{3,30})/i);
 return m?m[1].trim():"";
}

function extractArea(t){
 const s=String(t||"");
 let m=s.match(/\b(?:villa|vila|vl|unit|plot)\s*[:\-]?\s*([A-Z]?\d{1,5}[A-Z]?|\d+[A-Z])/i);
 if(m)return "Villa "+m[1];
 m=s.match(/\b(?:area|road|sector|zone|street|block)\s*[:\-]?\s*([A-Z0-9\-\/ &]{2,30})/i);
 return m?m[0].trim():"";
}

function extractStopWork(t){
 const n=norm(t);
 if(/stop\s*work.*\bno\b|no\s*stop\s*work/.test(n))return"NO";
 if(/stop\s*work|work\s*stoppage|activity\s*stopped|suspend/.test(n))return"YES";
 return"";
}

function cleanLine(l){
 return norm(l).replace(/work al height|work at heiqht|w0rk at height/g,"work at height").replace(/edqe|edgc|edgee/g,"edge").replace(/scaf folding|scaffald|scaffoldinq/g,"scaffolding").replace(/excavalion|excavatlon/g,"excavation").replace(/electrica1|electrlcal/g,"electrical").replace(/house keeping/g,"housekeeping");
}
function scoreToken(t){
 let raw=String(t||"").trim().toUpperCase().replace(/,/g,".");
 if(!raw)return"";
 if(/^(NA|N\/A|N-A)$/.test(raw))return"";
 let x=raw.replace(/[OSQ]/g,"0").replace(/[IL|]/g,"1");
 let m=x.match(/^([0-5])(?:\.([05]))?$/);
 if(m)return m[2]?`${m[1]}.${m[2]}`:String(Number(m[1]));
 m=x.match(/^([0-5])([05])$/);
 if(m)return `${m[1]}.${m[2]}`;
 m=x.match(/([0-5])(?:\.([05]))?\s*(?:\/\s*5)?/);
 if(m)return m[2]?`${m[1]}.${m[2]}`:String(Number(m[1]));
 return"";
}
function scoreLine(line){
 const s=String(line||"");
 const tokens=s.match(/[0-5](?:[\.,][05])?\s*(?:\/\s*5)?|[0-5][05]|N\/?A|NA/gi)||[];
 for(let i=tokens.length-1;i>=0;i--){const v=scoreToken(tokens[i]);if(v)return v;}
 return"";
}
function lineHasAlias(line,aliases){
 const l=cleanLine(line);
 return aliases.some(a=>{
   const x=norm(a);
   if(l.includes(x))return true;
   const words=x.split(/\s|\//).filter(w=>w.length>2);
   return words.length&&words.every(w=>l.includes(w.slice(0,Math.min(w.length,6))));
 });
}
function extractScores(text){
 const lines=String(text).split(/\n+/).map(x=>x.trim()).filter(Boolean),out={};
 for(const [k,a] of Object.entries(ALIAS)){
   for(let i=0;i<lines.length;i++){
     if(lineHasAlias(lines[i],a)){
       const v=scoreLine(lines[i])||scoreLine(lines[i+1]||"")||scoreLine(lines[i+2]||"");
       if(v){out[k]=v;break;}
     }
   }
 }
 const nums=[];
 for(const line of lines){
   const l=cleanLine(line);
   if(/score|kpi|control|safety|compliance|implementation|readiness|arrangement|interface|quality|management|supervision|electrical|housekeeping|welfare|fire|ptw|msra|lifting|traffic|scaffold|excavation|edge|height/.test(l)){
     const v=scoreLine(line); if(v)nums.push(v);
   }
 }
 if(Object.keys(out).length<10&&nums.length>=10){
   let idx=0;for(const k of KPI.map(x=>x[1])){if(!out[k]&&nums[idx])out[k]=nums[idx];idx++;}
 }
 return out;
}

function renderKpis(){
 const g=$("#kpiGrid");
 g.innerHTML=KPI.map((k,i)=>`<div class="kpi-card"><h3>${i+1}. ${k[2]}</h3><input class="score-input" data-key="${k[1]}" placeholder="0-5"></div>`).join("");
 document.querySelectorAll(".score-input").forEach(x=>{x.oninput=()=>calc(true);x.onchange=()=>calc(true);});
}
function scores(){const o={};document.querySelectorAll(".score-input").forEach(x=>o[x.dataset.key]=x.value.trim());return o;}
function val(v){if(String(v).toUpperCase()==="NA")return null;const n=Number(v);return Number.isFinite(n)?n:null;}
function low(){
 return KPI.map(k=>({key:k[1],label:k[2],v:val(scores()[k[1]])})).filter(x=>x.v!==null).sort((a,b)=>a.v-b.v).slice(0,3);
}
function calc(force=false){
 updateDerived(false);
 const s=scores();
 let total=0,count=0;
 KPI.forEach(k=>{const n=val(s[k[1]]);if(n!==null){total+=n;count++;}});
 const raw=count?total/75:"";
 let weighted=0;
 if(count){
   const w=[.12,.12,.05,.08,.10,.08,.06,.03,.10,.06,.03,.03,.05,.03,.06];
   KPI.forEach((k,i)=>{const n=val(s[k[1]]);if(n!==null)weighted+=n*w[i];});
   weighted=weighted/5;
 }
 const critical=["Work_at_Height","Excavation_Safety","Scaffolding_Compliance","PTW_Implementation","Lifting/Precast Installation"].some(k=>val(s[k])!==null&&val(s[k])<=1);
 const band=count?(weighted<.4?"Critical":weighted<.6?"Poor":weighted<.75?"Needs Improvement":weighted<.9?"Good":"Excellent"):"";
 $("#totalScore").value=count?String(total):"";
 $("#rawScore").value=count?String((raw*100).toFixed(1)):"";
 $("#weightedScore").value=count?String((weighted*100).toFixed(1)):"";
 $("#criticalRedFlag").value=count?(critical?"YES":"NO"):"";
 $("#awardEligible").value=count?((!critical&&weighted>=.75)?"YES":"NO"):"";
 $("#ratingBand").value=band;
 const lows=low();
 if(force||!$("#mainActivity").value)$("#mainActivity").value=lows[0]?.label||$("#mainActivity").value||"";
 if(force||!$("#rootCause").value)$("#rootCause").value=lows.length?"Poor supervision / weak implementation of low scoring KPI controls.":$("#rootCause").value;
 if(force||!$("#topGaps").value)$("#topGaps").value=lows.map((x,i)=>`${i+1}. ${x.label} scored ${x.v}/5 and requires management action.`).join("\n");
 if(force||!$("#immediateAction").value)$("#immediateAction").value=lows.map(x=>`${x.label}: stop/hold affected activity where required and rectify immediate unsafe condition.`).join("\n");
 if(force||!$("#preventiveAction").value)$("#preventiveAction").value=lows.map(x=>`${x.label}: Project Manager and Construction Manager shall implement corrective action, supervision and closeout evidence.`).join("\n");
 $("#summary").innerHTML=count?`Scores: ${count}/15 | Total: ${total} | Raw: ${(raw*100).toFixed(1)}% | Weighted: ${(weighted*100).toFixed(1)}% | Critical: ${critical?"YES":"NO"} | Band: ${band}`:"No scores yet. Photo can fill values, or type manually.";
}
function updateDerived(recalc=true){
 const d=$("#inspectionDate").value;
 if(d){
   $("#weekNo").value=String(weekNo(d));
   $("#monthValue").value=monthValue(d);
   $("#targetCloseoutDate").value=addDays(d,7);
 }
 const cl=$("#cluster").value.trim();
 if(CLUSTERS[cl]){
   $("#package").value=String(CLUSTERS[cl].pkg);
   $("#contractor").value=CLUSTERS[cl].contractor;
 }
 const p=$("#package").value.trim();
 if(!$("#contractor").value.trim()){
   if(p==="3")$("#contractor").value="INNOVO";
   if(p==="2"||p==="4")$("#contractor").value="TAJV";
 }
 if(recalc)calc(false);
}
async function readImage(){
 const f=$("#imageInput").files?.[0];if(!f){setOcr("Choose photo first","error");return;}
 setOcr("Reading photo...");
 try{
   const r=await Tesseract.recognize(f,"eng",{logger:m=>{if(m.status==="recognizing text")setOcr(`OCR ${Math.round(m.progress*100)}%`);}});
   const t=r.data.text||"";
   $("#ocrText").value=t;
   const d=extractDate(t); if(d)$("#inspectionDate").value=d;
   const cp=extractCluster(t); if(cp.cluster)$("#cluster").value=cp.cluster; if(cp.pkg)$("#package").value=cp.pkg;
   const con=extractContractor(t,cp.cluster,$("#package").value); if(con)$("#contractor").value=con;
   const insp=extractInspector(t); if(insp)$("#yourName").value=insp;
   const ar=extractArea(t); if(ar)$("#areaText").value=ar;
   const sw=extractStopWork(t); if(sw)$("#stopWork").value=sw;
   const sc=extractScores(t);
   document.querySelectorAll(".score-input").forEach(x=>{if(sc[x.dataset.key])x.value=sc[x.dataset.key];});
   updateDerived(false); calc(true);
   setOcr("Photo read completed. Auto-filled "+Object.keys(sc).length+" KPI value(s). Any blank KPI can be typed manually and will still go to Excel.","success");
 }catch(e){setOcr("OCR failed: "+e.message,"error");}
}

async function loadZip(){if(excelFile)return await JSZip.loadAsync(await excelFile.arrayBuffer());const b=await fetch("original.xlsx");if(!b.ok)throw new Error("original.xlsx not found");return await JSZip.loadAsync(await b.arrayBuffer());}
async function getText(zip,p){const f=zip.file(p);if(!f)throw new Error(p+" missing");return await f.async("text");}
function findWeeklySheetPath(workbook,rels){
 const sheet=[...workbook.matchAll(/<sheet[^>]*name="Weekly_Inspections"[^>]*r:id="([^"]+)"/g)][0];if(!sheet)throw new Error("Weekly_Inspections sheet not found");
 const rid=sheet[1];const rel=[...rels.matchAll(/<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"/g)].find(x=>x[1]===rid);if(!rel)throw new Error("Weekly relationship not found");
 return "xl/"+rel[2].replace(/^\.\.\//,"");
}
function getRows(xml){return [...xml.matchAll(/<row r="(\d+)"[^>]*>.*?<\/row>/gs)].map(m=>({r:Number(m[1]),xml:m[0],start:m.index,end:m.index+m[0].length}));}
function cellIn(row,col){const re=new RegExp(`<c r="${col}${row.r}"[^>]*>.*?<\\/c>`,"s");const m=row.xml.match(re);return m?m[0]:"";}
function hasValue(row,col){const c=cellIn(row,col);return /<v>[^<]+<\/v>/.test(c);}
function firstEmptyDataRow(rows){for(const row of rows){if(row.r>=4&&!hasValue(row,"B"))return row;}throw new Error("No empty pre-formatted row found. Add more blank rows in original template.");}
function appendSharedString(files,s){
 let xml=files.shared;const idx=(xml.match(/<si>/g)||[]).length;
 xml=xml.replace(/<\/sst>/,`<si><t>${esc(s)}</t></si></sst>`);
 xml=xml.replace(/count="(\d+)"/,(m,n)=>`count="${Number(n)+1}"`).replace(/uniqueCount="(\d+)"/,(m,n)=>`uniqueCount="${Number(n)+1}"`);
 files.shared=xml;return idx;
}
function cellStyleId(cell){const m=String(cell||"").match(/\ss="(\d+)"/);return m?Number(m[1]):0;}
function ensureCenterWrapStyle(files,oldId){
 const key=String(oldId||0);if(files.styleCache[key]!==undefined)return files.styleCache[key];
 let styles=files.styles||"";const m=styles.match(/<cellXfs[^>]*count="(\d+)"[^>]*>([\s\S]*?)<\/cellXfs>/);if(!m){files.styleCache[key]=oldId||0;return oldId||0;}
 const all=[...m[2].matchAll(/<xf[^>]*(?:\/>|>[\s\S]*?<\/xf>)/g)].map(x=>x[0]);
 let base=all[oldId]||all[0]||'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>';
 base=base.replace(/\sfontId="\d+"/,' fontId="0"'); if(!/\sfontId=/.test(base))base=base.replace('<xf','<xf fontId="0"');
 base=base.replace(/\sapplyFont="\d+"/,'').replace(/\sapplyAlignment="\d+"/,'').replace(/<alignment[^>]*\/>/g,'').replace(/<alignment[\s\S]*?<\/alignment>/g,'');
 let xf;
 if(/\/>\s*$/.test(base))xf=base.replace(/\/>\s*$/,' applyFont="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>');
 else xf=base.replace(/<\/xf>\s*$/,'<alignment horizontal="center" vertical="center" wrapText="1"/></xf>').replace('<xf','<xf applyFont="1" applyAlignment="1"');
 const newId=all.length;
 styles=styles.replace(/<cellXfs([^>]*)count="\d+"([^>]*)>/,`<cellXfs$1count="${newId+1}"$2>`).replace('</cellXfs>',xf+'</cellXfs>');
 files.styles=styles;files.styleCache[key]=newId;return newId;
}
function setCell(row,col,value,type,files){
 if(value===""||value===null||value===undefined)return;
 const ref=col+row.r;const old=cellIn(row,col);const oldStyle=cellStyleId(old);const sid=ensureCenterWrapStyle(files,oldStyle);
 let attrs=` s="${sid}"`, v=value;
 if(type==="s"){v=appendSharedString(files,String(value));attrs+=` t="s"`;}else{v=String(value);}
 const newCell=`<c r="${ref}"${attrs}><v>${esc(v)}</v></c>`;
 if(old){row.xml=row.xml.replace(old,newCell);return;}
 const re=new RegExp(`<c r="([A-Z]+)${row.r}"[^>]*>.*?<\\/c>`,"gs");
 const cells=[...row.xml.matchAll(re)];let inserted=false;
 for(const c of cells){if(colNum(c[1])>colNum(col)){row.xml=row.xml.replace(c[0],newCell+c[0]);inserted=true;break;}}
 if(!inserted)row.xml=row.xml.replace(/<\/row>/,newCell+"</row>");
}
function getInspectionId(){
 const manual=$("#inspectionId").value.trim();if(manual)return manual;
 const d=$("#inspectionDate").value.replace(/-/g,"");const cl=$("#cluster").value.trim().replace(/\s+/g,"");
 return d&&cl?`${d}-${cl}-01`:"";
}
function getExcelData(){
 calc(false);
 const sc=scores(), d=$("#inspectionDate").value, cl=$("#cluster").value.trim(), pkg=$("#package").value.trim(), contractor=$("#contractor").value.trim();
 return [
  ["A",getInspectionId(),"s"],["B",d?serial(d):"","n"],["C",$("#weekNo").value,"n"],["E",$("#monthValue").value,"s"],
  ["F",pkg?Number(pkg):"","n"],["G",cl,"s"],["H",(pkg&&cl)?"OK":"","s"],["I",contractor,"s"],
  ["O",$("#yourName").value.trim(),"s"],["P",$("#yourRole").value.trim(),"s"],["Q",$("#areaText").value.trim(),"s"],["R",$("#workersObserved").value.trim(),"s"],
  ["S",$("#mainActivity").value.trim(),"s"],["T",$("#stopWork").value,"s"],
  ...KPI.map(k=>[k[0], sc[k[1]], "n"]),
  ["AJ",$("#totalScore").value,"n"],["AK",$("#rawScore").value?Number($("#rawScore").value)/100:"","n"],["AL",$("#weightedScore").value?Number($("#weightedScore").value)/100:"","n"],
  ["AM",$("#criticalRedFlag").value,"s"],["AN",$("#awardEligible").value,"s"],["AO",$("#ratingBand").value,"s"],["AP",$("#repeatIssue").value,"s"],
  ["AQ",$("#rootCause").value.trim(),"s"],["AR",$("#topGaps").value.trim(),"s"],["AS",$("#immediateAction").value.trim(),"s"],["AT",$("#preventiveAction").value.trim(),"s"],["AU",$("#positiveObservations").value.trim(),"s"],
  ["AV",$("#actionOwner").value.trim(),"s"],["AW",$("#targetCloseoutDate").value?serial($("#targetCloseoutDate").value):"","n"],["AX",$("#evidence").value.trim(),"s"],
  ["AY",low()[0]?.label||"","s"],["AZ",low()[1]?.label||"","s"],["BA",low()[2]?.label||"","s"],["BB",low()[0]?.label||"","s"],["BC",low()[0]?.label||"","s"]
 ].filter(x=>x[1]!==""&&x[1]!==null&&x[1]!==undefined);
}
async function updateExcel(){
 try{
   updateDerived(false); calc(false);
   setStatus("Opening original xlsx and writing all website data...");
   const zip=await loadZip();
   const workbook=await getText(zip,"xl/workbook.xml"), rels=await getText(zip,"xl/_rels/workbook.xml.rels");
   const sheetPath=findWeeklySheetPath(workbook,rels);
   let sheet=await getText(zip,sheetPath), shared=await getText(zip,"xl/sharedStrings.xml"), styles=await getText(zip,"xl/styles.xml");
   const files={shared,styles,styleCache:{}};
   const rows=getRows(sheet), row=firstEmptyDataRow(rows);
   const before=row.xml;
   getExcelData().forEach(([col,val,type])=>setCell(row,col,val,type,files));
   sheet=sheet.slice(0,row.start)+row.xml+sheet.slice(row.end);
   zip.file(sheetPath,sheet);zip.file("xl/sharedStrings.xml",files.shared);zip.file("xl/styles.xml",files.styles);
   const blob=await zip.generateAsync({type:"blob",compression:"DEFLATE"});
   const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`Saadiyat_Lagoons_HSE_Weekly_KPI_UPDATED_ROW_${row.r}.xlsx`;a.click();
   setStatus(`Done. Row ${row.r} updated from website data: date, week, month, package, cluster, contractor, KEO/name, all manual KPI scores, rating band and closeout date written to Excel.`, "success");
 }catch(e){console.error(e);setStatus("Failed: "+e.message,"error");}
}

document.addEventListener("DOMContentLoaded",()=>{
 renderKpis();
 $("#imageInput").onchange=e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=ev=>{$("#preview").src=ev.target.result;$("#preview").style.display="block";$("#ph").style.display="none";setTimeout(readImage,200);};r.readAsDataURL(f);};
 $("#excelInput").onchange=e=>{excelFile=e.target.files?.[0]||null;setExcel(excelFile?`Selected original file: ${excelFile.name}`:"Included original.xlsx ready.",excelFile?"success":"");};
 $("#readBtn").onclick=readImage;$("#updateBtn").onclick=updateExcel;
 ["inspectionDate","cluster","package","contractor","inspectionId","yourName","yourRole","areaText","workersObserved","mainActivity","stopWork","repeatIssue","actionOwner","targetCloseoutDate","evidence"].forEach(id=>{const el=$("#"+id);if(el)el.oninput=()=>calc(true);});
 $("#inspectionDate").onchange=()=>updateDerived(true);$("#cluster").oninput=()=>updateDerived(true);$("#package").oninput=()=>updateDerived(true);
 updateDerived(false);calc(false);
});