/* ACROW Factory 5 — v224: always-visible dedicated fault screen button */
(function(){'use strict';
function openFault(){if(typeof window.showFaultLog==='function')return window.showFaultLog();var s=document.getElementById('acrowFaultLogScreen');if(s){s.style.display='block';s.scrollIntoView({behavior:'smooth',block:'start'});}}
function add(){
 var b=document.getElementById('faultScreenBtn');
 if(!b){b=document.createElement('button');b.id='faultScreenBtn';b.type='button';b.textContent='شاشة الأعطال';b.className='select-machines-btn';b.onclick=function(e){e.preventDefault();e.stopPropagation();openFault();};}
 b.style.cssText='display:flex!important;position:relative!important;z-index:999!important;width:calc(100% - 24px)!important;max-width:900px!important;box-sizing:border-box!important;justify-content:center!important;align-items:center!important;margin:12px auto!important;padding:13px!important;background:#0f6fff!important;color:#fff!important;border:0!important;border-radius:10px!important;font-size:18px!important;font-weight:800!important;cursor:pointer!important;';
 var anchor=document.getElementById('machineSelectList');
 if(anchor&&anchor.parentNode){anchor.parentNode.insertBefore(b,anchor);return;}
 var els=document.querySelectorAll('h1,h2,h3,h4,h5,h6,div,p,label,span,button');
 for(var i=0;i<els.length;i++){var t=(els[i].textContent||'').replace(/\s+/g,' ').trim();if(t.indexOf('اختيار الماكينات المنتجة اليوم')>=0||t.indexOf('الماكينات المنتجة اليوم')>=0){if(els[i].parentNode){els[i].parentNode.insertBefore(b,els[i].nextSibling);return;}}}
 if(!b.parentNode&&document.body)document.body.insertBefore(b,document.body.firstChild);
}
function boot(){add();[100,300,700,1200,2000,4000].forEach(function(t){setTimeout(add,t);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
if(window.MutationObserver)new MutationObserver(function(){setTimeout(add,0);}).observe(document.documentElement,{childList:true,subtree:true});
setInterval(add,1200);
})();
