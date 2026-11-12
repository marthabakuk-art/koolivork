/* engine3: koolipõhine ressursivajadus ja koolide liitmise võrdlus (vana mudeli „Oma kool” loogika) */
function pyFor(yi){
  const wf = Math.pow(1 + (P.wageG||0)/100, yi);
  let tf = 1; if (P.tTarget > 0){ const goal = P.tTarget/90, span = Math.max(1, P.tYear-2026); tf = 1 + (goal-1)*Math.min(1, yi/span); }
  let uf = 1; for (let k=1; k<=yi; k++) uf *= 1 + ((2026+k) <= 2030 ? (P.enG||0) : (P.enG2||0))/100;
  const sf = Math.min(2, Math.pow(1 + (P.supTrend||0)/100, yi)), hs0 = (P.hevShare||0);
  const Py = {...P, opM2: P.opM2*uf, pU: P.pU*sf, pT: Math.max(0, P.pT - hs0*0.5)*sf, pE: Math.max(0, P.pE - hs0*0.15)*sf};
  SAL_KEYS.forEach(k => Py[k] = P[k]*wf*(k==='tSal'?tf:1));
  return Py;
}
function n12For(t, yi){
  if (typeof pullN==='function' && P.pull && SIDX[t.name]!=null){ const hs = Math.min(0.2, (P.hevShare||0)/100 * Math.min(2, Math.pow(1+(P.supTrend||0)/100, yi))); return pullN(yi)[SIDX[t.name]].map((v,g)=> v*(g<9 ? 1-hs : 1)); }
  const src = IDX[P.demo===1 ? 'rv084' : P.demo===2 && IDX.hpk ? 'hpk' : (['hp','hp16','hpnm','hpx'][P.migr||0])];
  const ix = src[t.county] || src[t.county==='Tallinn' ? 'Harju' : t.county];
  const hs = Math.min(0.2, (P.hevShare||0)/100 * Math.min(2, Math.pow(1+(P.supTrend||0)/100, yi)));
  return t.n.map((v,g)=> v*(ix && ix[String(g+7)] ? ix[String(g+7)][Math.min(yi, ix[String(g+7)].length-1)] : 1)*(g<9 ? 1-hs : 1));
}
function calK(t){ return P.calib ? CAL.kn*(CAL.kc[t.county]||1) : 1; }
function schoolCalc(n12, Py, rider, name){
  const nb = n12.slice(0,9), ng = n12.slice(9,12), Nb = nb.reduce((a,b)=>a+b,0), Ng = ng.reduce((a,b)=>a+b,0);
  const s = {id:'S', name, S:1, hub:false, rider};
  const b = Nb>=1 ? basicScenario({...s, N:Nb, n:nb}, Py, null) : null;
  const g = Ng>=1 ? gymScenario({...s, kind:'gym', g:{med:Ng/3, sen:0}, shared: Nb>=1}, Py, null) : null;
  return b && g ? mergeRes(s, Py, b, g) : (b || g);
}
function slim(x, k, extra){
  if (!x) return null;
  const costs = Object.fromEntries(Object.entries(x.costs).map(([c,v])=>[c, v*k]));
  const bl = x.buildings[0] || {};
  const gy = x.gym || (x.parts && x.parts.g && x.parts.g.gym);
  return {N:x.N, costs, total:x.total*k, capital:x.capital, m2:x.m2, teachFTE:x.teachFTE*(P.calib?CAL.kt:1), staffFTE:x.staffFTE, headcount:x.headcount,
    staff:x.staff.filter(z=>z.fte>0.004).map(z=>({cat:z.cat, role:z.role, fte:z.fte, cost:z.cost*k, note:z.note||''})),
    persons:x.persons.map(p=>({n:p.names.map(n=>n.split(' (')[0]).join(' + '), l:p.lessons})),
    rooms:(bl.items||[]).map(i=>[i[0], i[1]]), util: bl.util ? bl.util.gen : null,
    sup:x.sup, groups:(x.groups||[]).map(g=>g.grades.map(v=>v+1).join('+') + (g.k>1?` (${g.k} kl)`:'')), gym: gy ? {k:gy.mixedK} : null, k, ...extra};
}
/* üks kool: tänased (2026) ja prognoositud õpilased, ressursivajadus */
function schoolDetail(name, year){
  const t = SCHOOLS.find(x=>x.name===name); if (!t) return null;
  const yi = Math.max(0, Math.min(14, year-2026)), Py = pyFor(yi), n12 = n12For(t, yi);
  const x = schoolCalc(n12, Py, P.riderF, name); if (!x) return null;
  return slim(x, calK(t), {n12, area: AREA[name]||0, good: COND[name] ? COND[name][0] : null, year});
}
/* koolide liitmine: iga kool eraldi vs üks kool (vastuvõtja = host) */
function mergeCompare(names, year, host, bM2){
  const T = names.map(n=>SCHOOLS.find(x=>x.name===n)).filter(Boolean); if (T.length<2) return null;
  const yi = Math.max(0, Math.min(14, year-2026)), Py = pyFor(yi);
  const parts = T.map(t=>{ const n12=n12For(t,yi), x=schoolCalc(n12, Py, P.riderF, t.name); return x ? slim(x, calK(t), {name:t.name, n12, area:AREA[t.name]||0, good: COND[t.name]?COND[t.name][0]:null}) : null; }).filter(Boolean);
  const H = T.find(t=>t.name===host) || T.slice().sort((a,b)=>b.n.reduce((x,y)=>x+y,0)-a.n.reduce((x,y)=>x+y,0))[0];
  const n12 = Array(12).fill(0); parts.forEach(p=>p.n12.forEach((v,g)=>n12[g]+=v));
  const k = parts.reduce((a,p)=>a+p.k*p.N,0)/Math.max(1, parts.reduce((a,p)=>a+p.N,0));
  const mx = schoolCalc(n12, Py, P.riderF, H.name);
  const M = slim(mx, k, {name:H.name, n12});
  // lisanduv koolivedu: teistest koolidest tulevad õpilased, kes seni koolibussi ei kasutanud
  const moved = parts.filter(p=>p.name!==H.name).reduce((a,p)=>a+p.N,0);
  const bus = moved*P.riderCost*(1-P.riderF/100)*k;
  M.costs['Transport'] = (M.costs['Transport']||0) + bus; M.total += bus; M.busExtra = bus; M.moved = moved;
  const dist = T.map(t=>({name:t.name, km: Math.round(haversine(t,H)*10)/10}));
  const hostArea = AREA[H.name]||0, lack = Math.max(0, M.m2 - hostArea), freed = parts.filter(p=>p.name!==H.name).reduce((a,p)=>a+p.area,0) + Math.max(0, hostArea - M.m2);
  const sepStaff = parts.reduce((a,p)=>a+p.staffFTE,0), layoffFTE = Math.max(0, sepStaff - M.staffFTE);
  const oneoff = {adapt: moved*P.mergeInvest, build: lack*(bM2||IDL.buildM2||4500), severance: P.layoff/100*P.sevMonths*layoffFTE*Py.tSal*EMP, fixed: P.closeFixed*(T.length-1)};
  return {year, host:H.name, parts, M, dist, hostArea, lack, freed, oneoff, layoffFTE};
}

