/* ACROW Factory 5 — retired legacy five-machine selection lock. */
(function(){
  'use strict';
  try { localStorage.removeItem('acrow_daily_extra_lock_v1'); } catch(e) {}
  try {
    if (typeof store !== 'undefined' && store && store.settings) {
      delete store.settings.dailyMachineIdsLocked;
    }
  } catch(e) {}
})();
