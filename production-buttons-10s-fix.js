/* ACROW Factory 5 — production buttons stay stable for 10 seconds */
(function(){
'use strict';
var LOCK_MS=10000;
var STYLE_ID='acrow-production-buttons-10s-v1';
var activeUntil=0;
function addStyle(){
 if(document.getElementById(STYLE_ID))return;
 var s=document.createElement('style');s.id=STYLE_ID;
 s.textContent=`
body.acrow-production-10s-lock .topbar,
body.acrow-production-10s-lock .top-main-action,
body.acrow-production-10s-lock .shift-controls,
body.acrow-production-10s-lock .mc-row,
body.acrow-production-10s-lock .mc-bottom,
body.acrow-production-10s-lock .actual-input{transition:none!important;animation:none!important;}
body.acrow-production-10s-lock .topbar{position:sticky!important;top:0!important;z-index:60!important;}
body.acrow-production-10s-lock .top-main-action,
body.acrow-production-10s-lock .mc-btn{visibility:visible!important;opacity:1!important;}
.top-main-action{width:auto!important;min-width:0!important;max-width:180px!important;padding:8px 14px!important;font-size:13px!important;line-height:1.2!important;flex:0 1 auto!important;box-sizing:border-box!important;}
`;
 document.head.appendChild(s);
}
function lock(){
 addStyle();
 activeUntil=Date.now()+LOCK_MS;
 document.body.classList.add('acrow-production-10s-lock');
 clearTimeout(window.__acrowProduction10sTimer);
 window.__acrowProduction10sTimer=setTimeout(function(){document.body.classList.remove('acrow-production-10s-lock');},LOCK_MS+50);
}
function isProductionInput(el){return !!(el&&el.closest&&el.closest('.actual-input'));}
function watchProduction(){
 if(window.__acrowProduction10sBound)return;
 window.__acrowProduction10sBound=true;
 document.addEventListener('focusin',function(e){if(isProductionInput(e.target))lock();},true);
 document.addEventListener('click',function(e){var t=e.target&&e.target.closest?e.target.closest('.actual-input,.top-main-action,.mc-btn'):null;if(t)lock();},true);
 var observer=new MutationObserver(function(){var input=document.querySelector('.actual-input:focus');if(input&&Date.now()>activeUntil)lock();});
 observer.observe(document.body,{childList:true,subtree:true});
}
function boot(){addStyle();watchProduction();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

/* ACROW Factory 5 — v223: stabilize only the five fixed daily-production machines */
(function(){
'use strict';
var EXTRA_DAILY=[
 {id:'2',name:'مكبس فريم كونكتور'},
 {id:'8',name:'تليسكوب'},
 {id:'9',name:'شور برس'},
 {id:'10',name:'اسبيجوت'},
 {id:'forming-frame',name:'فريم تشكيل'}
];
var IDS=EXTRA_DAILY.map(function(x){return String(x.id);});
function sid(v){return String(v==null?'':v).trim();}
function isFixed(id){return IDS.indexOf(sid(id))>=0;}
function ensureData(){
 try{
  if(typeof DEPARTMENTS!=='undefined'&&Array.isArray(DEPARTMENTS)&&!DEPARTMENTS.some(function(d){return d&&d.id==='daily'}))
   DEPARTMENTS.push({id:'daily',name:'ماكينات إنتاج اليوم',target:0,count:5,prefix:'PD'});
  if(typeof MACHINES!=='undefined'&&Array.isArray(MACHINES))EXTRA_DAILY.forEach(function(x){
   var i=MACHINES.findIndex(function(m){return sid(m&&m.id)===sid(x.id);});
   if(i<0)MACHINES.push({id:x.id,name:x.name,dept:'daily',deptName:'ماكينات إنتاج اليوم',target:null});
   else{MACHINES[i].name=x.name;MACHINES[i].dept='daily';MACHINES[i].deptName='ماكينات إنتاج اليوم';}
  });
 }catch(e){}
}
function box(){return document.getElementById('machineSelectList');}
function addMissingRows(){
 var b=box();if(!b)return false;
 var inputs=b.querySelectorAll('input[type="checkbox"][data-machine]');
 var have={};inputs.forEach(function(cb){have[sid(cb.getAttribute('data-machine'))]=true;});
 var added=false;
 EXTRA_DAILY.forEach(function(x){
  if(have[sid(x.id)])return;
  var row=document.createElement('label');
  row.className='fav-checkbox-row';
  row.setAttribute('data-acrow-fixed-daily','1');
  row.innerHTML='<input type="checkbox" data-machine="'+x.id+'" checked><span>'+x.name+'</span>';
  b.appendChild(row);added=true;
 });
 return added;
}
function keepFiveChecked(){
 var b=box();if(!b)return;
 b.querySelectorAll('input[type="checkbox"][data-machine]').forEach(function(cb){
  if(isFixed(cb.getAttribute('data-machine')))cb.checked=true;
 });
}
function readChecked(){
 var b=box(),a=[];if(!b)return a;
 b.querySelectorAll('input[type="checkbox"][data-machine]:checked').forEach(function(cb){
  var id=sid(cb.getAttribute('data-machine'));if(id&&a.indexOf(id)<0)a.push(id);
 });
 return a;
}
function persist(){
 var a=readChecked();
 IDS.forEach(function(id){if(a.indexOf(id)<0)a.push(id);});
 try{localStorage.setItem('acrow_daily_favorites_override',JSON.stringify(a));}catch(e){}
 try{if(typeof store!=='undefined')store.favorites=a;if(typeof saveStore==='function')saveStore();}catch(e){}
}
function repair(){
 ensureData();
 var b=box();if(!b)return;
 var added=addMissingRows();
 keepFiveChecked();
 if(added||!window.__acrow223SavedOnce){persist();window.__acrow223SavedOnce=true;}
}
function bind(b){
 if(!b||b.__acrow223Bound)return;
 b.__acrow223Bound=true;
 b.addEventListener('click',function(e){
  var cb=e.target&&e.target.closest?e.target.closest('input[type="checkbox"][data-machine]'):null;
  if(cb&&isFixed(cb.getAttribute('data-machine'))){
   e.preventDefault();
   e.stopPropagation();
   cb.checked=true;
   persist();
  }
 },true);
 b.addEventListener('change',function(e){
  var cb=e.target&&e.target.matches&&e.target.matches('input[type="checkbox"][data-machine]')?e.target:null;
  if(!cb)return;
  if(isFixed(cb.getAttribute('data-machine'))){
   e.stopPropagation();
   cb.checked=true;
  }
  persist();
 },true);
}
function stabilize(){
 var b=box();if(!b)return;
 repair();
 bind(b);
}
function boot(){
 ensureData();
 stabilize();
 [250,750,1500].forEach(function(t){setTimeout(stabilize,t);});
 var lastBox=null;
 var obs=new MutationObserver(function(){
  var b=box();
  if(!b)return;
  if(b!==lastBox){lastBox=b;stabilize();return;}
  var fixedMissing=false;
  IDS.forEach(function(id){if(!b.querySelector('input[type="checkbox"][data-machine="'+id+'"]'))fixedMissing=true;});
  if(fixedMissing)stabilize();
 });
 lastBox=box();
 obs.observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
