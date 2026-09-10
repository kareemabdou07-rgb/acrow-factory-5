/* ACROW Factory 5 v67 — reliable fault delete */
(function(){
'use strict';
if(window.__acrowFaultDeleteFixActive)return;
window.__acrowFaultDeleteFixActive=true;
var STYLE_ID='acrow-fault-delete-fix-v67';
function style(){
 if(document.getElementById(STYLE_ID))return;
 var s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
.fault-item{position:relative!important;padding-left:52px!important;}
.fault-item .f-del{position:absolute!important;left:8px!important;top:50%!important;transform:translateY(-50%)!important;width:36px!important;height:36px!important;padding:0!important;display:flex!important;align-items:center!important;justify-content:center!important;border:1px solid #ff5f6d!important;border-radius:7px!important;background:#3a1c1c!important;color:#ff5f6d!important;font-size:12px!important;z-index:9999!important;cursor:pointer!important;pointer-events:auto!important;}
`;
 document.head.appendChild(s);
}
function save(){try{if(typeof saveStore==='function')saveStore();}catch(e){}}
function redraw(){save();['renderMaintenance','renderFaults','renderFailures','render','renderDashboard'].forEach(function(n){try{if(typeof window[n]==='function')window[n]();}catch(e){}});}
function getInfo(btn){var item=btn.closest('.fault-item');if(!item)return null;var reason=item.querySelector('.f-reason');var mins=item.querySelector('.f-mins');return {item:item,reason:String(reason?reason.textContent:'').replace(/\s+/g,' ').trim(),mins:String(mins?mins.textContent:'').replace(/\s+/g,' ').trim()};}
function match(o,info){if(!o||typeof o!=='object')return false;var reason=String(o.reason||o.category||o.description||o.details||'').replace(/\s+/g,' ').trim();var mins=String(o.minutes!=null?o.minutes:o.mins!=null?o.mins:o.duration!=null?o.duration:'').replace(/\s+/g,' ').trim();return (!!info.reason&&reason===info.reason)|| (!!info.mins&&mins===info.mins);}
function removeIn(obj,info,depth){if(!obj||typeof obj!=='object'||depth>7)return false;if(Array.isArray(obj)){for(var i=0;i<obj.length;i++){if(match(obj[i],info)){obj.splice(i,1);return true;}}for(var j=0;j<obj.length;j++){if(removeIn(obj[j],info,depth+1))return true;}return false;}var keys=Object.keys(obj);for(var k=0;k<keys.length;k++){var v=obj[keys[k]];if(Array.isArray(v)&&/fault|failure|maintenance/i.test(keys[k])){for(var p=0;p<v.length;p++){if(match(v[p],info)){v.splice(p,1);return true;}}}}for(var q=0;q<keys.length;q++){if(removeIn(obj[keys[q]],info,depth+1))return true;}return false;}
function clickDelete(btn){var info=getInfo(btn);if(!info)return;var removed=false;try{if(typeof getRecord==='function'&&typeof dateInput!=='undefined'&&typeof currentShift!=='undefined'){var id=window.selectedMachineId||window.currentMachineId||window.currentFaultMachine||window.faultMachineId||'';if(typeof id==='object')id=id.id||id.machineId||id.code||'';if(id){var r=getRecord(dateInput.value,currentShift,String(id));removed=removeIn(r,info,0);}}}catch(e){}if(!removed){try{if(window.store)removed=removeIn(window.store,info,0);}catch(e){}}if(!removed){try{var raw=localStorage.getItem('acrow_factory_5');if(raw){var data=JSON.parse(raw);if(removeIn(data,info,0)){localStorage.setItem('acrow_factory_5',JSON.stringify(data));removed=true;}}}catch(e){}}if(removed){info.item.remove();redraw();}}
document.addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('.f-del'):null;if(!b)return;e.preventDefault();e.stopImmediatePropagation();clickDelete(b);},true);
function init(){style();document.querySelectorAll('.f-del').forEach(function(b){b.type='button';b.style.pointerEvents='auto';});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
new MutationObserver(init).observe(document.documentElement,{childList:true,subtree:true});
})();
