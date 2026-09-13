/* ACROW Factory 5 — v223 production selector fix */
(function(){'use strict';
var IDS=['2','8','9','10','forming-frame'];
var NAMES={'2':'مكبس فريم كونكتور','8':'تليسكوب','9':'شور برس','10':'اسبيجوت','forming-frame':'فريم تشكيل'};
function ensure(){try{
 if(typeof DEPARTMENTS!=='undefined'&&Array.isArray(DEPARTMENTS)&&!DEPARTMENTS.some(function(d){return d&&d.id==='daily'}))DEPARTMENTS.push({id:'daily',name:'ماكينات إنتاج اليوم',target:0,count:5,prefix:'PD'});
 if(typeof MACHINES!=='undefined'&&Array.isArray(MACHINES))IDS.forEach(function(id){var m=MACHINES.find(function(x){return String(x&&x.id)===id;});if(!m)MACHINES.push({id:id,name:NAMES[id],dept:'daily',deptName:'ماكينات إنتاج اليوم',target:null});else{m.name=NAMES[id];m.dept='daily';m.deptName='ماكينات إنتاج اليوم';}});
}catch(e){}}
function rebuild(){ensure();try{if(typeof window.rebuildMachines==='function')window.rebuildMachines();}catch(e){}try{if(typeof window.renderAll==='function')window.renderAll();}catch(e){}}
function boot(){rebuild();[200,700,1500,3000].forEach(function(t){setTimeout(rebuild,t);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
