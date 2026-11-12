/* ===== Koolivõrgu arendusmudel: koondamine tasanditele, tänane olukord, eelarve ===== */
const REG7 = ['Tallinn','Harjumaa','Tartu ja Jõgeva','Lääne-Eesti','Kesk-Eesti','Lõuna-Eesti','Ida-Virumaa'];
const regOfCounty = c => REGOF[c] || 'Harjumaa';
const TPT = (()=>{ return SCHOOLS.map(t=>{ let bd=1e9, dep=0; GRIDD.cl.forEach(g=>{ const d=Math.abs(g[0]-t.lat)*111+Math.abs(g[1]-t.lon)*58; if (d<bd){bd=d; dep=g[9];} }); return dep>=40; }); })();
const SIDX = {}; SCHOOLS.forEach((t,i)=>SIDX[t.name]=i);
/* hiljuti renoveeritud hooned, mille seisukord ehitisregistri järgi on vale (kasutaja teave) */
const RENOV_OK = ['Tallinna 21. Kool'];
RENOV_OK.forEach(n=>{ if (COND[n]) COND[n][0]=1; else COND[n]=[1,null]; });

/* tänase võrgu koolitee: iga ruudu lähim tänane kool igal astmel (kooli enda transport; ühistransport tiheda liiniga linnades) */
function statusQuoTravel(R, Q){
  const D = R.D, n = D.length, lv = {L:t=>t.L1 && !t.priv, P:t=>t.L2 && !t.priv, G:t=>t.L3 && !t.priv, GQ:t=>t.L3 && !t.priv && qStatus(t,'g',P)===1};
  const out = {};
  Object.entries(lv).forEach(([k,f])=>{
    const cand = SCHOOLS.map((t,i)=>({t,i})).filter(o=>f(o.t) && (typeof sqOpen!=='function' || sqOpen(o.i, k, Q.year))), tt = new Float32Array(n), who = new Int16Array(n);
    for (let i=0;i<n;i++){ const d=D[i];
      const near = cand.map(o=>({o, h:Math.abs(o.t.lat-d.lat)*111+Math.abs(o.t.lon-d.lon)*58})).sort((a,b)=>a.h-b.h).slice(0,6);
      let bt=1e9, bi=-1; near.forEach(({o})=>{ const tr=idlTravel(d, {i:o.i, lat:o.t.lat, lon:o.t.lon, pt:TPT[o.i]}, Q); if (tr.t<bt){ bt=tr.t; bi=o.i; } });
      tt[i]=bt; who[i]=bi; }
    out[k] = {t:tt, who}; });
  return out;
}

/* asukoha "hoidja" iga kooliastme kohta: asula suurim tänane kool, mis seda astet pakub (linnas 1,5 km, mujal 3 km); igal astmel on iga kool ainult ühe asukoha hoidja */
const LVK = {L:'L1', P:'L2', G:'L3'}, lvOfK = k => k==='L'?'L':k==='P'?'P':'G';
function labelSites(R){
  const SIv = Object.values(R.siteInfo), size = t => t.n.reduce((x,y)=>x+y,0);
  SIv.forEach(si=>{ si.keeper = {}; si.levels = [...new Set(si.kinds.map(lvOfK))]; });
  ['G','P','L'].forEach(l=>{ const used = new Set();
    SIv.filter(si=>si.levels.includes(l)).sort((a,b)=>b.N-a.N).forEach(si=>{ const r = TPT[si.c.i] ? 2.0 : 3.0;
      const cand = SCHOOLS.filter(t=>!t.priv && !t.hev && !t.adult && !used.has(t.name) && haversine(t,si.c)<=r);
      // gümnaasiumi asukoha nimeks eelistatakse kooli, kus täna on gümnaasiumiaste (kuni 6 km); muidu suurim lähedal asuv kool, mille hoonesse gümnaasium tuleks
      const gymNear = l==='G' && !cand.some(t=>t.L3) ? SCHOOLS.filter(t=>t.L3 && !t.priv && !t.hev && !t.adult && !used.has(t.name) && haversine(t,si.c)<=6).sort((a,b)=>haversine(a,si.c)-haversine(b,si.c)).slice(0,1) : [];
      const pool = cand.filter(t=>t[LVK[l]]).length ? cand.filter(t=>t[LVK[l]]) : gymNear.length ? gymNear : cand;
      const need = Math.max(1, Object.entries(si.nkK||{}).filter(([k])=>lvOfK(k)===l).reduce((x,[k,v])=>x+v,0));
      const forced = new Set(((R.Q.force||{}).open||[]).filter(o=>o.tier==='keep' || lvOfK(o.tier)===l).map(o=>o.name));
      const fc = cand.filter(t=>forced.has(t.name)), pool2 = fc.concat(pool.filter(t=>!forced.has(t.name)).sort((a,b)=>size(b)-size(a)));
      const fb = () => { const c0=SCHOOLS[si.c.i]; if (!c0.hev && !c0.adult) return c0; let b=null, d=1e9; SCHOOLS.forEach(t=>{ if (t.hev||t.adult||t.priv) return; const x=haversine(t,si.c); if (x<d){d=x;b=t;} }); return b||c0; };
      const picks = pool2.length ? pool2.slice(0,need) : [fb()];
      si.keeper[l] = picks[0].name; si.keepers = si.keepers||{}; si.keepers[l] = picks.map(t=>t.name); picks.forEach(t=>used.add(t.name)); }); });
  SIv.forEach(si=>{ const top = si.levels.includes('G')?'G':si.levels.includes('P')?'P':'L'; si.label = si.keeper[top]; si.labelT = SCHOOLS[SIDX[si.label]]; });
}
function siteLabel(si){ return si.label || si.c.name; }
function schoolRole(R, t){
  const SIv=Object.values(R.siteInfo), has = {L:t.L1, P:t.L2, G:t.L3};
  const keepSite = l => SIv.find(s=>s.keepers && s.keepers[l] && s.keepers[l].includes(t.name));
  const nearest = l => { let b=null, d=1e9; SIv.forEach(s=>{ if (!s.levels.includes(l)) return; const k=SCHOOLS[SIDX[s.keeper[l]]]||s.c, x=haversine(k,t); if (x<d){d=x;b=s;} }); return b ? {name:b.keeper[l], d} : null; };
  const keep=[], move=[], add=[]; let home=null;
  ['G','P','L'].forEach(l=>{ const ks=keepSite(l); if (ks && !home) home=ks; if (has[l]){ if (ks) keep.push(l); else move.push({l, to:nearest(l)}); } else if (ks) add.push(l); });
  keep.reverse();
  const code = !keep.length && !add.length ? 'liitub' : move.length ? 'muutub' : add.length ? 'laieneb' : 'jatkab', si=home;
  return {code, keep, move:move.reverse(), add, siteName: si ? si.label : null, site: si ? {N:si.N, area:si.area, exArea:si.exArea, perm:si.perm, renA:si.renA, inv:si.inv, invNew:si.invNew, invRen:si.invRen, kinds:si.kinds, nk:si.nk, isA:si.kinds.includes('A')} : null};
}

