/* Haridussilm: gümnaasiumi panuse eristatavus (keskmine 2024–2025, eesti keel ja matemaatika; −1 = oodatust madalam … +1 = oodatust kõrgem) */
const PANUS = {"Abja Gümnaasium":0.0,"Antsla Gümnaasium":-0.6,"Audentese Spordigümnaasium":-0.5,"Audentese Spordigümnaasiumi Otepää filiaal":-0.25,"August Kitzbergi nimeline Gümnaasium":-0.33,"Avinurme Gümnaasium":-0.14,"EBS Gümnaasium":0.83,"Ehte Humanitaargümnaasium":-0.17,"Elva Gümnaasium":-0.17,"Erakool Garant":0.0,"Eurogümnaasium":-0.17,"Gustav Adolfi Gümnaasium":0.5,"Hiiumaa Gümnaasium":0.17,"Hugo Treffneri Gümnaasium":0.67,"Häädemeeste Keskkool":0.0,"Jakob Westholmi Gümnaasium":0.33,"Jõgevamaa Gümnaasium":0.0,"Jõhvi Gümnaasium":-0.12,"Jüri Kool":0.33,"Kaarli Kool":0.0,"Kadrina Keskkool":0.17,"Kadrioru Saksa Gümnaasium":0.0,"Kallavere Keskkool":-0.5,"Kanepi Gümnaasium":0.0,"Kehra Gümnaasium":-0.17,"Keila Kool":0.17,"Kiili Gümnaasium":0.33,"Kilingi-Nõmme Gümnaasium":0.0,"Kiviõli Riigikool":0.0,"Koeru Keskkool":-0.2,"Kohila Gümnaasium":0.17,"Kohtla-Järve Gümnaasium":0.12,"Kool 21. sajandil":0.0,"Kose Gümnaasium":0.0,"Kunda Ühisgümnaasium":-0.5,"Kuusalu Keskkool":0.17,"Lasnamäe Gümnaasium":0.0,"Loksa Gümnaasium":0.0,"Loo Keskkool":-0.17,"Luunja Keskkool":-0.17,"Lähte Ühisgümnaasium":-0.5,"Läänemaa Ühisgümnaasium":0.5,"Lääneranna Gümnaasium":0.0,"Maardu Gümnaasium":0.17,"Miina Härma Gümnaasium":0.17,"Märjamaa Gümnaasium":-0.17,"Narva Eesti Gümnaasium":-0.67,"Narva Gümnaasium":0.0,"Narva Keeltelütseum":0.5,"Narva Õigeusu Gümnaasium":0.0,"Noarootsi Gümnaasium":-0.17,"Nõo Reaalgümnaasium":0.43,"Orissaare Gümnaasium":0.0,"Otepää Gümnaasium":0.17,"Paide Gümnaasium":-0.17,"Parksepa Keskkool":-0.17,"Pelgulinna Gümnaasium":0.2,"Pirita Majandusgümnaasium":0.75,"Pärnu Koidula Gümnaasium":0.0,"Pärnu Sütevaka Humanitaargümnaasium":0.5,"Pärnu Ühisgümnaasium":-0.5,"Põltsamaa Ühisgümnaasium":0.17,"Põlva Gümnaasium":0.5,"Püha Johannese Kool":0.0,"Rae Gümnaasium":0.33,"Rakvere Eragümnaasium":0.17,"Rakvere Riigigümnaasium":-0.67,"Rakvere Waldorfkool":0.0,"Rapla Gümnaasium":-0.17,"Rocca al Mare Kool":0.33,"Räpina Ühisgümnaasium":-0.5,"Rõngu Keskkool":0.25,"Saaremaa Gümnaasium":-0.67,"Sakala Eragümnaasium":0.25,"Saku Gümnaasium":0.5,"Saue Riigigümnaasium":-0.67,"Setomaa Gümnaasium":0.25,"Sillamäe Gümnaasium":-0.57,"Sindi Gümnaasium":-0.33,"Suure-Jaani Gümnaasium":0.0,"Tabasalu Gümnaasium":0.5,"Tallinna 21. Kool":0.8,"Tallinna 32. Keskkool":-0.5,"Tallinna 53. Keskkool":-0.5,"Tallinna Arte Gümnaasium":-0.71,"Tallinna Haabersti Gümnaasium":0.0,"Tallinna Humanitaargümnaasium":0.4,"Tallinna Inglise Kolledž":0.25,"Tallinna Juudi Kool":0.0,"Tallinna Järveotsa Gümnaasium":1.0,"Tallinna Kesklinna Vene Gümnaasium":0.67,"Tallinna Kristiine Gümnaasium":0.0,"Tallinna Kunstigümnaasium":-0.83,"Tallinna Kuristiku Gümnaasium":0.17,"Tallinna Laagna Gümnaasium":0.17,"Tallinna Lilleküla Gümnaasium":0.17,"Tallinna Linnamäe Vene Lütseum":0.33,"Tallinna Läänemere Gümnaasium":0.5,"Tallinna Mustamäe Gümnaasium":-0.5,"Tallinna Mustamäe Humanitaargümnaasium":-0.17,"Tallinna Mustamäe Reaalgümnaasium":-0.25,"Tallinna Mustjõe Gümnaasium":-0.5,"Tallinna Muusika- ja Balletikool":0.0,"Tallinna Nõmme Gümnaasium":-0.17,"Tallinna Pae Gümnaasium":0.0,"Tallinna Prantsuse Lütseum":0.4,"Tallinna Reaalkool":1.0,"Tallinna Saksa Gümnaasium":-0.17,"Tallinna Tehnikagümnaasium":-0.5,"Tallinna Tõnismäe Reaalkool":0.0,"Tallinna Vaba Waldorfkool":-0.5,"Tallinna Õismäe Gümnaasium":0.0,"Tallinna Õismäe Vene Lütseum":0.0,"Tallinna Ühisgümnaasium":0.0,"Tamsalu Kool":0.0,"Tapa Valla Gümnaasium":-0.17,"Tartu Annelinna Gümnaasium":-0.5,"Tartu Herbert Masingu Kool":0.2,"Tartu Jaan Poska Gümnaasium":0.5,"Tartu Katoliku Hariduskeskus":0.0,"Tartu Kristjan Jaak Petersoni Gümnaasium":-0.57,"Tartu Tamme Gümnaasium":0.0,"Tartu Waldorfgümnaasium":0.2,"Tarvastu Gümnaasium":0.4,"Toila Gümnaasium":-0.33,"Tõrva Gümnaasium":-0.25,"Tõstamaa Keskkool":0.0,"Türi Ühisgümnaasium":0.0,"Valga Gümnaasium":0.12,"Vanalinna Hariduskolleegium":-0.5,"Vastseliina Gümnaasium":0.4,"Viimsi Gümnaasium":0.17,"Viljandi Gümnaasium":-0.17,"Vinni-Pajusti Gümnaasium":0.33,"Väike-Maarja Gümnaasium":0.17,"Vändra Gümnaasium":0.25,"Võnnu Keskkool":-0.4,"Võru Gümnaasium":0.5,"Ülenurme Gümnaasium":-0.33};
/* riigigümnaasiumid (ainult gümnaasiumiaste) */
const STATE_G = new Set(["Hiiumaa Gümnaasium", "Jõgevamaa Gümnaasium", "Jõhvi Gümnaasium", "Kohtla-Järve Gümnaasium", "Läänemaa Ühisgümnaasium", "Narva Eesti Gümnaasium", "Narva Gümnaasium", "Noarootsi Gümnaasium", "Nõo Reaalgümnaasium", "Paide Gümnaasium", "Pärnu Koidula Gümnaasium", "Põlva Gümnaasium", "Rae Gümnaasium", "Rakvere Riigigümnaasium", "Rapla Gümnaasium", "Saaremaa Gümnaasium", "Saue Riigigümnaasium", "Sillamäe Gümnaasium", "Tabasalu Gümnaasium", "Tallinna Mustamäe Riigigümnaasium", "Tallinna Pelgulinna Riigigümnaasium", "Tallinna Tõnismäe Riigigümnaasium", "Tartu Tamme Gümnaasium", "Valga Gümnaasium", "Viimsi Gümnaasium", "Viljandi Gümnaasium", "Viljandi Täiskasvanute Gümnaasium", "Võru Gümnaasium"]);
/* Haridussilm: riigieksamite keskmine tulemus 2024–2025 (eesti keel ja lai matemaatika, punkti) */
const EXAM = {"Häädemeeste Keskkool":46.8,"Pärnu Ühisgümnaasium":45.1,"Toila Gümnaasium":48.9,"Põltsamaa Ühisgümnaasium":47.4,"Vändra Gümnaasium":55.7,"Kilingi-Nõmme Gümnaasium":43.9,"Pärnu Koidula Gümnaasium":70.1,"Sindi Gümnaasium":40.6,"Valga Gümnaasium":58.3,"Hugo Treffneri Gümnaasium":79.8,"Tartu Annelinna Gümnaasium":36.7,"Luunja Keskkool":38.4,"Tartu Herbert Masingu Kool":44.0,"Suure-Jaani Gümnaasium":42.0,"August Kitzbergi nimeline Gümnaasium":47.4,"Rõngu Keskkool":48.3,"Tõrva Gümnaasium":49.5,"Miina Härma Gümnaasium":69.1,"Tartu Tamme Gümnaasium":67.7,"Ülenurme Gümnaasium":53.0,"Elva Gümnaasium":53.9,"Vinni-Pajusti Gümnaasium":52.3,"Kadrina Keskkool":57.1,"Kose Gümnaasium":65.7,"Maardu Gümnaasium":44.2,"Kanepi Gümnaasium":49.3,"Tarvastu Gümnaasium":41.2,"Lähte Ühisgümnaasium":50.5,"Tallinna Kristiine Gümnaasium":52.8,"Tallinna Laagna Gümnaasium":56.4,"Tallinna Kunstigümnaasium":39.5,"Räpina Ühisgümnaasium":38.3,"Antsla Gümnaasium":42.5,"Võnnu Keskkool":29.2,"Kehra Gümnaasium":42.4,"Tõstamaa Keskkool":36.4,"Lääneranna Gümnaasium":49.6,"Abja Gümnaasium":37.2,"Tallinna Lilleküla Gümnaasium":58.2,"Tallinna Nõmme Gümnaasium":61.5,"Pirita Majandusgümnaasium":53.4,"Tallinna Arte Gümnaasium":47.9,"Tallinna Mustamäe Gümnaasium":44.8,"Tallinna Järveotsa Gümnaasium":56.6,"Jakob Westholmi Gümnaasium":68.9,"Tallinna 21. Kool":76.5,"Tallinna Prantsuse Lütseum":74.0,"Tallinna Ühisgümnaasium":56.8,"Tallinna Saksa Gümnaasium":51.0,"Tallinna Tehnikagümnaasium":44.8,"Tapa Valla Gümnaasium":43.7,"Saku Gümnaasium":57.8,"Tallinna Kuristiku Gümnaasium":55.8,"Orissaare Gümnaasium":51.7,"Pelgulinna Gümnaasium":36.6,"Tallinna Inglise Kolledž":74.6,"Vastseliina Gümnaasium":57.0,"Märjamaa Gümnaasium":38.8,"Avinurme Gümnaasium":47.5,"Loo Keskkool":52.1,"Tamsalu Kool":45.0,"Väike-Maarja Gümnaasium":63.1,"Otepää Gümnaasium":47.7,"EBS Gümnaasium":68.2,"Kohila Gümnaasium":54.7,"Kunda Ühisgümnaasium":50.4,"Tartu Katoliku Hariduskeskus":52.6,"Jõhvi Gümnaasium":56.2,"Viljandi Vaba Waldorfkool":56.5,"Nõo Reaalgümnaasium":77.5,"Tallinna Vaba Waldorfkool":57.3,"Gustav Adolfi Gümnaasium":80.1,"Kadrioru Saksa Gümnaasium":56.4,"Tallinna 32. Keskkool":60.3,"Rakvere Waldorfkool":48.8,"Viljandi Gümnaasium":61.2,"Võru Gümnaasium":63.5,"Noarootsi Gümnaasium":62.6,"Rakvere Eragümnaasium":38.7,"Audentese Spordigümnaasium":50.7,"Tallinna Õismäe Gümnaasium":58.1,"Parksepa Keskkool":49.1,"Kuusalu Keskkool":60.0,"Saaremaa Gümnaasium":57.0,"Saue Riigigümnaasium":63.7,"Loksa Gümnaasium":70.8,"Kiili Gümnaasium":63.6,"Jüri Kool":59.2,"Läänemaa Ühisgümnaasium":65.1,"Jõgevamaa Gümnaasium":67.8,"Püha Johannese Kool":54.2,"Hiiumaa Gümnaasium":55.2,"Rapla Gümnaasium":56.7,"Tabasalu Gümnaasium":67.0,"Rakvere Riigigümnaasium":56.2,"Narva Eesti Gümnaasium":43.8,"Paide Gümnaasium":56.8,"Koeru Keskkool":52.8,"Pärnu Sütevaka Humanitaargümnaasium":80.4,"Rocca al Mare Kool":61.7,"Vanalinna Hariduskolleegium":65.7,"Tartu Waldorfgümnaasium":50.9,"Tartu Jaan Poska Gümnaasium":75.3,"Türi Ühisgümnaasium":53.0,"Sillamäe Gümnaasium":38.0,"Kaarli Kool":51.5,"Tartu Kristjan Jaak Petersoni Gümnaasium":54.0,"Põlva Gümnaasium":51.4,"Keila Kool":46.7,"Viimsi Gümnaasium":65.6,"Kohtla-Järve Gümnaasium":57.8,"Tallinna Muusika- ja Balletikool":66.5,"Rae Gümnaasium":58.0,"Tallinna Reaalkool":86.7,"Kiviõli Riigikool":33.0};
const panusLow = name => { const v = PANUS[name]; return v!=null && v < -0.3; };
const isAdultS = t => /Täiskasvanute/.test(t.name);
const gMid = name => { const q = QUAL.s[name]; return q && q[2]!=null ? (q[2]+q[3])/2 : null; };
const EXAM_P80 = (()=>{ const v = Object.values(EXAM).sort((a,b)=>a-b); return v[Math.floor(0.8*v.length)]; })();
const FCI = name => SCHOOLS_FC.findIndex(t=>t.name===name);

