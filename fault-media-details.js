/* ACROW Factory 5 — v251: reliable fault details + photo capture */
(function(){
'use strict';
function esc(v){return String(v==null?'':v).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c];});}
function openRows(){
  var out=[];
  if(typeof store==='undefined'||!store||!store.records)return out;
  Object.keys(store.records).forEach(function(k){var r=store.records[k]||{};if(!Array.isArray(r.faults))return;r.faults.forEach(function(f,i){if(f&&!f.endTime)out.push({key:k,index:i,f:f,machine:r.machine||k,date:f.date||k});});});
  out.sort(function(a,b){return String(b.f.date||b.date).localeCompare(String(a.f.date||a.date))||String(b.f.time||'').localeCompare(String(a.f.time||''));});
  return out;
}
function showDetails(btn){
  var card=btn&&btn.closest?btn.closest('.afl-card'):null;if(!card)return;
  var media=card.querySelector('.afl-media');
  var reason=(card.querySelector('.afl-main')||{}).textContent||'العطل';
  var meta=(card.querySelector('.afl-meta')||{}).textContent||'';
  var desc=(card.querySelector('.afl-desc')||{}).textContent||'';
  var box=document.getElementById('aflDetailModal');
  if(!box){box=document.createElement('div');box.id='aflDetailModal';document.body.appendChild(box);}
  box.innerHTML='<div class="afl-detail-card"><button class="afl-detail-close">إغلاق</button><h2>تفاصيل العطل</h2><div class="afl-detail-reason">'+esc(reason)+'</div><div class="afl-detail-meta">'+esc(meta)+'</div><div class="afl-detail-desc">'+esc(desc)+'</div><div class="afl-detail-media"></div></div>';
  var target=box.querySelector('.afl-detail-media');
  if(media){var img=media.querySelector('img');var audio=media.querySelector('audio');if(img){var im=img.cloneNode(true);im.removeAttribute('style');target.appendChild(im);}if(audio){var au=audio.cloneNode(true);au.controls=true;target.appendChild(au);}}
  if(!target.children.length)target.innerHTML='<div>لا توجد صورة أو تسجيل صوتي لهذا العطل</div>';
  box.style.display='flex';box.querySelector('.afl-detail-close').onclick=function(){box.style.display='none';};
}
function savePhotoForButton(btn,file){
  var n=Number(btn.getAttribute('data-n')),rows=openRows(),item=rows[n];if(!item||!item.f||!file)return;
  var rd=new FileReader();
  rd.onload=function(){var im=new Image();im.onload=function(){var c=document.createElement('canvas'),max=1000,w=im.width,h=im.height;if(w>max){h=Math.round(h*max/w);w=max;}c.width=w;c.height=h;c.getContext('2d').drawImage(im,0,0,w,h);item.f.photo=c.toDataURL('image/jpeg',.62);try{if(typeof saveStore==='function')saveStore();}catch(e){}if(typeof window.showFaultLog==='function'){try{window.showFaultLog();}catch(e){}}};im.src=rd.result;};rd.readAsDataURL(file);
}
function capturePhoto(btn){
  var old=document.getElementById('aflEmergencyPhotoInput');if(old)try{old.remove();}catch(e){}
  var input=document.createElement('input');input.id='aflEmergencyPhotoInput';input.type='file';input.accept='image/*';input.setAttribute('capture','environment');input.style.cssText='position:fixed;left:0;top:0;width:2px;height:2px;opacity:.01;z-index:999999;';document.body.appendChild(input);
  input.addEventListener('change',function(){var f=input.files&&input.files[0];if(f)savePhotoForButton(btn,f);});
  try{input.click();}catch(e){}
}
function boot(){
  if(document.getElementById('aflDetailStyle'))return;
  var s=document.createElement('style');s.id='aflDetailStyle';s.textContent='#aflDetailModal{display:none;position:fixed;inset:0;z-index:20000;background:rgba(0,0,0,.72);align-items:center;justify-content:center;padding:15px;box-sizing:border-box}#aflDetailModal .afl-detail-card{position:relative;width:min(720px,96vw);max-height:90vh;overflow:auto;background:#fff;color:#111;border-radius:16px;padding:20px;box-sizing:border-box;text-align:right}#aflDetailModal h2{margin:0 0 12px;text-align:center}#aflDetailModal .afl-detail-close{position:absolute;left:12px;top:12px;background:#e53935;color:#fff;border:0;border-radius:8px;padding:8px 14px;font-weight:800}#aflDetailModal .afl-detail-reason{font-size:20px;font-weight:900;margin:8px 0}#aflDetailModal .afl-detail-meta,#aflDetailModal .afl-detail-desc{margin:7px 0;color:#555}#aflDetailModal .afl-detail-media{display:flex;flex-direction:column;gap:12px;margin-top:15px;align-items:center}#aflDetailModal .afl-detail-media img{display:block;width:auto;max-width:100%;max-height:55vh;border-radius:10px;border:2px solid #ddd}#aflDetailModal .afl-detail-media audio{width:min(520px,90vw);max-width:100%}';document.head.appendChild(s);
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.afl-open');if(!b)return;e.preventDefault();e.stopImmediatePropagation();showDetails(b);},true);
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.afl-photo');if(!b)return;e.preventDefault();e.stopImmediatePropagation();capturePhoto(b);},true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
