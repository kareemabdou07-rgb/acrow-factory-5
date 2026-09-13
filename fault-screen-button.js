/* ACROW Factory 5 — v221: dedicated fault screen button above daily machine selection */
(function(){
'use strict';
function add(){
 var anchor=document.getElementById('machineSelectList');
 if(!anchor) return;
 var host=anchor.parentElement;
 if(!host) return;
 var b=document.getElementById('faultScreenBtn');
 if(!b){
  b=document.createElement('button'); b.id='faultScreenBtn'; b.type='button'; b.textContent='شاشة الأعطال';
  b.className='select-machines-btn';
  b.style.cssText='width:100%;justify-content:center;margin:8px 0 12px;background:linear-gradient(135deg,#0f6fff,#20b8ff)!important;color:#fff!important;';
  b.onclick=function(e){e.preventDefault();e.stopPropagation();if(typeof window.showFaultLog==='function')window.showFaultLog();else {var s=document.getElementById('acrowFaultLogScreen');if(s){s.style.display='block';s.scrollIntoView({behavior:'smooth',block:'start'});}}};
  anchor.parentNode.insertBefore(b,anchor);
 }
}
function boot(){add();setTimeout(add,300);setTimeout(add,1000);setTimeout(add,2000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
if(window.MutationObserver)new MutationObserver(add).observe(document.documentElement,{childList:true,subtree:true});
setInterval(add,1500);
})();