/* ===== otsustatud võrgumuudatused (raha eraldatud, õpilaste vastuvõtt pole alanud) =====
   uued riigigümnaasiumid: gümnaasiumiaste kasvab kohtade arvuni lend-lennult alates avamisaastast ja on tõmbekool;
   ühendamised: liikmed kolivad vastuvõtvasse kooli uude hoonesse */
const DECIDED = {
  gcap: [{name:'Tallinna Tõnismäe Riigigümnaasium', y:2031, cap:1080, src:'uus hoone Endla tänaval, kuni 1080 kohta'}, {name:'Lasnamäe Gümnaasium', y:2031, cap:1080, src:'Lasnamäe riigigümnaasium; põhikool jääb', newName:'Lasnamäe Riigigümnaasium'}],
  merge: [{y:2029, host:'Narva Pähklimäe Kool', members:['Narva Paju Kool','Narva 6. Kool'], cap:734, src:'Narva uus koolimaja'}]};
const GCAP = {}; DECIDED.gcap.forEach(d=>{ const i=FCI(d.name); if (i>=0) GCAP[i]=d; });
// HEV-koolid (nt Narva Paju Kool) kolivad samasse majja, kuid jäävad kulude arvestuses eraldi HEV-üksuseks
const MERGE = DECIDED.merge.map(d=>({...d, h:FCI(d.host), m:d.members.filter(n=>!HEV_SCHOOLS.has(n)).map(FCI).filter(i=>i>=0)})).filter(d=>d.h>=0);

