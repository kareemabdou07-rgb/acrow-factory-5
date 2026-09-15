/* ACROW Factory 5 — custom From/To range for plan, efficiency and faults */
(function(){
'use strict';
function today(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function dates(a,b){if(!a||!b||a>b)return [];var out=[];for(var d=new Date(a+'T00:00:00');d<=new Date(b+'T00:00:00');d.setDate(d.getDate()+1))out.push(d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'));return out;}
function box(title,mode){var w=document.createElement('div');w.className='acrow-custom-range';w.innerHTML='<div style="font-weight:800;margin-bottom:7px">'+title+' — تاريخ اختياري</div><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><label>من <input type="date" class="acr-from"></label><label>إلى <input type="date" class="acr-to"></label><button type="button" class="acr-apply">عرض الفترة</button><button type="button" class="acr-clear">مسح</button></div><div class="acr-label" style="margin-top:6px;font-size:11px;opacity:.75"></div>';
var f=w.querySelector('.acr-from'),t=w.querySelector('.acr-to'),lab=w.querySelector('.acr-label');
f.value=today();t.value=today();
function apply(){if(!f.value||!t.value||f.value>t.value){lab.textContent='اختار تاريخ صحيح من وإلى';return;}var ds=dates(f.value,t.value);lab.textContent='الفترة: '+f.value+' إلى '+t.value+' ('+ds.length+' يوم)';if(mode==='plan'){window.__acrowPlanCustomFrom=f.value;window.__acrowPlanCustomTo=t.value;window.planPeriod='custom';if(typeof window.renderPlan==='function')window.renderPlan();else if(typeof window.renderDashboard==='function')window.renderDashboard();else if(typeof window.render==='function')window.render();}else{window.topCustomFrom=f.value;window.topCustomTo=t.value;if(mode==='eff')window.topEfficiencyPeriod='custom';if(mode==='fault')window.topFaultPeriod='custom';if(typeof window.renderDashboard==='function')window.renderDashboard();else if(typeof window.render==='function')window.render();}}
w.querySelector('.acr-apply').onclick=apply;w.querySelector('.acr-clear').onclick=function(){f.value='';t.value='';lab.textContent='';};
return w;}
function install(){if(document.getElementById('acrowCustomRanges'))return;var root=document.createElement('div');root.id='acrowCustomRanges';root.style='max-width:1200px;margin:8px auto;padding:0 20px;display:grid;gap:8px';root.appendChild(box('الخطة الشهرية','plan'));root.appendChild(box('الكفاءة','eff'));root.appendChild(box('الأعطال','fault'));document.body.appendChild(root);
var oldPlanDates=window.planDates;if(typeof oldPlanDates==='function'){window.planDates=function(period,base){if(period==='custom'){var a=window.__acrowPlanCustomFrom,b=window.__acrowPlanCustomTo;if(a&&b)return dates(a,b);}return oldPlanDates.apply(this,arguments);};}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(install,900);});else setTimeout(install,900);
})();
