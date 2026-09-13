/* ACROW Factory 5 — v220: fault log screen + new/repair alerts + photo/voice buttons */
(function(){
'use strict';
var screenId='acrowFaultLogScreen';
var selected=null;
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function allFaults(){
  var out=[]; if(typeof store==='undefined'||!store.records)return out;
  Object.keys(store.records).forEach(function(k){var r=store.records[k]||{}; (r.faults||[]).forEach(function(f,i){out.push({key:k,index:i,f:f,machine:r.machine||k,date:f.date||k});});});
  out.sort(function(a,b){return String(b.f.date||b.date).localeCompare(String(a.f.date||a.date)) || String(b.f.time||'').localeCompare(String(a.f.time||''));});
  return out;
}
function toast(msg){var t=document.getElementById('acrowFaultToast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(function(){t.classList.remove('show');},4200);}
function notify(msg){toast(msg);try{if('Notification' in window&&Notification.permission==='granted')new Notification('ACROW Factory 5',{body:msg});}catch(e){} try{if(navigator.vibrate)navigator.vibrate([120,70,120]);}catch(e){}}
function faultStatus(f){return f.endTime?'تم الإصلاح':'يوجد عطل جديد — رجاء الإصلاح';}
function render(){var root=document.getElementById(screenId);if(!root)return;var rows=allFaults();
  root.innerHTML='<div class="afl-head"><div><h2>شاشة الأعطال</h2><div class="afl-sub">سجل الأعطال المسجلة والصوت والصور</div></div><button id="aflClose">رجوع</button></div>'+
  '<div class="afl-alert">'+(rows.some(function(x){return !x.f.endTime;})?'يوجد عطل جديد — رجاء الإصلاح':'لا توجد أعطال مفتوحة')+'</div>'+
  '<div class="afl-list">'+(rows.length?rows.map(function(x,n){var f=x.f,open=!f.endTime;return '<div class="afl-card '+(open?'open':'done')+'" data-n="'+n+'"><div class="afl-row"><b>ماكينة '+esc(x.machine)+'</b><span>'+esc(open?'يوجد عطل جديد — رجاء الإصلاح':'تم الإصلاح')+'</span></div><div class="afl-main">'+esc(f.reason||'عطل')+'</div><div class="afl-meta">'+esc(f.date||'')+' — '+esc(f.time||'')+' — الوردية '+esc(f.shift||'')+(f.mins?' — '+esc(f.mins)+' دقيقة':'')+'</div><div class="afl-desc">'+esc(f.description||f.notes||'')+'</div><div class="afl-media">'+(f.photo?'<img src="'+f.photo+'" alt="صورة العطل">':'')+(f.audio?'<audio controls src="'+f.audio+'"></audio>':'')+'</div><div class="afl-actions"><button class="afl-open" data-n="'+n+'">تفاصيل العطل</button><button class="afl-photo" data-n="'+n+'">إضافة صورة</button><button class="afl-voice" data-n="'+n+'">تسجيل صوت</button></div></div>';}).join(''):'<div class="afl-empty">لا توجد أعطال مسجلة حتى الآن</div>')+'</div>';
  document.getElementById('aflClose').onclick=function(){root.style.display='none';};
  root.querySelectorAll('.afl-open').forEach(function(b){b.onclick=function(){selected=rows[+b.dataset.n]; if(selected&&typeof showFaultDetails==='function')showFaultDetails(selected.machine,selected.f,{date:selected.date,shift:selected.f.shift});};});
  root.querySelectorAll('.afl-photo').forEach(function(b){b.onclick=function(){selected=rows[+b.dataset.n];capturePhoto();};});
  root.querySelectorAll('.afl-voice').forEach(function(b){b.onclick=function(){selected=rows[+b.dataset.n];recordVoice();};});
}
function save(){try{if(typeof saveStore==='function')saveStore();}catch(e){}}
function capturePhoto(){if(!selected)return;var inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.capture='environment';inp.onchange=function(){var file=inp.files&&inp.files[0];if(!file)return;var rd=new FileReader();rd.onload=function(){var im=new Image();im.onload=function(){var c=document.createElement('canvas'),max=900,w=im.width,h=im.height;if(w>max){h=Math.round(h*max/w);w=max;}c.width=w;c.height=h;c.getContext('2d').drawImage(im,0,0,w,h);var data=c.toDataURL('image/jpeg',.55);selected.f.photo=data;save();render();toast('تم حفظ صورة العطل');};im.src=rd.result;};rd.readAsDataURL(file);};inp.click();}
function recordVoice(){if(!selected)return;if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!window.MediaRecorder){toast('تسجيل الصوت غير مدعوم على هذا الجهاز');return;}var chunks=[];navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){var rec=new MediaRecorder(stream);rec.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data);};rec.onstop=function(){stream.getTracks().forEach(function(t){t.stop();});var blob=new Blob(chunks,{type:rec.mimeType||'audio/webm'});if(blob.size>220000){toast('التسجيل طويل؛ سجل صوتًا أقصر من فضلك');return;}var rd=new FileReader();rd.onload=function(){selected.f.audio=rd.result;save();render();toast('تم حفظ تسجيل صوت العطل');};rd.readAsDataURL(blob);};rec.start();toast('جارٍ تسجيل الصوت — اضغط إيقاف التسجيل');var stop=document.createElement('button');stop.id='aflStopVoice';stop.textContent='إيقاف التسجيل';stop.className='afl-stop';document.body.appendChild(stop);stop.onclick=function(){if(rec.state!=='inactive')rec.stop();stop.remove();};setTimeout(function(){if(rec.state!=='inactive'){rec.stop();if(stop.parentNode)stop.remove();}},15000);}).catch(function(){toast('لم يتم السماح باستخدام الميكروفون');});}
function openScreen(){var root=document.getElementById(screenId);if(!root){root=document.createElement('section');root.id=screenId;document.body.appendChild(root);}root.style.display='block';render();try{if('Notification' in window&&Notification.permission==='default')Notification.requestPermission();}catch(e){}root.scrollIntoView({behavior:'smooth',block:'start'});}
function watch(){
  if(typeof window.showFaultLog==='undefined')window.showFaultLog=openScreen;
  var b=document.getElementById('maintenanceBtn');if(b&&!b.dataset.afl){b.dataset.afl='1';b.addEventListener('click',function(){setTimeout(openScreen,80);},false);}
}
function style(){if(document.getElementById('aflStyle'))return;var s=document.createElement('style');s.id='aflStyle';s.textContent='#'+screenId+'{display:none;position:relative;z-index:60;max-width:1200px;margin:18px auto;padding:18px;background:#0f1b29;border:1px solid #2b4054;border-radius:14px;color:#e9edf1}#'+screenId+' .afl-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px}#'+screenId+' h2{font-size:22px}#'+screenId+' .afl-sub{color:#8b98a5;font-size:12px;margin-top:4px}#'+screenId+' button{background:linear-gradient(135deg,#0f6fff,#20b8ff);color:#fff;border:0;border-radius:8px;padding:9px 13px;font-weight:700;cursor:pointer}#'+screenId+' .afl-alert{padding:12px;border-radius:10px;background:#3a3018;border:1px solid #ffd34d;color:#ffd34d;margin-bottom:14px;font-weight:800}#'+screenId+' .afl-card{background:#111d2b;border:1px solid #2b4054;border-radius:12px;padding:14px;margin-bottom:10px}#'+screenId+' .afl-card.open{border-color:#ff5f6d}#'+screenId+' .afl-card.done{border-color:#25e58f}#'+screenId+' .afl-row{display:flex;justify-content:space-between;gap:10px}#'+screenId+' .afl-row span{font-weight:800}#'+screenId+' .open .afl-row span{color:#ff5f6d}#'+screenId+' .done .afl-row span{color:#25e58f}#'+screenId+' .afl-main{font-size:17px;font-weight:800;margin-top:9px}#'+screenId+' .afl-meta,#'+screenId+' .afl-desc{color:#aab5c0;font-size:12px;margin-top:6px}#'+screenId+' .afl-media{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px}#'+screenId+' .afl-media img{max-width:180px;max-height:130px;border-radius:8px;border:1px solid #2b4054}#'+screenId+' audio{max-width:260px}#'+screenId+' .afl-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:12px}#'+screenId+' .afl-actions button{font-size:12px}.afl-stop{position:fixed;bottom:25px;left:50%;transform:translateX(-50%);z-index:9999;background:#ff5f6d!important;color:#fff!important;font-size:16px;box-shadow:0 4px 20px rgba(0,0,0,.35)}#acrowFaultToast{position:fixed;right:18px;bottom:18px;z-index:10000;background:#18283a;border:1px solid #20b8ff;color:#fff;padding:13px 16px;border-radius:10px;display:none;font-weight:700}#acrowFaultToast.show{display:block}';document.head.appendChild(s);var t=document.createElement('div');t.id='acrowFaultToast';document.body.appendChild(t);}
function boot(){style();watch();setTimeout(watch,500);setTimeout(watch,1500);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
if(window.MutationObserver)new MutationObserver(watch).observe(document.documentElement,{childList:true,subtree:true});
setInterval(function(){watch();},1800);
})();

