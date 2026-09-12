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
/* Keep the main-screen action button compact so it never covers the other buttons. */
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