/* ===== ümberkorralduse mõju: kulud koos kapitalikuluga, koolitee, kvaliteet ===== */
const LVG = {L:[0,1,2,3,4,5], P:[6,7,8], G:[9,10,11]};
const qEst = (name, st) => { const q=QUAL.s[name]; if (!q) return null; const lo=q[st==='g'?2:0], hi=q[st==='g'?3:1]; return lo==null ? null : (lo+hi)/2; };
const crfOf = (r, n) => r>0 ? r/(1-Math.pow(1+r,-n)) : 1/n;
// rS: renoveerimise hind osana uusehitusest (vaikimisi renovShare); senise praktika säilitamisel maintShare
function bldInv(name, need, Q, pNew, rS0){ const a=AREA[name]||0, good=COND[name]?COND[name][0]:0.4, bM2=Q.buildM2||4500, rS=rS0!=null ? rS0 : (Q.renovShare||60)/100;
  return Math.min(a,need)*(1-good)*rS*bM2 + Math.max(0,need-a)*(pNew||bM2); }
function structQ(x, n12){ if (!x) return {liit:0, low:0};
  const liit = (x.groups||[]).filter(g=>g.grades.length>1).reduce((a,g)=>a+g.grades.reduce((b,k)=>b+(n12[k]||0),0),0);
  return {liit, low: x.persons.filter(p=>p.lessons<12).length, persons:x.persons.length}; }
