/* ACROW Factory 5 - Attendance cloud layer
   Keeps the existing attendance page/UI and moves workers + attendance to Firebase.
*/
(function(){
'use strict';

var CFG={
 apiKey:'AIzaSyCGUyuUyu-qG-Z5A1LnnH6oIcbJSwgwS9oc',
 authDomain:'acrow-factory-5.firebaseapp.com',
 projectId:'acrow-factory-5',
 storageBucket:'acrow-factory-5.firebasestorage.app',
 messagingSenderId:'26128829420',
 appId:'1:26128829420:web:75e6a0f31edc7e66c44ec9'
};
var WORKERS='acrowAttendanceWorkers';
var ATT='acrowAttendanceRecords';
var db=null,storage=null,cloudReady=false,initialWorkerLoad=false,initialAttLoad=false;

function clean(s){return String(s||'').replace(/[،,؛;]/g,' ').replace(/\s+/g,' ').trim();}
function dayNow(){return new Date().toISOString().slice(0,10);}
function stableId(name,fp){
 var s=clean(name).toLowerCase()+'|'+clean(fp);
 try{return btoa(unescape(encodeURIComponent(s))).replace(/[^a-zA-Z0-9_-]/g,'').slice(0,120)||('w_'+Date.now());}
 catch(e){return 'w_'+Date.now();}
}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}

function syncLocalArrays(){
 try{
  localStorage.setItem('acrow_workers',JSON.stringify(W||[]));
  localStorage.setItem('acrow_att',JSON.stringify(A||[]));
 }catch(e){}
}

function renderStatus(msg){
 try{if(window.$ && $('status')) $('status').textContent=msg;}catch(e){}
}

function parseAttendanceText(raw){
 var s=clean(raw);
 if(!s)return null;
 var type=/يومية|يوميه/.test(s)?'يومية':/معين/.test(s)?'معين':'معين';
 var fp='';
 var m=s.match(/(?:الرقم\\s*(?:الثابت)?|رقم\\s*(?:الثابت)?|البصمة)\\s*[:：-]?\\s*(\\d{2,8})/i);
 if(m)fp=m[1];
 var job='';
 var jobs=['ملاحظ إنتاج','ملاحظ انتاج','عامل إنتاج','عامل انتاج','لحام','لحامين','مراقب جودة','جودة','سائق','فني','نجار','كهربائي','ميكانيكي','مخزن','مخازن','مشرف','مهندس'];
 for(var i=0;i<jobs.length;i++){if(s.indexOf(jobs[i])!==-1){job=jobs[i];break;}}
 var name=s.replace(/^(اسم العامل|العامل)\\s*[:：-]?\\s*/,'');
 name=name.split(/\\s*(?:المهنة|مهنته|وظيفته|الوظيفة|الرقم|رقم|البصمة|الثابت|نوع العامل)\\b/i)[0];
 name=name.replace(/\\b(?:معين|يومية)\\b/g,'').trim();
 if(!name)return null;
 return {name:clean(name),job:job,type:type,fp:fp,raw:s};
}

function workerObject(w){
 return {
  id:String(w.id||stableId(w.name,w.fp)),
  name:clean(w.name),
  job:clean(w.job),
  type:w.type==='يومية'?'يومية':'معين',
  fp:clean(w.fp),
  updatedAt:Date.now()
 };
}

async function saveWorkerCloud(w){
 if(!cloudReady||!db)return;
 var x=workerObject(w), id=stableId(x.name,x.fp||x.id);
 x.id=id;
 w.id=id;
 await db.collection(WORKERS).doc(id).set(x,{merge:true});
}

async function markCloud(w,text,audioUrl){
 if(!cloudReady||!db)return false;
 var x=workerObject(w), wid=stableId(x.name,x.fp||x.id), day=dayNow();
 x.id=wid; w.id=wid;
 var id=wid+'_'+day;
 var ref=db.collection(ATT).doc(id);
 var snap=await ref.get();
 if(snap.exists)return false;
 var now=new Date();
 var item={
  id:id,workerId:wid,name:x.name,job:x.job,type:x.type,fp:x.fp,
  day:day,time:now.toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit'}),
  text:String(text||'تسجيل حضور'),
  audioUrl:String(audioUrl||''),
  createdAt:firebase.firestore.FieldValue.serverTimestamp()
 };
 await ref.set(item,{merge:false});
 return true;
}

function replaceArraysFromCloud(){
 try{syncLocalArrays(); if(typeof window.refresh==='function')window.refresh();}catch(e){}
}

async function migrateLocal(){
 if(!cloudReady||!db)return;
 var localW=Array.isArray(window.W)?window.W.slice():[];
 var localA=Array.isArray(window.A)?window.A.slice():[];
 for(var i=0;i<localW.length;i++){
  try{await saveWorkerCloud(localW[i]);}catch(e){console.warn('worker migration',e);}
 }
 for(var j=0;j<localA.length;j++){
  var a=localA[j], w=localW.find(function(x){return String(x.id)===String(a.id);});
  if(!w)continue;
  try{
   var wid=stableId(w.name,w.fp), id=wid+'_'+String(a.day||dayNow());
   var ref=db.collection(ATT).doc(id), snap=await ref.get();
   if(!snap.exists){
    await ref.set({
      id:id,workerId:wid,name:w.name,job:w.job||'',type:w.type||'معين',fp:w.fp||'',
      day:a.day||dayNow(),time:a.time||'',text:a.text||'تسجيل سابق',audioUrl:a.audioUrl||'',
      migratedAt:firebase.firestore.FieldValue.serverTimestamp()
    });
   }
  }catch(e){console.warn('attendance migration',e);}
 }
}

function installCloudHandlers(){
 var oldRefresh=window.refresh;
 window.refresh=function(){
  try{
   var workers=Array.isArray(window.W)?window.W:[];
   $('workers').innerHTML='<option value="">اختر العامل</option>'+workers.map(function(w){
    return '<option value="'+esc(w.id)+'">'+esc(w.name)+' — '+esc(w.job||'')+' — '+esc(w.type||'معين')+' — '+esc(w.fp||'')+'</option>';
   }).join('');
   var arr=Array.isArray(window.A)?window.A:[];
   $('list').innerHTML=arr.slice(-30).reverse().map(function(a){
    var audio=a.audioUrl?'<br><a href="'+esc(a.audioUrl)+'" target="_blank">استماع للتسجيل</a>':'';
    return '<div style="padding:8px 0;border-bottom:1px solid #eee">'+esc(a.day)+' '+esc(a.time)+' — '+esc(a.name)+' — '+esc(a.text||'حضور')+audio+'</div>';
   }).join('')||'لا يوجد تسجيلات';
  }catch(e){if(oldRefresh)oldRefresh();}
 };

 window.save=async function(){
  syncLocalArrays();
 };

 window.mark=function(w,text){
  var day=dayNow(), arr=Array.isArray(window.A)?window.A:[];
  if(arr.some(function(x){return String(x.id)===String(w.id)&&x.day===day;}))return false;
  var now=new Date();
  var item={id:String(w.id),name:w.name,day:day,time:now.toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit'}),text:text||'تسجيل يدوي',audioUrl:window.__attendanceLastAudioUrl||''};
  arr.push(item); window.A=arr; syncLocalArrays(); window.refresh();
  markCloud(w,item.text,item.audioUrl).then(function(ok){
    if(ok)renderStatus('تم التسجيل والحضور: '+w.name);
    else renderStatus('تم التسجيل بالفعل: '+w.name);
  }).catch(function(e){console.error(e);renderStatus('تم الحضور محلياً، لكن تعذر الحفظ المركزي الآن.');});
  return true;
 };

 window.saveVoiceResult=function(){
  var raw=(window.textResult||window.__liveTranscript||'').trim();
  var p=parseAttendanceText(raw) || ((typeof window.parseVoice==='function')?window.parseVoice(raw):null);
  if(!p||!p.name){
   var typed=$('name').value.trim();
   if(!typed){renderStatus('لم يتم تحويل الكلام إلى كتابة. حاول مرة أخرى أو اكتب الاسم يدوياً.');return;}
   p={name:typed,job:$('job').value.trim(),type:$('type').value||'معين',fp:$('fp').value.trim(),raw:raw||'تسجيل يدوي'};
  }
  var workers=Array.isArray(window.W)?window.W:[];
  var w=workers.find(function(x){return clean(x.name)===clean(p.name) || (p.fp&&clean(x.fp)===clean(p.fp));});
  if(!w){w={id:stableId(p.name,p.fp),name:p.name,job:p.job,type:p.type,fp:p.fp};workers.push(w);}
  else{
   if(p.job)w.job=p.job;
   if(p.fp)w.fp=p.fp;
   if(p.type)w.type=p.type;
   w.id=stableId(w.name,w.fp||w.id);
  }
  window.W=workers;syncLocalArrays();window.refresh();
  $('name').value=w.name;$('job').value=w.job||'';$('type').value=w.type||'معين';$('fp').value=w.fp||'';
  saveWorkerCloud(w).then(function(){window.mark(w,raw||'تسجيل صوتي');}).catch(function(e){
   console.error(e); renderStatus('تم التعرف على العامل، لكن تعذر حفظ بياناته مركزياً الآن.');
  });
 };

 $('add').onclick=async function(){
  var name=$('name').value.trim();if(!name){alert('اكتب اسم العامل');return;}
  var workers=Array.isArray(window.W)?window.W:[];
  var old=workers.find(function(x){return clean(x.name)===clean(name)||($('fp').value.trim()&&clean(x.fp)===$('fp').value.trim());});
  if(old){
   old.job=$('job').value.trim();old.type=$('type').value;old.fp=$('fp').value.trim();
   old.id=stableId(old.name,old.fp||old.id);
  }else{
   old={id:stableId(name,$('fp').value.trim()),name:name,job:$('job').value.trim(),type:$('type').value,fp:$('fp').value.trim()};
   workers.push(old);
  }
  window.W=workers;syncLocalArrays();window.refresh();
  try{await saveWorkerCloud(old);renderStatus('تم حفظ بيانات العامل مركزياً: '+name);}
  catch(e){console.error(e);renderStatus('تم حفظ العامل على الجهاز، لكن تعذر الحفظ المركزي الآن.');}
 };

 $('att').onclick=function(){
  var w=(window.W||[]).find(function(x){return String(x.id)===$('workers').value;});if(!w)return;
  window.mark(w,'تسجيل يدوي');
 };

 var oldShowReport=window.showReport;
 window.showReport=function(){
  var f=$('from').value||dayNow(),t=$('to').value||dayNow();
  var rows=(window.A||[]).filter(function(a){return String(a.day)>=f&&String(a.day)<=t;});
  var byWorker={};
  rows.forEach(function(a){byWorker[a.workerId||a.id]=a;});
  var workers=(window.W||[]).filter(function(w){return !!byWorker[w.id] || rows.some(function(a){return clean(a.name)===clean(w.name);});});
  var معين=workers.filter(function(w){return w.type==='معين';}).length;
  var يومية=workers.filter(function(w){return w.type==='يومية';}).length;
  var jobs={};workers.forEach(function(w){var j=w.job||'غير محدد';jobs[j]=(jobs[j]||0)+1;});
  var html='<p><b>الفترة:</b> '+esc(f)+' إلى '+esc(t)+'</p><p><b>إجمالي الحضور:</b> '+workers.length+' | <b>معين:</b> '+معين+' | <b>يومية:</b> '+يومية+'</p>';
  html+='<table><tr><th>المهنة</th><th>العدد</th></tr>'+Object.keys(jobs).map(function(j){return '<tr><td>'+esc(j)+'</td><td>'+jobs[j]+'</td></tr>';}).join('')+'</table>';
  html+='<table><tr><th>التاريخ</th><th>الوقت</th><th>الاسم</th><th>المهنة</th><th>النوع</th><th>الرقم</th></tr>';
  rows.slice().reverse().forEach(function(a){
   html+='<tr><td>'+esc(a.day)+'</td><td>'+esc(a.time)+'</td><td>'+esc(a.name)+'</td><td>'+esc(a.job||'')+'</td><td>'+esc(a.type||'')+'</td><td>'+esc(a.fp||'')+'</td></tr>';
  });
  html+='</table>'; $('reportBox').innerHTML=html;
 };
}

async function uploadAudio(blob){
 window.__attendanceLastAudioUrl='';
 if(!storage||!blob)return '';
 try{
  var path='attendance-audio/'+dayNow()+'/'+Date.now()+'-'+Math.random().toString(36).slice(2)+'.webm';
  var ref=storage.ref(path);
  await ref.put(blob,{contentType:blob.type||'audio/webm'});
  var url=await ref.getDownloadURL();
  window.__attendanceLastAudioUrl=url;
  return url;
 }catch(e){console.error('attendance audio upload failed',e);return '';}
}

function installVoice(){
 window.start=async function(){
  if(window.recording)return;
  window.recording=true;
  if(typeof window.paint==='function')window.paint(true);
  renderStatus('الميكروفون يعمل الآن — اتكلم بالجملة كاملة');

  window.textResult='';
  window.__liveTranscript='';
  window.__attendanceLastAudioUrl='';
  window.__voiceRecognitionDone=false;

  // Android Chrome: use the browser's Arabic SpeechRecognition while also
  // recording the original audio. This removes the dependency on the old
  // Floot transcription endpoint.
  var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(SR){
   try{
    window.__voiceRecognition=new SR();
    window.__voiceRecognition.lang='ar-EG';
    window.__voiceRecognition.continuous=true;
    window.__voiceRecognition.interimResults=true;
    window.__voiceRecognition.onresult=function(e){
     var live='';
     for(var i=e.resultIndex;i<e.results.length;i++){
      var t=(e.results[i][0]&&e.results[i][0].transcript||'').trim();
      if(!t)continue;
      live+=(t+' ');
     }
     live=live.trim();
     if(live){
      window.__liveTranscript=(window.__liveTranscript+' '+live).replace(/\\s+/g,' ').trim();
      renderStatus('تم سماع: '+window.__liveTranscript);
     }
     for(var j=e.resultIndex;j<e.results.length;j++){
      if(e.results[j].isFinal){
       var ft=(e.results[j][0]&&e.results[j][0].transcript||'').trim();
       if(ft)window.textResult=(window.textResult+' '+ft).replace(/\\s+/g,' ').trim();
      }
     }
    };
    window.__voiceRecognition.onerror=function(e){
     console.warn('SpeechRecognition:',e.error);
     if(e.error==='not-allowed'||e.error==='service-not-allowed'){
      renderStatus('الميكروفون يعمل، لكن تحويل الكلام العربي غير متاح من Chrome الآن. أكمل الكلام ثم جرّب مرة أخرى.');
     }
    };
    window.__voiceRecognition.onend=function(){
     window.__voiceRecognitionDone=true;
    };
    window.__voiceRecognition.start();
   }catch(e){console.warn('SpeechRecognition start failed',e);}
  }

  try{
   window.stream=await navigator.mediaDevices.getUserMedia({audio:true});
   var mime=(window.MediaRecorder&&MediaRecorder.isTypeSupported('audio/webm;codecs=opus'))?'audio/webm;codecs=opus':'audio/webm';
   window.rec=new MediaRecorder(window.stream,{mimeType:mime});
   var chunks=[];
   window.rec.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data);};
   window.rec.onstop=async function(){
    var blob=new Blob(chunks,{type:window.rec.mimeType||'audio/webm'});
    $('audio').src=URL.createObjectURL(blob);
    $('audio').style.display='block';

    var audioPromise=uploadAudio(blob);

    // Give SpeechRecognition a short moment to deliver its final Arabic result.
    await new Promise(function(resolve){setTimeout(resolve,1600);});

    if(!window.textResult.trim() && window.__liveTranscript.trim()){
     window.textResult=window.__liveTranscript.trim();
    }

    await audioPromise;

    if(window.textResult.trim()){
     renderStatus('تم تحويل الكلام إلى كتابة: '+window.textResult);
    }else{
     renderStatus('تم حفظ التسجيل الصوتي. لم يصل نص عربي من Chrome.');
    }

    window.saveVoiceResult();
   };
   window.rec.start();
  }catch(e){
   console.error(e);
   try{if(window.__voiceRecognition)window.__voiceRecognition.stop();}catch(x){}
   window.recording=false;
   if(typeof window.paint==='function')window.paint(false);
   renderStatus('تعذر تشغيل الميكروفون. اسمح للموقع باستخدام الميكروفون من إعدادات Chrome.');
  }
 };

 window.stop=function(){
  if(!window.recording)return;
  window.recording=false;
  if(typeof window.paint==='function')window.paint(false);
  try{if(window.__voiceRecognition)window.__voiceRecognition.stop();}catch(e){}
  try{if(window.rec&&window.rec.state!=='inactive')window.rec.stop();}catch(e){}
  if(window.stream)window.stream.getTracks().forEach(function(t){t.stop();});
 };
}
function boot(){
 if(!window.firebase)return setTimeout(boot,100);
 try{
  if(!firebase.apps.length)firebase.initializeApp(CFG);
  db=firebase.firestore();
  try{storage=firebase.storage();}catch(e){storage=null;}
  cloudReady=true;
  installCloudHandlers();installVoice();
  renderStatus('جاري الاتصال بقاعدة بيانات الحضور...');
  db.collection(WORKERS).onSnapshot(function(snap){
   var out=[];snap.forEach(function(d){out.push(d.data());});
   if(snap.empty && !initialWorkerLoad){
    initialWorkerLoad=true;
    migrateLocal().catch(console.error);
    return;
   }
   initialWorkerLoad=true;window.W=out;syncLocalArrays();window.refresh();
   renderStatus('متصل بقاعدة بيانات الحضور');
  },function(e){console.error('workers listener',e);renderStatus('قاعدة البيانات غير متاحة حالياً.');});

  db.collection(ATT).onSnapshot(function(snap){
   var out=[];snap.forEach(function(d){out.push(d.data());});
   out.sort(function(a,b){return (String(a.day)+String(a.time)).localeCompare(String(b.day)+String(b.time));});
   if(snap.empty && !initialAttLoad){initialAttLoad=true;return;}
   initialAttLoad=true;window.A=out;syncLocalArrays();window.refresh();
  },function(e){console.error('attendance listener',e);});
 }catch(e){console.error('attendance cloud boot',e);renderStatus('تعذر الاتصال المركزي؛ البيانات المحلية ما زالت محفوظة.');}
}

function loadFirebase(){
 var a=document.createElement('script');a.src='https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js';
 a.onload=function(){
  var f=document.createElement('script');f.src='https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js';
  f.onload=function(){
   var s=document.createElement('script');s.src='https://www.gstatic.com/firebasejs/10.14.1/firebase-storage-compat.js';
   s.onload=boot;s.onerror=boot;document.head.appendChild(s);
  };
  f.onload=f.onload;document.head.appendChild(f);
 };
 document.head.appendChild(a);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadFirebase);else loadFirebase();
})();