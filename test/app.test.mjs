import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const stub = `
var __store = {};
var localStorage = {
  getItem: function (k) { return Object.prototype.hasOwnProperty.call(__store, k) ? __store[k] : null; },
  setItem: function (k, v) { __store[k] = String(v); }
};
var document = {
  getElementById: function () {
    return new Proxy({}, {
      get: function (t, p) {
        if (p === "classList") return { toggle: function () {}, remove: function () {} };
        if (p === "style") return {};
        if (p === "children") return [];
        return function () {};
      },
      set: function () { return true; }
    });
  },
  createElement: function () { return { value: "", textContent: "" }; },
  querySelector: function () { return { setAttribute: function () {} }; },
  addEventListener: function () {},
  body: { classList: { toggle: function () {} } }
};
var window = { addEventListener: function () {} };
var navigator = {};
var location = { protocol: "file:" };
var indexedDB = { open: function () { var r = {}; setTimeout(function () { if (r.onerror) r.onerror({}); }, 0); return r; } };
`;

function loadApp(seed) {
  let src = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  src = src.replace("__WORDS_EN__", "[]").replace("__WORDS_DE__", "[]");
  const ctx = {};
  vm.createContext(ctx);
  const pre = seed ? "__store = " + JSON.stringify(seed) + ";\n" : "";
  try { vm.runInContext(stub + pre + src, ctx); } catch (e) { /* les effets de bord au chargement peuvent échouer sur les stubs */ }
  return ctx;
}

test("shuffledArr : déterministe, permutation, sans mutation", () => {
  const app = loadApp();
  const input = Array.from({ length: 50 }, (_, i) => i);
  const a = app.shuffledArr(input, 42);
  const b = app.shuffledArr(input, 42);
  assert.deepEqual(a, b);
  assert.deepEqual([...a].sort((x, y) => x - y), input);
  assert.deepEqual(input, Array.from({ length: 50 }, (_, i) => i));
  assert.notDeepEqual(app.shuffledArr(input, 1), app.shuffledArr(input, 2));
});

test("navGo : avance, recule, boucle, reset du flip", () => {
  const app = loadApp();
  app.swipeGuard = () => false;
  const st = { index: 0, flipped: true };
  assert.equal(app.navGo(st, 10, 1), true);
  assert.equal(st.index, 1);
  assert.equal(st.flipped, false);
  assert.equal(app.navGo(st, 10, -1), true);
  assert.equal(st.index, 0);
  app.navGo(st, 10, -1);
  assert.equal(st.index, 9);
  app.navGo(st, 10, 1);
  assert.equal(st.index, 0);
});

test("navGo : bloqué par le swipeGuard", () => {
  const app = loadApp();
  app.swipeGuard = () => true;
  const st = { index: 3, flipped: true };
  assert.equal(app.navGo(st, 10, 1), false);
  assert.equal(st.index, 3);
  assert.equal(st.flipped, true);
});

test("daysBetween", () => {
  const app = loadApp();
  assert.equal(app.daysBetween(new Date("2026-01-01"), new Date("2026-01-31")), 30);
  assert.equal(app.daysBetween(new Date("2026-03-10"), new Date("2026-03-10")), 0);
});

test("normalizeLangList : padding, défauts, rejets", () => {
  const app = loadApp();
  const input = [["hello", "bonjour"], ["x", "y", "verbes", "note", "B2"], ["a", "b"], ["c", "d"], ["e", "f"], ["bad"]];
  const out = app.normalizeLangList(input);
  assert.equal(JSON.stringify(out), JSON.stringify([
    ["hello", "bonjour", "noms", "", "A1"],
    ["x", "y", "verbes", "note", "B2"],
    ["a", "b", "noms", "", "A1"],
    ["c", "d", "noms", "", "A1"],
    ["e", "f", "noms", "", "A1"]
  ]));
  assert.throws(() => app.normalizeLangList({}), /liste JSON/);
  assert.throws(() => app.normalizeLangList([["a", "b"], ["c", "d"]]), /5 mots/);
});

test("esc et cleanTitle", () => {
  const app = loadApp();
  assert.equal(app.esc("<b>&</b>"), "&lt;b&gt;&amp;&lt;/b&gt;");
  assert.equal(app.cleanTitle("pomme (Réf. ortho. POMME)"), "pomme");
  assert.equal(app.cleanTitle(""), "");
});