/* kulude jaotus laste elukoha järgi: iga kooli / optimaalse asukoha osa omavalitsuste kaupa */
const ctyN = c => c==='Tallinn' ? 'Harju' : c;
const KOVCTY = (()=>{ const m={}; SCHOOLS.forEach(t=>{ if (!m[t.kov]) m[t.kov]=ctyN(t.county); }); return m; })();
function resShares(R){
  if (R.RS) return R.RS; const D=R.D, n=D.length, SQT=R.SQT, kn=i=>BKOV.names[BKOV.kv[i]];
  const site={}, sch={}, add=(o,k,kv,w)=>{ const a=o[k]=o[k]||{}; a[kv]=(a[kv]||0)+w; };
  const tiers=[[R.L,R.L.grades],[R.P,3],[R.A,3],[R.B,3]];
  for (let i=0;i<n;i++){ const kv=kn(i); KOVCTY[kv]=KOVCTY[kv]||ctyN(D[i].county);
    tiers.forEach(([T,g])=>{ const w=(T.w[i]||0)*g; if (!(w>0)) return; const j=T.e.as[i]; if (j>=0) add(site,j,kv,w); });
    [['L',R.L.w[i]*R.L.grades],['P',R.P.w[i]*3],['G',(R.A.w[i]+R.B.w[i])*3]].forEach(([lv,w])=>{ if (!(w>0)) return; const t=SQT[lv].who[i]; if (t>=0) add(sch,t,kv,w); }); }
  const norm=o=>{ Object.keys(o).forEach(k=>{ const a=o[k], tot=Object.values(a).reduce((x,v)=>x+v,0); Object.keys(a).forEach(kv=>a[kv]/=tot); }); return o; };
  return R.RS={site:norm(site), sch:norm(sch)}; }
const keysKov = kv => [['reg',regOfCounty(KOVCTY[kv]||'Harju')],['county',KOVCTY[kv]||'Harju'],['kov',kv]];
/* koondmõõdikud igal tasandil: Eesti, piirkond (7), koolipiirkond (A), KOV, kool */
function summarize(R, Q){
  const D=R.D, n=D.length, SQT = R.SQT || (R.SQT = statusQuoTravel(R, Q)), E=R.econ;
  const unitKey = { reg: i=>regOfCounty(D[i].county), kov: i=>BKOV.names[BKOV.kv[i]] };
  const U = {}; const u = (lvl, key) => { const k=lvl+':'+key; return U[k] = U[k] || {lvl, key, sch:0, N25:0, Nh:0, cur:0, binv:0, bren:0, sites:0, siteN:0, ideal:0, inv:0, invNew:0, invRen:0, dormInv:0, area:0, areaBad:0, exUsed:0,
    tw:{L:[0,0,0,0],P:[0,0,0,0],G:[0,0,0,0],V:[0,0,0,0]}, acc:[0,0,0], dorm:0, vdorm:0, trans:0, cells:0}; };
  // tänased koolid
  const RS = resShares(R);
  SCHOOLS.forEach((t,i)=>{ const sq=R.SQ[t.name]; if (t.hev || t.adult) return; const keys=[['EE','Eesti'],['reg',regOfCounty(t.county)],['county',ctyN(t.county)],['kov',t.kov]];
    const op = typeof sqAny!=='function' || sqAny(i, Q.year); keys.forEach(([l,k])=>{ const x=u(l,k); if (op) x.sch++; x.N25+=t.n.reduce((a,b)=>a+b,0);
      const ar=AREA[t.name]||0, bad=1-(COND[t.name]?COND[t.name][0]:0.4); x.area+=ar; x.areaBad+=ar*bad; });
    if (!sq) return; const sh = RS.sch[i] || {[t.kov]:1};
    const put = x => (f) => { x.Nh+=sq.N*f; x.cur+=sq.c*f; x.binv+=(sq.inv||0)*f; x.bren+=(sq.ren||0)*f; };
    put(u('EE','Eesti'))(1); Object.entries(sh).forEach(([kv,f])=>keysKov(kv).forEach(([l,k])=>put(u(l,k))(f))); });
  // ideaalsed asukohad
  Object.values(R.siteInfo).forEach(si=>{ const c=si.labelT||si.c, keys=[['EE','Eesti'],['reg',regOfCounty(c.county)],['county',ctyN(c.county)],['kov',c.kov]];
    keys.forEach(([l,k])=>{ const x=u(l,k); x.sites+=Math.max(1,...Object.values(si.nkK||{1:1})); x.exUsed+=(si.exArea||0)/0.95; });
    const sh = RS.site[si.j] || {[c.kov]:1}, put = x => f => { x.siteN+=si.N*f; x.ideal+=si.cost*f; x.inv+=si.inv*f; x.invNew+=si.invNew*f; x.invRen+=si.invRen*f; };
    put(u('EE','Eesti'))(1); Object.entries(sh).forEach(([kv,f])=>keysKov(kv).forEach(([l,k])=>put(u(l,k))(f))); });
  // ruudud: koolitee täna ja ideaalis, ligipääs gümnaasiumile, transport ja õpilaskodu
  const tiers = {L:[R.L], P:[R.P], G:[R.A,R.B], V:[R.V]}, qa = Q.tA;
  for (let i=0;i<n;i++){ const keys=[['EE','Eesti'],['reg',unitKey.reg(i)],['county',ctyN(D[i].county)],['kov',unitKey.kov(i)]];
    Object.entries(tiers).forEach(([lv,Ts])=>{ Ts.forEach(T=>{ const w=T.w[i]*T.grades; if (!(w>0)) return; const ti=T.ct[i]; const sq = lv==='V' ? (ti>=0?ti:null) : SQT[lv].t[i];
      keys.forEach(([l,k])=>{ const x=u(l,k), a=x.tw[lv]; if (sq!=null){ a[0]+=w; a[1]+=w*Math.min(sq,120); } if (ti>=0){ a[2]+=w*ti; a[3]+=w; } if (ti===-1){ if (lv==='V') x.vdorm+=w; else x.dorm+=w; } if (lv!=='V') x.trans+=T.cc[i];
        if (lv==='G'){ x.acc[0]+=w; if (SQT.GQ.t[i]<=qa) x.acc[1]+=w;  } }); }); });
    // B-tasandi õpilased: ligipääs A-koolile arvestatakse nende A-määramise kauguse järgi (sama ruut)
  }
  // B-õpilastel on sama ligipääs A-koolile kui A-õpilastel samas ruudus: skaleerime A-osa kogu vanuserühmale
  Object.values(U).forEach(x=>{ const t=x.tw;
    x.tNow = {L:t.L[0]?t.L[1]/t.L[0]:null, P:t.P[0]?t.P[1]/t.P[0]:null, G:t.G[0]?t.G[1]/t.G[0]:null, V:t.V[3]?t.V[2]/t.V[3]:null};
    x.tIdeal = {L:t.L[3]?t.L[2]/t.L[3]:null, P:t.P[3]?t.P[2]/t.P[3]:null, G:t.G[3]?t.G[2]/t.G[3]:null, V:t.V[3]?t.V[2]/t.V[3]:null};
    x.accNow = x.acc[0]? x.acc[1]/x.acc[0] : null;
    x.ideal += x.trans; x.idealPP = x.siteN ? x.ideal/x.siteN : null; x.curPP = x.Nh ? x.cur/x.Nh : null;
    x.sav = (x.curPP && x.idealPP) ? (x.curPP - x.idealPP) * x.siteN : null;
    x.freed = Math.max(0, x.area - x.exUsed); x.invTot = x.inv; });
  // A-ligipääs ideaalis: A-tasandi määramise järgi
  const accA = {}; for (let i=0;i<n;i++){ const T=R.A, w=(R.A.w[i]+R.B.w[i])*3; if (!(w>0)) continue; const ti=T.ct[i]; const ok = ti>=0 && ti<=qa;
    [['EE','Eesti'],['reg',unitKey.reg(i)],['county',ctyN(D[i].county)],['kov',unitKey.kov(i)]].forEach(([l,k])=>{ const a=accA[l+':'+k]=accA[l+':'+k]||[0,0]; a[0]+=w; if (ok) a[1]+=w; }); }
  Object.entries(accA).forEach(([k,a])=>{ if (U[k]) U[k].accIdeal = a[1]/a[0]; });
  // dorm investments by region from econ.regions (A-piirkonnad) -> approximate to reg/kov via A-site location
  E.regions.forEach(r=>{ [['EE','Eesti'],['reg',regOfCounty(r.c.county)],['county',ctyN(r.c.county)],['kov',r.c.kov]].forEach(([l,k])=>{ u(l,k).dormInv += r.dormInv; }); });
  Object.values(U).forEach(x=>{ x.invTot = x.inv + x.dormInv; });
  // koolid
  const S = {}; SCHOOLS.forEach((t,i)=>{ S[t.name] = {role: schoolRole(R,t), sq: R.SQ[t.name]||null}; });
  return {U, S};
}

