/* ACROW Factory 5 — v222: fault screen button reliably above daily machine selection */
(function(){
'use strict';
function make(){
 var old=document.getElementById('faultScreenBtn');
 if(old) return old;
 var b=document.createElement('button');
 b.id='faultScreenBtn'; b.type='button'; b.textContent='شاشة الأعطال';
 b.className='select-machines-btn';
 b.style.cssText='display:flex!important;width:100%!important;box-sizing:border-box!important;justify-content:center!important;align-items:center!important;margin:8px 0 12px!important;background:#0f6fff!important;color:#fff!important;border:0!important;position:relative!important;z-index:50!important;';
 b.onclick=function(e){
  e.preventDefault(); e.stopPropagation();
  if(typeof window.showFaultLog==='function') window.showFaultLog();
  else {var s=document.getElementById('acrowFaultLogScreen'); if(s){s.style.display='block';s.scrollIntoView({behavior:'smooth',block:'start'});}}
 };
 return b;
}
function add(){
 var b=make();
 var anchor=document.getElementById('machineSelectList');
 if(anchor&&anchor.parentNode){
  if(b.parentNode!==anchor.parentNode || b.nextSibling!==anchor) anchor.parentNode.insertBefore(b,anchor);
  return;
 }
 var els=document.querySelectorAll('h1,h2,h3,h4,h5,h6,div,p,label,span,button');
 for(var i=0;i<els.length;i++){
  var t=(els[i].textContent||'').replace(/\s+/g,' ').trim();
  if(t.indexOf('اختيار الماكينات المنتجة اليوم')>=0 || t.indexOf('الماكينات المنتجة اليوم')>=0){
   if(els[i].parentNode){els[i].parentNode.insertBefore(b,els[i]);return;}
  }
 }
 if(!b.parentNode && document.body) document.body.insertBefore(b,document.body.firstChild);
}
function boot(){add();[100,300,700,1200,2000,4000].forEach(function(t){setTimeout(add,t);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
if(window.MutationObserver)new MutationObserver(add).observe(document.documentElement,{childList:true,subtree:true});
setInterval(add,1200);
})();
