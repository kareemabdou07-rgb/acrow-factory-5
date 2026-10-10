/* ACROW Factory 5 — monthly backup and safe production reset */
(function(){
'use strict';
var STYLE_ID='acrow-monthly-archive-style';
function el(id){return document.getElementById(id);}
function currentStore(){try{return typeof store!=='undefined'&&store?store:null;}catch(e){return null;}}
function monthLabel(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');}
function downloadBackup(){
  var s=currentStore();if(!s){alert('تعذر الوصول إلى بيانات البرنامج. لم يتم تنزيل نسخة.');return false;}
  try{
    var payload={format:'ACROW_FACTORY5_BACKUP',version:1,createdAt:new Date().toISOString(),month:monthLabel(),store:JSON.parse(JSON.stringify(s))};
    var blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});
    var url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='ACROW_Factory5_Backup_'+monthLabel()+'.json';
    document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},1500);
    var status=el('acrowArchiveStatus');if(status)status.textContent='تم تجهيز ملف النسخة. تأكد أنه ظهر في التنزيلات على هذا الجهاز، وانقله إلى اللابتوب إذا لزم.';
    return true;
  }catch(e){console.error(e);alert('تعذر إنشاء النسخة الاحتياطية. لم يتم مسح أي بيانات.');return false;}
}
function renderAfterChange(){
  try{if(typeof rebuildMachines==='function')rebuildMachines();}catch(e){}
  try{if(typeof render==='function')render();}catch(e){}
  try{if(typeof renderReport==='function')renderReport();}catch(e){}
  try{if(typeof renderDashboard==='function')renderDashboard();}catch(e){}
  try{if(typeof renderMaintenance==='function')renderMaintenance();}catch(e){}
  try{if(typeof saveStore==='function')saveStore();}catch(e){console.error('saveStore failed',e);}
  try{if(typeof window.__acrowCloudSaveNow==='function')window.__acrowCloudSaveNow();}catch(e){}
}
function performReset(){
  var s=currentStore();if(!s){alert('تعذر الوصول إلى بيانات البرنامج. لم يتم مسح أي شيء.');return;}
  try{
    s.records={};
    s._recordsResetAt=Date.now();
    if(typeof saveStore==='function')saveStore();
    try{if(typeof window.__acrowCloudSaveNow==='function')window.__acrowCloudSaveNow();}catch(e){}
    renderAfterChange();
    var status=el('acrowArchiveStatus');if(status)status.textContent='تم بدء شهر جديد. تم مسح سجلات التشغيل من البرنامج مع الاحتفاظ بالإعدادات.';
    var modal=el('acrowResetConfirmModal');if(modal)modal.style.display='none';
    alert('تم بدء شهر جديد. اترك الأجهزة الأخرى متصلة بالإنترنت حتى تستقبل التحديث.');
  }catch(e){console.error(e);alert('حصل خطأ أثناء بدء الشهر الجديد. راجع الاتصال قبل تكرار المحاولة.');}
}
function openResetConfirm(){
  var modal=el('acrowResetConfirmModal');if(modal)modal.style.display='flex';
}
function restoreBackup(file){
  if(!file)return;
  var reader=new FileReader();
  reader.onload=function(){
    try{
      var obj=JSON.parse(String(reader.result||'')),backup=obj&&obj.store;
      if(!backup||obj.format!=='ACROW_FACTORY5_BACKUP'||!backup.records||typeof backup.records!=='object')throw new Error('Invalid backup');
      var s=currentStore();if(!s)throw new Error('No store');
      if(!window.confirm('سيتم استرجاع سجلات التشغيل من النسخة وإضافتها إلى السجلات الموجودة، مع الحفاظ على إعدادات البرنامج الحالية. هل تريد المتابعة؟'))return;
      s.records=Object.assign({},backup.records,s.records||{});
      s._recordsResetAt=Number(s._recordsResetAt||0);
      renderAfterChange();
      var status=el('acrowArchiveStatus');if(status)status.textContent='تم استرجاع سجلات النسخة وإضافتها إلى سجلات البرنامج الحالية.';
      alert('تم استرجاع السجلات. افتح التقارير وحدد التاريخ المطلوب.');
    }catch(e){console.error(e);alert('الملف غير صالح أو ليس نسخة احتياطية من برنامج مصنع 5. لم يتم تغيير البيانات.');}
  };
  reader.onerror=function(){alert('تعذر قراءة ملف النسخة.');};
  reader.readAsText(file);
}
function addStyle(){
 if(el(STYLE_ID))return;
 var st=document.createElement('style');st.id=STYLE_ID;st.textContent=
 '#acrowArchiveLauncher{position:fixed;z-index:9990;left:12px;bottom:14px;background:#123d63;color:#fff;border:2px solid #20b8ff;border-radius:12px;padding:11px 15px;font:800 15px Tajawal,sans-serif;box-shadow:0 5px 20px #0008;cursor:pointer}'+
 '#acrowArchivePanel{position:fixed;z-index:9991;left:12px;bottom:65px;width:min(360px,calc(100vw - 24px));background:#111d2b;color:#e9edf1;border:1px solid #20b8ff;border-radius:14px;padding:16px;box-shadow:0 8px 30px #000b;display:none;font-family:Tajawal,sans-serif}'+
 '#acrowArchivePanel h3{font-size:19px;margin:0 0 8px}#acrowArchivePanel p{font-size:13px;line-height:1.7;margin:0 0 12px;color:#d0d9e2}'+
 '.acrowArchiveBtn{display:block;width:100%;margin:8px 0;padding:11px 10px;border:0;border-radius:9px;background:#1676b9;color:#fff;font:800 15px Tajawal,sans-serif;cursor:pointer}'+
 '.acrowArchiveDanger{background:#a92d35!important}.acrowArchiveSecondary{background:#304254!important}#acrowArchiveStatus{font-size:12px;line-height:1.6;color:#ffe17a;margin-top:10px;overflow-wrap:anywhere}';
 document.head.appendChild(st);
}
function buildUI(){
 if(el('acrowArchiveLauncher'))return;
 addStyle();
 var launch=document.createElement('button');launch.id='acrowArchiveLauncher';launch.type='button';launch.textContent='نسخ الشهر / شهر جديد';
 var panel=document.createElement('section');panel.id='acrowArchivePanel';panel.dir='rtl';
 panel.innerHTML='<h3>نسخة الشهر والبدء من جديد</h3><p>نزّل النسخة على نفس الجهاز الذي تفتح منه البرنامج. لو فاتح البرنامج على الموبايل، انقل الملف إلى اللابتوب واحفظه هناك قبل المسح.</p><button type="button" class="acrowArchiveBtn" id="acrowDownloadBackup">حفظ نسخة الشهر القديم</button><button type="button" class="acrowArchiveBtn acrowArchiveDanger" id="acrowResetMonth">بدء شهر جديد ومسح بيانات التشغيل القديمة</button><button type="button" class="acrowArchiveBtn acrowArchiveSecondary" id="acrowChooseRestore">استرجاع سجلات من نسخة محفوظة</button><input id="acrowRestoreFile" type="file" accept=".json,application/json" style="display:none"><button type="button" class="acrowArchiveBtn acrowArchiveSecondary" id="acrowArchiveClose">إغلاق</button><div id="acrowArchiveStatus" role="status"></div>';
 var modal=document.createElement('div');modal.id='acrowResetConfirmModal';modal.dir='rtl';modal.style.cssText='display:none;position:fixed;inset:0;z-index:10050;background:#000c;align-items:center;justify-content:center;padding:18px;font-family:Tajawal,sans-serif;';
 modal.innerHTML='<div style="width:min(420px,100%);background:#111d2b;color:#fff;border:2px solid #ffd34d;border-radius:16px;padding:20px;box-shadow:0 10px 40px #000"><h3 id="acrowResetConfirmTitle" style="font-size:21px;margin:0 0 12px">تأكيد أول قبل المسح</h3><p id="acrowResetConfirmMessage" style="font-size:16px;line-height:1.9;margin:0 0 16px">هل أنت متأكد إنك حفظت النسخة على اللابتوب قبل المسح؟<br>لو ضغطت متابعة، هتظهر رسالة تأكيد ثانية. لن يتم أي تغيير في هذه الخطوة.</p><button type="button" id="acrowResetConfirmYes" class="acrowArchiveBtn acrowArchiveDanger" style="background:#a92d35">نعم، حفظت النسخة — متابعة</button><button type="button" id="acrowResetConfirmFinal" class="acrowArchiveBtn acrowArchiveDanger" style="display:none;background:#a92d35">نعم، متأكد — امسح الآن</button><button type="button" id="acrowResetConfirmNo" class="acrowArchiveBtn acrowArchiveSecondary">إلغاء — لا تمسح أي شيء</button></div>';
 document.body.appendChild(launch);document.body.appendChild(panel);document.body.appendChild(modal);
 launch.addEventListener('click',function(){panel.style.display=panel.style.display==='block'?'none':'block';});
 el('acrowDownloadBackup').addEventListener('click',downloadBackup);
 el('acrowResetMonth').addEventListener('click',function(e){e.preventDefault();e.stopPropagation();openResetConfirm();});
 el('acrowResetConfirmYes').addEventListener('click',function(e){e.preventDefault();e.stopPropagation();performReset();});
 el('acrowResetConfirmNo').addEventListener('click',function(e){e.preventDefault();e.stopPropagation();var m=el('acrowResetConfirmModal');if(m)m.style.display='none';});
 el('acrowResetConfirmModal').addEventListener('click',function(e){if(e.target===this)this.style.display='none';});
 el('acrowChooseRestore').addEventListener('click',function(){el('acrowRestoreFile').click();});
 el('acrowRestoreFile').addEventListener('change',function(){var f=this.files&&this.files[0];if(f)restoreBackup(f);this.value='';});
 el('acrowArchiveClose').addEventListener('click',function(){panel.style.display='none';});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',buildUI);else buildUI();
})();