/* investeeringute eelarve ja prioriteedid (piirkonnad, otsustatud investeeringud, HEV, eriolukorrad) */
function budgetPlan(R, Q){
  const E=R.econ, crf=E.crfS, s=Q.capShare/100, spec=Q.specShare/100, hevS=(Q.hevShare||0)/100;
  const opex = Object.values(REGC).reduce((x,r)=>x+r.cost,0), annB = Q.annBFix ? Q.annBFix*1e6 : s/(1-s)*opex, years=Q.capYears, y0=Q.capStart, yEnd=y0+years-1, YRS=[...Array(years).keys()].map(k=>y0+k);
  const RN = REG7, SI = Object.values(R.siteInfo), byName = {}; SCHOOLS.forEach(t=>byName[t.name]=t);
  const CM = COMMIT.filter(c=> Q.commitLvl===2 || (Q.commitLvl===1 && c.cls==='otsustatud'));
  const cmY = (c, y) => { if (c.residual){ const own = COMMIT.filter(d=>d.who.startsWith('riik') && !d.residual).reduce((x,d)=>x+cmY(d,y),0); return Math.max(0,(c.residual[y]||0)*1e6 - own); } return (y>=c.y[0] && y<=c.y[1]) ? c.mln*1e6/(c.y[1]-c.y[0]+1) : 0; };
  const cmWin = c => YRS.reduce((x,y)=>x+cmY(c,y),0);
  const pk = E.regions.map(r=>{ const sv=E.curPP*r.idealN*(r.cur/Math.max(1,r.curN*E.curPP)) - r.ideal, iv=r.inv+r.dormInv, items=SI.filter(si=>si.reg===r.a && si.inv>1);
    const ben = r.binv + Math.max(0,sv)/crf, region = regOfCounty(r.c.county);
    const special = ['Ida-Viru','Hiiu','Saare'].includes(r.c.county) || items.some(si=>SPECIAL_ISL.some(nm=>byName[nm] && haversine(byName[nm], si.c)<3));
    const keepNames = new Set(SI.filter(si=>si.reg===r.a).flatMap(si=>Object.values(si.keepers||{}).flat())); const cms = CM.filter(c=>c.sch && c.sch.some(nm=>keepNames.has(nm)));
    const cmCover = Math.min(iv, cms.reduce((x,c)=>x+c.mln*1e6,0));
    const kv = R.pkKov && R.pkKov[r.a] || [];
    const parts = items.reduce((o,si)=>{ o.new+=si.invNew; o.ren+=si.invRen; o.oth+=si.invTemp+si.invMin; return o; }, {new:0, ren:0, oth:0}); parts.dorm = r.dormInv;
    return {kovs:kv, parts, a:r.a, name:(R.siteInfo[r.a]&&R.siteInfo[r.a].label)||r.c.name, kov:r.c.kov, county:r.c.county, sch:r.sch, isch:r.isch, sv, iv, need:Math.max(0,iv-cmCover), cms:cms.map(c=>c.id), items:items.map(si=>({name:si.label||siteLabel(si), kinds:si.kinds, invNew:si.invNew, invRen:si.invRen, invTemp:si.invTemp, invMin:si.invMin, inv:si.inv, N:si.N, nb:si.nb||0})), dormInv:r.dormInv, binv:r.binv, ben, region, special, score: iv>0 ? ben/iv : 99}; }).filter(p=>p.iv>0).sort((a,b)=>b.score-a.score);
  const needR={}, Nr={}; RN.forEach(k=>{ needR[k]=0; Nr[k]=REGC[k].N; }); pk.forEach(p=>needR[p.region]+=p.need);
  const totNeed=Object.values(needR).reduce((x,v)=>x+v,0), totN=Object.values(Nr).reduce((x,v)=>x+v,0);
  const key = k => Q.regKey===0 ? Nr[k]/totN : Q.regKey===1 ? needR[k]/Math.max(1,totNeed) : 0.5*Nr[k]/totN + 0.5*needR[k]/Math.max(1,totNeed);
  const bal={}, envSum={}, cmR={}; RN.forEach(k=>{ bal[k]=0; envSum[k]=0; cmR[k]=0; }); let res=0, resSum=0, cmNat=0, hevPot=0, hevSum=0, hevCm=0;
  pk.forEach(p=>{ p.fy = p.need<=1 ? y0 : null; p.got=0; p.gotR=0; }); const TL=[];
  // tasuvad lisainvesteeringud (Q.extraProfit): piirkonnad, kus tegevuskulu kokkuhoid ületab investeeringu kapitalikulu (tootlus > laenu hind), rahastatakse lisaks tavapärasele eelarvele
  if (Q.extraProfit) pk.forEach(p=>{ if (!p.fy && Math.max(0,p.sv)/crf > p.iv){ p.extra = true; p.got = p.need; p.fy = y0; } });
  YRS.forEach(y=>{ const hb=annB*hevS, hc=CM.filter(c=>c.hev===true).reduce((x,c)=>x+cmY(c,y),0); hevPot+=hb-hc; hevSum+=hb; hevCm+=hc;
    const nat = CM.filter(c=>!c.reg && c.hev!==true).reduce((x,c)=>x+cmY(c,y),0); cmNat+=nat;
    const free = Math.max(0, annB - hb - nat); res += free*spec; resSum += free*spec;
    RN.forEach(k=>{ const env=free*(1-spec)*key(k), cr=CM.filter(c=>c.reg===k && c.hev!==true).reduce((x,c)=>x+cmY(c,y),0); bal[k]+=env-cr; envSum[k]+=env; cmR[k]+=cr; });
    const pour = (p, pot) => { const x=Math.min(pot, p.need-p.got); p.got+=x; if (p.got>=p.need-1 && !p.fy) p.fy=y; return x; };
    for (const p of pk){ if (p.fy) continue; if (p.special && res>0){ const x=pour(p,res); res-=x; p.gotR+=x; } }
    const before = pk.reduce((x,p)=>x+p.got,0);
    for (const p of pk){ if (p.fy || bal[p.region]<=0) continue; bal[p.region]-=pour(p, bal[p.region]); }
    const cmy = CM.reduce((x,c)=>x+cmY(c,y),0); TL.push({y, budget:annB, committed:cmy, free:pk.reduce((x,p)=>x+p.got,0)-before}); });
  TL.forEach(t=>{ t.sav = pk.filter(p=>p.fy && p.fy < t.y).reduce((x,p)=>x+Math.max(0,p.sv),0); });
  [yEnd+1, yEnd+2].forEach(y=>TL.push({y, budget:0, committed:0, free:0, sav:pk.filter(p=>p.fy && p.fy < y).reduce((x,p)=>x+Math.max(0,p.sv),0), after:true}));
  pk.forEach(p=>{ p.src = p.gotR>0 ? (p.gotR>=p.got-1 ? 'reserv' : 'piirkond + reserv') : 'piirkond'; });
  const regions = RN.map(k=>{ const ps=pk.filter(p=>p.region===k); return {k, n:REGC[k].n, N:REGC[k].N, cost:REGC[k].cost, share:key(k), envY:envSum[k]/years, cm:cmR[k], need:ps.reduce((x,p)=>x+p.need,0), got:ps.reduce((x,p)=>x+p.got,0), nDone:ps.filter(p=>p.fy).length, nAll:ps.length, sav:ps.filter(p=>p.fy).reduce((x,p)=>x+Math.max(0,p.sv),0), bal:bal[k]}; });
  const cmTot = CM.reduce((x,c)=>x+cmWin(c),0);
  return {annB, opex, years, y0, yEnd, cmTot, cmState:CM.filter(c=>c.who.startsWith('riik')).reduce((x,c)=>x+cmWin(c),0), hevSum, hevCm, hevPot, resSum, res, pk, regions,
    TL, savDone: pk.filter(p=>p.fy).reduce((x,p)=>x+Math.max(0,p.sv),0), needAll: pk.reduce((x,p)=>x+p.need,0), gotAll: pk.reduce((x,p)=>x+p.got,0), nDone: pk.filter(p=>p.fy).length,
    commit: COMMIT.map(c=>({...c, inUse: CM.includes(c), win: cmWin(c)}))};
}

