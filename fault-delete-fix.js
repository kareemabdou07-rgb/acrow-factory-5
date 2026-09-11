/* ACROW Factory 5 v71 — first-touch trigger for existing fault buttons */
(function(){
'use strict';
if(window.__acrowFaultRepairDeleteV71)return;
window.__acrowFaultRepairDeleteV71=true;
var fired=0;
function style(){
 var id='acrow-fault-touch-v71';if(document.getElementById(id))return;
 var s=document.createElement('style');s.id=id;s.textContent='.fault-item button,.fault-item a,.fault-list button,.fault-list a{touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important;pointer-events:auto!important;}';document.head.appendChild(s);
}
function target(e){
 var b=e.target&&e.target.closest?e.target.closest('.fault-list button,.fault-list a,.fault-item button,.fault-item a'):null;
 if(!b)return null;
 var t=String(b.textContent||'').replace(/\s+/g,' ').trim();
 var del=b.classList.contains('f-del')||/^حذف(?: العطل)?$|^مسح$/.test(t);
 var repair=/^تم\s*الإصلاح$|^تم\s*الاصلاح$|^إصلاح$|^اصلاح$/.test(t);
 return (del||repair)?b:null;
}
function handle(e){
 var b=target(e);if(!b)return;
 var now=Date.now();
 if(now-fired<500){e.preventDefault();e.stopImmediatePropagation();return;}
 fired=now;
 e.preventDefault();
 e.stopPropagation();
 if(e.stopImmediatePropagation)e.stopImmediatePropagation();
 try{HTMLElement.prototype.click.call(b);}catch(x){try{b.click();}catch(y){}}
}
style();
document.addEventListener('pointerdown',handle,true);
document.addEventListener('touchstart',handle,true);
})();