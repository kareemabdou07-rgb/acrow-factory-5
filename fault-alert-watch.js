/* ACROW Factory 5 — v259: restore sound for opened and repaired faults */
(function(){
'use strict';
var last={};
var audioCtx=null;
function key(x){return String(x.key)+'#'+String(x.index)+'#'+String(x.f.id||'');}
function unlockAudio(){
  try{
    var C=window.AudioContext||window.webkitAudioContext;
    if(!C)return;
    if(!audioCtx)audioCtx=new C();
    if(audioCtx.state==='suspended')audioCtx.resume();
  }catch(e){}
}
try{
  ['pointerdown','touchstart','click'].forEach(function(ev){
    document.addEventListener(ev,unlockAudio,{once:true,capture:true});
  });
}catch(e){}
function soundAlert(msg,isOpen){
  try{
    var C=window.AudioContext||window.webkitAudioContext;
    if(C){
      if(!audioCtx)audioCtx=new C();
      if(audioCtx.state==='suspended')audioCtx.resume();
      var o=audioCtx.createOscillator(),g=audioCtx.createGain();
      o.type='sine';
      o.frequency.value=isOpen?880:660;
      g.gain.setValueAtTime(.0001,audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(.22,audioCtx.currentTime+.03);
      g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.55);
      o.connect(g);g.connect(audioCtx.destination);
      o.start();o.stop(audioCtx.currentTime+.6);
    }
  }catch(e){}
  try{
    if('speechSynthesis' in window){
      window.speechSynthesis.cancel();
      var u=new SpeechSynthesisUtterance(msg);
      u.lang='ar-EG';u.rate=.95;u.pitch=1;
      window.speechSynthesis.speak(u);
    }
  }catch(e){}
}
function scan(){
  if(typeof store==='undefined'||!store.records)return;
  Object.keys(store.records).forEach(function(k){
    var r=store.records[k]||{};
    (r.faults||[]).forEach(function(f,i){
      var id=key({key:k,index:i,f:f});
      var state=f.endTime?'done':'open';
      if(!last[id]){last[id]=state;return;}
      if(last[id]!==state){
        last[id]=state;
        var msg=state==='open'?'يوجد عطل جديد — رجاء الإصلاح':'تم إصلاح العطل — شكرًا';
        soundAlert(msg,state==='open');
        if(typeof window.showFaultToast==='function')window.showFaultToast(msg);
        else{
          var t=document.getElementById('acrowFaultToast');
          if(t){
            t.textContent=msg;
            t.classList.add('show');
            setTimeout(function(){t.classList.remove('show');},4200);
          }
        }
        try{
          if('Notification' in window&&Notification.permission==='granted')new Notification('ACROW Factory 5',{body:msg});
        }catch(e){}
        try{
          if(navigator.vibrate)navigator.vibrate([120,70,120]);
        }catch(e){}
      }
    });
  });
}
setInterval(scan,1200);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan);else scan();
})();