/* gümnaasiumipiirkond (paketi) igale ruudule ja koolile; KOVid piirkonnas */
function pkgMaps(R){
  if (R.pkCell) return; const D=R.D, n=D.length, as=R.A.e.as; R.pkCell = as;
  const kw = {}; for (let i=0;i<n;i++){ const a=as[i]; if (a<0) continue; const k=BKOV.names[BKOV.kv[i]], w=R.A.w[i]+R.B.w[i]+R.P.w[i]+R.L.w[i]; (kw[a]=kw[a]||{})[k]=((kw[a]||{})[k]||0)+w; }
  R.pkKov = {}; Object.entries(kw).forEach(([a,o])=>{ const tot=Object.values(o).reduce((x,v)=>x+v,0); R.pkKov[a]=Object.entries(o).filter(([k,v])=>v/tot>=0.08).sort((x,y)=>y[1]-x[1]).map(([k])=>k); });
  R.pkSchool = {}; SCHOOLS.forEach(t=>{ let bi=-1,bd=1e9; for (let i=0;i<n;i++){ const d=Math.abs(D[i].lat-t.lat)+Math.abs(D[i].lon-t.lon)*0.52; if (d<bd){bd=d;bi=i;} } R.pkSchool[t.name]=bi>=0?as[bi]:-1; });
}
/* eelarve piires saavutatav 2035: rahastatud gümnaasiumipiirkondades ideaalne võrk, mujal jätkub tänane */
function budgetView(R, Q, bp){
  const D=R.D, n=D.length, SQT=R.SQT, F=new Set(bp.pk.filter(p=>p.fy).map(p=>p.a)), unitKey = { reg: i=>regOfCounty(D[i].county), kov: i=>BKOV.names[BKOV.kv[i]] };
  const U={}; const u=(l,k)=>U[l+':'+k]=U[l+':'+k]||{N:0, cost:0, inv:0, sch:0, tw:{L:[0,0],P:[0,0],G:[0,0]}, acc:[0,0], dorm:0, freed:0, used:0, area:0, fundedPk:0};
  const RS = resShares(R);
  // KOV liigub eelarve järjekorras tervikuna: rahastatud on KOV, kelle laste enamuse gümnaasiumipiirkond on rahastatud.
  // Erand: linnad, kus asub vähemalt kaks gümnaasiumipiirkonna keskust (nt Tallinn, Tartu) – seal otsustatakse piirkonna kaupa.
  if (!R.kovPk){ const kw={}; for (let i=0;i<n;i++){ const a=R.pkCell[i]; if (a<0) continue; const k=BKOV.names[BKOV.kv[i]], w=R.A.w[i]+R.B.w[i]+R.P.w[i]+R.L.w[i]; const o=kw[k]=kw[k]||{}; o[a]=(o[a]||0)+w; }
    R.kovPk={}; Object.entries(kw).forEach(([k,o])=>{ R.kovPk[k]=+Object.entries(o).sort((x,y)=>y[1]-x[1])[0][0]; });
    const cen={}; new Set(Array.from(R.pkCell).filter(a=>a>=0)).forEach(a=>{ const t=SCHOOLS[R.C[a].i]; if (t) cen[t.kov]=(cen[t.kov]||0)+1; }); R.kovMulti=Object.fromEntries(Object.entries(cen).filter(([k,c])=>c>=2)); }
  const fK = (kv, a) => R.kovMulti[kv] || R.kovPk[kv]==null ? F.has(a) : F.has(R.kovPk[kv]);
  SCHOOLS.forEach((t,ti)=>{ const sq=R.SQ[t.name]; if (!sq) return; const f=fK(t.kov, R.pkSchool[t.name]);
    [['EE','Eesti'],['reg',regOfCounty(t.county)],['county',ctyN(t.county)],['kov',t.kov]].forEach(([l,k])=>{ const x=u(l,k); x.area+=AREA[t.name]||0; if (!f){ x.sch++; x.used+=AREA[t.name]||0; } });
    const sh=RS.sch[ti]||{[t.kov]:1}, put = x => g => { x.N+=sq.N*g; x.cost+=sq.c*g; x.NU=(x.NU||0)+sq.N*g; x.cU=(x.cU||0)+sq.c*g; x.invDef=(x.invDef||0)+(sq.inv||0)*g; };
    Object.entries(sh).forEach(([kv,g])=>{ if (fK(kv, R.pkSchool[t.name])) return; put(u('EE','Eesti'))(g); keysKov(kv).forEach(([l,k])=>put(u(l,k))(g)); }); });
  Object.values(R.siteInfo).forEach(si=>{ const c=si.labelT||si.c; if (fK(c.kov, si.reg)) [['EE','Eesti'],['reg',regOfCounty(c.county)],['county',ctyN(c.county)],['kov',c.kov]].forEach(([l,k])=>{ const x=u(l,k); x.sch+=Math.max(1,...Object.values(si.nkK||{1:1})); x.used+=(si.exArea||0)/0.95; });
    const sh=RS.site[si.j]||{[c.kov]:1}, put = x => g => { x.N+=si.N*g; x.cost+=si.cost*g; x.NF=(x.NF||0)+si.N*g; x.cF=(x.cF||0)+si.cost*g; x.inv+=si.inv*g; };
    Object.entries(sh).forEach(([kv,g])=>{ if (!fK(kv, si.reg)) return; put(u('EE','Eesti'))(g); keysKov(kv).forEach(([l,k])=>put(u(l,k))(g)); }); });
  bp.pk.filter(p=>p.fy).forEach(p=>{ const c=SCHOOLS[R.C[p.a].i]; [['EE','Eesti'],['reg',regOfCounty(c.county)],['county',ctyN(c.county)],['kov',c.kov]].forEach(([l,k])=>{ const x=u(l,k); x.inv+=p.dormInv; x.sav=(x.sav||0)+Math.max(0,p.sv); }); });
  // tegelikult investeeritud 2027–2033: piirkondade raha (täielikult või osaliselt rahastatud gümnaasiumipiirkonnad), juba otsustatud projektid, HEV
  const keysOf = t => [['EE','Eesti'],['reg',regOfCounty(t.county)],['county',ctyN(t.county)],['kov',t.kov]];
  bp.pk.forEach(p=>{ if (!(p.got>0)) return; const c=SCHOOLS[R.C[p.a].i]; keysOf(c).forEach(([l,k])=>{ const x=u(l,k); x.spent=(x.spent||0)+p.got; x.spentPk=(x.spentPk||0)+p.got; }); });
  bp.commit.forEach(c=>{ if (!c.inUse || !(c.win>0)) return; const sch=(c.sch||[]).map(nm=>SCHOOLS[SIDX[nm]]).filter(Boolean);
    if (c.hev===true){ if (sch.length) sch.forEach(t=>keysOf(t).filter(([l])=>l!=='EE').forEach(([l,k])=>{ const x=u(l,k); x.spent=(x.spent||0)+c.win/sch.length; x.spentCm=(x.spentCm||0)+c.win/sch.length; })); else if (c.reg){ const x=u('reg',c.reg); x.spent=(x.spent||0)+c.win; x.spentCm=(x.spentCm||0)+c.win; } return; }
    if (sch.length) sch.forEach(t=>{ const unf=!fK(t.kov, R.pkSchool[t.name]); keysOf(t).forEach(([l,k])=>{ const x=u(l,k); x.spent=(x.spent||0)+c.win/sch.length; x.spentCm=(x.spentCm||0)+c.win/sch.length; if (unf) x.cmUnf=(x.cmUnf||0)+c.win/sch.length; }); });
    else [['EE','Eesti']].concat(c.reg?[['reg',c.reg]]:[]).forEach(([l,k])=>{ const x=u(l,k); x.spent=(x.spent||0)+c.win; x.spentCm=(x.spentCm||0)+c.win; }); });
  { const x=u('EE','Eesti'); x.spent=(x.spent||0)+bp.hevSum; x.spentHev=bp.hevSum; }
  const tiers={L:[R.L],P:[R.P],G:[R.A,R.B]};
  for (let i=0;i<n;i++){ const f=fK(BKOV.names[BKOV.kv[i]], R.pkCell[i]), keys=[['EE','Eesti'],['reg',unitKey.reg(i)],['county',ctyN(D[i].county)],['kov',unitKey.kov(i)]];
    Object.entries(tiers).forEach(([lv,Ts])=>Ts.forEach(T=>{ const w=T.w[i]*T.grades; if (!(w>0)) return; const ti=T.ct[i], tm = f ? ti : SQT[lv].t[i];
      keys.forEach(([l,k])=>{ const x=u(l,k); x.wA=(x.wA||0)+w; if (f) x.wF=(x.wF||0)+w; if (tm>=0){ x.tw[lv][0]+=w; x.tw[lv][1]+=w*Math.min(tm,120); } if (f){ if (ti===-1) x.dorm+=w; x.cost+=T.cc[i]; x.cF=(x.cF||0)+T.cc[i]; }
        if (T===R.A){ const wg=(R.A.w[i]+R.B.w[i])*3; x.acc[0]+=wg; if (f ? (ti>=0 && ti<=Q.tA) : SQT.GQ.t[i]<=Q.tA) x.acc[1]+=wg; } }); })); }
  Object.values(U).forEach(x=>{ x.invDefNet = Math.max(0, (x.invDef||0) - (x.cmUnf||0));
    // tegevuskulu õpilase kohta: rahastatud ja rahastamata osa kaalutakse elukohtade järgi (koolide ja asukohtade õpilaste arv ei pruugi gümnaasiumipiirkonna piiril kokku langeda)
    const ppU = x.NU>0 ? x.cU/x.NU : null, ppF = x.NF>0 ? x.cF/x.NF : null, phi = x.wA>0 ? (x.wF||0)/x.wA : 0;
    x.phi = phi; x.ppB = ppF==null ? ppU : ppU==null ? ppF : (1-phi)*ppU + phi*ppF; x.pp = x.N ? x.cost/x.N : null; x.t={L:x.tw.L[0]?x.tw.L[1]/x.tw.L[0]:null, P:x.tw.P[0]?x.tw.P[1]/x.tw.P[0]:null, G:x.tw.G[0]?x.tw.G[1]/x.tw.G[0]:null}; x.accR = x.acc[0]?x.acc[1]/x.acc[0]:null; x.freed=Math.max(0,x.area-x.used); });
  return U;
}
/* kogu tulemus ühe käivitusega (töötaja jaoks) */
function runR(Q){ const R = idealRun(Q); labelSites(R); return R; }
/* aasta, mil KOV-i / maakonna / piirkonna / Eesti optimaalne võrk on täielikult rahastatud antud aastase eelarvega (null = mitte enne 2056) */
function doneYears(R, Q, annB){
  const bp = budgetPlan(R, {...Q, annBFix: annB/1e6, capYears: 30}), fy = {}; bp.pk.forEach(p=>fy[p.a]=p.fy||null);
  const out = {kov:{}, county:{}, reg:{}, EE:0}, mx = (o,k,v) => { if (o[k]===null) return; o[k] = v==null ? null : Math.max(o[k]||0, v); };
  Object.keys(R.kovPk||{}).forEach(kv=>{ let y; if (R.kovMulti && R.kovMulti[kv]){ y=0; bp.pk.filter(p=>(p.kovs||[]).includes(kv)||p.kov===kv).forEach(p=>{ if (y===null) return; y = p.fy ? Math.max(y,p.fy) : null; }); } else y = fy[R.kovPk[kv]];
    out.kov[kv]=y; keysKov(kv).forEach(([l,k])=>mx(out[l==='reg'?'reg':l==='county'?'county':'kov'], k, y)); if (out.EE!==null) out.EE = y==null ? null : Math.max(out.EE, y); });
  return out; }
