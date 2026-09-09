/* ACROW Factory 5 — v24: machine obstacle entry */
(function(){'use strict';
function saveObstacle(o){
  try{
    if(window.store){
      if(!Array.isArray(store.dailyObstacles)) store.dailyObstacles=[];
      store.dailyObstacles.push(o);
      if(typeof window.saveStore==='function') window.saveStore();
    }
    localStorage.setItem('acrow_production_obstacles',JSON.stringify(window.store&&Array.isArray(store.dailyObstacles)?store.dailyObstacles:[o]));
    return true;
  }catch(e){console.error(e);return false}
}
function machineName(card){var x=card&&card.querySelector('.mc-name');return x?(x.textContent||'').trim():''}
function openEntry(card){
  var old=document.getElementById('acrowV24Entry');if(old)old.remove();
  var name=machineName(card), now=new Date(), date=now.toISOString().slice(0,10), time=now.toTimeString().slice(0,5);
  var m=document.createElement('div');m.id='acrowV24Entry';m.innerHTML='<div class="v24box"><button type="button" class="v24close">إغلاق</button><h3>تسجيل معوقات الإنتاج</h3><div class="v24machine">الماكينة: <b>'+esc(name)+'</b></div><div class="v24grid"><label>التاريخ<input id="v24date" type="date" value="'+date+'"></label><label>الوردية<select id="v24shift"><option>الأولى</option><option>الثانية</option></select></label><label>الخامة<input id="v24material" type="text" placeholder="الخامة / المنتج"></label><label>وقت البداية<input id="v24start" type="time" value="'+time+'"></label><label>وقت النهاية<input id="v24end" type="time"></label><label>سبب المعوق<input id="v24reason" type="text" placeholder="سبب المعوق"></label></div><label class="v24full">تفاصيل المعوق<textarea id="v24details" placeholder="اكتب تفاصيل المعوق"></textarea></label><button type="button" id="v24save">تسجيل المعوق</button><div id="v24msg"></div></div>';
  document.body.appendChild(m);
  m.querySelector('.v24close').onclick=function(){m.remove()};
  m.onclick=function(e){if(e.target===m)m.remove()};
  m.querySelector('#v24save').onclick=function(){
    var date=m.querySelector('#v24date').value,shift=m.querySelector('#v24shift').value,material=m.querySelector('#v24material').value.trim(),start=m.querySelector('#v24start').value,end=m.querySelector('#v24end').value,reason=m.querySelector('#v24reason').value.trim(),details=m.querySelector('#v24details').value.trim();
    if(!date||!start||!reason){m.querySelector('#v24msg').textContent='اكتب التاريخ ووقت البداية وسبب المعوق أولاً';return}
    var mins=0;if(end){var a=start.split(':').map(Number),b=end.split(':').map(Number);mins=(b[0]*60+b[1])-(a[0]*60+a[1]);if(mins<0)mins+=1440}
    var o={id:'obs_'+Date.now(),date:date,shift:shift,machine:name,material:material,reason:reason,description:details,startTime:start,endTime:end,mins:mins,createdAt:new Date().toISOString()};
    if(saveObstacle(o)){m.querySelector('#v24msg').textContent='تم تسجيل المعوق';setTimeout(function(){m.remove()},500)}else m.querySelector('#v24msg').textContent='تعذر حفظ البيانات';
  };
}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function addStyle(){if(document.getElementById('v24style'))return;var s=document.createElement('style');s.id='v24style';s.textContent='#acrowV24Entry{position:fixed;inset:0;z-index:2147483600;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;padding:12px;font-family:Tajawal,sans-serif;direction:rtl}#acrowV24Entry .v24box{width:min(700px,100%);max-height:92vh;overflow:auto;background:#111d2b;color:#e9edf1;border:1px solid #33485c;border-radius:14px;padding:16px}#acrowV24Entry h3{margin:0 0 12px}.v24machine{background:#18283a;border:1px solid #2b4054;border-radius:8px;padding:10px;margin-bottom:10px}.v24grid{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.v24grid label,.v24full{display:flex;flex-direction:column;gap:5px;font-weight:700;font-size:12px}.v24grid input,.v24grid select,.v24full textarea{padding:9px;background:#07101b;color:#e9edf1;border:1px solid #31506a;border-radius:7px;font-family:Tajawal}.v24full{margin-top:9px}.v24full textarea{min-height:80px;resize:vertical}.v24box #v24save{width:100%;margin-top:12px;padding:10px;border:0;border-radius:8px;background:#1686c9;color:#fff;font-family:Tajawal;font-weight:800}.v24close{float:left;background:#334155;color:#fff;border:1px solid #475569;border-radius:7px;padding:7px 11px}.v24box #v24msg{text-align:center;margin-top:8px;font-weight:800;color:#7ee2a8}@media(max-width:600px){.v24grid{grid-template-columns:1fr}}';document.head.appendChild(s)}
function start(){addStyle();document.querySelectorAll('.machine-card').forEach(function(card){var btns=card.querySelectorAll('button');var target=null;btns.forEach(function(b){var t=(b.textContent||'').trim();if(t==='معوقات الإنتاج'||t==='تسجيل معوقات الإنتاج')target=b});if(target){target.textContent='تسجيل معوقات الإنتاج';target.style.display='block';target.style.width='100%';target.onclick=function(e){e.preventDefault();e.stopImmediatePropagation();openEntry(card)};}})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){start();setTimeout(start,500)});else{start();setTimeout(start,500)}
})();