/* tugevad gümnaasiumid, millel on õpilaskodu */
const DQ = new Set(SCHOOLS.map((t,i)=>(t.L3 && !t.priv && qStatus(t,'g',P)===1 && (VOC.gd[t.name]||0)>0) ? i : -1).filter(i=>i>=0));
/* host = vastuvõttev kool; moves = [{name, lv:['L','P','G']}] (host ise lv:[]) */
function reorgCompare(R, Q, host, moves, year){
  const yi = Math.max(0, Math.min(14, year-2026)), Py = pyFor(yi), H = SCHOOLS[SIDX[host]]; if (!H) return null;
  const names = [...new Set([host, ...moves.map(m=>m.name)])].filter(n=>SIDX[n]!=null);
  const lam = (Q.schoolEff!=null ? Q.schoolEff : 30)/100, rate = (Q.dormRate||4)/100, life = Q.schLife||40, tA = Q.tA||60;
  const mv = {}; moves.forEach(m=>{ mv[m.name] = new Set(m.lv); });
  const before = [], after = []; const nH = Array(12).fill(0);
  let opB=0, opA=0, invB=0, invA=0, staffB=0, staffA=0, teachB=0, teachA=0, Nmoved=0, sB={liit:0,low:0}, sA={liit:0,low:0};
  const pAfter = {}, mS = (Q.maintShare||30)/100;   // enne: koolid eraldi, õpikeskkonna säilitamine (sama mis senise praktika stsenaariumis); pärast: vastuvõttev kool renoveeritakse täies mahus
  names.forEach(n=>{ const t=SCHOOLS[SIDX[n]], n12=n12For(t,yi), k=calK(t), x=schoolCalc(n12, Py, P.riderF, n);
    if (!x) return; const sq=structQ(x,n12);
    before.push({name:n, N:x.N, cost:x.total*k, costs:Object.fromEntries(Object.entries(x.costs).map(([c,v])=>[c,v*k])), teach:x.teachFTE, staff:x.staffFTE, m2:x.m2, inv:bldInv(n,x.m2,Q,null,mS), liit:sq.liit, low:sq.low});
    opB+=x.total*k; invB+=bldInv(n,x.m2,Q,null,mS); staffB+=x.staffFTE; teachB+=x.teachFTE; sB.liit+=sq.liit; sB.low+=sq.low;
    const m = n===host ? new Set() : (mv[n]||new Set()), rest = n12.map((v,g)=> [...m].some(l=>LVG[l].includes(g)) ? 0 : v);
    n12.forEach((v,g)=>{ if (n===host || rest[g]===0 && v>0) nH[g]+=v; });
    if (n!==host){ const NR=rest.reduce((a,b)=>a+b,0), moved=n12.reduce((a,b)=>a+b,0)-NR; Nmoved+=moved;
      if (NR>=1){ const y=schoolCalc(rest, Py, P.riderF, n), s2=structQ(y,rest); after.push({name:n, N:y.N, cost:y.total*k, teach:y.teachFTE, staff:y.staffFTE, m2:y.m2, inv:bldInv(n,y.m2,Q,null,mS), liit:s2.liit, low:s2.low}); }
      else after.push({name:n, N:0, cost:0, teach:0, staff:0, m2:0, inv:0, liit:0, low:0, closed:true}); } });
  const siA0 = Object.values(R.siteInfo).find(s=>s.keepers && s.keepers.G && s.keepers.G.includes(host) && s.kinds.includes('A')), newG = !!siA0 && !H.L3, pNewH = newG ? (Q.stateM2||Q.buildM2) : null;
  const kH = calK(H), xh = schoolCalc(nH, Py, P.riderF, host), sh = structQ(xh, nH);
  const bus = Nmoved*P.riderCost*(1-P.riderF/100)*kH;
  after.unshift({name:host, N:xh.N, cost:xh.total*kH + bus, costs:Object.fromEntries(Object.entries(xh.costs).map(([c,v])=>[c,v*kH])), teach:xh.teachFTE, staff:xh.staffFTE, m2:xh.m2, inv:bldInv(host,xh.m2,Q,pNewH), liit:sh.liit, low:sh.low, host:true});
  after.forEach(a=>{ opA+=a.cost; invA+=a.inv; staffA+=a.staff; teachA+=a.teach; sA.liit+=a.liit; sA.low+=a.low; });
  const layoff = Math.max(0, staffB-staffA), oneoff = {adapt:Nmoved*P.mergeInvest, sev:P.layoff/100*P.sevMonths*layoff*Py.tSal*EMP, fixed:P.closeFixed*Math.max(1,names.length-1)};
  const one = oneoff.adapt+oneoff.sev+oneoff.fixed, capB = invB*crfOf(rate,life), capA = invA*crfOf(rate,life) + one*crfOf(rate,15);
  const net = (opB+capB) - (opA+capA);
  // koolitee ja ligipääs: ruudud, mille lähim tänane kool sellel astmel on liikuva astmega kool
  const SQT = R.SQT || (R.SQT = statusQuoTravel(R, Q)), D=R.D, hi = SIDX[host], hostObj = {i:hi, lat:H.lat, lon:H.lon, pt:TPT[hi]};
  const hostStrongG = qStatus(H,'g',P)===1, siA = Object.values(R.siteInfo).find(s=>s.keepers && s.keepers.G && s.keepers.G.includes(host) && s.kinds.includes('A'));
  const tr = {w:0, b:0, a:0, over60:0, over60b:0, gOver:0, gOverB:0}, acc = {w:0, before:0, after:0, afterD:0, beforeD:0}, tl = {}, hostDorm = (VOC.gd[host]||0)>0 || !!siA;
  ['L','P','G'].forEach(lv=>{ const src = names.filter(n=>n!==host && mv[n] && mv[n].has(lv)).map(n=>SIDX[n]); if (!src.length) return; const S=new Set(src);
    const Ts = lv==='G' ? [R.A,R.B] : [lv==='L'?R.L:R.P];
    for (let i=0;i<D.length;i++){ if (!S.has(SQT[lv].who[i])) continue; const w=Ts.reduce((a,T)=>a+(T.w[i]||0)*T.grades,0); if (!(w>0)) continue;
      const tb=Math.min(SQT[lv].t[i],120), ta=Math.min(idlTravel(D[i], hostObj, Q).t,120); tr.w+=w; tr.b+=w*tb; tr.a+=w*ta; const L=tl[lv]=tl[lv]||{w:0,b:0,a:0}; L.w+=w; L.b+=w*tb; L.a+=w*ta; if (ta>60) tr.over60+=w; if (tb>60) tr.over60b+=w; if (lv==='G'){ if (ta>tA) tr.gOver+=w; if (tb>tA) tr.gOverB+=w; }
      if (lv==='G'){ acc.w+=w; const okB = SQT.GQ.t[i]<=tA, okA = okB || ((hostStrongG || newG) && ta<=tA); if (okB) acc.before+=w; if (okA) acc.after+=w; const okBD = okB || DQ.has(SQT.GQ.who[i]) && SQT.GQ.t[i]<=120, okAD = okA || okBD || ((hostStrongG || newG) && hostDorm); if (okBD) acc.beforeD+=w; if (okAD) acc.afterD+=w; } } });
  // edasiõpe: liikuvad õpilased saavad osa (λ) vastuvõtva kooli ja oma kooli tulemuse vahest
  const qd = {g:{n:0, b:0, a:0, hi:0, lo:0, gp:0, co:0}, b:{n:0, b:0, a:0, hi:0, lo:0, gp:0, co:0}};
  const estH = {g: newG || (!qEst(host,'g') && siA) ? (Q.newGymQ||49)/100 : (qEst(host,'g') ?? QUAL.g.med), b: qEst(host,'b') ?? QUAL.b.med};
  names.filter(n=>n!==host).forEach(n=>{ const t=SCHOOLS[SIDX[n]], n12=n12For(t,yi), m=mv[n]||new Set();
    [['g',['G']],['b',['L','P']]].forEach(([st,lvs])=>{ const N = lvs.filter(l=>m.has(l)).reduce((a,l)=>a+LVG[l].reduce((b,g)=>b+n12[g],0),0); if (!N) return;
      const e0 = qEst(n,st) ?? QUAL[st].med, e1 = e0 + lam*(estH[st]-e0), q=qd[st], ng=lvs.filter(l=>m.has(l)).reduce((a,l)=>a+LVG[l].length,0); q.n+=N; q.b+=N*e0; q.a+=N*e1; q.gp+=N*(estH[st]-e0); q.co+=N*(e1-e0)/ng; if (estH[st]>e0+0.03) q.hi+=N; else if (estH[st]<e0-0.03) q.lo+=N; }); });
  ['g','b'].forEach(k=>{ const q=qd[k]; q.extra = q.a-q.b; q.gap = q.n? q.gp/q.n : null; q.b = q.n? q.b/q.n : null; q.a = q.n? q.a/q.n : null; });
  return {year, host, names, before, after, opB, opA, invB, invA, capB, capA, capInvA:invA*crfOf(rate,life), capOne:one*crfOf(rate,15), life, oneoff, one, net, layoff, Nmoved, bus, staffB, staffA, teachB, teachA, sB, sA,
    travel:{byLv:Object.fromEntries(Object.entries(tl).map(([k,o])=>[k,{b:o.b/o.w, a:o.a/o.w, N:o.w}])), N:tr.w, before:tr.w?tr.b/tr.w:null, after:tr.w?tr.a/tr.w:null, over60:tr.w?tr.over60/tr.w:0, over60b:tr.w?tr.over60b/tr.w:0},
    access:{N:acc.w, before:acc.before, after:acc.after, beforeD:acc.beforeD, afterD:acc.afterD}, dorm:{need:tr.gOver, needB:tr.gOverB, places:VOC.gd[host]||0, planned:!!siA}, qd, lam, estH, hostNew: newG || (!qEst(host,'g') && !!siA), newG, hostStrongG, hostDorm};
}
/* iga gümnaasiumipiirkonna otsused ideaalse võrgu põhjal: vastuvõttev kool + sinna liikuvad kooliastmed */
function decisions(R, Q, year){
  const SQT = R.SQT || (R.SQT = statusQuoTravel(R, Q)); pkgMaps(R);
  const byHost = {};
  SCHOOLS.forEach(t=>{ if (t.priv || t.hev || t.adult) return; const r=schoolRole(R,t); r.move.forEach(m=>{ if (!m.to || !m.to.name || m.to.name===t.name) return; const h=byHost[m.to.name]=byHost[m.to.name]||{}; (h[t.name]=h[t.name]||[]).push(m.l); }); });
  const out = Object.entries(byHost).map(([host, mm])=>{ const r = reorgCompare(R, Q, host, Object.entries(mm).map(([name,lv])=>({name, lv})), year); if (!r) return null;
    const H=SCHOOLS[SIDX[host]]; r.pk = R.pkSchool[host]; r.kov=H.kov; r.county=H.county; r.region=regOfCounty(H.county); r.moves=mm; r.addLv = schoolRole(R,H).add; return r; }).filter(Boolean);
  // piirkondade ligipääs tugevale akadeemilisele gümnaasiumile täna
  const pkAcc = {}; for (let i=0;i<R.D.length;i++){ const a=R.pkCell[i]; if (a<0) continue; const w=(R.A.w[i]+R.B.w[i])*3; if (!(w>0)) continue; const o=pkAcc[a]=pkAcc[a]||[0,0,0]; o[0]+=w; const ok=SQT.GQ.t[i]<=(Q.tA||60); if (ok) o[1]+=w; if (ok || DQ.has(SQT.GQ.who[i]) && SQT.GQ.t[i]<=120) o[2]+=w; }
  const pkName = a => (R.siteInfo[a] && R.siteInfo[a].label) || (R.C[a] && R.C[a].name) || String(a);
  const pks = {}; Object.entries(pkAcc).forEach(([a,o])=>{ pks[a] = {a:+a, name:pkName(a), acc:o[1]/o[0], accD:o[2]/o[0], N:o[0], kovs:(R.pkKov&&R.pkKov[a])||[], region: R.C[a] ? regOfCounty(SCHOOLS[R.C[a].i].county) : ''}; });
  return {dec: out, pks, dorm: dormStats(R,Q), stateM2:Q.stateM2, newGymQ:Q.newGymQ, tA: Q.tA||60, lam:(Q.schoolEff!=null?Q.schoolEff:30)};
}

