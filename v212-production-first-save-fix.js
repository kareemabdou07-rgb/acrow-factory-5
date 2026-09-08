(function(){
'use strict';
var timers=new WeakMap();
function isProd(el){return el&&el.tagName==='INPUT'&&el.type==='number'&&el.classList.contains('actual-input');}
function cloudSave(){try{if(window.__acrowV198Sync&&window.__acrowV198Sync.ref&&typeof store!=='undefined'&&window.firebase){return window.__acrowV198Sync.ref.set({data:store,updatedAt:firebase.firestore.FieldValue.serverTimestamp()});}}catch(e){}return Promise.resolve();}
function mark(input,btn){if(input)input.classList.add('v212-production-saved');if(btn){btn.textContent='تم التثبيت';btn.classList.add('v212-saved');clearTimeout(timers.get(btn));timers.set(btn,setTimeout(function(){if(btn&&btn.isConnected){btn.textContent='تثبيت';btn.classList.remove('v212-saved');}},5000));}}
function commit(input,btn){if(!isProd(input)||input.value==='')return;if(btn.dataset.busy==='1')return;btn.dataset.busy='1';var typed=input.value;mark(input,btn);try{document.body.dataset.v198RemotePending='1';}catch(e){}
try{input.dispatchEvent(new Event('input',{bubbles:true}));}catch(e){}
try{input.dispatchEvent(new Event('change',{bubbles:true}));}catch(e){}
try{if(input.value!==typed)input.value=typed;}catch(e){}
try{if(typeof saveStore==='function')saveStore();}catch(e){}
setTimeout(function(){cloudSave().then(function(){try{delete document.body.dataset.v198RemotePending;}catch(e){}btn.dataset.busy='';}).catch(function(){try{delete document.body.dataset.v198RemotePending;}catch(e){}btn.dataset.busy='';});},80);
}
function bind(input){if(!isProd(input)||input.dataset.v212==='1')return;input.dataset.v212='1';input.addEventListener('input',function(){input.classList.remove('v212-production-saved');});var row=input.closest('.mc-row');if(!row)return;var old=row.querySelector('.v205-save-btn');if(old)old.remove();var btn=document.createElement('button');btn.type='button';btn.className='v205-save-btn';btn.textContent='تثبيت';btn.title='تثبيت إنتاج هذه الماكينة';btn.addEventListener('pointerdown',function(e){e.preventDefault();e.stopPropagation();var current=row.querySelector('input.actual-input[type="number"]')||input;commit(current,btn);});btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();});row.appendChild(btn);}
function scan(){document.querySelectorAll('input.actual-input[type="number"]').forEach(bind);}
var css=document.createElement('style');css.textContent='.v205-save-btn{flex:0 0 auto;min-width:82px;padding:9px 12px;border:1px solid #7fb9d8;border-radius:8px;background:#b9dff2;color:#123;font-family:Tajawal,sans-serif;font-size:13px;font-weight:900;cursor:pointer;white-space:nowrap}.v205-save-btn.v212-saved{background:#25e58f!important;color:#073b24!important;border-color:#16a34a!important}.mc-row input.v212-production-saved{background:#16352a!important;border-color:#25e58f!important;color:#25e58f!important;box-shadow:0 0 0 2px rgba(37,229,143,.18),inset 0 0 10px rgba(37,229,143,.08)!important}';document.head.appendChild(css);
function init(){scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

/* v213: fix decimal shift hours (e.g. 7.5) in the Edit screen. */
function findShiftBox(){
  var nodes=[].slice.call(document.querySelectorAll('label,div,span,h3,h4'));
  for(var i=0;i<nodes.length;i++){
    var t=((nodes[i].innerText||nodes[i].textContent||'').replace(/\s+/g,' ').trim());
    if(t.indexOf('طول الوردية')!==-1){var m=nodes[i].closest('.modal,.modal-overlay');if(m)return m;}
  }
  return null;
}
function shiftInputs(){var b=findShiftBox();if(!b)return [];return [].slice.call(b.querySelectorAll('input')).slice(0,2);}
function prepareShiftInputs(){shiftInputs().forEach(function(x){x.type='number';x.step='0.1';x.min='0';x.inputMode='decimal';});}
function setShiftValues(vals){
  try{
    if(typeof store==='undefined'||!store)return;
    var seen=[];
    function walk(o){if(!o||typeof o!=='object'||seen.indexOf(o)!==-1)return;seen.push(o);Object.keys(o).forEach(function(k){var v=o[k];if(typeof v==='number'&&/shift|hour|hours|duration|وردية|ساع/i.test(k))candidates.push({o:o,k:k,v:v});else if(v&&typeof v==='object')walk(v);});}
    var candidates=[];walk(store);
    vals.forEach(function(v){var n=Number(String(v).replace(',','.'));if(!isFinite(n))return;var hit=candidates.find(function(c){return Math.abs(Number(c.v)-n)<0.000001;});if(hit)hit.o[hit.k]=n;});
  }catch(e){}
}
function bindShiftSave(){
  var b=findShiftBox();if(!b)return;
  var btn=[].slice.call(b.querySelectorAll('button')).find(function(x){return ((x.innerText||x.textContent||'').indexOf('حفظ التعديلات')!==-1);});
  if(!btn||btn.dataset.v213==='1')return;btn.dataset.v213='1';
  btn.addEventListener('click',function(){var vals=shiftInputs().map(function(x){return x.value;});setTimeout(function(){setShiftValues(vals);try{if(typeof saveStore==='function')saveStore();}catch(e){}try{cloudSave();}catch(e){}},100);},false);
}
function scanShiftFix(){prepareShiftInputs();bindShiftSave();}
scanShiftFix();
new MutationObserver(scanShiftFix).observe(document.body,{childList:true,subtree:true});
})();