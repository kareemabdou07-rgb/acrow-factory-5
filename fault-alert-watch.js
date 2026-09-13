/* ACROW Factory 5 — v220: notify when a fault is opened or repaired */
(function(){
'use strict';
var last={};
function key(x){return String(x.key)+'#'+String(x.index)+'#'+String(x.f.id||'');}
function scan(){
  if(typeof store==='undefined'||!store.records)return;
  Object.keys(store.records).forEach(function(k){var r=store.records[k]||{};(r.faults||[]).forEach(function(f,i){var id=key({key:k,index:i,f:f});var state=f.endTime?'done':'open';if(!last[id]){last[id]=state;return;}if(last[id]!==state){last[id]=state;var msg=state==='open'?'يوجد عطل جديد — رجاء الإصلاح':'تم إصلاح العطل — شكرًا';if(typeof window.showFaultToast==='function')window.showFaultToast(msg);else{var t=document.getElementById('acrowFaultToast');if(t){t.textContent=msg;t.classList.add('show');setTimeout(function(){t.classList.remove('show');},4200);}}try{if('Notification' in window&&Notification.permission==='granted')new Notification('ACROW Factory 5',{body:msg});}catch(e){}try{if(navigator.vibrate)navigator.vibrate([120,70,120]);}catch(e){}}});});
}
setInterval(scan,1200);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan);else scan();
})();