function reorgBrief(r){ return r && {host:r.host, net:r.net, opB:r.opB, opA:r.opA, capB:r.capB, capA:r.capA, one:r.one, qx:(r.qd.g.extra||0)+(r.qd.b.extra||0), co:(r.qd.g.co||0)+(r.qd.b.co||0), gB:r.qd.g.b, gA:r.qd.g.a, bB:r.qd.b.b, bA:r.qd.b.a, tB:r.travel.before, tA:r.travel.after, over60:r.travel.over60, tl:r.travel.byLv, dorm:r.hostDorm, dN:r.dorm.need, dNB:r.dorm.needB, dP:r.dorm.places, dPl:r.dorm.planned, acc:r.access.after-r.access.before, liit:r.sB.liit-r.sA.liit}; }

/* õpilaskodude roll: kui palju gümnaasiumiealisi on kaugemal kui tA tugevast gümnaasiumist ja kas õpilaskodu lahendab */
function dormStats(R, Q){ const SQT = R.SQT || (R.SQT = statusQuoTravel(R, Q)), tA=Q.tA||60; let tot=0, far=0, farD=0, far90=0; const byS={};
  for (let i=0;i<R.D.length;i++){ const w=(R.A.w[i]+R.B.w[i])*3; if (!(w>0)) continue; tot+=w; const t=SQT.GQ.t[i]; if (t<=tA) continue; far+=w; if (t>90) far90+=w; const j=SQT.GQ.who[i]; if (DQ.has(j)) farD+=w; byS[j]=(byS[j]||0)+w; }
  const strong = SCHOOLS.filter(t=>t.L3 && !t.priv && qStatus(t,'g',P)===1), withD = strong.filter(t=>(VOC.gd[t.name]||0)>0);
  return {tot, far, farD, far90, tA, nStrong:strong.length, nStrongD:withD.length, places:withD.reduce((a,t)=>a+VOC.gd[t.name],0), top:Object.entries(byS).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([j,w])=>({name:SCHOOLS[j].name, w, dorm:VOC.gd[SCHOOLS[j].name]||0}))}; }
