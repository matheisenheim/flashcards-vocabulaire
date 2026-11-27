# 📖 Flashcards Vocabulaire

Application **mono-fichier HTML** pour réviser du vocabulaire **français**, **anglais** et **allemand**, avec tableau de bord de progression, examens, favoris et mode sombre. Installable comme application (PWA).

## 🌐 Version en ligne (GitHub Pages)

L'application est publiée via GitHub Pages : **[matheisenheim.github.io/flashcards-vocabulaire](https://matheisenheim.github.io/flashcards-vocabulaire/)** (servie en HTTPS depuis la branche `main`, racine du dépôt). Toutes les données restent locales au navigateur, comme pour le fichier ouvert en local.

**Déploiement automatique** : à chaque push sur `main`, le workflow GitHub Actions [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) publie le site (source Pages réglée sur « GitHub Actions » dans Settings → Pages).

## ✨ Fonctionnalités

- **Trois langues** : dictionnaire français (à importer depuis un fichier JSON Larousse), listes anglais et allemand intégrées, choisies via le menu déroulant
- **Options repliables** ⚙️ : catégorie, niveau, sens de lecture, examen, mélange… dans un menu qu'on peut fermer pour alléger l'écran
- **Niveaux CEFR** : anglais et allemand classés A1 → C2
- **Favoris** : étoile jaune ★ = favori, gris ☆ = non favori, filtre « Favoris » pour ne réviser que ses favoris
- **Suivi de progression** : bouton « Je connais », pourcentage de mots sus, statistiques et examens (seuil de réussite 70 %)
- **Répétition espacée (SRS)** : pastille « 📅 À revoir » + filtre des révisions dues (boîtes de Leitner 1/2/4/7/21 j), alimentées par les examens
- **Tableau de bord enrichi** : révisions dues par langue, mots les plus ratés, courbe de réussite des examens sur 14 jours
- **Interface en français ou en anglais** (sélecteur dans ⚙️ Options, persisté)
- **Aide ℹ️** intégrée à l'app (bouton en haut à droite)
- **Trois thèmes** persistants : clair ☀️, sombre 🌙, automne chaud 🍂 (bouton en haut à droite)
- **Import / export JSON** des listes de mots (depuis le Dashboard → 📂 Gestion des listes)
- **PWA** : installable sur l'écran d'accueil du téléphone, ouverture plein écran, **fonctionne hors ligne** grâce au service worker (`sw.js`)

## 🚀 Utilisation

1. Ouvrir la [version en ligne](https://matheisenheim.github.io/flashcards-vocabulaire/) dans un navigateur, ou télécharger `index.html` et l'ouvrir localement (fonctionne hors ligne)
2. Pour le français : onglet Français → importer le fichier JSON Larousse (l'import n'est à faire qu'une fois, les mots sont stockés dans le navigateur)
3. **Android (Chrome)** : menu ⋮ → *Ajouter à l'écran d'accueil*
4. **iPhone (Safari)** : Partager → *Sur l'écran d'accueil*

## 📁 Fichiers

| Fichier | Contenu |
| --- | --- |
| `src/index.template.html` | Structure HTML (placeholders `/*__CSS__*/`, `/*__APP_JS__*/`) |
| `src/style.css` | Feuille de style (variables CSS, thèmes clair/sombre) |
| `src/app.js` | Logique de l'application (`VERSION`, placeholders `__WORDS_EN__`/`__WORDS_DE__`) |
| `src/sw.js` | Service worker source (placeholder `__VERSION__` pour le cache) |
| `data/vocabulaire-anglais.json` | 984 mots anglais classés A1 → C2 — **source unique** |
| `data/vocabulaire-allemand.json` | 398 mots allemands classés A1 → C2 — **source unique** |
| `build.mjs` | `node build.mjs` régénère `index.html` et `sw.js` à la racine |
| `index.html` | Application mono-fichier **générée** — ne pas éditer à la main |
| `sw.js` | Service worker **généré** — ne pas éditer à la main |
| `.github/workflows/deploy-pages.yml` | Déploie le site sur GitHub Pages à chaque push sur `main` |
| `.github/workflows/ci.yml` | CI : tests unitaires + tests E2E (jsdom) + lint des workflows |
| `.github/workflows/release.yml` | Release GitHub automatique sur tag `vX.Y.Z` |
| `test/app.test.mjs` | Tests unitaires (`node --test`, zéro dépendance) |
| `e2e/e2e.spec.mjs` | Tests E2E sur le vrai DOM (`npm run test:e2e`, jsdom) |
| `package.json` / `package-lock.json` | Scripts + dev-dépendance jsdom (tests uniquement, jamais embarquée dans la PWA) |
| `CHANGELOG.md` | Historique des versions |

## 🛠 Développement

1. Modifier `src/` (template, CSS, JS) et `data/` (listes de mots)
2. `node build.mjs` → régénère `index.html` et `sw.js` à la racine (Node requis, zéro dépendance)
3. `node --test` → lance les tests unitaires (`test/`, zéro dépendance)
4. Tests E2E (vrai DOM via jsdom) : `npm ci` puis `npm run test:e2e` (`e2e/`, lit `index.html` généré)
5. La CI (`.github/workflows/ci.yml`) vérifie à chaque push : syntaxe, tests unitaires, tests E2E, build à jour (`git diff --exit-code`), lint des workflows (actionlint)
6. Le site est déployé automatiquement sur GitHub Pages à chaque push sur `main` (`deploy-pages.yml`)
7. Release : bump `VERSION` dans `src/app.js` (format `x.x.x`) + entrée dans `CHANGELOG.md`, commit, puis `git tag vX.Y.Z && git push origin vX.Y.Z` → `release.yml` vérifie la cohérence tag/VERSION et publie une release GitHub avec le mono-fichier `index.html` en pièce jointe

## 🔧 Principe

L'application distribuée tient dans un seul fichier HTML généré : logique, styles, listes de mots, manifeste PWA et icône (encodés en base64). Les données de l'utilisateur (favoris, progression, réglages) sont stockées localement (localStorage / IndexedDB) — rien ne quitte le téléphone.
