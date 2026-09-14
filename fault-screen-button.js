/* ACROW Factory 5 — v224: always-visible dedicated fault screen button */
(function(){'use strict';
function openFault(){if(typeof window.showFaultLog==='function')return window.showFaultLog();var s=document.getElementById('acrowFaultLogScreen');if(s){s.style.display='block';s.scrollIntoView({behavior:'smooth',block:'start'});}}
function add(){
 var b=document.getElementById('faultScreenBtn');
 if(!b){b=document.createElement('button');b.id='faultScreenBtn';b.type='button';b.textContent='شاشة الأعطال';b.className='select-machines-btn';b.onclick=function(e){e.preventDefault();e.stopPropagation();openFault();};}
 b.style.cssText='display:flex!important;position:relative!important;z-index:999!important;width:calc(100% - 24px)!important;max-width:900px!important;box-sizing:border-box!important;justify-content:center!important;align-items:center!important;margin:12px auto!important;padding:13px!important;background:#0f6fff!important;color:#fff!important;border:0!important;border-radius:10px!important;font-size:18px!important;font-weight:800!important;cursor:pointer!important;';
 var anchor=document.getElementById('machineSelectList');
 if(anchor&&anchor.parentNode){anchor.parentNode.insertBefore(b,anchor);return;}
 var els=document.querySelectorAll('h1,h2,h3,h4,h5,h6,div,p,label,span,button');
 for(var i=0;i<els.length;i++){var t=(els[i].textContent||'').replace(/\s+/g,' ').trim();if(t.indexOf('اختيار الماكينات المنتجة اليوم')>=0||t.indexOf('الماكينات المنتجة اليوم')>=0){if(els[i].parentNode){els[i].parentNode.insertBefore(b,els[i].nextSibling);return;}}}
 if(!b.parentNode&&document.body)document.body.insertBefore(b,document.body.firstChild);
}
function boot(){add();[100,300,700,1200,2000,4000].forEach(function(t){setTimeout(add,t);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
if(window.MutationObserver)new MutationObserver(function(){setTimeout(add,0);}).observe(document.documentElement,{childList:true,subtree:true});
setInterval(add,1200);
})();

/* v163 — date range fix: maintenance, production efficiency, monthly plan only */
(function(){'use strict';
var planFrom='',planTo='';
function iso(v){v=String(v||'').trim();if(/^\d{4}-\d{2}-\d{2}$/.test(v))return v;var m=v.match(/^(\d{1,2})[\\\/-](\d{1,2})[\\\/-](\d{4})$/);return m?m[3]+'-'+String(m[2]).padStart(2,'0')+'-'+String(m[1]).padStart(2,'0'):'';}
function dates(a,b){a=iso(a);b=iso(b);if(!a||!b||a>b)return[];var x=new Date(a+'T00:00:00'),y=new Date(b+'T00:00:00'),out=[];for(;x<=y;x.setDate(x.getDate()+1))out.push(x.toISOString().slice(0,10));return out;}
function fixMaintenance(){var r=document.getElementById('maintenanceRange'),f=document.getElementById('maintenanceFromDate'),t=document.getElementById('maintenanceToDate');if(!r||!f||!t)return;f.type='date';t.type='date';f.removeAttribute('inputmode');t.removeAttribute('inputmode');f.max=t.value||'';t.min=f.value||'';if(r.value==='custom'){var b=document.getElementById('maintenanceDate')?.value||'';if(!f.value&&b)f.value=iso(b);if(!t.value&&b)t.value=iso(b);}if(!f.dataset.acrowRangeBound){f.dataset.acrowRangeBound='1';f.addEventListener('blur',function(){var v=iso(f.value);if(v)f.value=v;});t.addEventListener('blur',function(){var v=iso(t.value);if(v)t.value=v;});f.addEventListener('change',function(){if(f.value)t.min=f.value;});t.addEventListener('change',function(){if(t.value)f.max=t.value;});}}
function addEfficiencyRange(){var rows=document.querySelectorAll('[data-top-custom-from],[data-top-custom-to]');rows.forEach(function(el){if(el.dataset.acrowEffBound)return;el.dataset.acrowEffBound='1';el.addEventListener('change',function(){var box=el.closest('.top-eff-selector');if(box){var cf=box.querySelector('[data-top-custom-from]'),ct=box.querySelector('[data-top-custom-to]');if(cf&&ct&&cf.value&&ct.value){topEfficiencyPeriod='custom';topFaultPeriod=topFaultPeriod;try{if(typeof updateSummaryOnly==='function')updateSummaryOnly();}catch(e){}}}});});}
function addPlanRange(){var tabs=document.getElementById('planPeriodTabs');if(!tabs)return;var btn=tabs.querySelector('[data-plan-period="custom"]');if(!btn){btn=document.createElement('button');btn.className='shift-tab';btn.dataset.planPeriod='custom';btn.textContent='من تاريخ إلى تاريخ';tabs.appendChild(btn);btn.onclick=function(){document.querySelectorAll('#planPeriodTabs .shift-tab').forEach(function(x){x.classList.remove('active');});btn.classList.add('active');window.__acrowPlanPeriodCustom=true;var box=document.getElementById('acrowPlanCustomDates');if(box)box.style.display='flex';if(typeof renderPlanStatus==='function')renderPlanStatus();};}
var box=document.getElementById('acrowPlanCustomDates');if(!box){box=document.createElement('div');box.id='acrowPlanCustomDates';box.className='analysis-options no-print';box.style.cssText='display:none;align-items:center;flex-wrap:wrap;gap:10px;margin-top:8px;';box.innerHTML='<span>من:</span><input type="date" id="planCustomFrom" class="date-input"><span>إلى:</span><input type="date" id="planCustomTo" class="date-input">';tabs.parentNode.insertBefore(box,tabs.nextSibling);}
var f=document.getElementById('planCustomFrom'),t=document.getElementById('planCustomTo');if(f&&t&&!f.dataset.bound){f.dataset.bound='1';f.onchange=function(){planFrom=f.value;planTo=t.value;if(planFrom&&planTo&&planFrom>planTo){var q=planFrom;planFrom=planTo;planTo=q;f.value=planFrom;t.value=planTo;}if(typeof renderPlanStatus==='function')renderPlanStatus();};t.onchange=f.onchange;}}
function patchPlanDates(){if(typeof window.planDates!=='function'||window.__acrowPlanDatesPatched)return;var original=window.planDates;window.planDates=function(period,base){if((period==='custom'||window.__acrowPlanPeriodCustom)&&planFrom&&planTo)return dates(planFrom,planTo);return original.apply(this,arguments);};window.__acrowPlanDatesPatched=true;}
function ensure(){fixMaintenance();addEfficiencyRange();addPlanRange();patchPlanDates();}
function boot(){ensure();[300,800,1500,3000].forEach(function(t){setTimeout(ensure,t);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
if(window.MutationObserver)new MutationObserver(function(){setTimeout(ensure,0);}).observe(document.documentElement,{childList:true,subtree:true});
})();
