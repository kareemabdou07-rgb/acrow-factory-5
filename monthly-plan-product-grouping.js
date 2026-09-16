/* ACROW Factory 5 — monthly plan product grouping
   Groups the existing monthly-plan table by the requested final products.
   Keeps the existing monthly-plan layout/style and does not change production entry,
   machine selection, targets, or other reports.
*/
(function(){
  'use strict';

  function sid(v){ return String(v == null ? '' : v).trim(); }
  function pad(n){ return String(n).padStart(2,'0'); }
  function monthDates(base){
    var d = new Date(String(base || '').slice(0,10) + 'T00:00:00');
    if(isNaN(d)) d = new Date();
    var y=d.getFullYear(), m=d.getMonth(), last=new Date(y,m+1,0).getDate(), out=[];
    for(var i=1;i<=last;i++) out.push(y+'-'+pad(m+1)+'-'+pad(i));
    return out;
  }
  function groupName(machine){
    var name=String((machine&&machine.name)||'').trim();
    var dept=String((machine&&machine.dept)||'').trim();
    var dn=String((machine&&machine.deptName)||'').trim();
    var all=(name+' '+dept+' '+dn).toLowerCase();

    if(dept==='ledger' || /ليدجر/.test(all)) return 'ليدجر';
    if(/شور\s*بريس/.test(all)) return 'شور بريس';
    if(/فريم\s*كوباية/.test(all)) return 'فريم كوباية';
    if(/فريم\s*تشكيل/.test(all)) return 'فريم تشكيل';
    if(/فريم\s*كونيكتور/.test(all)) return 'فريم كونيكتور';
    if(/أسبجوت|اسبيجوت|سبجوت|spigot/i.test(all)) return 'أسبجوت';
    if(dept==='sorting' || /منطقة\s*الفرز/.test(all)) return 'منطقة الفرز';
    if(dept==='range' || /رينج\s*فيرت|رينج\s*فيرتي/.test(all)) return 'رينج فيرتكال';

    // Anything not requested above keeps its existing product/department name.
    return dn || name || 'أخرى';
  }
  function selectedIds(){
    try{
      var s=window.store;
      var a=s && s.settings && Array.isArray(s.settings.planMachineIds) ? s.settings.planMachineIds : null;
      if(!a && s && s.settings && Array.isArray(s.settings.planStatusMachineIds)) a=s.settings.planStatusMachineIds;
      return new Set((a||[]).map(sid));
    }catch(e){ return new Set(); }
  }
  function actualForMachine(id, dates){
    var total=0, wanted=new Set(dates), records=(window.store&&window.store.records)||{};
    Object.keys(records).forEach(function(key){
      var p=key.split('_');
      if(p.length<3) return;
      var rid=sid(p[p.length-1]);
      var date=p.slice(0,p.length-2).join('_');
      if(rid!==sid(id) || !wanted.has(date)) return;
      total += Number(records[key] && records[key].actual) || 0;
    });
    return total;
  }
  function esc(v){ return String(v==null?'':v).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c];}); }

  function render(){
    var box=document.getElementById('planProductBreakdown');
    if(!box || typeof window.MACHINES==='undefined') return;

    var base=(document.getElementById('planDate')&&document.getElementById('planDate').value) || new Date().toISOString().slice(0,10);
    var ids=selectedIds();
    if(!ids.size) return;

    var dates=monthDates(base), groups={};
    window.MACHINES.forEach(function(machine){
      var id=sid(machine.id);
      if(!ids.has(id)) return;
      var g=groupName(machine);
      if(!groups[g]) groups[g]={name:g,actual:0,machines:0};
      groups[g].actual += actualForMachine(id,dates);
      groups[g].machines += 1;
    });

    var rows=Object.values(groups).filter(function(x){return x.actual>0 || x.machines>0;});
    rows.sort(function(a,b){return b.actual-a.actual || a.name.localeCompare(b.name,'ar');});
    var monthActual=rows.reduce(function(s,x){return s+x.actual;},0);

    var info=box.querySelector('[data-monthly-plan-group-info]');
    if(!info){
      info=document.createElement('div');
      info.setAttribute('data-monthly-plan-group-info','1');
      box.insertBefore(info,box.firstChild);
    }
    var selectedText=[...ids].map(function(id){
      var mm=window.MACHINES.find(function(x){return sid(x.id)===sid(id);});
      return mm ? mm.name+' ('+mm.id+')' : id;
    }).join(' — ');
    var monthly=(typeof window.getMonthlyPlan==='function') ? Number(window.getMonthlyPlan(base)||0) : 0;
    info.style.cssText='padding:12px 14px;margin-bottom:10px;border:1px solid var(--border);border-radius:12px;background:var(--surface-2);font-weight:800;';
    info.innerHTML='المكن الداخلة في خصم الخطة: '+esc(selectedText||'لم يتم اختيار ماكينة')+'<br><span style="font-size:12px;font-weight:500;color:var(--text-dim)">إجمالي إعداد الخطة الشهري: '+Math.round(monthly)+' قطعة — الإنتاج الفعلي يُسحب من نفس بيانات تسجيل الإنتاج والتقارير.</span>';

    var old=box.querySelector('[data-monthly-plan-grouped-products]');
    if(old) old.remove();
    var wrap=document.createElement('div');
    wrap.setAttribute('data-monthly-plan-grouped-products','1');
    wrap.innerHTML='<div class="report-table-wrap" style="border:0;border-radius:0;margin-top:10px;">'+
      '<table class="report-table">'+
      '<thead><tr><th>المنتج</th><th>عدد الماكينات</th><th>المحقق خلال الشهر</th><th>نسبته من إجمالي المحقق</th></tr></thead><tbody>'+
      (rows.map(function(x){return '<tr><td><b>'+esc(x.name)+'</b></td><td>'+x.machines+'</td><td>'+Math.round(x.actual)+' قطعة</td><td>'+(monthActual>0?Math.round(x.actual/monthActual*1000)/10:0)+'%</td></tr>';}).join('') || '<tr><td colspan="4">اختار المكن من إعداد الخطة أولاً</td></tr>')+
      '</tbody></table></div>';
    box.appendChild(wrap);
  }

  function bind(){
    if(!document.getElementById('planStatusSection')) return;
    render();
  }
  document.addEventListener('click',function(e){
    if(e.target && e.target.closest && (e.target.closest('#planStatusBtn') || e.target.closest('#saveMonthlyPlanBtn') || e.target.closest('#planStatusMachineSelect'))){
      setTimeout(bind,120);
      setTimeout(bind,500);
    }
  },true);
  document.addEventListener('change',function(e){
    if(e.target && (e.target.id==='planDate' || e.target.closest('#planStatusMachineSelect'))) setTimeout(bind,80);
  },true);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind); else bind();
  setInterval(bind,1200);
})();
