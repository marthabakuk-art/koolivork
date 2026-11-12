importScripts('engine.js','engine4.js','engine2.js','engine3.js');
// eelarve parameetrid ei muuda võrku: nende muutmisel arvutatakse ainult eelarve uuesti
const BUDGET_KEYS = ['annBFix','schoolEff','capShare','capYears','capStart','commitLvl','hevShare','specShare','regKey'];
const CACHE = new Map();
const ready = () => new Promise(r=>{ const w=()=>ROAD?r():setTimeout(w,100); w(); });
const sKey = Q => JSON.stringify([P.demo, P.migr, P.pull, P.kovReact, P.kovThr, P.upSplit, Object.keys(Q).sort().filter(k=>!BUDGET_KEYS.includes(k)).map(k=>[k,Q[k]])]);
const getR = Q => { const k=sKey(Q); if (!CACHE.has(k)){ if (CACHE.size>8) CACHE.delete(CACHE.keys().next().value); const R=runR(Q); pkgMaps(R); CACHE.set(k, R); } return CACHE.get(k); };
onmessage = async e => {
  const m = e.data; await ready();
  try{
    if (m.P) Object.assign(P, m.P);
    const Q = {...IDL, ...(m.Q||{})};
    if (m.cmd==='school'){ postMessage({id:m.id, ok:true, D:schoolDetail(m.name, m.year)}); return; }
       if (m.cmd==='merge'){ const R=getR(Q), part = m.moves && Object.keys(m.moves).length;
         const M = part ? {host:m.host, partial:true} : mergeCompare(m.names, m.year, m.host, Q.buildM2);
         if (M){ const mv = n => part ? (m.moves[n]||[]) : ['L','P','G'];
           M.RG = reorgCompare(R, Q, M.host, m.names.filter(n=>n!==M.host).map(n=>({name:n, lv:mv(n)})), m.year);
           if (!part) M.alt = m.names.map(h=>reorgBrief(reorgCompare(R, Q, h, m.names.filter(n=>n!==h).map(n=>({name:n, lv:['L','P','G']})), m.year))); }
         postMessage({id:m.id, ok:true, M}); return; }
       if (m.cmd==='budgetU'){ const R=getR(Q); if (!R.SQT) R.SQT=statusQuoTravel(R,Q); pkgMaps(R); const bp=budgetPlan(R,{...Q, annBFix:m.annB}); const UB=budgetView(R,Q,bp); const pick={}; Object.entries(UB).forEach(([k,v])=>{ if (/^(EE|county|kov):/.test(k)) pick[k]={N:v.N, sch:v.sch, ppB:v.ppB, phi:v.phi, cost:v.cost, inv:v.inv, invDef:v.invDef, invDefNet:v.invDefNet, cmUnf:v.cmUnf, spent:v.spent, sav:v.sav}; }); postMessage({id:m.id, ok:true, UB:pick, done:doneYears(R, Q, m.annB*1e6), annB:bp.annB, nDone:bp.nDone, nAll:bp.pk.length}); return; }
       if (m.cmd==='dec'){ const R=getR(Q); postMessage({id:m.id, ok:true, D:decisions(R, Q, m.year||2030)}); return; }
       if (m.cmd==='fc'){ const nm=P.nominal, cp=P.cpi; P.nominal=m.nominal?1:0; if (m.cpi!=null) P.cpi=m.cpi; let F; try{ F=fcRun(); } finally { P.nominal=nm||0; P.cpi=cp; } F.nominal=!!m.nominal; postMessage({id:m.id, ok:true, F}); return; }
    if (m.cmd==='opt'){ const out={}; for (const y of m.years){ out[y]=siteCount(getR({...Q, year:y})); } postMessage({id:m.id, ok:true, opt:out}); return; }
    const f = m.force||{}, hasF = (f.open||[]).length || (f.close||[]).length;
    if (!hasF){ postMessage({id:m.id, ok:true, X:pack(getR(Q), Q)}); return; }
    // otsused: võrdlus sama eeldustega baasiga; muutub ainult otsuste ümbrus (vaikimisi 40 km)
    const R0 = getR(Q), pts=[...(f.open||[]).map(o=>o.name), ...(f.close||[])].map(n=>SCHOOLS.find(t=>t.name===n)).filter(Boolean);
    const Qf = {...Q, force:f, lock:{A:R0.A.all, B:R0.B.S, P:R0.P.all, L:R0.L.all}, lockC:pts.map(t=>({lat:t.lat, lon:t.lon})), lockR:m.radius||40};
    const R1 = runR(Qf);
    postMessage({id:m.id, ok:true, X:pack(R1, Q), X0:pack(R0, Q)});
  }catch(err){ postMessage({id:m.id, ok:false, err:String(err && err.stack || err)}); }
};
