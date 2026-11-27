# Changelog

Historique des versions de l'application Flashcards Vocabulaire.

Les numéros de version suivent le format **x.x.x** (majeur.mineur.correctif) ; les versions antérieures à l'adoption de ce format sont notées rétrospectivement en `vN.0.0`.

## v23.0.1 — Boutons ℹ️/thème dans l'en-tête
- Les boutons Aide ℹ️ et thème ☀️/🌙/🍂 étaient en `position: fixed` et chevauchaient le contenu (titre, menu, carte) sur petit écran
- Ils sont maintenant dans une ligne d'en-tête `.head` (flex, à côté du titre) : plus de superposition, à toute taille d'écran

## v23.0.0 — Batch pédagogie / technique / produit
- **Pédagogie 1 — répétition espacée (SRS)** : boîtes de Leitner (0/1/2/4/7/21 jours), pastille « 📅 À revoir (n) » dans les vues EN/DE et FR, filtre « à revoir », compteurs au tableau de bord ; les réponses d'examen alimentent le SRS (`flashcards-srs-v1`)
- **Pédagogie 2 — statistiques avancées** : révisions dues par langue, top 10 des mots les plus ratés aux examens (`flashcards-miss-v1`), courbe de taux de réussite des examens sur 14 jours
- **Technique 3** : plus aucun `alert()` — notifications discrètes `toast`
- **Technique 4** : listes EN/DE chargées à la demande par `fetch` sur HTTP(S) (`data/*.json` servis par Pages) ; les JSON embarqués restent le repli en `file://` / hors ligne ; `indexedDB` guardé si indisponible
- **Technique 6 — i18n FR/EN** : interface entièrement traduisible (`data-i18n`, `data-i18n-html`, `data-i18n-ph`, `data-i18n-aria`), sélecteur de langue d'interface dans chaque panneau ⚙️ Options, persisté (`flashcards-ui-lang`), `<html lang>` et aria-labels traduits, aide traduite
- **Technique 1 — tests E2E** : `e2e/e2e.spec.mjs` sous jsdom (vrai DOM : démarrage, navigation, retournement Entrée/clic, menu des langues, cycle des thèmes, switch FR→EN, dashboard, examen, aide) ; job CI `e2e` (`npm ci`) ; `package.json` + `package-lock.json` (seule dev-dépendance : jsdom, jamais embarquée dans la PWA)
- **Produit 2 — aide ℹ️ dans l'app** : overlay d'aide (utilisation, options, thèmes, données locales, hors ligne, version)
- 16 tests unitaires + 8 tests E2E : OK

## v22.4.1 — Allègement de l'en-tête
- Suppression des textes du haut de page (« Mots par niveau… » / « Touche la carte pour la retourner… » / « Recto : le mot — Verso : … ») dans les vues anglais/allemand et français, plus de l'assignation `langSub` et de la règle CSS `.sub` inutilisée
- Conservés : les astuces en bas de page (`langTip`/`frTip`) et les indices à l'intérieur des cartes

## v22.4.0 — Panneau d'options repliable
- Toutes les options des vues (recherche, catégorie, niveau, sens EN↔FR, mélange, examen, recommencer, favoris, réinitialisations, changement de fichier) regroupées dans un `<details>` « ⚙️ Options » repliable par vue
- État ouvert/fermé persisté (`flashcards-opts-v1`, par vue)
- Style : pastille en pointillés centrée, flèche ▾/▴, `list-style` masquée
- 1 nouveau test : 15/15 OK

## v22.3.0 — Menu des langues + carte adaptative
- La barre d'onglets remplacée par un **menu déroulant** (`select#langMenu`) : Anglais / Allemand / Français / Tableau de bord, synchronisé avec la vue active
- **Carte de hauteur adaptative** : `.scene` en `clamp(260px, 55vh, 480px)` (s'adapte à la hauteur d'écran, bornée)
- CSS : règles `.tabs`/`.tab` supprimées, style `.menurow` ajouté
- 1 nouveau test (`setTab` sur les 4 vues) : 14/14 OK

