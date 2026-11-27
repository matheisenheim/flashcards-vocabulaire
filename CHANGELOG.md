# Changelog

Historique des versions de l'application Flashcards Vocabulaire.

## v21 — PWA installable
- Manifeste d'application intégré au fichier (nom, mode plein écran, orientation portrait, couleurs)
- Icône d'application intégrée (étoile jaune sur fond sombre, encodée en base64)
- Balises iOS pour l'installation plein écran depuis Safari
- Installation : « Ajouter à l'écran d'accueil » sur Android/iOS

## v20 — Réparation des accents
- Correction des caractères corrompus en double encodage (mojibake) dans les listes anglaises et allemandes ajoutées aux v13–v15 (« né » affiché « nÃ© », tirets « – » cassés, etc.)
- Vérification exhaustive : accents anglais et allemands, emojis, mots français d'origine intacts

## v19 — Étoile favori clarifiée
- L'étoile du bouton favori reflète désormais sans ambiguïté l'état du mot : étoile pleine ★ sur bouton jaune = favori ; étoile creuse ☆ grise = non favori (l'emoji ⭐, toujours jaune, prêtait à confusion)
- Libellé « Favori (favori) » quand le mot est favorisé

## v18 — Correctif favoris fantômes (mobile)
- Un balayage (swipe) commençant sur le bouton favori déclenchait en plus un clic résiduel qui marquait le mot suivant comme favori
- Tout clic dans les 500 ms suivant un swipe est désormais ignoré (favori, « je connais », cartes, navigation)
- Les swipes rapprochés restent fonctionnels

## v17 — Favoris français
- Bouton ⭐ Favori sur la carte française (double tap interdit)
- Filtre ⭐ Favoris dans les chips pour ne réviser que ses favoris
- Persistance en localStorage

## v16 — Gestion des listes
- Boutons import/export déplacés dans un sous-menu du Dashboard « 📂 Gestion des listes » (onglets vocabulaire épurés)
- Listes importées persistées en IndexedDB
- Nom de fichier versionné à l'export (`flashcards-vocabulaire-app-vXX.html`)

## v15 — Niveaux allemands + import/export
- Niveaux CEFR allemands A1–C2 (398 mots)
- Import/export JSON des listes anglais et allemand

## v13–v14 — Niveaux CEFR anglais
- ~984 mots anglais classés par niveau : A1 (144), A2 (116), B1 (141), B2 (308), C1 (156), C2 (119)
- Sélecteur de niveau dans l'onglet anglais

## v12 — Mode sombre
- Bouton 🌙/☀️, classe `body.dark`, préférence persistée en localStorage
- Graphiques du Dashboard adaptés au thème sombre

## v8–v11 — Bouton « Je connais » fiabilisé
- Protection anti double-tap (450 ms)
- Libellé « ✓ Je connais (déjà su) » quand le mot est déjà su
- Retrait d'un mot connu seulement après confirmation en 2 appuis
- Suppression des messages flottants (toasts)

## v6–v7 — Examen
- Un mot réussi à l'examen n'est plus reposé (`exMastered`)
- Passage automatique en « connu » après réussite

## v5 — Mélange aléatoire
- Mélange du paquet avec un seed aléatoire (au lieu d'une permutation fixe)

## v4 — Correctif Dashboard
- Ajout du champ langue manquant lors de l'enregistrement des résultats d'examen (`l: e.l`)

## v1–v3 — Versions initiales
- Application mono-fichier : flashcards français/anglais/allemand, catégories grammaticales, examen de 20 mots, Dashboard de progression
