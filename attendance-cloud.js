/* ACROW Factory 5 - Attendance cloud layer
   Reliable local-first attendance save + Firebase sync.
*/
(function(){
'use strict';
var CFG={apiKey:'AIzaSyCGUyuUyu-qG-Z5A1LnnH6oIcbJSwgwS9oc',authDomain:'acrow-factory-5.firebaseapp.com',projectId:'acrow-factory-5',storageBucket:'acrow-factory-5.firebasestorage.app',messagingSenderId:'26128829420',appId:'1:26128829420:web:75e6a0f31edc7e66c44ec9'};
var WORKERS='acrowAttendanceWorkers',ATT='acrowAttendanceRecords',db=null,storage=null,cloudReady=false;

function clean(s){return String(s||'').replace(/[،,؛;]/g,' ').replace(/\s+/g,' ').trim();}
function dayNow(){return new Date().toISOString().slice(0,10);}
function stableId(name,fp){var s=clean(name).toLowerCase()+'|'+clean(fp);try{return btoa(unescape(encodeURIComponent(s))).replace(/[^a-zA-Z0-9_-]/g,'').slice(0,120)||('w_'+Date.now());}catch(e){return 'w_'+Date.now();}}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function syncLocal(){try{localStorage.setItem('acrow_workers',JSON.stringify(Array.isArray(window.W)?window.W:[]));localStorage.setItem('acrow_att',JSON.stringify(Array.isArray(window.A)?window.A:[]));}catch(e){console.error(e);}}
function status(msg){try{if(window.$&&$('status'))$('status').textContent=msg;}catch(e){}}

function parseAttendanceText(raw){
 var s=clean(raw);if(!s)return null;
 var type=/يومية|يوميه/.test(s)?'يومية':/معين/.test(s)?'معين':'معين',fp='';
 var m=s.match(/(?:الرقم\s*(?:الثابت)?|رقم\s*(?:الثابت)?|البصمة)\s*[:：-]?\s*(\d{2,8})/i);
 if(m)fp=m[1];else{var nums=s.match(/\b\d{2,8}\b/g);if(nums&&nums.length)fp=nums[nums.length-1];}
 var job='',jobs=['ملاحظ إنتاج','ملاحظ انتاج','عامل إنتاج','عامل انتاج','لحام','لحامين','مراقب جودة','جودة','سائق','فني','نجار','كهربائي','ميكانيكي','مخزن','مخازن','مشرف','مهندس'];
 for(var i=0;i<jobs.length;i++)if(s.indexOf(jobs[i])!==-1){job=jobs[i];break;}
 var name=s.replace(/^(اسم العامل|العامل)\s*[:：-]?\s*/,'');
 name=name.split(/\s*(?:المهنة|مهنته|وظيفته|الوظيفة|الرقم|رقم|البصمة|الثابت|نوع العامل)\b/i)[0];
 name=name.replace(/\b(?:معين|يومية)\b/g,'').trim();
 return name?{name:clean(name),job:job,type:type,fp:fp,raw:s}:null;
}
function normW(w){return{id:String(w.id||stableId(w.name,w.fp)),name:clean(w.name),job:clean(w.job),type:w.type==='يومية'?'يومية':'معين',fp:clean(w.fp),updatedAt:w.updatedAt||Date.now()};}
function normA(a){return{id:String(a.id||((a.workerId||a.id)+'_'+(a.day||dayNow()))),workerId:String(a.workerId||a.id||''),name:clean(a.name),job:clean(a.job),type:a.type==='يومية'?'يومية':'معين',fp:clean(a.fp),day:String(a.day||dayNow()),time:String(a.time||''),text:String(a.text||'تسجيل حضور'),audioUrl:String(a.audioUrl||'')};}
function mergeW(local,cloud){var m={};(local||[]).forEach(function(w){var x=normW(w);m[x.id]=x;});(cloud||[]).forEach(function(w){var x=normW(w);m[x.id]=Object.assign({},m[x.id]||{},x);});return Object.keys(m).map(function(k){return m[k];});}
function mergeA(local,cloud){var m={};(local||[]).forEach(function(a){var x=normA(a);m[x.id]=x;});(cloud||[]).forEach(function(a){var x=normA(a);m[x.id]=Object.assign({},m[x.id]||{},x);});return Object.keys(m).map(function(k){return m[k];});}

async function saveWorkerCloud(w){if(!cloudReady||!db)return;var x=normW(w),id=stableId(x.name,x.fp||x.id);x.id=id;w.id=id;await db.collection(WORKERS).doc(id).set(x,{merge:true});}
async function markCloud(w,text,audioUrl){if(!cloudReady||!db)return true;var x=normW(w),wid=stableId(x.name,x.fp||x.id),day=dayNow(),id=wid+'_'+day;x.id=wid;w.id=wid;var ref=db.collection(ATT).doc(id),snap=await ref.get();if(snap.exists)return false;var now=new Date();await ref.set({id:id,workerId:wid,name:x.name,job:x.job,type:x.type,fp:x.fp,day:day,time:now.toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit'}),text:String(text||'تسجيل حضور'),audioUrl:String(audioUrl||''),createdAt:firebase.firestore.FieldValue.serverTimestamp()});return true;}

function render(){try{var ws=Array.isArray(window.W)?window.W:[];$('workers').innerHTML='<option value="">اختر العامل</option>'+ws.map(function(w){return '<option value="'+esc(w.id)+'">'+esc(w.name)+' — '+esc(w.job||'')+' — '+esc(w.type||'معين')+' — '+esc(w.fp||'')+'</option>';}).join('');var aa=Array.isArray(window.A)?window.A:[];$('list').innerHTML=aa.slice(-30).reverse().map(function(a){var au=a.audioUrl?'<br><a href="'+esc(a.audioUrl)+'" target="_blank">استماع للتسجيل</a>':'';return '<div style="padding:8px 0;border-bottom:1px solid #eee">'+esc(a.day)+' '+esc(a.time)+' — '+esc(a.name)+' — '+esc(a.text||'حضور')+au+'</div>';}).join('')||'لا يوجد تسجيلات';}catch(e){console.error(e);}}
function installHandlers(){
 window.refresh=render;
 window.save=function(){syncLocal();};
 window.mark=function(w,text){
  var arr=Array.isArray(window.A)?window.A:[],day=dayNow();
  if(arr.some(function(x){return String(x.id)===String(w.id)&&String(x.day)===day;}))return false;
  var now=new Date(),item={id:String(w.id),workerId:String(w.id),name:w.name,job:w.job||'',type:w.type||'معين',fp:w.fp||'',day:day,time:now.toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit'}),text:text||'تسجيل يدوي',audioUrl:window.__attendanceLastAudioUrl||''};
  arr.push(item);window.A=arr;syncLocal();render();
  if(cloudReady)markCloud(w,item.text,item.audioUrl).then(function(){status('تم التسجيل والحضور: '+w.name);}).catch(function(e){console.error(e);status('تم التسجيل والحضور على الجهاز: '+w.name+' — المزامنة المركزية ستتم لاحقاً.');});
  return true;
 };
 window.saveVoiceResult=function(){
  var raw=String(window.textResult||window.__liveTranscript||'').trim(),p=parseAttendanceText(raw);
  if(!p||!p.name){var typed=$('name').value.trim();if(!typed){status('لم يصل اسم العامل من الصوت. اكتب الاسم في خانة اسم العامل ثم اضغط حفظ التسجيل والبيانات.');return;}p={name:typed,job:$('job').value.trim(),type:$('type').value||'معين',fp:$('fp').value.trim(),raw:raw||'تسجيل يدوي'};}
  var ws=Array.isArray(window.W)?window.W:[],w=ws.find(function(x){return clean(x.name)===clean(p.name)||(p.fp&&clean(x.fp)===clean(p.fp));});
  if(!w){w={id:stableId(p.name,p.fp),name:p.name,job:p.job||'',type:p.type||'معين',fp:p.fp||''};ws.push(w);}else{if(p.job)w.job=p.job;if(p.type)w.type=p.type;if(p.fp)w.fp=p.fp;w.id=stableId(w.name,w.fp||w.id);}
  window.W=ws;syncLocal();render();
  $('name').value=w.name;$('job').value=w.job||'';$('type').value=w.type||'معين';$('fp').value=w.fp||'';
  var marked=window.mark(w,raw||'تسجيل صوتي');syncLocal();
  status(marked?'تم التسجيل والحضور: '+w.name:'العامل مسجل حضور اليوم بالفعل: '+w.name);
  saveWorkerCloud(w).catch(function(e){console.error('worker cloud',e);});
 };
 $('saveVoice').onclick=function(){window.saveVoiceResult();};
 $('add').onclick=async function(){var name=$('name').value.trim();if(!name){alert('اكتب اسم العامل');return;}var ws=Array.isArray(window.W)?window.W:[],old=ws.find(function(x){return clean(x.name)===clean(name)||($('fp').value.trim()&&clean(x.fp)===$('fp').value.trim());});if(old){old.job=$('job').value.trim();old.type=$('type').value;old.fp=$('fp').value.trim();old.id=stableId(old.name,old.fp||old.id);}else{old={id:stableId(name,$('fp').value.trim()),name:name,job:$('job').value.trim(),type:$('type').value,fp:$('fp').value.trim()};ws.push(old);}window.W=ws;syncLocal();render();saveWorkerCloud(old).then(function(){status('تم حفظ بيانات العامل: '+name);}).catch(function(){status('تم حفظ العامل على الجهاز، والمزامنة المركزية ستتم لاحقاً.');});};
 $('att').onclick=function(){var w=(window.W||[]).find(function(x){return String(x.id)===$('workers').value;});if(w)window.mark(w,'تسجيل يدوي');};
}

async function transcribeAudio(blob){
 try{
  status('جاري تحويل التسجيل الصوتي إلى كتابة...');
  var buf=await blob.arrayBuffer(),bytes=new Uint8Array(buf),binary='',chunk=0x8000;
  for(var i=0;i<bytes.length;i+=chunk)binary+=String.fromCharCode.apply(null,bytes.subarray(i,i+chunk));
  var r=await fetch('https://acrow-attendance.floot.app/_api/transcribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({audioBase64:btoa(binary),mimeType:blob.type||'audio/webm'})});
  var data=await r.json().catch(function(){return {};});
  if(!r.ok||!data.text)throw new Error(data.error||'no transcript');
  window.textResult=String(data.text).trim();window.__liveTranscript=window.textResult;
  status('تم تحويل الكلام إلى كتابة: '+window.textResult);
  return window.textResult;
 }catch(e){console.warn('transcribeAudio',e);return window.textResult||window.__liveTranscript||'';}
}
async function uploadAudio(blob){window.__attendanceLastAudioUrl='';if(!storage||!blob)return '';try{var ref=storage.ref('attendance-audio/'+dayNow()+'/'+Date.now()+'-'+Math.random().toString(36).slice(2)+'.webm');await ref.put(blob,{contentType:blob.type||'audio/webm'});var url=await ref.getDownloadURL();window.__attendanceLastAudioUrl=url;return url;}catch(e){console.warn('audio upload',e);return '';}}
function installVoice(){
 window.start=async function(){
  if(window.recording)return;window.recording=true;if(typeof window.paint==='function')window.paint(true);status('الميكروفون يعمل الآن — اتكلم بالجملة كاملة');
  window.textResult='';window.__liveTranscript='';window.__speechFinalParts=[];window.__speechInterim='';window.__attendanceLastAudioUrl='';
  var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(SR)try{var r=new SR();window.__voiceRecognition=r;r.lang='ar-EG';r.continuous=true;r.interimResults=true;r.onresult=function(e){for(var i=e.resultIndex;i<e.results.length;i++){var t=((e.results[i][0]&&e.results[i][0].transcript)||'').trim();if(!t)continue;if(e.results[i].isFinal)window.__speechFinalParts.push(t);else window.__speechInterim=t;}window.textResult=window.__speechFinalParts.concat(window.__speechInterim?[window.__speechInterim]:[]).join(' ').replace(/\s+/g,' ').trim();window.__liveTranscript=window.textResult;if(window.textResult)status('تم سماع: '+window.textResult);};r.onerror=function(e){console.warn('SpeechRecognition',e.error);};r.onend=function(){window.textResult=window.__speechFinalParts.concat(window.__speechInterim?[window.__speechInterim]:[]).join(' ').replace(/\s+/g,' ').trim();window.__liveTranscript=window.textResult;if(window.recording){try{r.start();}catch(x){}}};r.start();}catch(e){console.warn('SpeechRecognition start',e);}
  try{window.stream=await navigator.mediaDevices.getUserMedia({audio:true});var mime=(window.MediaRecorder&&MediaRecorder.isTypeSupported('audio/webm;codecs=opus'))?'audio/webm;codecs=opus':'audio/webm';window.rec=new MediaRecorder(window.stream,{mimeType:mime});var chunks=[];window.rec.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data);};window.rec.onstop=async function(){var blob=new Blob(chunks,{type:window.rec.mimeType||'audio/webm'});$('audio').src=URL.createObjectURL(blob);$('audio').style.display='block';uploadAudio(blob).catch(function(){});await transcribeAudio(blob);if(!window.textResult.trim()&&window.__liveTranscript.trim())window.textResult=window.__liveTranscript.trim();window.saveVoiceResult();};window.rec.start();}
  catch(e){console.error(e);try{if(window.__voiceRecognition)window.__voiceRecognition.stop();}catch(x){}window.recording=false;if(typeof window.paint==='function')window.paint(false);status('تعذر تشغيل الميكروفون.');}
 };
 window.stop=function(){if(!window.recording)return;window.recording=false;if(typeof window.paint==='function')window.paint(false);try{if(window.__voiceRecognition)window.__voiceRecognition.stop();}catch(e){}try{if(window.rec&&window.rec.state!=='inactive')window.rec.stop();}catch(e){}if(window.stream)window.stream.getTracks().forEach(function(t){t.stop();});};
}

async function migrateLocal(){if(!cloudReady||!db)return;var ws=Array.isArray(window.W)?window.W.slice():[],aa=Array.isArray(window.A)?window.A.slice():[];for(var i=0;i<ws.length;i++)try{await saveWorkerCloud(ws[i]);}catch(e){}for(var j=0;j<aa.length;j++){var a=aa[j],w=ws.find(function(x){return String(x.id)===String(a.workerId||a.id)||clean(x.name)===clean(a.name);});if(!w)continue;try{var x=normW(w),id=stableId(x.name,x.fp)+'_'+String(a.day||dayNow()),ref=db.collection(ATT).doc(id),snap=await ref.get();if(!snap.exists)await ref.set({id:id,workerId:stableId(x.name,x.fp),name:x.name,job:x.job,type:x.type,fp:x.fp,day:a.day||dayNow(),time:a.time||'',text:a.text||'تسجيل سابق',audioUrl:a.audioUrl||''});}catch(e){}}}
function boot(){if(!window.firebase)return setTimeout(boot,100);try{if(!firebase.apps.length)firebase.initializeApp(CFG);db=firebase.firestore();try{storage=firebase.storage();}catch(e){storage=null;}cloudReady=true;installHandlers();installVoice();status('جاري الاتصال بقاعدة بيانات الحضور...');migrateLocal();db.collection(WORKERS).onSnapshot(function(s){var c=[];s.forEach(function(d){c.push(d.data());});window.W=mergeW(Array.isArray(window.W)?window.W:[],c);syncLocal();render();},function(e){console.error(e);status('تم الحفظ على الجهاز؛ تعذر الاتصال المركزي حالياً.');});db.collection(ATT).onSnapshot(function(s){var c=[];s.forEach(function(d){c.push(d.data());});window.A=mergeA(Array.isArray(window.A)?window.A:[],c);syncLocal();render();},function(e){console.error(e);});}catch(e){console.error(e);status('تم الحفظ على الجهاز؛ المزامنة المركزية غير متاحة حالياً.');}}
function loadFirebase(){var a=document.createElement('script');a.src='https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js';a.onload=function(){var f=document.createElement('script');f.src='https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js';f.onload=function(){var s=document.createElement('script');s.src='https://www.gstatic.com/firebasejs/10.14.1/firebase-storage-compat.js';s.onload=boot;s.onerror=boot;document.head.appendChild(s);};document.head.appendChild(f);};document.head.appendChild(a);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){try{installHandlers();installVoice();}catch(e){}loadFirebase();});else{try{installHandlers();installVoice();}catch(e){}loadFirebase();}
})();