/* ACROW Factory 5 — buttons colors only. No functionality changes. */
(function(){
'use strict';
function apply(){
 var ids=['acrowReasonBtn','reportsBtn','printReportsBtn','maintenanceBtn','faultsBtn','planBtn','editBtn'];
 var selectors=['button'];
 document.querySelectorAll(selectors.join(',')).forEach(function(b){
   var t=(b.textContent||'').trim();
   if(/طباعة التقارير|إدارة الأعطال|الخطة الشهرية|التعديل|تسجيل الإنتاج|أسباب نقص الكفاءة/.test(t)){
     b.style.setProperty('background','#1769aa','important');
     b.style.setProperty('color','#fff','important');
     b.style.setProperty('border-color','#1769aa','important');
     b.style.setProperty('font-weight','900','important');
     b.style.setProperty('transition','background .15s ease,color .15s ease','important');
     b.onpointerdown=function(){b.style.setProperty('background','#fff176','important');b.style.setProperty('color','#1769aa','important');};
     b.onpointerup=function(){setTimeout(function(){b.style.setProperty('background','#1769aa','important');b.style.setProperty('color','#fff','important');},120);};
   }
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(apply,300);});else setTimeout(apply,300);
new MutationObserver(function(){apply();}).observe(document.documentElement,{childList:true,subtree:true});
})();