/* v231: زر شاشة الأعطال ثابت داخل الشاشة الرئيسية فوق اختيار الماكينات المنتجة اليوم */
(function(){
'use strict';
function addNativeFaultButton(){
  try{
    var anchor=document.getElementById('machineSelectList');
    if(!anchor||!anchor.parentNode)return;
    var b=document.getElementById('acrowNativeFaultButton');
    if(!b){
      b=document.createElement('button');
      b.id='acrowNativeFaultButton';
      b.type='button';
      b.textContent='شاشة الأعطال';
      b.className='select-machines-btn';
      b.style.cssText='display:block!important;visibility:visible!important;opacity:1!important;width:100%!important;min-height:50px!important;margin:12px 0!important;padding:11px 16px!important;background:#0f6fff!important;color:#fff!important;border:0!important;border-radius:9px!important;font-family:Tajawal,sans-serif!important;font-size:17px!important;font-weight:800!important;cursor:pointer!important;position:relative!important;z-index:2147483647!important;box-shadow:0 3px 10px rgba(0,0,0,.25)!important;';
      b.onclick=function(e){e.preventDefault();e.stopPropagation();if(typeof window.showFaultLog==='function')window.showFaultLog();};
    }
    if(b.parentNode!==anchor.parentNode || b.nextElementSibling!==anchor){anchor.parentNode.insertBefore(b,anchor);}
  }catch(e){}
}
function bootNativeFaultButton(){addNativeFaultButton();[100,300,700,1200,2000,3500].forEach(function(t){setTimeout(addNativeFaultButton,t);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootNativeFaultButton);else bootNativeFaultButton();
if(window.MutationObserver)new MutationObserver(addNativeFaultButton).observe(document.documentElement,{childList:true,subtree:true});
setInterval(addNativeFaultButton,1000);
})();
