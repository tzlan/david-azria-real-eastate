# King David Immobilier — site auto-alimenté par Facebook

David publie un appartement sur sa Page Facebook. 30 minutes plus tard, le bien a sa page sur le site : photos, prix, carte, formulaire de contact, données structurées Google.

```
Post Page FB ──► GitHub Action (toutes les 30 min)
                   ├─ Graph API : nouveaux posts / posts modifiés
                   ├─ Claude Haiku : texte libre → prix, pièces, m², quartier, prestations
                   ├─ Photos téléchargées + converties en WebP (le CDN Facebook expire)
                   └─ commit data/listings.json ──► Vercel rebuild ──► site statique
```

- **Post modifié** (ex. ajout de « VENDU ») → l'annonce passe en *Vendu* automatiquement.
- **Post supprimé** → l'annonce disparaît du site.
- **Post qui n'est pas une annonce** (vœux, conseils) → ignoré.
- Les 6 annonces de démo disparaissent au premier sync réel.

## Stack

Next.js 16 (App Router, SSG) · TypeScript strict · CSS natif (tokens, dark mode système) · Leaflet + tuiles CARTO · Resend · Zod.

Pages générées : `/`, `/biens/[slug]`, `/quartiers/[slug]`, `/contact`, `sitemap.xml`, `robots.txt`.
SEO : JSON-LD `RealEstateListing` + `RealEstateAgent` + `BreadcrumbList`, sitemap avec images, URLs parlantes (`/biens/vente-appartement-4-pieces-rehavia-8f3a1c`), pages quartier.

## Mise en route (≈ 45 min, une seule fois)

### 1. Vérifier que c'est une Page Facebook
Le lien `profile.php?id=61577646827725` doit être une **Page** (bouton « Passer à la Page » visible pour David). Si c'est un profil perso : créer une Page « King David Immobilier » et publier dessus (puis partager dans les groupes, 1 clic).

### 2. Token Facebook permanent
1. [developers.facebook.com](https://developers.facebook.com) → *Créer une app* → type **Business**. David doit être admin de l'app.
2. *Outils → Explorateur de l'API Graph* → sélectionner l'app → permissions `pages_show_list`, `pages_read_engagement`, `pages_read_user_content` → *Generate Access Token*.
3. Échanger contre un token longue durée :
   ```
   https://graph.facebook.com/v23.0/oauth/access_token?grant_type=fb_exchange_token&client_id=APP_ID&client_secret=APP_SECRET&fb_exchange_token=TOKEN_COURT
   ```
4. Avec ce token : `GET /me/accounts` → copier l'`access_token` de la Page. **Ce token de Page n'expire pas.**
5. Vérifier : `GET /PAGE_ID/posts?access_token=...` doit renvoyer les posts.

L'app peut rester en mode développement : on ne lit que la Page de son propre admin, pas besoin de validation Meta.

### 3. GitHub
Pousser le projet dans un repo, puis *Settings → Secrets and variables → Actions* :

| Secret | Valeur |
|---|---|
| `FB_PAGE_ID` | id de la Page |
| `FB_PAGE_TOKEN` | token de Page (étape 2.4) |
| `ANTHROPIC_API_KEY` | clé API Anthropic |

Lancer une première fois à la main : *Actions → Sync Facebook → Run workflow*.

### 4. Vercel
Importer le repo. Variables d'environnement :

| Variable | Exemple |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://kingdavid-immobilier.com` |
| `NEXT_PUBLIC_AGENT_PHONE` | `+972 5X XXX XXXX` (active le bouton WhatsApp) |
| `RESEND_API_KEY` | clé Resend |
| `AGENT_EMAIL` | email de David |
| `MAIL_FROM` | `King David Immobilier <leads@domaine.com>` |

### 5. Resend
Créer un compte, vérifier le domaine du site (3 enregistrements DNS). L'email de lead contient : coordonnées, lien WhatsApp direct, message, photo + prix + caractéristiques du bien, lien vers l'annonce et le post Facebook.

### 6. Google
Search Console → ajouter le domaine → soumettre `/sitemap.xml`.

## Commandes

```bash
npm install
npm run dev          # http://localhost:3000
npm run sync         # sync manuel (variables .env requises)
npm run typecheck
npm run build
```

## Coûts
Vercel Hobby et GitHub Actions : gratuits. Resend : gratuit jusqu'à 3 000 emails/mois. Claude Haiku : quelques centimes par mois (seuls les posts nouveaux ou modifiés sont analysés). Domaine : ~10 €/an.

## Conseils pour David (meilleure extraction)
Rien d'obligatoire, mais un post qui mentionne **prix, nombre de pièces, m², étage et quartier** donne une fiche complète. Pour marquer un bien vendu : modifier le post et ajouter « VENDU ».
# david-azria-real-eastate
