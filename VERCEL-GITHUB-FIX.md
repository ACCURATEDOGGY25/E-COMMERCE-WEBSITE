# Fix: "repository does not contain the requested branch"

GitHub **does have code** on `main`. This error is almost always a **wrong setting in Vercel**, not an empty repo.

## Check on GitHub first

Open: https://github.com/ACCURATEDOGGY25/E-COMMERCE-WEBSITE

You should see folders: `frontend`, `backend`, `scripts`, etc.  
If you see "empty repository", run locally:

```bash
cd "/Users/mac/Documents/NEW WEBSITE"
bash push.sh
```

---

## Vercel import — use these exact settings

| Setting | Correct value |
|---------|----------------|
| **GitHub account** | **ACCURATEDOGGY25** (same account that owns the repo) |
| **Repository** | **E-COMMERCE-WEBSITE** (not another repo with a similar name) |
| **Production Branch** | **`main`** (not `master`) |
| **Root Directory** | **`frontend`** |

Common mistakes:

- Branch set to `master` → repo only has **`main`**
- Wrong GitHub user connected to Vercel
- Importing a **fork** or **template** that is still empty
- Repository name typo (`E-COMMERCE-WEBSITE` vs `e-commerce-website` old project)

---

## Fix Vercel ↔ GitHub access

1. Vercel → **Settings** → **Git** → reconnect GitHub
2. GitHub → **Settings** → **Applications** → **Vercel** → grant access to **ACCURATEDOGGY25**
3. Ensure **E-COMMERCE-WEBSITE** is in the allowed repository list
4. Delete the broken Vercel project and **Import** again with settings above

---

## After import works

1. Add env: `NEXT_PUBLIC_API_URL` = your API URL (see `PUBLIC_URLS.txt` or Render)
2. Deploy
3. Confirm tab title **MarketHub** (not 500 / empty)

Repo URL: https://github.com/ACCURATEDOGGY25/E-COMMERCE-WEBSITE  
Default branch: **main**