/* ===== tõmbekoolid: koolid, kuhu kandideerib mitu õpilast kohale; demograafiline langus vähendab konkurssi, mitte õpilaste arvu =====
   gümnaasiumiaste: vähemalt 100 õpilast ja (kõrghariduse omandamine ≥ 55% või riigieksamite keskmine Eesti parima viiendiku hulgas) või riigigümnaasium;
   põhikooliaste: sama kool, kui omavalitsuses on vähemalt 3 põhikooli (valik on olemas) */
const PULL = (()=>{ const g = new Set(), b = new Set(), L2kov = {};
  SCHOOLS_FC.forEach(t=>{ if (t.L2 && !HEV_SCHOOLS.has(t.name) && !isAdultS(t)) L2kov[t.kov] = (L2kov[t.kov]||0) + 1; });
  SCHOOLS_FC.forEach((t,i)=>{ if (!t.L3 || HEV_SCHOOLS.has(t.name) || isAdultS(t)) return;
    const Ng = t.n.slice(9).reduce((a,v)=>a+v,0), m = gMid(t.name), ex = EXAM[t.name];
    if (Ng >= 100 && ((m!=null && m >= 0.55) || (ex!=null && ex >= EXAM_P80) || STATE_G.has(t.name))){ g.add(i); if (t.L2 && (L2kov[t.kov]||0) >= 3) b.add(i); } });
  return {g, b}; })();
