var VERSION = "v22.1.0";
var LS = {
  dark: "flashcards-dark",
  stats: "flashcards-stats-v1",
  known: { fr: "flashcards-fr-known-v1", en: "flashcards-en-known-v1", de: "flashcards-de-known-v1" },
  favs: { fr: "flashcards-fr-favs-v1" }
};
function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
function lsGetJSON(k, fb) { try { return JSON.parse(lsGet(k) || JSON.stringify(fb)); } catch (e) { return fb; } }
function lsSetJSON(k, v) { lsSet(k, JSON.stringify(v)); }
function navGo(st, len, dir) { if (swipeGuard()) return false; st.flipped = false; st.index = (st.index + dir + len) % len; return true; }
/* ================= LISTES ANGLAIS / ALLEMAND ================= */
var CATS_EN = { articles:"Articles & pronoms", verbes:"Verbes", prepositions:"Prépositions & conjonctions", adverbes:"Adverbes & négations", adjectifs:"Adjectifs & quantifieurs", noms:"Noms fréquents" };
var CATS_DE = { articles:"Artikeln & Pronomen", verbes:"Verben", prepositions:"Präpositionen & Konjunktionen", adverbes:"Adverbien & Partikeln", adjectifs:"Adjektive", noms:"Nomen" };
var WORDS_EN = __WORDS_EN__;
(function () {
  var m = {
"the":"A1","a":"A1","an":"A1","I":"A1","you":"A1","he":"A1","she":"A1","it":"A1","we":"A1","they":"A1","me":"A1","him":"A1","her":"A1","us":"A1","them":"A1","my":"A1","your":"A1","his":"A1","its":"A1","our":"A1","their":"A1","this":"A1","that":"A1","these":"A1","those":"A1","who":"A1","what":"A1","one":"A1","there":"A1",
"be":"A1","have":"A1","do":"A1","go":"A1","come":"A1","get":"A1","make":"A1","know":"A1","think":"A1","take":"A1","see":"A1","want":"A1","give":"A1","work":"A1","help":"A1","hear":"A1","play":"A1","run":"A1","like":"A1","live":"A1","write":"A1","read":"A1","open":"A1","walk":"A1","love":"A1","buy":"A1","wait":"A1","meet":"A1","win":"A1","sit":"A1","stand":"A1",
"of":"A1","in":"A1","to":"A1","for":"A1","with":"A1","on":"A1","at":"A1","by":"A1","from":"A1","up":"A1","after":"A1","under":"A1","and":"A1","but":"A1","or":"A1","so":"A1","because":"A1","if":"A1","before":"A1",
"not":"A1","no":"A1","very":"A1","now":"A1","here":"A1","where":"A1","when":"A1","how":"A1","why":"A1","again":"A1","well":"A1","only":"A1","always":"A1","never":"A1","often":"A1","sometimes":"A1",
"all":"A1","some":"A1","good":"A1","new":"A1","old":"A1","big":"A1","small":"A1","long":"A1","short":"A1","right":"A1","left":"A1","early":"A1","late":"A1","hard":"A1","first":"A1","last":"A1","next":"A1","best":"A1","better":"A1","young":"A1",
"time":"A1","year":"A1","day":"A1","man":"A1","woman":"A1","child":"A1","world":"A1","life":"A1","hand":"A1","eye":"A1","place":"A1","week":"A1","thing":"A1","home":"A1","head":"A1","night":"A1","friend":"A1","family":"A1","name":"A1","question":"A1","house":"A1","room":"A1","book":"A1","school":"A1","city":"A1","food":"A1","minute":"A1","hour":"A1","water":"A1",
"which":"A2",
"will":"A2","would":"A2","can":"A2","could":"A2","should":"A2","may":"A2","must":"A2","use":"A2","find":"A2","tell":"A2","call":"A2","try":"A2","feel":"A2","leave":"A2","put":"A2","mean":"A2","keep":"A2","begin":"A2","show":"A2","move":"A2","hold":"A2","bring":"A2","happen":"A2","lose":"A2","pay":"A2","learn":"A2","change":"A2","add":"A2","grow":"A2","send":"A2","set":"A2","build":"A2","turn":"A2",
"about":"A2","into":"A2","over":"A2","between":"A2","out":"A2","than":"A2","as":"A2",
"also":"A2","just":"A2","then":"A2","still":"A2","usually":"A2","already":"A2",
"any":"A2","more":"A2","most":"A2","many":"A2","much":"A2","little":"A2","own":"A2","same":"A2","high":"A2","low":"A2","important":"A2","different":"A2","full":"A2","strong":"A2",
"people":"A2","way":"A2","part":"A2","case":"A2","company":"A2","number":"A2","group":"A2","problem":"A2","fact":"A2","money":"A2","story":"A2","student":"A2","word":"A2",
"might":"B1","include":"B1","offer":"B1","remember":"B1","expect":"B1","provide":"B1","consider":"B1",
"against":"B1","during":"B1","through":"B1","around":"B1","while":"B1",
"even":"B1","perhaps":"B1",
"such":"B1","other":"B1","another":"B1","each":"B1","few":"B1","able":"B1","free":"B1","true":"B1","real":"B1",
"side":"B1","area":"B1","business":"B1","moment":"B1","point":"B1",
"although":"B2","however":"B2"
  };
  WORDS_EN.forEach(function (w) { if (!w[4]) w[4] = m[w[0]] || "A2"; });
})();
var WORDS_DE = __WORDS_DE__;