/* ===== põhistsenaarium „mõistlik investeerimine” =====
   tasuvad gümnaasiumipiirkonnad (tegevuskulu kokkuhoid > investeeringu kapitalikulu, tootlus > 4%): optimaalne võrk ajakava järgi;
   mujal senine praktika ja rahuldava õpikeskkonna säilitamine (halvas seisus vajalik pind, osaline renoveerimine); juba otsustatud projektid mõlemas.
   võrdlusalus: kogu Eestis senine praktika + sama säilitusinvesteering + otsustatud projektid. */
function schedPk(L, y0, y1){
  const PR = p => p.need>50e6 ? [0.06,0.31,0.32,0.31] : [0.08,0.46,0.46], Y=[]; for (let y=y0; y<=y1; y++) Y.push(y);
  const rows = L.filter(p=>p.need>1e5).sort((a,b)=>Math.max(0,b.sv)/b.iv - Math.max(0,a.sv)/a.iv).map(p=>({p, pr:PR(p), s:y0}));
  const tot = rows.reduce((x,r)=>x+r.p.need,0), sp = () => { const o=Object.fromEntries(Y.map(y=>[y,0])); rows.forEach(r=>r.pr.forEach((f,k)=>o[r.s+k]+=f*r.p.need)); return o; };
  const obj = () => { const o=sp(); return Y.reduce((x,y)=>x+Math.pow(o[y]/1e6,2),0) + rows.reduce((x,r)=>x+0.02*(r.s-y0)*Math.max(0,r.p.sv)/1e6*tot/1e6/Y.length,0); };
  rows.forEach((r,i)=>{ r.s = y0 + Math.min(y1-r.pr.length+1-y0, Math.floor(i*(y1-r.pr.length+2-y0)/Math.max(1,rows.length))); });
  for (let it=0; it<40; it++){ let moved=false; rows.forEach(r=>{ const cur=r.s; let best=cur, bo=obj(); for (let s=y0; s<=y1-r.pr.length+1; s++){ r.s=s; const v=obj(); if (v<bo-1e-6){ bo=v; best=s; } } r.s=best; if (best!==cur) moved=true; }); if (!moved) break; }
  rows.forEach(r=>r.e=r.s+r.pr.length-1); return rows;
}
/* maakonnakeskuste gümnaasiumid, mille kvaliteedi tõstmisse investeerimine on koolivõrgu strateegia osa:
   riigigümnaasium maakonnakeskuses (Tallinn ja Harjumaa välja arvatud), mida mudel tugevaks ei loe, hoone heas seisus (≥60% pinnast või ehitatud/renoveeritud 2010+) ja pind piisav (8 m² õpilase kohta, vähemalt 80% tänasest) */