## v22.2.0 — Thème automne chaud + sobriété
- 3ᵉ thème « automne » (chaud/sobre, tons pierre/ambré) : simple bloc de variables CSS `body.autumn`
- Le bouton de thème cycle clair ☀️ → sombre 🌙 → automne 🍂, préférence persistée (`flashcards-theme`), migration de l'ancien réglage `flashcards-dark`
- Thème automne sobre : badges de catégorie neutralisés, ombres atténuées
- `meta theme-color` mise à jour selon le thème ; 1 nouveau test (cycle + migration) : 13/13 OK

## v22.1.1 — Moteur de cartes unifié
- `makeEngine(cfg)` dans `src/app.js` : un seul moteur (deck filtré, navigation, retournement, « Je connais » à 2 appuis, favoris, rendu) partagé par les vues anglais/allemand (`langEngine`) et français (`frEngine`)
- Les spécificités de chaque vue passent en configuration : accesseurs (`keyOf`/`catOf`/`levelOf`/`textOf`), `ids` DOM, `renderCard`, `renderEmpty`, `knowText`, stockage `known`/`favs`
- Suppression des ~150 lignes dupliquées (`f*` vs `l*`) ; alias `deck()`/`lRender()`/… conservés pour l'examen et le dashboard
- 3 nouveaux tests unitaires sur le moteur (filtres, recherche, favoris, rendu) : 12/12 OK

## v22.1.0 — CI, tests, accessibilité, releases (palier 3)
- Tests unitaires `node --test` (`test/app.test.mjs`, zéro dépendance) : `shuffledArr`, `navGo`, `daysBetween`, `normalizeLangList`, `esc`, `cleanTitle`, `lsGetJSON`/`lsSetJSON`, stabilité des clés `LS`, format de `VERSION`
- CI `.github/workflows/ci.yml` : syntaxe (`node --check`), tests, build à jour (`git diff --exit-code`), lint des workflows avec actionlint
- Accessibilité : cartes focusables au clavier (`tabindex`/`role="button"`, Entrée/Espace pour retourner), `aria-label`, contour `:focus-visible`
- Release automatique `.github/workflows/release.yml` : sur tag `vX.Y.Z`, vérifie que `VERSION` == tag, build à jour, publie une release GitHub avec `index.html` en pièce jointe

## v22.0.2 — Sources découpées + build (palier 2)
- `src/` (`index.template.html`, `style.css`, `app.js`, `sw.js`) + `data/` (JSON) : les listes de mots ont une **source unique** (`data/*.json`), injectées au build
- `build.mjs` (Node, zéro dépendance) : `node build.mjs` régénère `index.html` et `sw.js` à la racine (fichiers générés, ne pas éditer)
- `VERSION` dans `src/app.js` = source unique de version (pied de page + nom du cache du service worker)
- CI : `node --check` sur les sources + `git diff --exit-code` pour garantir que le build commité est à jour, puis déploiement Pages
- JSON régénérés depuis les données runtime : le mojibake corrigé en v20.0.0 est enfin propagé aux fichiers JSON ; allemand complet (398 mots avec niveaux)
- **Correctif v22.0.1** : `LS`/`VERSION` étaient définis dans une IIFE interne → `ReferenceError` au chargement de l'app ; remontés en portée globale

