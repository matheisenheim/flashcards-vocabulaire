import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const APP_URL = "https://matheisenheim.github.io/flashcards-vocabulaire/";

function boot() {
  return new JSDOM(html, {
    url: APP_URL,
    runScripts: "dangerously",
    pretendToBeVisual: true,
    beforeParse(window) { window.localStorage.setItem("flashcards-ui-lang", "fr"); }
  });
}
async function ready(dom) {
  await new Promise((r) => setTimeout(r, 150));
  return dom.window.document;
}
function change(w, el) {
  el.dispatchEvent(new w.Event("change", { bubbles: true }));
}

test("E2E : démarrage en anglais, carte affichée, version en pied de page", async () => {
  const dom = boot();
  const doc = await ready(dom);
  assert.equal(doc.getElementById("langMenu").value, "en");
  assert.ok(doc.getElementById("frontTxt").textContent.length > 0);
  assert.match(doc.getElementById("pos").textContent, /^1 \/ \d+$/);
  assert.match(doc.getElementById("verFoot").textContent, /v\d+\.\d+\.\d+/);
  assert.match(doc.querySelector("h1").textContent, /Flashcards/);
  assert.equal(doc.getElementById("dueCount").textContent, "0");
  assert.equal(doc.getElementById("viewLang").classList.contains("hidden"), false);
  assert.match(doc.querySelector('meta[name="viewport"]').content, /viewport-fit=cover/);
  const css = doc.querySelector("style").textContent;
  assert.match(css, /min-height: 100dvh/);
  assert.match(css, /\.scene \{[^}]*flex: 1 1 auto/);
  dom.window.close();
});

test("E2E : navigation (suivant) et retournement de la carte (Entrée puis clic)", async () => {
  const dom = boot();
  const doc = await ready(dom);
  const w = dom.window;
  const card = doc.getElementById("card");
  const pos0 = doc.getElementById("pos").textContent;
  doc.getElementById("nextBtn").click();
  assert.notEqual(doc.getElementById("pos").textContent, pos0);
  card.dispatchEvent(new w.KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
  assert.match(card.className, /flipped/);
  assert.ok(doc.getElementById("backTxt").textContent.length > 0);
  card.click();
  assert.doesNotMatch(card.className, /flipped/);
  doc.getElementById("prevBtn").click();
  assert.equal(doc.getElementById("pos").textContent, pos0);
  dom.window.close();
});

test("E2E : le menu des langues bascule en allemand", async () => {
  const dom = boot();
  const doc = await ready(dom);
  const w = dom.window;
  const menu = doc.getElementById("langMenu");
  menu.value = "de";
  change(w, menu);
  assert.equal(menu.value, "de");
  assert.ok(doc.getElementById("frontTxt").textContent.length > 0);
  assert.match(doc.getElementById("badge").textContent, /Artikeln|Verben|Nomen|Adjektive|Präpositionen|Adverbien/);
  dom.window.close();
});

test("E2E : le bouton thème cycle clair → sombre → automne et persiste", async () => {
  const dom = boot();
  const doc = await ready(dom);
  const w = dom.window;
  const btn = doc.getElementById("themeBtn");
  assert.equal(doc.body.classList.contains("dark"), false);
  btn.click();
  assert.equal(doc.body.classList.contains("dark"), true);
  assert.equal(w.localStorage.getItem("flashcards-theme"), "dark");
  btn.click();
  assert.equal(doc.body.classList.contains("autumn"), true);
  assert.equal(w.localStorage.getItem("flashcards-theme"), "autumn");
  btn.click();
  assert.equal(doc.body.classList.contains("dark"), false);
  assert.equal(doc.body.classList.contains("autumn"), false);
  dom.window.close();
});

test("E2E : la langue de l'interface passe en anglais via ⚙️ Options (persistant)", async () => {
  const dom = boot();
  const doc = await ready(dom);
  const w = dom.window;
  assert.match(doc.querySelector("h1").textContent, /Flashcards Vocabulaire/);
  const sel = doc.querySelector(".uiLangSel");
  assert.ok(sel);
  sel.value = "en";
  change(w, sel);
  assert.equal(doc.documentElement.lang, "en");
  assert.match(doc.querySelector("h1").textContent, /Vocabulary Flashcards/);
  assert.equal(doc.querySelector('#langMenu option[value="dash"]').textContent, "📊 Dashboard");
  assert.match(doc.getElementById("verFoot").textContent, /offline PWA/);
  assert.match(doc.getElementById("knowBtn").textContent, /I know this word/);
  assert.equal(w.localStorage.getItem("flashcards-ui-lang"), "en");
  const sel2 = doc.querySelectorAll(".uiLangSel")[1];
  assert.equal(sel2.value, "en");
  dom.window.close();
});

test("E2E : le tableau de bord s'affiche avec graphiques SVG et listes", async () => {
  const dom = boot();
  const doc = await ready(dom);
  const w = dom.window;
  const menu = doc.getElementById("langMenu");
  menu.value = "dash";
  change(w, menu);
  assert.equal(doc.getElementById("viewDash").classList.contains("hidden"), false);
  assert.ok(doc.getElementById("dashChart").innerHTML.length > 0);
  assert.ok(doc.getElementById("dashSrs").innerHTML.length > 0);
  assert.match(doc.getElementById("dashExList").textContent, /Aucun examen/);
  dom.window.close();
});

test("E2E : un examen démarre, donne un feedback et avance", async () => {
  const dom = boot();
  const doc = await ready(dom);
  doc.getElementById("examBtn").click();
  assert.equal(doc.getElementById("examOverlay").classList.contains("hidden"), false);
  assert.match(doc.getElementById("examPos").textContent, /Question 1 \/ 20/);
  const opts = doc.getElementById("examOpts").children;
  assert.ok(opts.length >= 2);
  opts[0].click();
  assert.equal(doc.getElementById("examFb").classList.contains("hidden"), false);
  doc.getElementById("examNext").click();
  assert.match(doc.getElementById("examPos").textContent, /Question 2 \/ 20/);
  doc.getElementById("examQuit").click();
  assert.equal(doc.getElementById("examOverlay").classList.contains("hidden"), true);
  dom.window.close();
});

test("E2E : la page d'aide s'ouvre et se ferme", async () => {
  const dom = boot();
  const doc = await ready(dom);
  doc.getElementById("helpBtn").click();
  assert.equal(doc.getElementById("helpOverlay").classList.contains("hidden"), false);
  assert.match(doc.getElementById("helpBody").textContent, /Version v\d+\.\d+\.\d+/);
  doc.getElementById("helpClose").click();
  assert.equal(doc.getElementById("helpOverlay").classList.contains("hidden"), true);
  dom.window.close();
});
