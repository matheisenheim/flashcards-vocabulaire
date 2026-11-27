import { readFileSync, writeFileSync } from "node:fs";

const read = (p) => readFileSync(p, "utf8");

const appJs = read("src/app.js");
const versionMatch = appJs.match(/var VERSION = "(v\d+\.\d+\.\d+)";/);
if (!versionMatch) throw new Error("VERSION introuvable dans src/app.js");
const version = versionMatch[1];

const wordsEn = JSON.parse(read("data/vocabulaire-anglais.json"));
const wordsDe = JSON.parse(read("data/vocabulaire-allemand.json"));
if (!Array.isArray(wordsEn) || !Array.isArray(wordsDe)) throw new Error("data/*.json invalides");

let js = appJs
  .replace("__WORDS_EN__", () => JSON.stringify(wordsEn))
  .replace("__WORDS_DE__", () => JSON.stringify(wordsDe));

const html = read("src/index.template.html")
  .replace("/*__CSS__*/", () => read("src/style.css"))
  .replace("/*__APP_JS__*/", () => js);

const sw = read("src/sw.js").replace("__VERSION__", version);

const placeholder = /__(CSS|APP_JS|WORDS_EN|WORDS_DE|VERSION)__/;
for (const [out, content] of [["index.html", html], ["sw.js", sw]]) {
  if (placeholder.test(content)) throw new Error("placeholder restant dans " + out);
  writeFileSync(out, content);
}

console.log(`build OK — ${version} | ${wordsEn.length} mots EN, ${wordsDe.length} mots DE | index.html ${(html.length / 1024).toFixed(0)} Ko | sw.js ${sw.length} o`);