## v22.0.1 — Refactor interne (maintenance)
- Thème clair/sombre en variables CSS (`--bg`, `--surface`, `--active-bg`…) : `body.dark` ne redéfinit plus que les variables, les ~24 règles de override sont supprimées
- Stockage centralisé : constantes `LS` + helpers `lsGet` / `lsSet` / `lsGetJSON` / `lsSetJSON` (clés inchangées, données des utilisateurs conservées)
- Navigation des cartes dédupliquée via `navGo` (modes fr/en/de)
- Version unique `VERSION` dans `index.html`, injectée dans le pied de page ; cache du service worker aligné (`flashcards-v22.0.1`)
- Workflow Pages : jobs `build` / `deploy` séparés (contournement du bug actions/deploy-pages#451)

## v22.0.0 — Service worker (hors ligne)
- Nouveau `sw.js` : met l'application en cache à l'installation (cache versionné `flashcards-v22.0.0` : `index.html` + listes JSON)
- Requêtes de navigation en « network-first » : HTML toujours à jour en ligne, repli sur le cache hors ligne
- Autres requêtes GET same-origin en « cache-first » avec mise à jour du cache en arrière-plan
- Enregistrement du service worker dans `index.html` (HTTPS uniquement ; inactif en ouverture locale `file://`)
- `sw.js` ajouté à la liste des fichiers déployés par le workflow GitHub Pages

## v21.0.0 — PWA installable
- Manifeste d'application intégré au fichier (nom, mode plein écran, orientation portrait, couleurs)
- Icône d'application intégrée (étoile jaune sur fond sombre, encodée en base64)
- Balises iOS pour l'installation plein écran depuis Safari
- Installation : « Ajouter à l'écran d'accueil » sur Android/iOS

## v20.0.0 — Réparation des accents
- Correction des caractères corrompus en double encodage (mojibake) dans les listes anglaises et allemandes ajoutées aux v13.0.0–v15.0.0 (« né » affiché « nÃ© », tirets « – » cassés, etc.)
- Vérification exhaustive : accents anglais et allemands, emojis, mots français d'origine intacts

## v19.0.0 — Étoile favori clarifiée
- L'étoile du bouton favori reflète désormais sans ambiguïté l'état du mot : étoile pleine ★ sur bouton jaune = favori ; étoile creuse ☆ grise = non favori (l'emoji ⭐, toujours jaune, prêtait à confusion)
- Libellé « Favori (favori) » quand le mot est favorisé

## v18.0.0 — Correctif favoris fantômes (mobile)
- Un balayage (swipe) commençant sur le bouton favori déclenchait en plus un clic résiduel qui marquait le mot suivant comme favori
- Tout clic dans les 500 ms suivant un swipe est désormais ignoré (favori, « je connais », cartes, navigation)
- Les swipes rapprochés restent fonctionnels

## v17.0.0 — Favoris français
- Bouton ⭐ Favori sur la carte française (double tap interdit)
- Filtre ⭐ Favoris dans les chips pour ne réviser que ses favoris
- Persistance en localStorage

## v16.0.0 — Gestion des listes
- Boutons import/export déplacés dans un sous-menu du Dashboard « 📂 Gestion des listes » (onglets vocabulaire épurés)
- Listes importées persistées en IndexedDB
- Nom de fichier versionné à l'export (`flashcards-vocabulaire-app-vXX.html`)

## v15.0.0 — Niveaux allemands + import/export
- Niveaux CEFR allemands A1–C2 (398 mots)
- Import/export JSON des listes anglais et allemand

## v13.0.0–v14.0.0 — Niveaux CEFR anglais
- ~984 mots anglais classés par niveau : A1 (144), A2 (116), B1 (141), B2 (308), C1 (156), C2 (119)
- Sélecteur de niveau dans l'onglet anglais

## v12.0.0 — Mode sombre
- Bouton 🌙/☀️, classe `body.dark`, préférence persistée en localStorage
- Graphiques du Dashboard adaptés au thème sombre

## v8.0.0–v11.0.0 — Bouton « Je connais » fiabilisé
- Protection anti double-tap (450 ms)
- Libellé « ✓ Je connais (déjà su) » quand le mot est déjà su
- Retrait d'un mot connu seulement après confirmation en 2 appuis
- Suppression des messages flottants (toasts)

## v6.0.0–v7.0.0 — Examen
- Un mot réussi à l'examen n'est plus reposé (`exMastered`)
- Passage automatique en « connu » après réussite

## v5.0.0 — Mélange aléatoire
- Mélange du paquet avec un seed aléatoire (au lieu d'une permutation fixe)

## v4.0.0 — Correctif Dashboard
- Ajout du champ langue manquant lors de l'enregistrement des résultats d'examen (`l: e.l`)

## v1.0.0–v3.0.0 — Versions initiales
- Application mono-fichier : flashcards français/anglais/allemand, catégories grammaticales, examen de 20 mots, Dashboard de progression
