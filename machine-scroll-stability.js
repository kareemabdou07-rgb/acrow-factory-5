/* ACROW Factory 5 — v211: keep production machine search/input screen stable */
(function(){
'use strict';
var active=false,lock=null,queuedRender=false,hooked=false;
var SELECTOR='#machineSelectList,.production-panel,.production-screen,[data-production],.actual-input';
function inProduction(){
 var a=document.activeElement;
 if(a && a.matches && a.matches('.actual-input')) return true;
 if(a && a.closest && a.closest(SELECTOR)) return true;
 return !!document.querySelector('.actual-input:focus,#machineSelectList input:focus,#machineSelectList select:focus');
}
function release(){
 active=false;
 if(lock){var l=lock;lock=null;if(l.vv){l.vv.removeEventListener('scroll',l.keep);l.vv.removeEventListener('resize',l.keep);}window.removeEventListener('scroll',l.keep);window.removeEventListener('resize',l.keep);}
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
 [30,80,150,300,600,1000,1500].forEach(function(t){setTimeout(keep,t);});
}
function addStyle(){
 if(document.getElementById('acrow-machine-stability-v211'))return;
 var s=document.createElement('style');s.id='acrow-machine-stability-v211';s.textContent=SELECTOR+'{overflow-anchor:none!important;} #machineSelectList{scroll-behavior:auto!important;}';document.head.appendChild(s);
}
function hookRenders(){
 if(hooked)return;
 hooked=true;
 function wrap(name){
   try{
    if(typeof window[name]!=='function')return;
    var original=window[name];
    if(original.__acrowV211)return;
    var wrapped=function(){
      if(active && inProduction() && (name==='rebuildMachines' || name==='render')){
        queuedRender=true;
        setTimeout(function(){if(!active&&queuedRender){queuedRender=false;try{original.apply(window,arguments);}catch(e){}}},80);
        return;
      }
      return original.apply(this,arguments);
    };
    wrapped.__acrowV211=true;window[name]=wrapped;
   }catch(e){}
 }
 wrap('rebuildMachines');wrap('render');
}
function bind(){addStyle();hookRenders();}
document.addEventListener('pointerdown',function(e){if(e.target&&e.target.closest&&e.target.closest(SELECTOR))capture();bind();},true);
document.addEventListener('touchstart',function(e){if(e.target&&e.target.closest&&e.target.closest(SELECTOR))capture();},true);
document.addEventListener('focusin',function(e){if(e.target&&e.target.closest&&e.target.closest(SELECTOR)){capture();bind();}},true);
document.addEventListener('change',function(e){if(e.target&&e.target.closest&&e.target.closest('#machineSelectList')){setTimeout(function(){if(inProduction())capture();},20);}},true);
document.addEventListener('focusout',function(){setTimeout(function(){if(!inProduction())release();},180);},true);
if(window.MutationObserver){new MutationObserver(function(){if(active&&inProduction()){var y=window.scrollY||0,x=window.scrollX||0;requestAnimationFrame(function(){if(active&&inProduction()&&(Math.abs((window.scrollY||0)-y)>1||Math.abs((window.scrollX||0)-x)>1))window.scrollTo(x,y);});}bind();}).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();