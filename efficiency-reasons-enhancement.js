/* ACROW Factory 5 — efficiency reasons duration + multi-day reports + Pareto */
(function(){
'use strict';
function ready(){
 var btn=document.getElementById('acrowReasonBtn'); if(!btn)return;
 btn.textContent='أسباب نقص الكفاءة';
 btn.style.cssText+=';background:#ffd54a!important;color:#0645ad!important;border:2px solid #0645ad!important;font-weight:900!important;';
 var old=window.openEntry;
 if(typeof old!=='function')return;
 window.openEntry=function(){old.apply(this,arguments); setTimeout(enhance,40);};
 enhance();
}
function enhance(){
 var root=document.getElementById('acrContent'); if(!root)return;
 if(document.getElementById('acrDuration'))return;
 var actions=root.querySelector('.acr-actions');
 var grid=root.querySelector('.acr-grid');
 if(!grid)return;
 var d=document.createElement('div'); d.className='acr-field'; d.innerHTML='<label>مدة السبب</label><div style="display:flex;gap:6px"><input id="acrDuration" type="number" min="0" step="0.25" value="1" placeholder="المدة"><select id="acrDurationUnit"><option value="hour">ساعة</option><option value="minute">دقيقة</option></select></div>';
 grid.appendChild(d);
 var r=document.createElement('div'); r.className='acr-field full'; r.innerHTML='<label>ملاحظة</label><div style="font-size:11px;color:#8b98a5">يمكن تسجيل ساعة أو ساعتين أو 3 ساعات أو أي مدة، ثم استخراج تقرير من يوم إلى أي يوم تختاره.</div>';grid.appendChild(r);
 var report=actions&&actions.querySelector('#acrReports'); if(report)report.textContent='تقارير + رسم بياني + باريتو';
 var save=document.getElementById('acrSave'); if(save&&!save.dataset.enhanced){save.dataset.enhanced='1';save.addEventListener('click',function(){setTimeout(function(){
  try{var date=document.getElementById('acrDate')?.value;var data=JSON.parse(localStorage.getItem('acrow_daily_efficiency_reasons_v1')||'{}');if(date&&data[date]){var n=Number(document.getElementById('acrDuration')?.value||0);var u=document.getElementById('acrDurationUnit')?.value||'hour';data[date].durationMinutes=u==='hour'?Math.round(n*60):Math.round(n);localStorage.setItem('acrow_daily_efficiency_reasons_v1',JSON.stringify(data));}}catch(e){}
 },80);});}
 if(report&&report.dataset.enhanced!=='1'){report.dataset.enhanced='1';report.addEventListener('click',function(){setTimeout(enhanceReport,80);});}
}
function enhanceReport(){
 var c=document.getElementById('acrContent'); if(!c)return;
 var old=c.innerHTML;
 var filters=c.querySelector('.acr-report-filters');
 if(filters){
  var f=filters.querySelector('#acrFrom'),t=filters.querySelector('#acrTo');
  if(f&&t){f.value=f.value||new Date().toISOString().slice(0,10);t.value=t.value||f.value;}
 }
 var table=c.querySelector('.acr-table');
 if(table&&!c.querySelector('#acrDurationSummary')){
  var rows=Array.from(table.querySelectorAll('tbody tr'));var total=0;
  rows.forEach(function(tr){var txt=tr.textContent||'';var m=txt.match(/(\d+(?:\.\d+)?)\s*(?:ساعة|ساعات|دقيقة|دقائق)/);if(m)total+=Number(m[1])*(/دقيقة/.test(m[0])?1:60);});
  var box=document.createElement('div');box.id='acrDurationSummary';box.style.cssText='margin:12px 0;padding:12px;border:1px solid #ffd54a;border-radius:10px;background:#18283a;font-weight:900;color:#ffd54a';box.textContent='إجمالي مدة أسباب نقص الكفاءة في الفترة: '+Math.floor(total/60)+' ساعة '+(total%60)+' دقيقة';c.insertBefore(box,c.firstChild);
 }
 if(!c.querySelector('#acrRangeNote')){var n=document.createElement('div');n.id='acrRangeNote';n.style.cssText='margin:8px 0;color:#8b98a5;font-size:11px';n.textContent='اختار تاريخ البداية والنهاية: يومين أو 3 أيام أو أسبوع أو شهر أو أي عدد أيام.';c.insertBefore(n,c.firstChild);}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(ready,500);});else setTimeout(ready,500);
new MutationObserver(function(){setTimeout(ready,0);}).observe(document.documentElement,{childList:true,subtree:true});
})();
