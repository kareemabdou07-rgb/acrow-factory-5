/* ACROW Factory 5 — v23: place obstacle registration beside machine fault button */
(function(){
'use strict';
function style(){
 if(document.getElementById('acrow-v23-style')) return;
 var s=document.createElement('style'); s.id='acrow-v23-style';
 s.textContent='.acrow-v23-obstacle{display:inline-block!important;width:auto!important;margin:0 0 0 6px!important;padding:7px 10px!important}.acrow-v23-actions{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:7px}.acrow-v23-actions button{margin:0!important;width:auto!important}';
 document.head.appendChild(s);
}
function add(){
 document.querySelectorAll('.machine-card').forEach(function(card){
  var old=card.querySelector('.acrow-v22-btn');
  if(!old)return;
  old.classList.add('acrow-v23-obstacle');
  old.textContent='تسجيل معوقات الإنتاج';
  var fault=card.querySelector('[id*="fault" i],button[onclick*="fault" i],button[data-fault]');
  var anchor=fault;
  if(!anchor){
   var buttons=card.querySelectorAll('button');
   for(var i=0;i<buttons.length;i++){
    var t=(buttons[i].textContent||'').trim();
    if(t.indexOf('تسجيل العطل')!==-1 || t.indexOf('الأعطال')!==-1){anchor=buttons[i];break}
   }
  }
  if(anchor){
   var parent=anchor.parentElement;
   if(parent){
    if(!parent.classList.contains('acrow-v23-actions')){
     var wrap=document.createElement('div');wrap.className='acrow-v23-actions';
     parent.insertBefore(wrap,anchor);wrap.appendChild(anchor);wrap.appendChild(old);
    }
   }
  }
 });
}
function start(){style();add();setTimeout(add,300);setTimeout(add,1000);new MutationObserver(add).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