const srcIdx = () => IDX[P.demo===1 ? 'rv084' : P.demo===2 ? 'hpk' : (['hp','hp16','hpnm','hpx'][P.migr||0])];
/* põhikooli lõpetajate jagunemine (eeldus upSplit): gümnaasium / kutseõpe / ei õpi
   0 = senine (70 / 25 / 5, Haridussilm 2005–2025); 1 = õppimiskohustus kuni 18 (70 / 28 / 2);
   2 = liigutakse riigi eesmärgi suunas (vaikimisi): kutseõpe 28% → 35% aastaks 2035, ei õpi 2%, gümnaasium 70% → 63% */
const SPLIT0 = {g:0.70, v:0.25, n:0.05};
function splitAt(year){ const o = P.upSplit|0; if (o===0 || year < 2026) return SPLIT0; if (o===1) return {g:0.70, v:0.28, n:0.02};
  const v = 0.28 + 0.07*Math.min(1, (year-2026)/9); return {g:1-v-0.02, v, n:0.02}; }
const gymF = year => splitAt(year).g/SPLIT0.g, vocF = year => splitAt(year).v/SPLIT0.v;
function demandY(yi){ const src = srcIdx(), io = c => src[c] || src[c==='Tallinn' ? 'Harju' : c], Y = IDX.years[yi];
  // gümnaasiumi klass g sisenes aastal Y-(g-9); 2025/26 õpilased (aasta 2026) on tegelikud
  const gk = g => { const e = Y - (g-9); return e > 2026 ? gymF(e) : 1; };
  return SCHOOLS_FC.map(t=>{ if (HEV_SCHOOLS.has(t.name)) return t.n.slice();   // HEV-koolide õpilaste arv püsib
    const ix = io(t.county); return t.n.map((v,g)=> v*(ix ? ix[String(g+7)][yi] : 1)*(g>=9 ? gk(g) : 1)); }); }
const PN_C = new Map();
/* õpilased koolides aastal yi: tõmbekoolid hoiavad oma suuruse, kuni piirkonna nõudlus on suurem kui nende kohad; kogu langus läheb teistele koolidele.
   Piirkond: gümnaasium – maakond, Tallinn koos Harjumaaga; põhikool – omavalitsus, Tallinn koos Harjumaaga. */