const COUNTY_CENTRE = {Hiiu:'Hiiumaa vald','Ida-Viru':'Jõhvi vald','Jõgeva':'Jõgeva vald','Järva':'Paide linn','Lääne':'Haapsalu linn','Lääne-Viru':'Rakvere linn','Põlva':'Põlva vald','Pärnu':'Pärnu linn',Rapla:'Rapla vald',Saare:'Saaremaa vald',Tartu:'Tartu linn',Valga:'Valga vald',Viljandi:'Viljandi linn','Võru':'Võru linn'};
function qiSchools(Q){ return SCHOOLS.filter(t=> t.L3 && !t.priv && !t.hev && STATE_G.has(t.name) && COUNTY_CENTRE[t.county]===t.kov && qStatus(t,'g',P)!==1
  && COND[t.name] && (COND[t.name][0]>=0.6 || (COND[t.name][1]||0)>=2010) && (AREA[t.name]||0)/8 >= 0.8*t.n.reduce((x,v)=>x+v,0)); }
function planMain(R, Q, bp){
  const E=R.econ, crf=E.crfS, y0=Q.capStart||2027, y1=y0+(Q.capYears||7)-1, YRS=[]; for (let y=y0; y<=2035; y++) YRS.push(y); const nY=YRS.length, yi=y=>y-y0;
  const strict = bp.pk.filter(p=>Math.max(0,p.sv)/crf > p.iv), sA = new Set(strict.map(p=>p.a));
  const rows = schedPk(strict, y0, y1), rowOf = {}; rows.forEach(r=>rowOf[r.p.a]=r);
  const cmOnly = strict.filter(p=>!(p.need>1e5));
  const U = {}, z = () => new Array(nY).fill(0), u = k => U[k] = U[k] || {P:z(), S:z(), S0:z(), C:z(), H:z(), dpp:z(), dsch:z(), D:z()};
  const keysT = c => [['EE','Eesti'],['reg',regOfCounty(c.county)],['county',ctyN(c.county)],['kov',c.kov]], add = (c, f, arr) => keysT(c).forEach(([l,k])=>{ const x=u(l+':'+k)[f]; arr.forEach((v,i)=>x[i]+=v); });
  const even = v => YRS.map(y=> y<=y1 ? v/(y1-y0+1) : 0);
  // 1) tasuvad investeeringud: asukohtade investeering × (vajadus / kogu investeering) ajakava profiiliga; õpilaskodud piirkonna keskuse KOV-i
  const SI = Object.values(R.siteInfo);
  rows.forEach(r=>{ const p=r.p, f = p.iv>0 ? p.need/p.iv : 0, prof = v => YRS.map(y=> y>=r.s && y<=r.e ? r.pr[y-r.s]*v : 0);
    r.items = []; SI.filter(si=>si.reg===p.a && si.inv>1).forEach(si=>{ const c=si.labelT||si.c; add(c,'P',prof(si.inv*f)); r.items.push({name:si.label||siteLabel(si), kov:c.kov, inv:si.inv*f, invNew:si.invNew*f, invRen:si.invRen*f, nb:si.nb||0, N:si.N}); });
    const cc = SCHOOLS[R.C[p.a].i] || R.C[p.a]; if (p.dormInv>0) add({county:cc.county, kov:cc.kov}, 'P', prof(p.dormInv*f)); r.kov = cc.kov; r.county = cc.county; });
  // 2) juba otsustatud projektid (mõlemas stsenaariumis): koolide KOV-i, muidu piirkonda
  const CM = COMMIT.filter(c=> Q.commitLvl===2 || (Q.commitLvl===1 && c.cls==='otsustatud'));
  const cmY = (c, y) => { if (c.residual){ const own = COMMIT.filter(d=>d.who.startsWith('riik') && !d.residual).reduce((x,d)=>x+cmY(d,y),0); return Math.max(0,(c.residual[y]||0)*1e6 - own); } return (y>=c.y[0] && y<=c.y[1]) ? c.mln*1e6/(c.y[1]-c.y[0]+1) : 0; };
  const cmSch = new Set(); const kovNames = new Set(SCHOOLS.map(t=>t.kov)), whoKov = w => { const k = w==='Tallinn' ? 'Tallinna linn' : w.replace(/\s*\(.*$/,''); return kovNames.has(k) ? k : null; };
  CM.forEach(c=>{ const arr = YRS.map(y=>cmY(c,y)); if (!arr.some(v=>v>0)) return; const sch=(c.sch||[]).map(nm=>SCHOOLS[SIDX[nm]]).filter(Boolean); sch.forEach(t=>cmSch.add(t.name));
    const f = c.hev===true ? 'H' : 'C';
    if (sch.length) sch.forEach(t=>add(t, f, arr.map(v=>v/sch.length)));
    else { const kv = whoKov(c.who||''); const t = kv && SCHOOLS.find(t=>t.kov===kv); if (t) add(t, f, arr); else { const tgt = [u('EE:Eesti')]; if (c.reg) tgt.push(u('reg:'+c.reg)); tgt.forEach(x=>arr.forEach((v,i)=>x[f][i]+=v)); } } });
  // 3) säilitusinvesteering: senise praktika koolid (põhistsenaariumis ainult tasuvate piirkondade väliselt), HEV-koolid mõlemas
  const fundedKov = (kv, a) => (R.kovMulti[kv] || R.kovPk[kv]==null) ? sA.has(a) : sA.has(R.kovPk[kv]);
  let mtAll=0, mtMain=0; const rate=(Q.maintShare||30)/100*Q.buildM2;
  SCHOOLS.forEach(t=>{ if (cmSch.has(t.name)) return;
    if (t.hev){ const v=(AREA[t.name]||0)*(1-(COND[t.name]?COND[t.name][0]:0.4))*rate; if (v>0){ add(t,'S',even(v)); add(t,'S0',even(v)); mtAll+=v; mtMain+=v; } return; }
    const sq=R.SQ[t.name]; if (!sq || !(sq.mt>0)) return; mtAll+=sq.mt; add(t,'S0',even(sq.mt));
    if (!fundedKov(t.kov, R.pkSchool[t.name])){ mtMain+=sq.mt; add(t,'S',even(sq.mt)); } });
  // 4) tegevuskulu vahe õpilase kohta aastate kaupa: valmimisaastale järgnevast aastast optimaalne võrk (2035. aasta võrgu ja hindadega)
  const mk = set => ({pk: bp.pk.map(p=>({...p, fy: set.has(p.a) ? y0 : null, got:0})), commit:[], hevSum:0});
  const V0 = budgetView(R, Q, mk(new Set())), cache = {};
  YRS.forEach((y,i)=>{ const set = new Set([...rows.filter(r=>r.e<y).map(r=>r.p.a), ...cmOnly.map(p=>p.a).filter(()=> y>y1-1)]); if (!set.size) return;
    const key=[...set].sort().join(','); const V = cache[key] = cache[key] || budgetView(R, Q, mk(set));
    Object.entries(V).forEach(([k,x])=>{ const b=V0[k]; if (!b || !(b.ppB>0) || !(x.ppB>0) || !/^(EE|reg|county|kov):/.test(k)) return; u(k).dpp[i] = b.ppB - x.ppB; u(k).dsch[i] = (b.sch||0) - (x.sch||0); }); });
  const Vf = budgetView(R, Q, mk(sA)); Object.entries(Vf).forEach(([k,x])=>{ if (!/^(EE|reg|county|kov):/.test(k)) return; const b=V0[k]; const o=u(k); o.sch=x.sch; o.sch0=b?b.sch:null; o.N=x.N; o.pp=x.ppB; o.pp0=b?b.ppB:null; o.phi=x.phi; });
  // piirkonna ja maakonna kulunäitajad KOV-ide kaalutud summana (ruutude ja koolide piirkonnajaotus ei kattu Tallinna ja Harju puhul)
  { const KM={}; SCHOOLS.forEach(t=>{ if (!KM[t.kov]) KM[t.kov]=[['EE','Eesti'],['reg',regOfCounty(t.county)],['county',ctyN(t.county)]]; });
    const agg={}; Object.entries(U).forEach(([k,x])=>{ if (!k.startsWith('kov:') || !(x.N>0) || !(x.pp>0)) return; const kv=k.slice(4); (KM[kv]||[]).forEach(([l,kk])=>{ const a=agg[l+':'+kk]=agg[l+':'+kk]||{N:0,c:0,c0:0,sch:0,sch0:0,d:new Array(nY).fill(0),ds:new Array(nY).fill(0)}; a.N+=x.N; a.c+=x.pp*x.N; a.c0+=(x.pp0||x.pp)*x.N; a.sch+=x.sch||0; a.sch0+=x.sch0||0; x.dpp.forEach((v,i)=>a.d[i]+=v*x.N); x.dsch.forEach((v,i)=>a.ds[i]+=v); }); });
    Object.entries(agg).forEach(([k,a])=>{ const o=u(k); o.N=a.N; o.pp=a.c/a.N; o.pp0=a.c0/a.N; o.sch=a.sch; o.sch0=a.sch0; o.dpp=a.d.map(v=>v/a.N); o.dsch=a.ds; }); }
  // 5) tegevuskulu kokkuhoid (€ aastas) gümnaasiumipiirkonna arvestusest: piirkonna kokkuhoid jagatakse omavalitsustele seal elavate laste järgi ja kehtib valmimisele järgnevast aastast
  { const KM={}; SCHOOLS.forEach(t=>{ if (!KM[t.kov]) KM[t.kov]=[['reg',regOfCounty(t.county)],['county',ctyN(t.county)]]; });
    const kw={}; for (let i=0;i<R.D.length;i++){ const a=R.pkCell[i]; if (a<0 || !sA.has(a)) continue; const kv=BKOV.names[BKOV.kv[i]], w=R.A.w[i]+R.B.w[i]+R.P.w[i]+R.L.w[i]; if (!(w>0)) continue; const o=kw[a]=kw[a]||{}; o[kv]=(o[kv]||0)+w; }
    const cmA = new Set(cmOnly.map(p=>p.a));
    strict.forEach(p=>{ const st = rowOf[p.a] ? rowOf[p.a].e+1 : cmA.has(p.a) ? y1-2 : null; if (st==null) return; const o=kw[p.a]||{}, tw=Object.values(o).reduce((x,v)=>x+v,0); if (!(tw>0)) return;
      Object.entries(o).forEach(([kv,w])=>{ const v=Math.max(0,p.sv)*w/tw; [['EE','Eesti'], ...(KM[kv]||[]), ['kov',kv]].forEach(([l,k])=>{ const D=u(l+':'+k).D; YRS.forEach((y,i)=>{ if (y>=st) D[i]+=v; }); }); }); }); }
  // 6) gümnaasiumide kvaliteedi tõstmine maakonnakeskustes: riigigümnaasium maakonnakeskuses, mida mudel tugevaks ei loe, hoone on korras ja pind sobib.
  //    Lisakulu Q.qiCost € gümnaasiumiõpilase kohta aastas; eeldus: 2035. aastaks on kool tugev (ligipääs arvutatakse uuesti).
  const QI = qiSchools(Q), qiOn = (Q.qiCost||0) > 0 && QI.length;
  const acc = {}; { const SQT = R.SQT || (R.SQT = statusQuoTravel(R, Q)), tA = Q.tA||45, D=R.D, qo = QI.map(t=>({i:SIDX[t.name], lat:t.lat, lon:t.lon, pt:TPT[SIDX[t.name]]}));
    for (let i=0;i<D.length;i++){ const w=(R.A.w[i]+R.B.w[i])*3; if (!(w>0)) continue; const ok0 = SQT.GQ.t[i]<=tA;
      let ok1 = ok0; if (!ok0 && qiOn) for (const o of qo){ if (Math.abs(o.lat-D[i].lat)*111+Math.abs(o.lon-D[i].lon)*58 > 90) continue; if (idlTravel(D[i], o, Q).t<=tA){ ok1=true; break; } }
      const kv=BKOV.names[BKOV.kv[i]], t0=SCHOOLS.find(t=>t.kov===kv), keys=[['EE','Eesti'], ...(t0?[['reg',regOfCounty(t0.county)],['county',ctyN(t0.county)]]:[]), ['kov',kv]];
      keys.forEach(([l,k])=>{ const o=acc[l+':'+k]=acc[l+':'+k]||[0,0,0]; o[0]+=w; if (ok0) o[1]+=w; if (ok1) o[2]+=w; }); } }
  Object.entries(acc).forEach(([k,o])=>{ const x=u(k); x.acc0=o[1]/o[0]; x.acc1=o[2]/o[0]; x.accN=o[0]; });
  const iv=strict.reduce((a,p)=>a+p.iv,0), sv=strict.reduce((a,p)=>a+Math.max(0,p.sv),0), life=Q.schLife||40, npv=r=>-iv+sv*(1-Math.pow(1+r,-life))/r; let lo=0.0001, hi=1; for (let k=0;k<60;k++){ const m=(lo+hi)/2; if (npv(m)>0) lo=m; else hi=m; }
  return {qi: qiOn ? QI.map(t=>({name:t.name, kov:t.kov, county:t.county, reg:regOfCounty(t.county), pk:R.pkSchool[t.name], N:Math.round(t.n.reduce((x,v)=>x+v,0)), G:Math.round(t.n.slice(9).reduce((x,v)=>x+v,0)), cond:COND[t.name]?COND[t.name][0]:null, area:AREA[t.name]||0})) : [], qiCost: qiOn ? Q.qiCost : 0, y0, y1, years:YRS, U, mtAll, mtMain, rate, nPk:bp.pk.length, nStrict:strict.length, irr: sv>0 ? lo : null, sv, iv, need:strict.reduce((a,p)=>a+p.need,0),
    rows: rows.map(r=>({a:r.p.a, name:r.p.name, kov:r.kov, county:r.county, region:r.p.region, kovs:r.p.kovs, need:r.p.need, iv:r.p.iv, sv:Math.max(0,r.p.sv), s:r.s, e:r.e, pr:r.pr, dormInv:r.p.dormInv*(r.p.iv>0?r.p.need/r.p.iv:0), items:r.items})),
    cmOnly: cmOnly.map(p=>({a:p.a, name:p.name, kov:(SCHOOLS[R.C[p.a].i]||{}).kov, county:p.county, region:p.region, kovs:p.kovs, sv:Math.max(0,p.sv), iv:p.iv})) };
}
function pack(R, Q){
  const t0 = Date.now(); pkgMaps(R); const sm = summarize(R, Q), bp = budgetPlan(R, Q), UB = budgetView(R, Q, bp);
  // teine põhistsenaarium: kaks korda suurem investeeringueelarve; ja aasta, millal optimaalne võrk eri tempoga valmib
  const bp2 = budgetPlan(R, {...Q, annBFix: 2*bp.annB/1e6}), UB2 = budgetView(R, Q, bp2);
  const done = {y1: doneYears(R, Q, bp.annB), y2: doneYears(R, Q, 2*bp.annB)};
  // tavapärane eelarve + tasuvad lisainvesteeringud (laenuga, ilma laeta)
  const bp3 = budgetPlan(R, {...Q, extraProfit:1}), UB3v = budgetView(R, Q, bp3), UB3 = {};
  Object.entries(UB3v).forEach(([k,v])=>{ if (/^(EE|reg|county|kov):/.test(k)) UB3[k] = {N:v.N, sch:v.sch, ppB:v.ppB, phi:v.phi, cost:v.cost}; });
  const ex = bp3.pk.filter(p=>p.extra), extra = {n:ex.length, need:ex.reduce((a,p)=>a+p.need,0), sv:ex.reduce((a,p)=>a+Math.max(0,p.sv),0), nDone:bp3.nDone, nDone1:bp.nDone, nAll:bp.pk.length, a:ex.map(p=>p.a)};
  const bp2s = {annB:bp2.annB, nDone:bp2.nDone, nAll:bp2.pk.length, TL:bp2.TL};
  const sites = Object.values(R.siteInfo).map(si=>({j:si.j, name:si.label, kov:(si.labelT||si.c).kov, county:(si.labelT||si.c).county, x:(si.labelT||si.c).x, y:(si.labelT||si.c).y, kinds:si.kinds, N:si.N, nk:si.nk, inv:si.inv, invNew:si.invNew, invRen:si.invRen, area:si.area, exArea:si.exArea, perm:si.perm, reg:si.reg}));
  // koolid, kui investeeritakse optimaalse võrgu stsenaariumi järgi (2035): tasuva investeeringuga omavalitsustes optimaalse võrgu asukoha õpilased, mujal senine praktika
  const Fset = new Set(bp.pk.filter(p=>Math.max(0,p.sv)/R.econ.crfS > p.iv).map(p=>p.a)), fK = (kv,a) => R.kovMulti[kv] || R.kovPk[kv]==null ? Fset.has(a) : Fset.has(R.kovPk[kv]);
  const keepN = {}; Object.values(R.siteInfo).forEach(si=>{ const ks=[...new Set(Object.values(si.keepers||{}).flat())]; ks.forEach(n=>keepN[n]=(keepN[n]||0)+si.N/ks.length); });
  const optS = {}; SCHOOLS.forEach(t=>{ if (t.hev || t.adult) return; optS[t.name] = {f: fK(t.kov, R.pkSchool[t.name]) ? 1 : 0, N: Math.round(keepN[t.name]||0)}; });
  const E = R.econ; const PL = planMain(R, Q, bp);
  return {PL, UB3, extra, optS, Q, ms: R.ms + Date.now()-t0, sites, U: sm.U, UB, UB2, bp2:bp2s, done, S: sm.S, bp, lock:{A:R.A.all, B:R.B.S, P:R.P.all, L:R.L.all},
    econ:{curTot:E.curTot, idealTot:E.idealTot, normSav:E.normSav, curPP:E.curPP, freed:E.freed, exTot:E.exTot, invDorm:E.invDorm, dormNew:E.dormNew, IDI:E.IDI, BASE:E.BASE, resaleV:E.resaleV, crfS:E.crfS, transY:E.transY, dormOpY:E.dormOpY, YL:E.YL},
    unc: R.P.uncovered + R.L.uncovered, split: R.Bsplit, shares: R.shares, val: (typeof valStats==='function' ? valStats(R) : null),
    cells: {x:R.D.map(d=>d.x), y:R.D.map(d=>d.y), a:Array.from(R.A.e.as)}};
}
function fullRun(Q){ return pack(runR(Q), Q); }

/* prognoos tänase võrguga (vana mudeli forecast) kompaktselt */
function fcRun(){
  const F = forecast(SCHOOLS_FC, IDX, P), r = v => Math.round(v*10)/10;
  return {years:F.years, total:F.total.map(t=>({N:t.N, teach:t.teach, sup:t.sup, oth:t.oth, cost:t.cost, schools:t.schools})),
    county:Object.fromEntries(Object.entries(F.county).map(([c,a])=>[c, a.map(t=>({N:t.N, teach:t.teach, sup:t.sup, oth:t.oth, cost:t.cost, schools:t.schools}))])),
    sch: F.sch.map(x=>({N:x.N.map(r), G:x.G.map(r), teach:x.teach.map(r), sup:x.sup.map(r), cost:x.cost.map(Math.round)})), names:SCHOOLS.map(t=>t.name), kov:SCHOOLS.map(t=>t.kov), county2:SCHOOLS.map(t=>t.county),
    // senine praktika: KOV-ide otsused (kool, aste, vastuvõttev kool, kokkuhoid) ja tõmbekoolid
    ev: F.SIM ? F.SIM.ev.map(e=>({y:e.y, s:SCHOOLS[e.i].name, lv:e.lv, h:SCHOOLS[e.j].name, pct:e.pct==null ? null : Math.round(e.pct*1000)/10, m:Math.round(e.m), dec:e.dec||null, why:e.why||null, occ:e.occ!=null ? Math.round(e.occ*100)/100 : null, rc:e.rc!=null ? Math.round(e.rc*100)/100 : null, closed:F.SIM.closedAt[e.i]>=0 && F.SIM.N[IDX.years.indexOf(e.y)][e.i].every(v=>v<0.5)})) : [],
    pull: {g:[...PULL.g].map(i=>SCHOOLS[i].name), b:[...PULL.b].map(i=>SCHOOLS[i].name)}, dec: P.pull ? DECIDED : null,
    // kutsekeskhariduse õppijate muutus maakonniti: 16–18-aastaste arv × kutseõppe osakaalu muutus (eeldus upSplit); 2025/26 = 1
    vocIx: (()=>{ const src = srcIdx(), o = {}; Object.keys(F.county).forEach(c=>{ const ix = src[c] || src[c==='Tallinn' ? 'Harju' : c]; if (!ix) return;
      o[c] = F.years.map((Y,yi)=> (ix['16'][yi]+ix['17'][yi]+ix['18'][yi])/3 * [0,1,2].reduce((a,k)=>a + (Y-k > 2026 ? vocF(Y-k) : 1), 0)/3); }); return o; })()};
}
/* optimaalne koolide (koolimajade) arv aastate kaupa */
function siteCount(R){ const by={}; Object.values(R.siteInfo).forEach(si=>{ const c=si.labelT||si.c, n=Math.max(1,...Object.values(si.nkK||{1:1})); ['EE:Eesti','county:'+c.county,'kov:'+c.kov].forEach(k=>by[k]=(by[k]||0)+n); }); return by; }
