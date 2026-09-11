/* ACROW Factory 5 v72 — larger fault action buttons */
(function(){
'use strict';
if(window.__acrowFaultRepairDeleteV72)return;
window.__acrowFaultRepairDeleteV72=true;
var fired=0;
function style(){
 var id='acrow-fault-touch-v72';if(document.getElementById(id))return;
 var s=document.createElement('style');s.id=id;s.textContent=`
.fault-item button,.fault-item a,.fault-list button,.fault-list a{touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important;pointer-events:auto!important;}
.acrow-fault-action-v72{min-width:135px!important;min-height:54px!important;height:54px!important;padding:10px 18px!important;font-size:18px!important;font-weight:900!important;line-height:1.2!important;border-radius:10px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;cursor:pointer!important;touch-action:manipulation!important;pointer-events:auto!important;box-sizing:border-box!important;}
.fault-item .f-del.acrow-fault-action-v72{min-width:135px!important;}
`;
 document.head.appendChild(s);
}
function target(e){
 var b=e.target&&e.target.closest?e.target.closest('.fault-list button,.fault-list a,.fault-item button,.fault-item a'):null;
 if(!b)return null;
 var t=String(b.textContent||'').replace(/\s+/g,' ').trim();
 var del=b.classList.contains('f-del')||/^حذف(?: العطل)?$|^مسح$/.test(t);
 var repair=/^تم\s*الإصلاح$|^تم\s*الاصلاح$|^إصلاح$|^اصلاح$/.test(t);
 if(!del&&!repair)return null;
 b.classList.add('acrow-fault-action-v72');
 return b;
}
function scan(root){
 (root||document).querySelectorAll('.fault-list button,.fault-list a,.fault-item button,.fault-item a').forEach(function(b){
  var t=String(b.textContent||'').replace(/\s+/g,' ').trim();
  if(b.classList.contains('f-del')||/^حذف(?: العطل)?$|^مسح$|^تم\s*الإصلاح$|^تم\s*الاصلاح$|^إصلاح$|^اصلاح$/.test(t)) b.classList.add('acrow-fault-action-v72');
 });
}
function handle(e){
 var b=target(e);if(!b)return;
 var now=Date.now();
 if(now-fired<500){e.preventDefault();e.stopImmediatePropagation();return;}
 fired=now;
 e.preventDefault();e.stopPropagation();
 if(e.stopImmediatePropagation)e.stopImmediatePropagation();
 try{HTMLElement.prototype.click.call(b);}catch(x){try{b.click();}catch(y){}}
}
style();
scan();
document.addEventListener('pointerdown',handle,true);
document.addEventListener('touchstart',handle,true);
document.addEventListener('click',function(e){target(e);},true);
if(window.MutationObserver){new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes&&m.addedNodes.forEach(function(n){if(n.nodeType===1)scan(n);});});}).observe(document.body,{childList:true,subtree:true});}
})();
