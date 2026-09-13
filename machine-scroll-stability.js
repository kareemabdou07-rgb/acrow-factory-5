/* ACROW Factory 5 — keep production machine search/input screen stable */
(function(){
'use strict';
var active=false, lock=null;
function inProduction(){
 var a=document.activeElement;
 if(a && (a.matches&&a.matches('.actual-input'))) return true;
 if(a && a.closest&&a.closest('#machineSelectList,.production-panel,.production-screen,[data-production]')) return true;
 return !!document.querySelector('.actual-input:focus,#machineSelectList input:focus,#machineSelectList select:focus');
}
function release(){
 active=false;
 if(!lock)return;
 var l=lock;lock=null;
 if(l.vv){l.vv.removeEventListener('scroll',l.keep);l.vv.removeEventListener('resize',l.keep);}
 window.removeEventListener('scroll',l.keep);window.removeEventListener('resize',l.keep);
}
function capture(){
 var y=window.scrollY||window.pageYOffset||0,x=window.scrollX||0;
 if(lock)release();
 active=true;
 var keep=function(){
   if(!active || !inProduction()){release();return;}
   var cy=window.scrollY||window.pageYOffset||0,cx=window.scrollX||0;
   if(Math.abs(cy-y)>1||Math.abs(cx-x)>1)window.scrollTo(x,y);
 };
 var vv=window.visualViewport;
 lock={vv:vv,keep:keep};
 if(vv){vv.addEventListener('scroll',keep,{passive:true});vv.addEventListener('resize',keep,{passive:true});}
 window.addEventListener('scroll',keep,{passive:true});
 window.addEventListener('resize',keep,{passive:true});
 requestAnimationFrame(keep);
 [50,150,300,600,1000].forEach(function(t){setTimeout(keep,t);});
}
document.addEventListener('pointerdown',function(e){
 if(e.target&&e.target.closest&&e.target.closest('#machineSelectList,.production-panel,.production-screen,[data-production],.actual-input'))capture();
},true);
document.addEventListener('touchstart',function(e){
 if(e.target&&e.target.closest&&e.target.closest('#machineSelectList,.production-panel,.production-screen,[data-production],.actual-input'))capture();
},true);
document.addEventListener('focusin',function(e){
 if(e.target&&e.target.closest&&e.target.closest('#machineSelectList,.production-panel,.production-screen,[data-production],.actual-input'))capture();
},true);
document.addEventListener('focusout',function(){setTimeout(function(){if(!inProduction())release();},120);},true);
})();
