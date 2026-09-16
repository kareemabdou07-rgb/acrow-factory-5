/* Move 5S/Safety button below the production/fault controls. */
(function(){'use strict';
function move(){
 var b=document.getElementById('factoryFiveSSafetyBtn');
 if(!b)return;
 var candidates=document.querySelectorAll('button');
 var anchor=null;
 for(var i=0;i<candidates.length;i++){
   var t=(candidates[i].textContent||'').replace(/\s+/g,' ').trim();
   if(/إدارة الأعطال|أسباب نقص الكفاءة/.test(t)) anchor=candidates[i];
 }
 if(anchor&&anchor.parentNode){anchor.parentNode.insertBefore(b,anchor.nextSibling);}
}
function boot(){move();setTimeout(move,500);setTimeout(move,1500);setTimeout(move,3000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();