/* ================= ONGLETS ================= */
var mode = "en";
function byId(i) { return document.getElementById(i); }
function cardKey(e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.click(); } }
var __lastTap = 0;
function isDoubleTap() { var n = Date.now(); if (n - __lastTap < 450) { return true; } __lastTap = n; return false; }
function toast(msg) {
  var t = byId("toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
  t.textContent = msg; t.className = "show";
  clearTimeout(t.__h); t.__h = setTimeout(function () { t.className = ""; }, 1800);
}
function setTab(m) {
  mode = m;
  ["Fr","En","De","Dash"].forEach(function (t) { byId("tab" + t).classList.toggle("active", mode === t.toLowerCase()); });
  byId("viewFr").classList.toggle("hidden", mode !== "fr");
  byId("viewLang").classList.toggle("hidden", mode === "fr" || mode === "dash");
  byId("viewDash").classList.toggle("hidden", mode !== "dash");
  if (mode !== "fr" && mode !== "dash") initLang();
  if (mode === "fr") initFr();
  if (mode === "dash") renderDash();
}
byId("tabFr").onclick = function () { setTab("fr"); };
byId("tabEn").onclick = function () { setTab("en"); };
byId("tabDe").onclick = function () { setTab("de"); };
byId("tabDash").onclick = function () { setTab("dash"); };

/* ================= STATISTIQUES ================= */
var STATS_KEY = LS.stats;
var stats = { days: {} };
stats = lsGetJSON(STATS_KEY, { days: {} });
function saveStats() {
  var days = {};
  Object.keys(stats.days).sort().slice(-120).forEach(function (d) { days[d] = stats.days[d]; });
  stats.days = days;
  lsSetJSON(STATS_KEY, stats);
}
function dayKey() {
  var d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function addWordRead(key) {
  var k = dayKey();
  if (!stats.days[k]) stats.days[k] = { w: {}, ex: [] };
  if (!stats.days[k].w) stats.days[k].w = {};
  stats.days[k].w[key] = 1;
  saveStats();
}
function addExam(score, total, lang) {
  var k = dayKey();
  if (!stats.days[k]) stats.days[k] = { w: {}, ex: [] };
  if (!stats.days[k].ex) stats.days[k].ex = [];
  stats.days[k].ex.push({ s: score, t: total, l: lang || "?" });
  saveStats();
}
function daysBetween(d1, d2) { return Math.round((d2 - d1) / 86400000); }
function renderDash() {
  var k = dayKey();
  var today = stats.days[k] || { w: {}, ex: [] };
  byId("dashToday").textContent = Object.keys(today.w || {}).length;
  var exs = [], tot = 0, ok = 0, totalWords = 0;
  Object.keys(stats.days).sort().forEach(function (d) {
    var day = stats.days[d];
    totalWords += Object.keys(day.w || {}).length;
    (day.ex || []).forEach(function (e) {
      tot++;
      exs.push({ d: d, s: e.s, t: e.t, l: e.l });
      if (e.t && e.s / e.t >= 0.7) ok++;
    });
  });
  byId("dashExams").textContent = ok + " / " + tot;
  byId("dashTotal").textContent = totalWords;
  // streak
  var streak = 0;
  var cur = new Date();
  for (;;) {
    var dk = cur.getFullYear() + "-" + String(cur.getMonth() + 1).padStart(2, "0") + "-" + String(cur.getDate()).padStart(2, "0");
    var day = stats.days[dk];
    var active = day && ((day.w && Object.keys(day.w).length) || (day.ex && day.ex.length));
    if (active) { streak++; cur.setDate(cur.getDate() - 1); } else break;
  }
  byId("dashStreak").textContent = streak;
  // chart 14 days
  var svg = byId("dashChart");
  var days = [];
  var d0 = new Date();
  var dk = document.body.classList.contains("dark");
  var colTxt = dk ? "#e2e8f0" : "#0f172a";
  var colGrid = dk ? "#334155" : "#f1f5f9";
  for (var i = 13; i >= 0; i--) {
    var dd = new Date(d0); dd.setDate(d0.getDate() - i);
    var key = dd.getFullYear() + "-" + String(dd.getMonth() + 1).padStart(2, "0") + "-" + String(dd.getDate()).padStart(2, "0");
    var n = stats.days[key] && stats.days[key].w ? Object.keys(stats.days[key].w).length : 0;
    days.push({ l: key.slice(8) + "/" + key.slice(5, 7), n: n, today: i === 0 });
  }
  var max = Math.max(5, Math.max.apply(null, days.map(function (x) { return x.n; })));
  var W = 700, H = 200, pad = 26, bw = (W - pad * 2) / 14 * 0.62;
  var x = function (i) { return pad + (i + 0.5) * (W - pad * 2) / 14; };
  var h = function (n) { return n / max * (H - 74); };
  var s = '<line x1="' + pad + '" y1="' + (H - 44) + '" x2="' + (W - pad) + '" y2="' + (H - 44) + '" stroke="' + colGrid + '" stroke-width="1"/>';
  [0, max].forEach(function (v) {
    var y = H - 44 - h(v);
    s += '<text x="' + (pad - 4) + '" y="' + (y + 4) + '" font-size="11" fill="#94a3b8" text-anchor="end">' + v + "</text>";
    s += '<line x1="' + pad + '" y1="' + y + '" x2="' + (W - pad) + '" y2="' + y + '" stroke="' + colGrid + '" stroke-width="1"/>';
  });
  days.forEach(function (d, i) {
    var bh = Math.max(d.n ? 3 : 1, h(d.n));
    var y = H - 44 - bh;
    s += '<rect x="' + (x(i) - bw / 2) + '" y="' + y + '" width="' + bw + '" height="' + bh + '" rx="3" fill="' + (d.today ? "#2563eb" : "#10b981") + '" opacity="' + (d.n ? 1 : 0.25) + '"/>';
    if (d.n) s += '<text x="' + x(i) + '" y="' + (y - 5) + '" font-size="11" font-weight="600" fill="' + colTxt + '" text-anchor="middle">' + d.n + "</text>";
    s += '<text x="' + x(i) + '" y="' + (H - 28) + '" font-size="10" fill="#94a3b8" text-anchor="middle">' + d.l + "</text>";
  });
  svg.innerHTML = s;
  // known per language
  var counts = [["Français", "flashcards-fr-known-v1", (frWords || []).length], ["Anglais", "flashcards-en-known-v1", WORDS_EN.length], ["Allemand", "flashcards-de-known-v1", WORDS_DE.length]];
  var html = "";
  counts.forEach(function (c) {
    var kn = {};
    kn = lsGetJSON(c[1], {});
    var n = Object.keys(kn).length;
    var pct = c[2] ? Math.round(n / c[2] * 100) : 0;
    html += '<div class="dashrow"><span class="lang">' + c[0] + '</span><div class="mini"><div style="width:' + pct + '%"></div></div><span class="n">' + n + " mot" + (n > 1 ? "s" : "") + (c[2] ? " / " + c[2] + " (" + pct + " %)" : "") + "</span></div>";
  });
  byId("dashKnown").innerHTML = html;
  // last exams
  var last = exs.slice(-8).reverse();
  var flags = { "Français": "🇫🇷", "Anglais": "🇬🇧", "Allemand": "🇩🇪" };
  byId("dashExList").innerHTML = last.length ? last.map(function (e) {
    var pct = Math.round(e.s / e.t * 100);
    var known = e.l && e.l !== "?";
    var fl = known ? (flags[e.l] || "📚") : "❔";
    return fl + " " + (known ? e.l : "langue non enregistrée") + " — " + e.d + " : " + e.s + "/" + e.t + " (" + pct + " %) " + (pct >= 70 ? "✅" : "❌");
  }).join("<br/>") : "Aucun examen enregistré pour l'instant.";
  // exams per language summary
  var perLang = {};
  exs.forEach(function (e) {
    var l = (e.l && e.l !== "?") ? e.l : "Avant le suivi par langue";
    if (!perLang[l]) perLang[l] = { ok: 0, tot: 0 };
    perLang[l].tot++;
    if (e.t && e.s / e.t >= 0.7) perLang[l].ok++;
  });
  var order = ["Français", "Anglais", "Allemand"];
  var langKeys = Object.keys(perLang).sort(function (a, b) {
    var ia = order.indexOf(a), ib = order.indexOf(b);
    if (ia === -1) ia = 99; if (ib === -1) ib = 99;
    return ia - ib;
  });
  var exHtml = "";
  langKeys.forEach(function (l) {
    var p = perLang[l];
    var isOld = l === "Avant le suivi par langue";
    var pct = Math.round(p.ok / p.tot * 100);
    exHtml += '<div class="dashrow"' + (isOld ? ' style="opacity:.55"' : "") + '><span class="lang">' + (isOld ? "❔ " : (flags[l] ? flags[l] + " " : "📚 ")) + l + '</span><div class="mini"><div style="width:' + pct + "%;" + (isOld ? "background:#94a3b8" : "") + '"></div></div><span class="n">' + p.ok + " réussi" + (p.ok > 1 ? "s" : "") + " / " + p.tot + "</span></div>";
  });
  byId("dashExamLang").innerHTML = exHtml || "Aucun examen enregistré pour l'instant.";
}

/* ===== niveaux allemand ===== */
var DE_A2 = {"dieser":1,"mögen":1,"benutzen":1,"telefonieren":1,"kennenlernen":1,"einladen":1,"bezahlen":1,"schmecken":1,"kaputt":1,"pünktlich":1,"endlich":1,"gern":1,"zusammen":1,"manchmal":1,"vielleicht":1,"leider":1,"einfach":1,"schwierig":1,"müde":1,"frei":1,"billig":1};
WORDS_DE.forEach(function (w) { w[4] = w[4] || (DE_A2[w[0]] ? "A2" : "A1"); });
/* ================= MODE ANGLAIS / ALLEMAND ================= */
var CATS = CATS_EN, WORDS = WORDS_EN, LS_KEY = LS.known.en;
var langBuilt = false;
function initLang() {
  var isDe = mode === "de";
  CATS = isDe ? CATS_DE : CATS_EN;
  WORDS = isDe ? WORDS_DE : WORDS_EN;
  LS_KEY = LS.known[mode];
  byId("langSub").textContent = isDe
    ? "Mots par niveau A1–C2, alignés sur les listes Goethe. Pluriel et déclinaisons sur la même face."
    : "Touche la carte pour la retourner. Ces mots couvrent ~65 % de tout texte anglais.";
  byId("langTip").textContent = isDe
    ? "Astuce : apprends toujours le nom avec son article (der/die/das)."
    : "Astuce : commence par « Articles & pronoms » puis « Verbes ».";
  byId("langA").textContent = isDe ? "DE → FR" : "EN → FR";
  byId("langB").textContent = isDe ? "FR → DE" : "FR → EN";
  lState.lang = isDe ? "de" : "en";
  langUI();
  lState.index = 0; lState.flipped = false; lState.cat = "all"; lState.shuffled = false;
  byId("shuffleBtn").classList.remove("active");
  buildCatSelect();
  var lv = byId("levelSelect");
  if (!lv.children.length) {
    [["all", "🎯 Tous niveaux"], ["A1", "A1 — débutant"], ["A2", "A2 — élémentaire"], ["B1", "B1 — intermédiaire"], ["B2", "B2 — intermédiaire +"], ["C1", "C1 — avancé"], ["C2", "C2 — maîtrise"]].forEach(function (p) {
      var o = document.createElement("option"); o.value = p[0]; o.textContent = p[1]; lv.appendChild(o);
    });
  }
  lv.value = lState.level || "all";
  langBuilt = true;
  lRender();
}
var known = {};
known = lsGetJSON(LS_KEY, {});
var lState = { cat: "all", lang: "en", shuffled: false, index: 0, flipped: false, seed: 1, level: "all" };
function loadKnown() { known = lsGetJSON(LS_KEY, {}); }
function saveKnown() { lsSetJSON(LS_KEY, known); }
function shuffledArr(arr, seed) {
  var a = arr.slice(), s = seed || 1;
  function rand() { s = (s * 9301 + 49297) % 233280; return s / 233280; }
  for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rand() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}
function deck() {
  var d = lState.cat === "all" ? WORDS : WORDS.filter(function (w) { return w[2] === lState.cat; });
  if (mode !== "fr" && lState.level && lState.level !== "all") d = d.filter(function (w) { return w[4] === lState.level; });
  return lState.shuffled ? shuffledArr(d, lState.seed) : d;
}
function lRender() {
  loadKnown();
  var d = deck();
  if (!d.length) return;
  if (lState.index >= d.length) lState.index = 0;
  var w = d[lState.index];
  var foreign = w[0], fr = w[1], cat = w[2], note = w[3] || "";
  var showForeign = lState.lang !== "fr";
  byId("frontTxt").textContent = showForeign ? foreign : fr;
  byId("frontNote").textContent = showForeign ? note : "";
  byId("backTxt").textContent = showForeign ? fr : foreign;
  byId("backNote").textContent = showForeign ? "" : note;
  var badge = byId("badge");
  badge.textContent = CATS[cat] + (w[4] ? " · " + w[4] : "");
  badge.className = "badge cat-" + cat;
  byId("card").className = "card" + (lState.flipped ? " flipped" : "");
  byId("pos").textContent = (lState.index + 1) + " / " + d.length;
  var kc = d.filter(function (x) { return known[x[0]]; }).length;
  byId("knowTxt").textContent = kc + " mots sus (" + Math.round(kc / d.length * 100) + " %)";
  byId("prog").style.width = Math.round(kc / d.length * 100) + "%";
  var kb = byId("knowBtn");
  kb.className = "act know" + (known[foreign] ? " on" : "");
  kb.textContent = known[foreign] ? "✓ Je connais (déjà su)" : "Je connais ce mot";
}
function lNext() { if (navGo(lState, deck().length, 1)) lRender(); }
function lPrev() { if (navGo(lState, deck().length, -1)) lRender(); }
function lRestart() { lState.index = 0; lState.flipped = false; lRender(); }
function buildCatSelect() {
  var sel = byId("catSelect");
  sel.innerHTML = "";
  var cats = [["all", "Toutes les catégories"]].concat(Object.keys(CATS).map(function (k) { return [k, CATS[k]]; }));
  cats.forEach(function (c) {
    var o = document.createElement("option");
    o.value = c[0];
    o.textContent = c[1];
    sel.appendChild(o);
  });
  sel.value = lState.cat;
}
byId("card").onclick = function () {
  if (swipeGuard()) return;
  if (!lState.flipped) { var w = deck()[lState.index]; if (w) addWordRead(mode + ":" + w[0]); }
  lState.flipped = !lState.flipped; lRender();
};
byId("card").addEventListener("keydown", cardKey);
byId("nextBtn").onclick = lNext;
byId("prevBtn").onclick = lPrev;
byId("reviewBtn").onclick = lNext;
byId("knowBtn").addEventListener("click", function (e) {
  e.stopPropagation();
  if (swipeGuard()) return;
  if (isDoubleTap()) return;
  try {
    var w = deck()[lState.index];
    if (known[w[0]]) {
      if (knowBtnConfirm !== w[0]) { knowBtnConfirm = w[0]; return; }
      knowBtnConfirm = null;
      known[w[0]] = false;
    } else {
      knowBtnConfirm = null;
      known[w[0]] = true;
    }
    saveKnown(); lRender();
  } catch (err) { toast("Erreur : " + err.message); }
});
var knowBtnConfirm = null;
byId("langA").onclick = function () { lState.lang = mode; lState.flipped = false; langUI(); lRender(); };
byId("langB").onclick = function () { lState.lang = "fr"; lState.flipped = false; langUI(); lRender(); };
function langUI() {
  byId("langA").classList.toggle("active", lState.lang !== "fr");
  byId("langB").classList.toggle("active", lState.lang === "fr");
}
byId("shuffleBtn").onclick = function () { lState.shuffled = !lState.shuffled; lState.seed = Math.floor(Math.random() * 2147483647) + 1; this.classList.toggle("active", lState.shuffled); lRestart(); };
byId("catSelect").onchange = function () { lState.cat = this.value; lState.index = 0; lState.flipped = false; lRender(); };
byId("levelSelect").onchange = function () { lState.level = this.value; lState.index = 0; lState.flipped = false; lRender(); };
/* ===== import / export des listes EN & DE ===== */
function idbGetKey(db, key) {
  return new Promise(function (res, rej) {
    var rq = db.transaction("words").objectStore("words").get(key);
    rq.onsuccess = function () { res(rq.result); };
    rq.onerror = function () { rej(rq.error); };
  });
}
var importTarget = "en";
function exportLangList(lang) {
  var words = lang === "de" ? WORDS_DE : WORDS_EN;
  var data = JSON.stringify(words, null, 1);
  var blob = new Blob([data], { type: "application/json" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = lang === "de" ? "vocabulaire-allemand.json" : "vocabulaire-anglais.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(a.href); }, 3000);
}
function normalizeLangList(arr) {
  if (!Array.isArray(arr)) throw new Error("Le fichier doit être une liste JSON");
  var out = [];
  arr.forEach(function (w) {
    if (!Array.isArray(w) || w.length < 2 || !w[0]) return;
    out.push([String(w[0]), String(w[1] || ""), String(w[2] || "noms"), String(w[3] || ""), String(w[4] || "A1")]);
  });
  if (out.length < 5) throw new Error("Moins de 5 mots valides trouvés");
  return out;
}
function applyLangList(lang, list) {
  if (lang === "de") WORDS_DE = list; else WORDS_EN = list;
  idbOpen().then(function (db) {
    return idbPut(db, { k: lang, words: list }).then(function () { db.close(); });
  }).catch(function () {});
  if (mode === lang) initLang();
}
byId("exportEnBtn").addEventListener("click", function () { exportLangList("en"); });
byId("exportDeBtn").addEventListener("click", function () { exportLangList("de"); });
byId("importEnBtn").addEventListener("click", function () { importTarget = "en"; byId("importListFile").click(); });
byId("importDeBtn").addEventListener("click", function () { importTarget = "de"; byId("importListFile").click(); });
byId("importListFile").addEventListener("change", function () {
  var file = this.files && this.files[0];
  this.value = "";
  if (!file) return;
  var lang = importTarget;
  var reader = new FileReader();
  reader.onload = function () {
    try {
      var list = normalizeLangList(JSON.parse(reader.result));
      applyLangList(lang, list);
      toast("✅ " + list.length + " mots importés (" + (lang === "de" ? "allemand" : "anglais") + ")");
    } catch (err) { toast("❌ Import impossible : " + err.message); }
  };
  reader.readAsText(file);
});
(function loadLangLists() {
  idbOpen().then(function (db) {
    return idbGetKey(db, "en").then(function (r1) {
      if (r1 && Array.isArray(r1.words)) WORDS_EN = r1.words;
      return idbGetKey(db, "de").then(function (r2) {
        if (r2 && Array.isArray(r2.words)) WORDS_DE = r2.words;
        db.close();
        if (langBuilt) initLang(); else lRender();
      });
    });
  }).catch(function () {});
})();
byId("resetBtn").onclick = lRestart;
byId("resetKnow").onclick = function () { known = {}; saveKnown(); lRender(); };

/* ================= MODE FRANÇAIS (IndexedDB) ================= */
var FR_KEY = LS.known.fr;
var frWords = null; // [{t,c,d:[[def,[ex],[syn],[contr]]]}]
var fState = { index: 0, flipped: false, shuffled: false, seed: 1, query: "", cat: "", favOnly: false };
function idbOpen() {
  return new Promise(function (res, rej) {
    var rq = indexedDB.open("vocabfr", 1);
    rq.onupgradeneeded = function () { rq.result.createObjectStore("words", { keyPath: "k" }); };
    rq.onsuccess = function () { res(rq.result); };
    rq.onerror = function () { rej(rq.error); };
  });
}
function idbPut(db, val) {
  return new Promise(function (res, rej) {
    var tx = db.transaction("words", "readwrite");
    tx.objectStore("words").put(val);
    tx.oncomplete = res; tx.onerror = function () { rej(tx.error); };
  });
}
function idbGet(db) {
  return new Promise(function (res, rej) {
    var rq = db.transaction("words").objectStore("words").get("all");
    rq.onsuccess = function () { res(rq.result); };
    rq.onerror = function () { rej(rq.error); };
  });
}
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function cleanTitle(t) { return String(t || "").replace(/\(Réf\. ortho\.[^)]*\)/g, "").trim(); }
function frDeck() {
  var d = frWords || [];
  if (fState.favOnly) d = d.filter(function (w) { return frFavs[w.t]; });
  if (fState.cat) d = d.filter(function (w) { return w.c === fState.cat; });
  var q = fState.query.trim().toLowerCase();
  if (q) {
    var starts = d.filter(function (w) { return w.t.toLowerCase().indexOf(q) === 0; });
    var contains = d.filter(function (w) { return w.t.toLowerCase().indexOf(q) > 0; });
    return starts.concat(contains).slice(0, 100);
  }
  return fState.shuffled ? shuffledArr(d, fState.seed) : d;
}
function frSaveKnown() { lsSetJSON(FR_KEY, frKnown); }
var FR_FAV = LS.favs.fr;
var frFavs = {};
frFavs = lsGetJSON(FR_FAV, {});
function frSaveFavs() { lsSetJSON(FR_FAV, frFavs); }
var frKnown = {};
frKnown = lsGetJSON(FR_KEY, {});
function fRender() {
  var d = frDeck();
  if (!d.length) { byId("frFront").textContent = "Aucun mot"; byId("frBack").innerHTML = ""; return; }
  if (fState.index >= d.length) fState.index = 0;
  var w = d[fState.index];
  byId("frBadge").textContent = w.c || "";
  byId("frFront").textContent = w.t;
  var html = "";
  w.d.forEach(function (def, i) {
    html += '<div class="d">';
    html += (w.d.length > 1 ? '<b class="num">' + (i + 1) + '.</b> ' : "") + esc(def[0]);
    (def[1] || []).forEach(function (ex) { if (ex && ex !== ";") html += '<div class="ex">« ' + esc(ex) + ' »</div>'; });
    if (def[2] && def[2].length) html += '<div class="syn"> synonymes : ' + esc(def[2].join(", ")) + "</div>";
    if (def[3] && def[3].length) html += '<div class="contr"> contraires : ' + esc(def[3].join(", ")) + "</div>";
    html += "</div>";
  });
  byId("frBack").innerHTML = html;
  byId("frCard").className = "card" + (fState.flipped ? " flipped" : "");
  byId("frPos").textContent = (fState.index + 1) + " / " + d.length;
  var kc = d.filter(function (x) { return frKnown[x.t]; }).length;
  byId("frKnowTxt").textContent = kc + " mots sus (" + Math.round(kc / d.length * 100) + " %) — " + (frWords ? frWords.length : 0) + " mots au total";
  byId("frProg").style.width = Math.round(kc / d.length * 100) + "%";
  var kb = byId("frKnowBtn");
  kb.className = "act know" + (frKnown[w.t] ? " on" : "");
  kb.textContent = frKnown[w.t] ? "✓ Je connais (déjà su)" : "Je connais ce mot";
  var fb = byId("frFavCard");
  fb.className = "act" + (frFavs[w.t] ? " favon" : "");
  fb.innerHTML = '<span class="star' + (frFavs[w.t] ? "" : " off") + '">' + (frFavs[w.t] ? "&#9733;" : "&#9734;") + "</span> Favori" + (frFavs[w.t] ? " (favori)" : "");
}
function fNext() { if (navGo(fState, frDeck().length, 1)) fRender(); }
function fPrev() { if (navGo(fState, frDeck().length, -1)) fRender(); }
function fRestart() { fState.index = 0; fState.flipped = false; fRender(); }
function showFrStudy(hasData) {
  byId("importBox").classList.toggle("hidden", hasData);
  byId("frStudy").classList.toggle("hidden", !hasData);
}
function initFr() {
  if (frWords) { showFrStudy(true); fRender(); return; }
  idbOpen().then(function (db) {
    return idbGet(db).then(function (rec) {
      db.close();
      if (rec && rec.words && rec.words.length) {
        frWords = rec.words;
        buildFrCatSelect();
        showFrStudy(true);
        fRender();
      } else {
        showFrStudy(false);
      }
    });
  }).catch(function () { showFrStudy(false); });
}
byId("importBtn").onclick = function () { byId("fileInput").click(); };
byId("frReimport").onclick = function () { frWords = null; fState.index = 0; showFrStudy(false); };
byId("fileInput").onchange = function (e) {
  var file = e.target.files && e.target.files[0];
  if (!file) return;
  var status = byId("importStatus");
  status.classList.remove("hidden");
  status.textContent = "Lecture du fichier… (peut prendre 1–2 min)";
  var reader = new FileReader();
  reader.onload = function () {
    status.textContent = "Analyse des mots…";
    setTimeout(function () {
      try {
        var data = JSON.parse(reader.result);
        if (!Array.isArray(data)) throw new Error("Format inattendu");
        var out = [];
        data.forEach(function (e) {
          var defs = (e["définitions"] || []).map(function (d) {
            return [d["définition"] || "", (d["exemples"] || []).filter(function (x) { return x && x !== ";"; }).slice(0, 3), (d["synonymes"] || []).slice(0, 5), (d["contraires"] || []).slice(0, 3)];
          }).filter(function (d) { return d[0]; });
          if (!defs.length) return;
          var t = cleanTitle(e["titre"]);
          if (!t || t.length > 40) return;
          out.push({ t: t, c: (e["catégorie_grammaticale"] || "").replace("Catégorie non trouvée", ""), d: defs.slice(0, 4) });
        });
        status.textContent = "Enregistrement de " + out.length + " mots…";
        idbOpen().then(function (db) {
          return idbPut(db, { k: "all", words: out }).then(function () {
            db.close();
            frWords = out;
            fState.index = 0;
            buildFrCatSelect();
            status.textContent = "✅ " + out.length + " mots importés !";
            showFrStudy(true);
            fRender();
          });
        }).catch(function (err) { status.textContent = "Erreur d'enregistrement : " + err; });
      } catch (err) { status.textContent = "❌ Fichier illisible : " + err; }
    }, 30);
  };
  reader.onerror = function () { status.textContent = "❌ Impossible de lire le fichier."; };
  reader.readAsText(file);
};
byId("frCard").onclick = function () {
  if (swipeGuard()) return;
  if (!fState.flipped) { var w = frDeck()[fState.index]; if (w) addWordRead("fr:" + w.t); }
  fState.flipped = !fState.flipped; fRender();
};
byId("frCard").addEventListener("keydown", cardKey);
byId("frNext").onclick = fNext;
byId("frPrev").onclick = fPrev;
byId("frReviewBtn").onclick = fNext;
byId("frKnowBtn").addEventListener("click", function (e) {
  e.stopPropagation();
  if (swipeGuard()) return;
  if (isDoubleTap()) return;
  try {
    var w = frDeck()[fState.index];
    if (!w) return;
    if (frKnown[w.t]) {
      if (frKnowBtnConfirm !== w.t) { frKnowBtnConfirm = w.t; return; }
      frKnowBtnConfirm = null;
      frKnown[w.t] = false;
    } else {
      frKnowBtnConfirm = null;
      frKnown[w.t] = true;
    }
    frSaveKnown(); fRender();
  } catch (err) { toast("Erreur : " + err.message); }
});
var frKnowBtnConfirm = null;
byId("frFavCard").addEventListener("click", function (e) {
  e.stopPropagation();
  if (swipeGuard()) return;
  try {
    var w = frDeck()[fState.index];
    if (!w) return;
    frFavs[w.t] = !frFavs[w.t];
    if (!frFavs[w.t]) delete frFavs[w.t];
    frSaveFavs(); fRender();
  } catch (err) { toast("Erreur : " + err.message); }
});
byId("frFavBtn").addEventListener("click", function () {
  fState.favOnly = !fState.favOnly;
  this.classList.toggle("active", fState.favOnly);
  fState.index = 0; fState.flipped = false; fRender();
});
byId("frShuffle").onclick = function () { fState.shuffled = !fState.shuffled; fState.seed = Math.floor(Math.random() * 2147483647) + 1; this.classList.toggle("active", fState.shuffled); fRestart(); };
byId("frReset").onclick = fRestart;
byId("frResetKnow").onclick = function () { frKnown = {}; frSaveKnown(); fRender(); };
byId("searchInput").oninput = function () { fState.query = this.value; fState.index = 0; fRender(); };
byId("frCatSelect").onchange = function () { fState.cat = this.value; fState.index = 0; fState.flipped = false; fRender(); };
function buildFrCatSelect() {
  var sel = byId("frCatSelect");
  sel.innerHTML = "";
  var opt = document.createElement("option");
  opt.value = "";
  opt.textContent = "Toutes les catégories grammaticales";
  sel.appendChild(opt);
  var seen = {};
  (frWords || []).forEach(function (w) { if (w.c && !seen[w.c]) seen[w.c] = 1; });
  Object.keys(seen).sort(function (a, b) { return a.localeCompare(b, "fr"); }).forEach(function (c) {
    var o = document.createElement("option");
    o.value = c; o.textContent = c;
    sel.appendChild(o);
  });
  sel.value = fState.cat || "";
}

/* ================= MODE EXAMEN ================= */
function rShuffle(a) {
  a = a.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}
var EX = { qs: [], i: 0, score: 0, answered: false, finished: false, starter: null, lang: "?" };
var exMastered = { en: {}, de: {}, fr: {} };
function defSnippet(w) {
  var d = (w.d && w.d[0] && w.d[0][0]) || "";
  d = String(d).replace(/\s+/g, " ").trim();
  return d.length > 110 ? d.slice(0, 110) + "…" : d;
}
function examStart(qs, starter, lang) {
  EX = { qs: qs, i: 0, score: 0, answered: false, finished: false, starter: starter, lang: lang || "?" };
  byId("examOverlay").classList.remove("hidden");
  renderExamQ();
}
function renderExamQ() {
  var q = EX.qs[EX.i];
  EX.answered = false;
  byId("examNext").textContent = "Suivant →";
  byId("examPos").textContent = "Question " + (EX.i + 1) + " / " + EX.qs.length;
  byId("examScore").textContent = "Score : " + EX.score;
  byId("examQ").textContent = q.q;
  byId("examFb").classList.add("hidden");
  byId("examEnd").classList.add("hidden");
  var box = byId("examOpts");
  box.classList.remove("hidden");
  box.innerHTML = "";
  q.opts.forEach(function (o) {
    var b = document.createElement("button");
    b.className = "opt";
    b.textContent = o.txt;
    b.onclick = function () {
      if (EX.answered) return;
      EX.answered = true;
      Array.prototype.forEach.call(box.children, function (x) { x.disabled = true; });
      if (o.correct) {
        EX.score++;
        if (q.k) exMastered[mode === "fr" ? "fr" : mode][q.k] = 1;
        if (q.wk) { if (mode === "fr") { frKnown[q.wk] = 1; frSaveKnown(); } else { known[q.wk] = 1; saveKnown(); } }
        b.classList.add("correct");
        byId("examFb").textContent = "✅ Bonne réponse !" + (q.note ? " — " + q.note : "");
      } else {
        b.classList.add("wrong");
        Array.prototype.forEach.call(box.children, function (x) { if (x.__ok) x.classList.add("correct"); });
        byId("examFb").textContent = "❌ La bonne réponse était : " + q.correctTxt + (q.note ? " — " + q.note : "");
      }
      byId("examFb").classList.remove("hidden");
      byId("examScore").textContent = "Score : " + EX.score;
    };
    b.__ok = o.correct;
    box.appendChild(b);
  });
}
function showExamEnd() {
  EX.finished = true;
  addExam(EX.score, EX.qs.length, EX.lang);
  byId("examOpts").classList.add("hidden");
  byId("examFb").classList.add("hidden");
  byId("examQ").textContent = "";
  byId("examPos").textContent = "";
  byId("examEnd").classList.remove("hidden");
  var pct = Math.round(EX.score / EX.qs.length * 100);
  var mention = pct >= 90 ? "Excellent ! 🏆" : pct >= 70 ? "Très bien ! 👍" : pct >= 50 ? "Pas mal, continue ! 💪" : "À retravailler… 📚";
  byId("examFinal").textContent = EX.score + " / " + EX.qs.length + " (" + pct + " %) — " + mention;
  byId("examNext").textContent = "↺ Nouvel examen";
}
function examNextHandler() {
  if (EX.finished) { EX.starter(); return; }
  if (!EX.answered) return;
  EX.i++;
  if (EX.i >= EX.qs.length) showExamEnd(); else renderExamQ();
}
byId("examNext").onclick = examNextHandler;
byId("examQuit").onclick = function () { byId("examOverlay").classList.add("hidden"); };
function startLangExam() {
  var mk = mode === "de" ? "de" : "en";
  var full = deck();
  var pool = full.filter(function (w) { return !exMastered[mk][w[0] + "|" + w[1]]; });
  if (pool.length < 5) { exMastered[mk] = {}; pool = full; }
  if (pool.length < 5) { alert("Pas assez de mots dans cette catégorie."); return; }
  var n = Math.min(20, pool.length);
  var picks = rShuffle(pool).slice(0, n);
  var askFr = lState.lang === "fr";
  var qs = picks.map(function (w) {
    var correctTxt = askFr ? w[0] : w[1];
    var distr = [];
    var others = rShuffle(pool.filter(function (x) { return x !== w; }));
    for (var i = 0; i < others.length && distr.length < 4; i++) {
      var o = askFr ? others[i][0] : others[i][1];
      if (o !== correctTxt && distr.indexOf(o) === -1) distr.push(o);
    }
    var opts = rShuffle([correctTxt].concat(distr)).map(function (t) { return { txt: t, correct: t === correctTxt }; });
    return { q: askFr ? w[1] : w[0], opts: opts, correctTxt: correctTxt, note: w[3] || "", k: w[0] + "|" + w[1], wk: w[0] };
  });
  examStart(qs, startLangExam, mode === "de" ? "Allemand" : "Anglais");
}
function startFrExam() {
  var full = frWords || [];
  if (fState.cat) full = full.filter(function (w) { return w.c === fState.cat; });
  var pool = full.filter(function (w) { return !exMastered.fr[w.t]; });
  if (pool.length < 5) { exMastered.fr = {}; pool = full; }
  if (pool.length < 5) { alert("Pas assez de mots pour un examen."); return; }
  var n = Math.min(20, pool.length);
  var picks = rShuffle(pool).slice(0, n);
  var qs = picks.map(function (w) {
    var correctTxt = defSnippet(w);
    var others = rShuffle(pool.filter(function (x) { return x !== w; })).slice(0, 4);
    var opts = rShuffle([w].concat(others)).map(function (x) {
      var t = defSnippet(x);
      return { txt: x.t + " : " + t, correct: x === w };
    });
    return { q: w.t + (w.c ? " (" + w.c + ")" : ""), opts: opts, correctTxt: correctTxt, note: "", k: w.t, wk: w.t };
  });
  examStart(qs, startFrExam, "Français");
}
byId("examBtn").onclick = startLangExam;
byId("frExamBtn").onclick = startFrExam;

/* ================= LECTURE VOCALE ================= */
function pickVoice(lang) {
  var voices = [];
  try { voices = speechSynthesis.getVoices() || []; } catch (e) {}
  var base = lang.split("-")[0];
  var local = voices.filter(function (v) { return v.lang && v.lang.indexOf(lang) === 0 && (v.localService || v.default); });
  if (local.length) return local[0];
  var any = voices.filter(function (v) { return v.lang && v.lang.indexOf(lang) === 0; });
  if (any.length) return any[0];
  var baseMatch = voices.filter(function (v) { return v.lang && v.lang.indexOf(base) === 0; });
  return baseMatch[0] || null;
}
function speak(text, lang) {
  if (!("speechSynthesis" in window) || !text) return;
  try {
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(String(text));
    u.lang = lang;
    u.rate = 0.9;
    var v = pickVoice(lang);
    if (v) u.voice = v;
    speechSynthesis.speak(u);
    if (!v) setTimeout(function () {
      try {
        var v2 = pickVoice(lang);
        if (v2) {
          speechSynthesis.cancel();
          var u2 = new SpeechSynthesisUtterance(String(text));
          u2.lang = lang; u2.voice = v2; u2.rate = 0.9;
          speechSynthesis.speak(u2);
        }
      } catch (e) {}
    }, 300);
  } catch (e) {}
}
if ("speechSynthesis" in window) {
  try {
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = function () {};
  } catch (e) {}
}
byId("frontSpeak").onclick = function (e) { e.stopPropagation(); speak(byId("frontTxt").textContent, lState.lang === "fr" ? "fr-FR" : (mode === "de" ? "de-DE" : "en-US")); };
byId("backSpeak").onclick = function (e) { e.stopPropagation(); speak(byId("backTxt").textContent, lState.lang === "fr" ? (mode === "de" ? "de-DE" : "en-US") : "fr-FR"); };
byId("frFrontSpeak").onclick = function (e) { e.stopPropagation(); speak(byId("frFront").textContent, "fr-FR"); };

/* swipe global */
var x0 = null;
var lastSwipe = 0;
function swipeGuard() { return Date.now() - lastSwipe < 500; }
document.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
document.addEventListener("touchend", function (e) {
  if (x0 === null) return;
  var dx = e.changedTouches[0].clientX - x0;
  if (Math.abs(dx) > 60) {
    lastSwipe = 0; /* le swipe lui-même navigue toujours */
    if (mode === "fr") { dx < 0 ? fNext() : fPrev(); } else { dx < 0 ? lNext() : lPrev(); }
    lastSwipe = Date.now(); /* bloque le clic résiduel après un swipe */
  } else if (Math.abs(dx) > 15) {
    lastSwipe = Date.now(); /* petit glissement : ignore aussi le clic synthétique */
  }
  x0 = null;
}, { passive: true });

/* ================= MODE SOMBRE ================= */
var darkOn = false;
darkOn = lsGet(LS.dark) === "1";
function applyDark(on) {
  document.body.classList.toggle("dark", on);
  byId("darkBtn").textContent = on ? "☀️" : "🌙";
  var m = document.querySelector('meta[name="theme-color"]');
  if (m) m.setAttribute("content", on ? "#0b1220" : "#0f172a");
}
applyDark(darkOn);
byId("darkBtn").addEventListener("click", function () {
  darkOn = !darkOn;
  lsSet(LS.dark, darkOn ? "1" : "0");
  applyDark(darkOn);
  if (mode === "dash") renderDash();
});

byId("verFoot").textContent = "Version " + VERSION + " — PWA hors ligne (service worker)";
setTab("en");

if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  });
}

