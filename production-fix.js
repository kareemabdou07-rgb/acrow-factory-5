/* ACROW Factory 5 — production entry + تثبيت button fix */
(function(){
  'use strict';
  var STYLE_ID='acrow-production-fix-style';
  var BTN_CLASS='production-fix-btn';

  function addStyle(){
    if(document.getElementById(STYLE_ID)) return;
    var s=document.createElement('style'); s.id=STYLE_ID;
    s.textContent=`
      .actual-input.acrow-has-value{background:#d9fbe8!important;border:3px solid #20b86a!important;color:#063b22!important;box-shadow:0 0 0 2px rgba(32,184,106,.12)!important;}
      .actual-input.acrow-fixed{background:#b9f3d1!important;border:3px solid #16a05b!important;color:#063b22!important;box-shadow:0 0 0 3px rgba(22,160,91,.18)!important;}
      .actual-input.acrow-empty{background:#fff3a6!important;border:3px solid #e0b800!important;color:#111!important;}
      .${BTN_CLASS}{min-width:82px!important;min-height:52px!important;padding:8px 10px!important;border-radius:8px!important;border:2px solid #20b86a!important;background:#176b45!important;color:#fff!important;font-family:'Tajawal',sans-serif!important;font-size:14px!important;font-weight:900!important;cursor:pointer!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;flex-shrink:0!important;position:relative!important;z-index:5!important;}
      .${BTN_CLASS}:hover{background:#1f8b5b!important;}
      .${BTN_CLASS}.fixed{background:#25e58f!important;color:#062417!important;border-color:#25e58f!important;}
      .${BTN_CLASS}:disabled{opacity:.45!important;cursor:not-allowed!important;}
      .actual-input{pointer-events:auto!important;position:relative!important;z-index:4!important;}
      .acrow-production-row{display:flex!important;align-items:center!important;gap:8px!important;width:100%!important;}
      .acrow-production-row .actual-input{min-width:0!important;flex:1 1 auto!important;}
      @media(max-width:600px){.${BTN_CLASS}{min-width:78px!important;font-size:13px!important;}.acrow-production-row{gap:6px!important;}}
    `;
    document.head.appendChild(s);
  }

  function getRec(machineId){
    try{
      if(typeof getRecord!=='function' || typeof dateInput==='undefined') return null;
      return getRecord(dateInput.value,currentShift,machineId);
    }catch(e){return null;}
  }

  function applyState(input,button,rec){
    if(!input) return;
    input.classList.remove('acrow-empty','acrow-has-value','acrow-fixed');
    var has=input.value!=='' && Number(input.value)>=0;
    if(rec && rec.productionFixed && has){ input.classList.add('acrow-fixed'); }
    else if(has){ input.classList.add('acrow-has-value'); }
    else { input.classList.add('acrow-empty'); }
    if(button){
      button.classList.toggle('fixed',!!(rec&&rec.productionFixed&&has));
      button.textContent=(rec&&rec.productionFixed&&has)?'تم التثبيت':'تثبيت';
      button.disabled=!!input.disabled || !has;
    }
  }

  function decorateCard(card){
    var input=card.querySelector('.actual-input');
    if(!input) return;
    var row=input.closest('.mc-row');
    if(!row) return;
    row.classList.add('acrow-production-row');
    var id=String(input.dataset.machine||'').trim();
    if(!id) return;
    var btn=row.querySelector('.'+BTN_CLASS);
    if(!btn){
      btn=document.createElement('button');
      btn.type='button';
      btn.className=BTN_CLASS;
      btn.dataset.fixProduction=id;
      btn.textContent='تثبيت';
      row.appendChild(btn);
    }
    var rec=getRec(id);
    if(rec && rec.actual!==null && rec.actual!==undefined && input.value!==String(rec.actual)) input.value=rec.actual;
    applyState(input,btn,rec);
  }

  function decorateAll(){
    addStyle();
    document.querySelectorAll('.machine-card').forEach(decorateCard);
  }

  document.addEventListener('input',function(e){
    var input=e.target.closest&&e.target.closest('.actual-input');
    if(!input) return;
    var id=String(input.dataset.machine||'').trim();
    var rec=getRec(id);
    if(rec){rec.productionFixed=false; rec.actual=input.value===''?null:Number(input.value); try{saveStore();}catch(x){}}
    var btn=input.closest('.mc-row')&&input.closest('.mc-row').querySelector('.'+BTN_CLASS);
    applyState(input,btn,rec);
  },true);

  document.addEventListener('click',function(e){
    var btn=e.target.closest&&e.target.closest('.'+BTN_CLASS);
    if(!btn) return;
    e.preventDefault(); e.stopPropagation();
    var row=btn.closest('.mc-row');
    var input=row&&row.querySelector('.actual-input');
    if(!input || input.disabled || input.value==='') return;
    var id=String(input.dataset.machine||'').trim();
    var rec=getRec(id);
    if(!rec) return;
    rec.actual=Number(input.value);
    rec.productionFixed=!rec.productionFixed;
    try{saveStore();}catch(x){}
    applyState(input,btn,rec);
    try{if(typeof updateSummaryOnly==='function')updateSummaryOnly();}catch(x){}
    try{if(typeof renderReport==='function')renderReport();}catch(x){}
  },true);

  var observer=new MutationObserver(function(){
    clearTimeout(observer._t);
    observer._t=setTimeout(decorateAll,30);
  });
  function start(){
    addStyle(); decorateAll();
    var root=document.getElementById('departments')||document.body;
    observer.observe(root,{childList:true,subtree:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
