/* ACROW Factory 5 — v25: machine obstacle button + main obstacle report */
(function(){'use strict';
function machineName(card){var x=card&&card.querySelector('.mc-name');return x?(x.textContent||'').trim():''}
function getObstacles(){
  try{
    if(window.store&&Array.isArray(store.dailyObstacles)) return store.dailyObstacles;
    var x=localStorage.getItem('acrow_production_obstacles');
    return x?JSON.parse(x):[];
  }catch(e){return []}
}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function openEntry(card){
  var old=document.getElementById('acrowV25Entry');if(old)old.remove();
  var name=machineName(card),now=new Date(),date=now.toISOString().slice(0,10),time=now.toTimeString().slice(0,5);
  var m=document.createElement('div');m.id='acrowV25Entry';m.innerHTML='<div class="v25box"><button type="button" class="v25close">إغلاق</button><h3>تسجيل معوقات الإنتاج</h3><div class="v25machine">الماكينة: <b>'+esc(name)+'</b></div><div class="v25grid"><label>التاريخ<input id="v25date" type="date" value="'+date+'"></label><label>الوردية<select id="v25shift"><option>الأولى</option><option>الثانية</option></select></label><label>الخامة / المنتج<input id="v25material" type="text"></label><label>وقت البداية<input id="v25start" type="time" value="'+time+'"></label><label>وقت النهاية<input id="v25end" type="time"></label><label>سبب المعوق<input id="v25reason" type="text"></label></div><label class="v25full">تفاصيل المعوق<textarea id="v25details"></textarea></label><button type="button" id="v25save">تسجيل المعوق</button><div id="v25msg"></div></div>';
  document.body.appendChild(m);
  m.querySelector('.v25close').onclick=function(){m.remove()};m.onclick=function(e){if(e.target===m)m.remove()};
  m.querySelector('#v25save').onclick=function(){
    var date=m.querySelector('#v25date').value,shift=m.querySelector('#v25shift').value,material=m.querySelector('#v25material').value.trim(),start=m.querySelector('#v25start').value,end=m.querySelector('#v25end').value,reason=m.querySelector('#v25reason').value.trim(),details=m.querySelector('#v25details').value.trim();
    if(!date||!start||!reason){m.querySelector('#v25msg').textContent='اكتب التاريخ ووقت البداية وسبب المعوق أولاً';return}
    var mins=0;if(end){var a=start.split(':').map(Number),b=end.split(':').map(Number);mins=(b[0]*60+b[1])-(a[0]*60+a[1]);if(mins<0)mins+=1440}
    var o={id:'obs_'+Date.now(),date:date,shift:shift,machine:name,material:material,reason:reason,description:details,startTime:start,endTime:end,mins:mins,createdAt:new Date().toISOString()};
    try{if(window.store){if(!Array.isArray(store.dailyObstacles))store.dailyObstacles=[];store.dailyObstacles.push(o);if(typeof window.saveStore==='function')window.saveStore()}localStorage.setItem('acrow_production_obstacles',JSON.stringify(getObstacles()));m.querySelector('#v25msg').textContent='تم تسجيل المعوق';setTimeout(function(){m.remove()},500)}catch(e){m.querySelector('#v25msg').textContent='تعذر حفظ البيانات'}
  };
}
function addMachineButtons(){
  document.querySelectorAll('.machine-card').forEach(function(card){
    if(card.querySelector('.acrow-v25-obstacle-btn'))return;
    var bottom=card.querySelector('.mc-bottom');if(!bottom)return;
    var b=document.createElement('button');b.type='button';b.className='mc-btn acrow-v25-obstacle-btn';b.textContent='تسجيل معوقات الإنتاج';b.title='تسجيل معوقات الإنتاج لهذه الماكينة';b.onclick=function(e){e.preventDefault();e.stopPropagation();openEntry(card)};
    bottom.appendChild(b);
  });
}
function openReport(){
  var existing=Array.from(document.querySelectorAll('button,a')).find(function(b){return (b.textContent||'').trim()==='تقرير معوقات الإنتاج' && !b.classList.contains('acrow-v25-report-btn')});
  if(existing){existing.click();return}
  var old=document.getElementById('acrowV25Report');if(old)old.remove();
  var data=getObstacles().slice().sort(function(a,b){return String(b.date||'').localeCompare(String(a.date||''))});
  var total=data.reduce(function(s,o){return s+(Number(o.mins)||0)},0);
  var rows=data.map(function(o){return '<tr><td>'+esc(o.date)+'</td><td>'+esc(o.shift)+'</td><td>'+esc(o.machine)+'</td><td>'+esc(o.reason)+'</td><td>'+esc(o.startTime||'')+'</td><td>'+esc(o.endTime||'')+'</td><td>'+esc(o.mins||0)+'</td></tr>'}).join('');
  var m=document.createElement('div');m.id='acrowV25Report';m.innerHTML='<div class="v25report"><button class="v25close">إغلاق</button><h3>تقرير معوقات الإنتاج</h3><div class="v25summary">عدد المعوقات: <b>'+data.length+'</b> — إجمالي التوقف: <b>'+total+' دقيقة</b></div><div class="v25tablewrap"><table><thead><tr><th>التاريخ</th><th>الوردية</th><th>الماكينة</th><th>المعوق</th><th>بداية</th><th>نهاية</th><th>دقيقة</th></tr></thead><tbody>'+rows+'</tbody></table></div><button class="v25print" onclick="window.print()">طباعة التقرير</button></div>';
  document.body.appendChild(m);m.querySelector('.v25close').onclick=function(){m.remove()};m.onclick=function(e){if(e.target===m)m.remove()};
}
function addMainReportButton(){
  if(document.querySelector('.acrow-v25-report-btn'))return;
  var top=document.querySelector('.topbar');if(!top)return;
  var b=document.createElement('button');b.type='button';b.className='acrow-v25-report-btn';b.textContent='تقرير معوقات الإنتاج';b.onclick=openReport;
  var holder=top.querySelector('.shift-controls');if(holder)holder.insertBefore(b,holder.firstChild);else top.appendChild(b);
}
function addStyle(){if(document.getElementById('v25style'))return;var s=document.createElement('style');s.id='v25style';s.textContent='.acrow-v25-obstacle-btn{border-color:#f59e0b!important;color:#ffd54a!important;background:linear-gradient(135deg,#3a2b0b,#241c0a)!important}.acrow-v25-report-btn{padding:9px 14px;border-radius:8px;border:1px solid #f59e0b;background:linear-gradient(135deg,#f59e0b,#facc15);color:#111;font-family:Tajawal;font-weight:800;cursor:pointer}.acrow-v25-report-btn:hover{filter:brightness(1.08)}#acrowV25Entry,#acrowV25Report{position:fixed;inset:0;z-index:2147483600;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;padding:12px;font-family:Tajawal,sans-serif;direction:rtl}#acrowV25Entry .v25box,#acrowV25Report .v25report{width:min(900px,100%);max-height:92vh;overflow:auto;background:#111d2b;color:#e9edf1;border:1px solid #33485c;border-radius:14px;padding:16px}.v25grid{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.v25grid label,.v25full{display:flex;flex-direction:column;gap:5px;font-weight:700;font-size:12px}.v25grid input,.v25grid select,.v25full textarea{padding:9px;background:#07101b;color:#e9edf1;border:1px solid #31506a;border-radius:7px;font-family:Tajawal}.v25full{margin-top:9px}.v25full textarea{min-height:80px}.v25machine,.v25summary{background:#18283a;border:1px solid #2b4054;border-radius:8px;padding:10px;margin:10px 0}.v25box #v25save,.v25print{width:100%;margin-top:12px;padding:10px;border:0;border-radius:8px;background:#1686c9;color:#fff;font-family:Tajawal;font-weight:800}.v25close{float:left;background:#334155;color:#fff;border:1px solid #475569;border-radius:7px;padding:7px 11px}.v25tablewrap{overflow:auto}.v25report table{width:100%;border-collapse:collapse;font-size:12px}.v25report th,.v25report td{border:1px solid #2b4054;padding:8px;text-align:center}.v25report th{background:#18283a}@media(max-width:600px){.v25grid{grid-template-columns:1fr}.acrow-v25-report-btn{width:100%}}';document.head.appendChild(s)}
function start(){addStyle();addMachineButtons();addMainReportButton();setTimeout(function(){addMachineButtons();addMainReportButton()},700)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
new MutationObserver(function(){addMachineButtons()}).observe(document.body,{childList:true,subtree:true});
})();
