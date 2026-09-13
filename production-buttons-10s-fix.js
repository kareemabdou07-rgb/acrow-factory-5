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
body.acrow-production-10s-lock .actual-input{
 transition:none!important;
 animation:none!important;
}
body.acrow-production-10s-lock .topbar{position:sticky!important;top:0!important;z-index:60!important;}
body.acrow-production-10s-lock .top-main-action,
body.acrow-production-10s-lock .mc-btn{visibility:visible!important;opacity:1!important;}
.top-main-action{
 width:auto!important;
 min-width:0!important;
 max-width:180px!important;
 padding:8px 14px!important;
 font-size:13px!important;
 line-height:1.2!important;
 flex:0 1 auto!important;
 box-sizing:border-box!important;
}
`;
 document.head.appendChild(s);
}
function lock(){
 addStyle();
 activeUntil=Date.now()+LOCK_MS;
 document.body.classList.add('acrow-production-10s-lock');
 clearTimeout(window.__acrowProduction10sTimer);
 window.__acrowProduction10sTimer=setTimeout(function(){
  document.body.classList.remove('acrow-production-10s-lock');
 },LOCK_MS+50);
}
function isProductionInput(el){
 return !!(el&&el.closest&&el.closest('.actual-input'));
}
function watchProduction(){
 if(window.__acrowProduction10sBound)return;
 window.__acrowProduction10sBound=true;
 document.addEventListener('focusin',function(e){
  if(isProductionInput(e.target))lock();
 },true);
 document.addEventListener('click',function(e){
  var t=e.target&&e.target.closest?e.target.closest('.actual-input,.top-main-action,.mc-btn'):null;
  if(t)lock();
 },true);
 var observer=new MutationObserver(function(){
  var input=document.querySelector('.actual-input:focus');
  if(input && Date.now()>activeUntil)lock();
 });
 observer.observe(document.body,{childList:true,subtree:true});
}
function boot(){addStyle();watchProduction();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

/* ACROW Factory 5 — v221: five monthly-plan machines are permanently included in daily production */
(function(){
'use strict';
var EXTRA_DAILY=[
 {id:'2',name:'مكبس فريم كونكتور',dept:'daily'},
 {id:'8',name:'تليسكوب',dept:'daily'},
 {id:'9',name:'شور برس',dept:'daily'},
 {id:'10',name:'اسبيجوت',dept:'daily'},
 {id:'forming-frame',name:'فريم تشكيل',dept:'daily'}
];
var IDS=EXTRA_DAILY.map(function(x){return String(x.id);});
function sid(v){return String(v==null?'':v).trim();}
function fixed(a){
 a=Array.isArray(a)?a.map(sid).filter(Boolean):[];
 IDS.forEach(function(id){if(a.indexOf(id)<0)a.push(id);});
 return a;
}
function ensure(){
 try{
  if(typeof DEPARTMENTS!=='undefined'&&Array.isArray(DEPARTMENTS)&&!DEPARTMENTS.some(function(d){return d&&d.id==='daily';}))DEPARTMENTS.push({id:'daily',name:'ماكينات إنتاج اليوم',target:0,count:5,prefix:'PD'});
  if(typeof MACHINES!=='undefined'&&Array.isArray(MACHINES))EXTRA_DAILY.forEach(function(x){
   var i=MACHINES.findIndex(function(m){return sid(m&&m.id)===sid(x.id);});
   if(i<0)MACHINES.push({id:x.id,name:x.name,dept:'daily',deptName:'ماكينات إنتاج اليوم',target:null});
   else{MACHINES[i].name=x.name;MACHINES[i].dept='daily';MACHINES[i].deptName='ماكينات إنتاج اليوم';}
  });
 }catch(e){}
}
function save(a){
 a=fixed(a);
 try{localStorage.setItem('acrow_daily_favorites_override',JSON.stringify(a));}catch(e){}
 try{if(typeof store!=='undefined')store.favorites=a;if(typeof saveStore==='function')saveStore();}catch(e){}
 return a;
}
function current(){
 try{var x=localStorage.getItem('acrow_daily_favorites_override');if(x!==null){var a=JSON.parse(x);if(Array.isArray(a))return fixed(a);}}catch(e){}
 try{if(typeof store!=='undefined'&&Array.isArray(store.favorites))return fixed(store.favorites);}catch(e){}
 return fixed([]);
}
function sync(){
 ensure();
 var a=save(current());
 var box=document.getElementById('machineSelectList');
 if(box)box.querySelectorAll('input[type="checkbox"]').forEach(function(cb){
  var id=sid(cb.getAttribute('data-machine'));
  if(id)cb.checked=a.indexOf(id)>=0;
 });
}
function boot(){
 ensure();sync();
 [100,300,700,1500,2500].forEach(function(t){setTimeout(sync,t);});
 if(!window.__acrow221Interval)window.__acrow221Interval=setInterval(sync,700);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();