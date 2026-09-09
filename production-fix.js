/* ACROW Factory 5 — stable production entry v6: yellow before entry, continuous yellow-green blink after entry */
(function(){
'use strict';
var STYLE_ID='acrow-production-stable-style-v6';
var blinkTimer=null;
var blinkPhase=false;
function style(){
 if(document.getElementById(STYLE_ID))return;
 var s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
.actual-input{pointer-events:auto!important;touch-action:manipulation!important;position:relative!important;z-index:2!important;-webkit-user-select:text!important;user-select:text!important;background:#fff3b0!important;border:3px solid #e0ad00!important;color:#4a3900!important;box-shadow:none!important;transition:none!important;}
.actual-input.acrow-fixed{box-shadow:none!important;}
.acrow-production-row{display:flex!important;align-items:center!important;gap:8px!important;width:100%!important;}
.acrow-production-row .actual-input{flex:1 1 auto!important;min-width:0!important;}
.acrow-production-row .production-fix-btn-v2{display:none!important;}
`;
 document.head.appendChild(s);
}
function rec(id){try{return typeof getRecord==='function'&&typeof dateInput!=='undefined'?getRecord(dateInput.value,currentShift,id):null}catch(e){return null}}
function setColor(input,green){
 input.style.setProperty('background-color',green?'#b9f3d1':'#fff3b0','important');
 input.style.setProperty('border-color',green?'#159957':'#e0ad00','important');
 input.style.setProperty('color',green?'#063b22':'#4a3900','important');
}
function paint(input,r){
 var has=String(input.value||'').trim()!=='';
 input.classList.toggle('acrow-fixed',has);
 if(has)setColor(input,blinkPhase);else setColor(input,false);
 if(r)r.productionFixed=has;
}
function decorate(root){
 style();
 (root||document).querySelectorAll('.actual-input').forEach(function(input){
  var row=input.closest('.mc-row')||input.parentElement;if(row)row.classList.add('acrow-production-row');
  paint(input,rec(String(input.dataset.machine||'').trim()));
 });
}
function blinkTick(){
 blinkPhase=!blinkPhase;
 document.querySelectorAll('.actual-input.acrow-fixed').forEach(function(input){setColor(input,blinkPhase);});
}
function startBlink(){
 if(blinkTimer)return;
 blinkTimer=setInterval(blinkTick,700);
}
document.addEventListener('input',function(e){
 var input=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(!input)return;
 e.stopImmediatePropagation();
 var r=rec(String(input.dataset.machine||'').trim());
 if(r){r.actual=input.value===''?null:Number(input.value);r.productionFixed=input.value!=='';}
 if(String(input.value||'').trim()!==''){
  input.classList.add('acrow-fixed');
  blinkPhase=false;
  setColor(input,false);
  startBlink();
 }else{
  input.classList.remove('acrow-fixed');
  setColor(input,false);
 }
},true);
document.addEventListener('change',function(e){
 var input=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(!input)return;
 var r=rec(String(input.dataset.machine||'').trim());
 if(r){r.actual=input.value===''?null:Number(input.value);r.productionFixed=input.value!=='';try{saveStore()}catch(x){}}
 paint(input,r);
},true);
document.addEventListener('blur',function(e){
 var input=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(!input)return;
 var r=rec(String(input.dataset.machine||'').trim());
 if(r){r.actual=input.value===''?null:Number(input.value);r.productionFixed=input.value!=='';try{saveStore()}catch(x){}}
 paint(input,r);
},true);
function watch(){
 if(!window.MutationObserver)return;
 var ob=new MutationObserver(function(list){
  list.forEach(function(m){m.addedNodes&&m.addedNodes.forEach(function(n){if(n.nodeType===1)decorate(n);});});
 });
 ob.observe(document.body,{childList:true,subtree:true});
}
function start(){style();decorate();startBlink();watch();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