function pullN(yi){
  const key = [P.demo, P.migr, P.pull, P.pullR, P.upSplit, yi].join('|'); if (PN_C.has(key)) return PN_C.get(key);
  const nat = demandY(yi); if (!P.pull){ PN_C.set(key, nat); return nat; }
  const S = SCHOOLS_FC, Y = IDX.years[yi], out = nat.map(a=>a.slice()), r = P.pullR || 3, grp = {};
  const cap0 = (i,g) => { const d = GCAP[i]; return d && g>=9 && Y >= d.y + (g-9) ? d.cap/3 : S[i].n[g]; };
  const isPull = (i, st) => st==='g' ? (PULL.g.has(i) || (GCAP[i] && Y >= GCAP[i].y)) : PULL.b.has(i);
  const HT = c => c==='Tallinn' || c==='Harju';
  S.forEach((t,i)=>{ if (HEV_SCHOOLS.has(t.name) || isAdultS(t)) return;
    if (t.n.slice(9).some(v=>v>0) || GCAP[i]){ const k = 'g:' + (HT(t.county) ? 'HT' : t.county); (grp[k] = grp[k] || {st:'g', gr:[9,10,11], m:[]}).m.push(i); }
    if (t.n.slice(0,9).some(v=>v>0)){ const k = 'b:' + (HT(t.county) ? 'HT' : t.kov); (grp[k] = grp[k] || {st:'b', gr:[0,1,2,3,4,5,6,7,8], m:[]}).m.push(i); } });
  Object.values(grp).forEach(G=>{ if (!G.m.some(i=>isPull(i, G.st))) return;
    G.gr.forEach(g=>{ let D0=0, Dt=0, P0=0, natO=0;
      G.m.forEach(i=>{ D0 += S[i].n[g]; Dt += nat[i][g]; if (!isPull(i, G.st)) natO += nat[i][g]; });
      if (!(D0 > 0)) return; const kc = Math.min(1, r*Dt/D0);
      G.m.forEach(i=>{ if (isPull(i, G.st)) P0 += cap0(i,g)*kc; });
      const T = natO > 0 ? Math.min(P0, Dt) : Dt, sc = P0 > 0 ? T/P0 : 0, f = natO > 0 ? Math.max(0, Dt - T)/natO : 0;
      G.m.forEach(i=>{ out[i][g] = isPull(i, G.st) ? cap0(i,g)*kc*sc : nat[i][g]*f; }); }); });
  PN_C.set(key, out); return out;
}

/* ===== senine praktika: omavalitsus liidab kooliastme või kogu kooli, kui see säästab vähemalt 10%
   (P.kovReact 1: kahe kooli kogukulust; 2: suletava kooliastme / kooli kulust) =====
   kandidaat: kulu õpilase kohta (põhikool ja gümnaasiumiaste eraldi) > 1,3 × maakonna mediaan või hoone on alla 60% täis;
   kaalutakse kooli kõrgeimat astet (gümnaasium → 7.–9. kl → 1.–6. kl) ja kogu kooli liitmist;
   vastuvõttev kool: eelistatult samas KOV-is, mitte tõmbekool, vaba ruumiga; koolitee 1.–6. kl ≤ 30 min, 7.–9. kl ≤ 45 min, gümnaasium ≤ 60 min;
   kulus on tegelik hoone ülalpidamine (ka tühi pind); üks muudatus koolis aastas */
const KR = {thr:0.10, pre:1.3, occ:0.6, dec:0.9, lim:{L:30, P:45, G:60}, LV:{G:[9,10,11], P:[6,7,8], L:[0,1,2,3,4,5]}};
const SIM_C = new Map();
const crfK = (r, n) => r/(1-Math.pow(1+r,-n));
/* kooli kulu osade kaupa (põhikool ja gümnaasiumiaste eraldi), sama loogika nagu schoolYear */
function syParts(n12, Py){ const nb=n12.slice(0,9), ng=n12.slice(9,12), Nb=nb.reduce((a,b)=>a+b,0), Ng=ng.reduce((a,b)=>a+b,0); if (Nb+Ng < 1) return null;
  const o = {N:Nb+Ng, Nb, Ng, cb:0, cg:0, cost:0, teach:0, sup:0, oth:0, m2:0};
  const acc = (x, k) => { const s = x.staff.filter(y=>y.cat==='Tugiteenused').reduce((a,y)=>a+y.fte,0); o.teach += x.teachFTE; o.sup += s; o.oth += x.staffFTE - x.teachFTE - s; o[k] += x.total; o.cost += x.total; o.m2 += x.m2; };
  if (Nb >= 1) acc(basicScenario({id:'s', N:Nb, S:1, hub:false, rider:P.riderF, n:nb}, Py, null), 'cb');
  if (Ng >= 1) acc(gymScenario({id:'g', S:1, rider:P.riderF, kind:'gym', g:{med:Ng/3, sen:0}, shared: Nb>=1}, Py, null), 'cg');
  return o; }
