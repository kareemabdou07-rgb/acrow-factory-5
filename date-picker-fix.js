/* ACROW Factory 5 — reliable date pickers for efficiency/fault reports */
(function(){
  'use strict';
  function today(){
    var d=new Date();
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }
  function anchor(){
    var el=document.getElementById('analysisDate')||document.getElementById('dateInput');
    return (el&&el.value)||today();
  }
  function seedCustomDates(){
    var a=anchor();
    try{
      if(typeof topCustomFrom!=='undefined' && !topCustomFrom) topCustomFrom=a;
      if(typeof topCustomTo!=='undefined' && !topCustomTo) topCustomTo=a;
    }catch(e){}
    ['[data-top-custom-from]','[data-top-custom-to]'].forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(x){if(!x.value)x.value=a;});
    });
  }
  function openPicker(el){
    if(!el || el.disabled || el.readOnly)return;
    try{ if(typeof el.showPicker==='function') el.showPicker(); }catch(e){}
  }
  function bind(){
    seedCustomDates();
    document.querySelectorAll('input[type="date"]').forEach(function(el){
      el.style.setProperty('pointer-events','auto','important');
      el.style.setProperty('position','relative','important');
      el.style.setProperty('z-index','20','important');
      el.style.setProperty('touch-action','manipulation','important');
      if(el.dataset.acrowDatePickerFix==='1')return;
      el.dataset.acrowDatePickerFix='1';
      el.addEventListener('click',function(){openPicker(el);},false);
      el.addEventListener('pointerup',function(){setTimeout(function(){openPicker(el);},0);},false);
      el.addEventListener('focus',function(){seedCustomDates();},false);
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
  setTimeout(bind,150); setTimeout(bind,700); setInterval(bind,1000);
})();
