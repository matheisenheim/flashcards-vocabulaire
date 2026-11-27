# 📖 Flashcards Vocabulaire

Application **mono-fichier HTML** pour réviser du vocabulaire **français**, **anglais** et **allemand**, avec tableau de bord de progression, examens, favoris et mode sombre. Installable comme application (PWA).

## 🌐 Version en ligne (GitHub Pages)

L'application est publiée via GitHub Pages : **[matheisenheim.github.io/flashcards-vocabulaire](https://matheisenheim.github.io/flashcards-vocabulaire/)** (servie en HTTPS depuis la branche `main`, racine du dépôt). Toutes les données restent locales au navigateur, comme pour le fichier ouvert en local.

**Déploiement automatique** : à chaque push sur `main`, le workflow GitHub Actions [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) publie le site (source Pages réglée sur « GitHub Actions » dans Settings → Pages).

## ✨ Fonctionnalités

- **Trois langues** : dictionnaire français (à importer depuis un fichier JSON Larousse), listes anglais et allemand intégrées
- **Niveaux CEFR** : anglais et allemand classés A1 → C2
- **Favoris** : étoile jaune ★ = favori, gris ☆ = non favori, filtre « Favoris » pour ne réviser que ses favoris
- **Suivi de progression** : bouton « Je connais », pourcentage de mots sus, statistiques et examens (seuil de réussite 70 %)
- **Mode sombre** 🌙 persistant
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
| `index.html` | L'application complète (version courante) |
| `sw.js` | Service worker : met l'application en cache pour le fonctionnement hors ligne |
| `.github/workflows/deploy-pages.yml` | Déploiement automatique du site sur GitHub Pages |
| `vocabulaire-anglais.json` | ~984 mots anglais classés A1 → C2 |
| `vocabulaire-allemand.json` | ~398 mots allemands classés A1 → C2 |
| `CHANGELOG.md` | Historique des versions |

## 🔧 Principe

Tout tient dans un seul fichier HTML : logique, styles, listes de mots, manifeste PWA et icône (encodés en base64). Les données de l'utilisateur (favoris, progression, réglages) sont stockées localement (localStorage / IndexedDB) — rien ne quitte le téléphone.
