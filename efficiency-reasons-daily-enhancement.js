/* ACROW Factory 5 — efficiency reasons date/time + daily report + print */
(function(){
'use strict';
var KEY='acrow_daily_efficiency_reasons_v1';
function pad(n){return String(n).padStart(2,'0');}
function nowLocal(){var d=new Date();return {date:d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()),time:pad(d.getHours())+':'+pad(d.getMinutes())};}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function addFields(){
 var root=document.getElementById('acrContent');if(!root||document.getElementById('acrStartTime'))return;
 var grid=root.querySelector('.acr-grid');if(!grid)return;
 var n=nowLocal();
 var d=document.createElement('div');d.className='acr-field';d.innerHTML='<label>التاريخ</label><input id="acrReportDate" type="date" value="'+n.date+'">';grid.appendChild(d);
 var t=document.createElement('div');t.className='acr-field';t.innerHTML='<label>وقت بداية السبب</label><input id="acrStartTime" type="time" value="'+n.time+'">';grid.appendChild(t);
 var t2=document.createElement('div');t2.className='acr-field';t2.innerHTML='<label>وقت نهاية السبب</label><input id="acrEndTime" type="time" value="'+n.time+'">';grid.appendChild(t2);
 var info=document.createElement('div');info.className='acr-field full';info.innerHTML='<div style="font-size:12px;color:#ffd54a;font-weight:800">التاريخ والوقت والمدة يتم حفظهم مع سبب نقص الكفاءة.</div>';grid.appendChild(info);
 var actions=root.querySelector('.acr-actions');if(actions&&!document.getElementById('acrDailyReport')){var b=document.createElement('button');b.className='acr-btn warn';b.id='acrDailyReport';b.textContent='التقرير اليومي';b.onclick=openDailyReport;actions.appendChild(b);}
 hookSave();
}
function readData(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch(e){return {};}}
function saveData(data){try{localStorage.setItem(KEY,JSON.stringify(data));}catch(e){}try{if(typeof store!=='undefined'&&store){store.dailyEfficiencyReasons=data;if(typeof saveStore==='function')saveStore();}}catch(e){}}
function hookSave(){var b=document.getElementById('acrSave');if(!b||b.dataset.dtEnhanced==='1')return;b.dataset.dtEnhanced='1';b.addEventListener('click',function(){setTimeout(function(){
 try{
  var date=document.getElementById('acrDate')?.value||document.getElementById('acrReportDate')?.value;
  var data=readData();if(!date||!data[date])return;
  var x=data[date];x.date=date;x.startTime=document.getElementById('acrStartTime')?.value||x.startTime||'';x.endTime=document.getElementById('acrEndTime')?.value||x.endTime||'';
  var sv=document.getElementById('acrDuration')?.value;var unit=document.getElementById('acrDurationUnit')?.value||'hour';if(sv!==undefined&&sv!=='')x.durationMinutes=unit==='hour'?Math.round(Number(sv)*60):Math.round(Number(sv));
  saveData(data);
 }catch(e){}
 },180);});}
function openDailyReport(){
 var root=document.getElementById('acrContent');if(!root)return;
 var n=nowLocal();var data=readData();var d=document.getElementById('acrReportDate')?.value||n.date;var x=data[d];
 var rows=x?[x]:[];var total=x&&x.durationMinutes?Number(x.durationMinutes):0;
 var old=root.innerHTML;root.innerHTML='<div class="acr-title">التقرير اليومي لأسباب نقص الكفاءة</div><div class="acr-sub">اليوم: '+esc(d)+'</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px"><button class="acr-btn warn" id="acrPrintDaily">طباعة التقرير</button><button class="acr-btn" id="acrBackDaily">رجوع</button></div>'+
 '<div class="acr-table-wrap"><table class="acr-table"><thead><tr><th>التاريخ</th><th>من</th><th>إلى</th><th>المدة</th><th>السبب</th><th>التصنيف</th><th>الماكينات</th><th>نسبة التأثير</th><th>التفاصيل</th></tr></thead><tbody>'+ (rows.length?rows.map(function(r){var mins=Number(r.durationMinutes||0);return '<tr><td>'+esc(r.date)+'</td><td>'+esc(r.startTime||'')+'</td><td>'+esc(r.endTime||'')+'</td><td>'+Math.floor(mins/60)+' س '+(mins%60)+' د</td><td>'+esc(r.reason)+'</td><td>'+esc(r.category)+'</td><td>'+esc(r.machines)+'</td><td>'+esc(r.lossPercent==null?'':r.lossPercent)+'%</td><td>'+esc(r.notes)+'</td></tr>';}).join(''):'<tr><td colspan="9" class="acr-empty">لا توجد بيانات مسجلة لهذا اليوم</td></tr>')+'</tbody></table></div><div style="margin-top:12px;padding:12px;background:#18283a;border:1px solid #ffd54a;border-radius:10px;color:#ffd54a;font-weight:900">إجمالي مدة أسباب نقص الكفاءة: '+Math.floor(total/60)+' ساعة '+(total%60)+' دقيقة</div>';
 document.getElementById('acrPrintDaily').onclick=function(){printDaily(d,x);};document.getElementById('acrBackDaily').onclick=function(){root.innerHTML=old;addFields();};
}
function printDaily(d,x){var mins=Number(x&&x.durationMinutes||0);var w=window.open('','_blank');if(!w)return;w.document.write('<html dir="rtl"><head><meta charset="utf-8"><title>تقرير أسباب نقص الكفاءة '+esc(d)+'</title><style>body{font-family:Arial,sans-serif;padding:25px;color:#111}h2{text-align:center}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #777;padding:8px;text-align:right}th{background:#eee}.sum{margin-top:18px;font-weight:bold}</style></head><body><h2>تقرير يومي — أسباب نقص كفاءة الإنتاج</h2><div>التاريخ: '+esc(d)+'</div><table><tr><th>من</th><th>إلى</th><th>المدة</th><th>السبب</th><th>التصنيف</th><th>الماكينات</th><th>التأثير</th><th>التفاصيل</th></tr><tr><td>'+esc(x?.startTime||'')+'</td><td>'+esc(x?.endTime||'')+'</td><td>'+Math.floor(mins/60)+' ساعة '+(mins%60)+' دقيقة</td><td>'+esc(x?.reason||'')+'</td><td>'+esc(x?.category||'')+'</td><td>'+esc(x?.machines||'')+'</td><td>'+esc(x?.lossPercent==null?'':x.lossPercent)+'%</td><td>'+esc(x?.notes||'')+'</td></tr></table><div class="sum">إجمالي المدة: '+Math.floor(mins/60)+' ساعة '+(mins%60)+' دقيقة</div><script>window.onload=function(){window.print();}</script></body></html>');w.document.close();}
function ready(){addFields();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(ready,700);});else setTimeout(ready,700);
new MutationObserver(function(){setTimeout(ready,50);}).observe(document.documentElement,{childList:true,subtree:true});
})();