function kovSim(){
  const key = JSON.stringify([P.demo, P.migr, P.pull, P.pullR, P.kovReact, P.kovThr, P.upSplit]); if (SIM_C.has(key)) return SIM_C.get(key);
  const S = SCHOOLS_FC, Y = IDX.years.length, LVs = ['G','P','L'], lvOf = g => g>=9 ? 'G' : g>=6 ? 'P' : 'L';
  const st = S.map(t=>({G:!!t.L3, P:!!t.L2, L:!!t.L1})), dest = S.map(()=>({})), area = S.map(t=>AREA[t.name]||0);
  const elig = i => { const t=S[i]; return !t.priv && !HEV_SCHOOLS.has(t.name) && !isAdultS(t); };
  const TT = new Map(), trav = (i,j) => { const k=i*1000+j; if (!TT.has(k)) TT.set(k, idlTravel({lat:S[i].lat, lon:S[i].lon, pt:TPT[i]}, {lat:S[j].lat, lon:S[j].lon, pt:TPT[j]}, IDL).t); return TT.get(k); };
  const follow = (i, lv) => { let j=i, k=0; while (dest[j][lv]!=null && k++<20) j = dest[j][lv]; return j; };
  const sumLv = (n, lv) => KR.LV[lv].reduce((a,g)=>a+n[g],0);
  const isPullAt = (j, lv, y) => lv==='G' ? (PULL.g.has(j) || (GCAP[j] && y >= GCAP[j].y)) : PULL.b.has(j);
  const crfB = crfK((IDL.dormRate||4)/100, IDL.schLife||40), crfO = crfK((IDL.dormRate||4)/100, 15), bM2 = IDL.buildM2||4500;
  const out = {N:[], moved:[], open:[], ev:[], closedAt:S.map(()=>-1)}, N0 = pullN(0).map(a=>a.reduce((x,y)=>x+y,0));
  for (let yi=0; yi<Y; yi++){
    const year = IDX.years[yi];
    // otsustatud ühendamised
    if (P.kovReact) MERGE.forEach(d=>{ if (d.y!==year) return; area[d.h] = Math.max(area[d.h], d.cap*8);
      d.m.forEach(i=>{ LVs.forEach(l=>{ if (st[i][l]) dest[i][l] = d.h; }); st[i] = {G:false, P:false, L:false}; if (out.closedAt[i] < 0) out.closedAt[i] = yi;
        out.ev.push({y:year, i, lv:'ALL', j:d.h, pct:null, sav:0, m:0, dec:d.src}); }); });
    const base = pullN(yi), N = S.map(()=>Array(12).fill(0)), mv = S.map(()=>0);
    base.forEach((a,i)=>a.forEach((v,g)=>{ if (!(v>0)) return; const j = follow(i, lvOf(g)); N[j][g] += v; if (j!==i) mv[j] += v; }));
    out.ev.forEach(e=>{ if (e.dec && e.y===year) e.m = N[e.j].reduce((a,b)=>a+b,0); });
    if (P.kovReact && yi >= 1){
      const Py = pyFor(yi), thr = (P.kovThr || 20)/100, bu = Py.opM2 + Py.techSal*EMP*12/P.m2Clean + Py.techSal*EMP*12/2500;
      const exc = (i, x) => x && area[i] > 0 ? Math.max(0, area[i] - x.m2)*bu : 0;      // tühja pinna ülalpidamine
      const X = N.map((n,i)=> elig(i) ? syParts(n, Py) : null), med = {b:{}, g:{}}, all = {b:[], g:[]};
      S.forEach((t,i)=>{ const x=X[i]; if (!x) return; if (x.Nb>=1){ (med.b[t.county]=med.b[t.county]||[]).push(x.cb/x.Nb); all.b.push(x.cb/x.Nb); } if (x.Ng>=1){ (med.g[t.county]=med.g[t.county]||[]).push(x.cg/x.Ng); all.g.push(x.cg/x.Ng); } });
      const mdn = v => { const a=v.slice().sort((x,y)=>x-y); return a[Math.floor(a.length/2)]; }, natM = {b:mdn(all.b), g:mdn(all.g)};
      const mOf = (k, c) => (med[k][c] && med[k][c].length >= 3) ? mdn(med[k][c]) : natM[k];
      const capN = i => area[i] > 0 ? area[i]/8 : null;   // hoone maht: 8 m² õpilase kohta
      const done = new Set(), cand = [];
      // omavalitsus reageerib õpilaste arvu langusele: kandidaat on kool, kus õpilasi on vähemalt 10% vähem kui 2026
      S.forEach((t,i)=>{ const x=X[i]; if (!x) return; const lv = LVs.find(l=>st[i][l] && sumLv(N[i], l) > 0.5); if (!lv) return; if (x.N > KR.dec*N0[i]) return;
        const k = lv==='G' ? 'g' : 'b', r = (k==='g' ? x.cg/x.Ng : x.cb/x.Nb)/mOf(k, t.county), cN = capN(i), occ = cN ? x.N/cN : 1;
        if (r > KR.pre || occ < KR.occ) cand.push({i, lv, rc:r, occ, r: Math.max(r, KR.pre*KR.occ/Math.max(0.05, occ))}); });
      cand.sort((a,b)=>b.r-a.r).forEach(({i, lv, rc, occ})=>{ if (done.has(i) || !X[i]) return;
        const open = LVs.filter(l=>st[i][l] && sumLv(N[i], l) > 0.5);
        const opts = [[lv]]; if (open.length > 1) opts.push(open);
        let best = null;
        opts.forEach(lvs=>{ const lim = Math.min(...lvs.map(l=>KR.lim[l]));
          const hosts = S.map((t,j)=>j).filter(j=> j!==i && elig(j) && X[j] && lvs.every(l=>st[j][l] && sumLv(N[j], l) > 0.5 && !isPullAt(j, l, year))
            && haversine(S[i], S[j]) < 70 && trav(i,j) <= lim
            && X[j].N >= X[i].N                                        // väiksem kool liidetakse suuremaga, mitte vastupidi
            && lvs.every(l=>{ const st2 = l==='G' ? 'g' : 'b', qi = qStatus(S[i], st2, P), qj = qStatus(S[j], st2, P); return qj >= qi; })   // 1. kvaliteet õpilase vaates ei lange
            && (lvs.length === 1 && lvs[0] !== 'L' || S[j].kov === S[i].kov));   // kogu kool ja algklassid jäävad oma omavalitsusse
          const evalH = j => { const ni=N[i].slice(), nj=N[j].slice(); let m=0; lvs.forEach(l=>KR.LV[l].forEach(g=>{ nj[g]+=ni[g]; m+=ni[g]; ni[g]=0; }));
            const xi = syParts(ni, Py), xj = syParts(nj, Py);
            if (area[j] > 0 && xj.m2 > area[j]) return null;                       // vastuvõtval koolil peab olema vaba ruumi
            const before = X[i].cost + exc(i, X[i]) + X[j].cost + exc(j, X[j]);
            const staffB = X[i].teach+X[i].sup+X[i].oth + X[j].teach+X[j].sup+X[j].oth, staffA = (xi ? xi.teach+xi.sup+xi.oth : 0) + xj.teach+xj.sup+xj.oth;
            const extra = area[j] > 0 ? 0 : Math.max(0, xj.m2 - X[j].m2);
            const one = m*P.mergeInvest + P.layoff/100*P.sevMonths*Math.max(0, staffB-staffA)*Py.tSal*EMP + P.closeFixed;
            const after = (xi ? xi.cost + exc(i, xi) : 0) + xj.cost + exc(j, xj) + m*P.riderCost*(1-P.riderF/100) + extra*bM2*crfB + one*crfO;
            const own = xi ? (lvs.includes('G') ? X[i].cg : X[i].cb*lvs.reduce((a,l)=>a+sumLv(N[i],l),0)/Math.max(1,X[i].Nb)) : X[i].cost + exc(i, X[i]);   // suletava osa kulu
            return {j, m, xi, xj, lvs, sav: before-after, pct: (before-after)/(P.kovReact===2 ? own : before)}; };
          const ok = hosts.map(evalH).filter(e=>e && e.pct >= thr);
          if (!ok.length) return;
          const same = ok.filter(e=>S[e.j].kov===S[i].kov), pick = (same.length ? same : ok).sort((a,b)=>b.sav-a.sav)[0];
          if (!best || pick.sav > best.sav) best = pick; });
        if (!best) return; const j = best.j;
        best.lvs.forEach(l=>{ KR.LV[l].forEach(g=>{ N[j][g] += N[i][g]; N[i][g] = 0; }); st[i][l] = false; dest[i][l] = j; });
        mv[j] += best.m; X[i] = best.xi; X[j] = best.xj; done.add(i);
        if (!N[i].some(v=>v>0.5)){ st[i] = {G:false, P:false, L:false}; if (out.closedAt[i] < 0) out.closedAt[i] = yi; }
        out.ev.push({y:year, i, lv: best.lvs.length > 1 ? 'ALL' : best.lvs[0], j, pct:best.pct, sav:best.sav, m:best.m, why: occ < KR.occ ? 'occ' : 'cost', occ, rc}); });
    }
    out.N.push(N); out.moved.push(mv); out.open.push(st.map(s=>({...s})));
  }
  SIM_C.set(key, out); return out;
}
const simOn = () => !!(P.pull || P.kovReact);
const simYi = year => Math.max(0, Math.min(IDX.years.length-1, IDX.years.indexOf(Math.min(year, IDX.years[IDX.years.length-1]))));
/* kas kool pakub seda astet tänases võrgus antud aastal (senise praktika järgi) */
function sqOpen(i, lv, year){ if (!simOn()) return true; const o = kovSim().open[simYi(year)][i]; return lv==='GQ' ? o.G : o[lv]; }
function sqAny(i, year){ if (!simOn()) return true; const o = kovSim().open[simYi(year)][i]; return o.G || o.P || o.L; }
/* valideerimine: kui suur osa gümnaasiumiealistest õpib teise omavalitsuse gümnaasiumis (mudel) – võrdluseks Haridussilma põhikoolilõpetajate liikumisega */
function valStats(R){
  const D = R.D, SQT = R.SQT, out = {}, kvOf = i => BKOV.names[BKOV.kv[i]];
  const SJ = {}; Object.values(R.siteInfo).forEach(si=>SJ[si.j]=si);
  const siteKov = j => { const si = SJ[j]; return si ? (si.labelT||si.c).kov : (R.C[j] ? R.C[j].kov : null); };
  const add = (c, k, w) => { const o = out[c] = out[c] || {w:0, sq:0, opt:0}; o[k] += w; };
  for (let i=0; i<D.length; i++){ const wA = (R.A.w[i]||0)*3, wB = (R.B.w[i]||0)*3, w = wA + wB; if (!(w>0)) continue; const kv = kvOf(i);
    [D[i].county, 'Eesti'].forEach(c=>{ add(c, 'w', w); const s = SQT.G.who[i]; if (s>=0 && SCHOOLS[s].kov!==kv) add(c, 'sq', w);
      const a = R.A.e.as[i], b = R.B.e.as[i]; if (a>=0 && siteKov(a)!==kv) add(c, 'opt', wA); if (b>=0 && siteKov(b)!==kv) add(c, 'opt', wB); }); }
  Object.values(out).forEach(o=>{ o.sq /= o.w; o.opt /= o.w; });
  return {c:out, sh:R.shares};
}
/* HEV-koolid: õpilased õppekava ja klassi liigi järgi (EHIS/Haridussilm 2025/26) ja tegelik kulu õpilase kohta, kus see on teada */
const HEVMIX = {"Haapsalu Viigi Kool":{"hool":6,"lihts":44,"toim":19,"rok_eri":26},"Kaali Kool":{"rok_eri":3,"rok":26},"Kajamaa Kool":{"lihts":16,"rok_eri":65},"Kose-Uuemõisa Lasteaed-Kool":{"rok":48},"Lasnamäe Põhikool":{"lihts":62,"rok_eri":281},"Maarjamaa Riigikool":{"hool":11,"lihts":158,"toim":84},"Mäepealse Erakool":{"rok_eri":43},"Narva Paju Kool":{"hool":6,"lihts":42,"toim":20,"rok_eri":69,"rok":47},"Põlva Roosi Kool":{"hool":3,"lihts":14,"toim":8},"Ristiku Põhikool":{"lihts":8,"rok_eri":187,"rok":104},"Saaremaa Toetava Hariduse Keskus":{"hool":4,"lihts":23,"toim":12,"rok_eri":41},"Tallinna Heleni Kool":{"lihts":5,"toim":4,"rok_eri":143},"Tallinna Konstantin Pätsi Vabaõhukool":{"lihts":3,"rok_eri":135},"Tartu Herbert Masingu Kool":{"lihts":7,"rok_eri":273},"Tartu Maarja Kool":{"hool":17,"lihts":9,"toim":47,"rok_eri":1},"Tartu Tähtvere Riigikool":{"lihts":5,"toim":8,"rok_eri":262},"Türi Kevade Kool":{"hool":3,"lihts":4,"toim":12},"Viljandi Kaare Kool":{"lihts":32,"rok_eri":79}};
const HEVACT = {"Mäepealse Erakool": 14912};
/* ===== HEV-koolid: eraldi kulumudel; õpilaste arv püsib 2025/26 tasemel =====
   klassi suurus (PGS ja HEV-õppe kord): tavaklass HEV-koolis 12, väikeklass/eriklass riikliku õppekava järgi 10, lihtsustatud õpe 11, toimetulekuõpe 6, hooldusõpe 4;
   õpetaja abi klassi kohta: 0,25 / 0,5 / 0,5 / 1 / 1,5; tugispetsialisti tunde õpilase kohta nädalas: 1 / 1,5 / 1,5 / 1,5 / 2;
   juhtimine vähemalt 1 direktor ja 0,5 sekretäri; hoone tegeliku pinna järgi; transport ja öömaja hevTrans € õpilase kohta */
