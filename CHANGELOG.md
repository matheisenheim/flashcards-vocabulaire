# Changelog

Historique des versions de l'application Flashcards Vocabulaire.

Les numéros de version suivent le format **x.x.x** (majeur.mineur.correctif) ; les versions antérieures à l'adoption de ce format sont notées rétrospectivement en `vN.0.0`.

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