test("lsGetJSON / lsSetJSON : aller-retour et repli", () => {
  const app = loadApp();
  app.lsSetJSON("t", { a: 1 });
  assert.equal(JSON.stringify(app.lsGetJSON("t", {})), '{"a":1}');
  assert.equal(JSON.stringify(app.lsGetJSON("absent", { x: 9 })), '{"x":9}');
  app.lsSet("corrompu", "{pas du json");
  assert.equal(JSON.stringify(app.lsGetJSON("corrompu", { ok: true })), '{"ok":true}');
});

test("LS : clés de stockage stables (compatibilité données utilisateurs)", () => {
  const app = loadApp();
  assert.equal(app.LS.dark, "flashcards-dark");
  assert.equal(app.LS.stats, "flashcards-stats-v1");
  assert.equal(app.LS.known.en, "flashcards-en-known-v1");
  assert.equal(app.LS.known.de, "flashcards-de-known-v1");
  assert.equal(app.LS.known.fr, "flashcards-fr-known-v1");
  assert.equal(app.LS.favs.fr, "flashcards-fr-favs-v1");
});

test("VERSION au format x.x.x", () => {
  const app = loadApp();
  assert.match(app.VERSION, /^v\d+\.\d+\.\d+$/);
});

test("moteur unifié lang : filtres catégorie/niveau et mélange", () => {
  const app = loadApp();
  app.WORDS = [["a", "x", "verbes", "", "A1"], ["b", "y", "noms", "", "B2"], ["c", "z", "verbes", "", "B1"]];
  app.lState.cat = "all"; app.lState.level = "all"; app.lState.shuffled = false; app.lState.query = "";
  assert.equal(app.deck().length, 3);
  app.lState.cat = "verbes";
  assert.equal(app.deck().length, 2);
  app.lState.cat = "all"; app.lState.level = "B2";
  assert.equal(JSON.stringify(app.deck().map((w) => w[0])), '["b"]');
  app.lState.level = "all"; app.lState.shuffled = true; app.lState.seed = 7;
  const d = app.deck();
  assert.equal(d.length, 3);
  assert.equal(JSON.stringify([...d].map((w) => w[0]).sort()), '["a","b","c"]');
});

test("moteur unifié fr : recherche et filtre favoris", () => {
  const app = loadApp();
  app.frWords = [
    { t: "pomme", c: "nom", d: [["fruit", [], [], []]] },
    { t: "poire", c: "nom", d: [["fruit", [], [], []]] },
    { t: "table", c: "nom", d: [["meuble", [], [], []]] }
  ];
  app.fState.query = "po";
  assert.equal(app.frDeck().length, 2);
  app.fState.query = "";
  app.fState.favOnly = true;
  app.frFavs = { pomme: true };
  assert.equal(JSON.stringify(app.frDeck().map((w) => w.t)), '["pomme"]');
});

test("thèmes : cycle clair/sombre/automne et migration de l'ancien réglage", () => {
  let app = loadApp();
  assert.equal(JSON.stringify(app.THEMES), '["light","dark","autumn"]');
  assert.equal(app.theme, "light");
  assert.equal(app.LS.theme, "flashcards-theme");
  app = loadApp({ "flashcards-dark": "1" });
  assert.equal(app.theme, "dark");
  app = loadApp({ "flashcards-theme": "autumn" });
  assert.equal(app.theme, "autumn");
  app.applyTheme("autumn");
  assert.equal(app.theme, "autumn");
  app.applyTheme("light");
  assert.equal(app.theme, "light");
});

test("moteur unifié : render() ne plante pas avec les stubs DOM", () => {
  const app = loadApp();
  app.WORDS = [["a", "x", "verbes", "", "A1"]];
  app.lState.cat = "all"; app.lState.level = "all"; app.lState.shuffled = false; app.lState.flipped = false;
  app.langEngine.render();
  app.frWords = [{ t: "pomme", c: "nom", d: [["fruit", [], [], []]] }];
  app.frEngine.render();
  app.langEngine.next();
  app.frEngine.next();
});