const HEV_SIZE = {rok:12, rok_eri:10, lihts:11, toim:6, hool:4}, HEV_ASST = {rok:0.25, rok_eri:0.5, lihts:0.5, toim:1, hool:1.5}, HEV_SUPH = {rok:1, rok_eri:1.5, lihts:1.5, toim:1.5, hool:2};
function hevSchoolYear(name, n12, Py){
  const N = n12.reduce((a,b)=>a+b,0), o = {N, teach:0, sup:0, oth:0, cost:0, cap:0, m2:0, tcost:0, src:'mudel'}; if (N < 1) return o;
  const mix = HEVMIX[name] || {rok_eri:1}, mt = Object.values(mix).reduce((a,b)=>a+b,0) || 1, EMPm = 12*EMP;
  let classes = 0, asst = 0, suph = 0;
  Object.entries(mix).forEach(([k,v])=>{ const n = N*v/mt, c = n/HEV_SIZE[k]; classes += c; asst += c*HEV_ASST[k]; suph += n*HEV_SUPH[k]; });
  classes = Math.max(1, classes);
  const teach = classes*P.hevLoad*(1+P.extra/100)/P.contact*(1+P.addOn/100), spec = suph/P.supContact, lead = Math.max(1, N/150), adm = Math.max(0.5, N/300);
  const m2 = AREA[name] || N*P.hevM2, bldStaff = m2/P.m2Clean + m2/2500 + N/P.mealsPerCook;
  o.teach = teach; o.sup = asst + spec; o.oth = lead + adm + bldStaff; o.m2 = m2; o.tcost = teach*Py.tSal*EMPm;
  o.cost = o.tcost + (asst*Py.abiSal + spec*Py.supSal + lead*Py.dirSal*0.85 + adm*Py.adminSal + bldStaff*Py.techSal)*EMPm + m2*Py.opM2 + N*(P.perMat + P.perIT + P.perOther + DAYS*P.mealIng + P.hevTrans);
  if (HEVACT[name]){ o.cost = HEVACT[name]*N*(Py.tSal/P.tSal); o.src = 'tegelik'; }
  return o; }
