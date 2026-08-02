# Deploy JAI Home Care — GitHub Pages

Share a live link with your client: `https://<username>.github.io/<repo-name>/`

## What you need (safe — no passwords in chat)

1. **GitHub username** for the new account (e.g. `jaihomecareservices`)
2. **Repo name** (e.g. `jai-home-care` or `website`)
3. **Login once** in the Cursor terminal (you type the password — not the AI):

```powershell
gh auth login
```

Choose: GitHub.com → HTTPS → Login with browser (or paste a token).

## One-time setup (after `gh auth login`)

Run from this folder:

```powershell
cd "E:\Cursor wale hai hum\projects\jai-home-care"

git init
git add .
git commit -m "feat: initial JAI Home Care site for client review"

gh repo create YOUR_USERNAME/REPO_NAME --public --source=. --remote=origin --push

gh api repos/YOUR_USERNAME/REPO_NAME/pages -X POST -f build_type=workflow -f source[branch]=main -f source[path]=/
```

Replace `YOUR_USERNAME` and `REPO_NAME`. GitHub Actions will deploy in ~1 minute.

## After deploy

- Live URL: **https://YOUR_USERNAME.github.io/REPO_NAME/**
- Send that link to your client for review
- Every `git push` updates the live site automatically

## Update sitemap after first deploy

Edit `sitemap.xml` and `robots.txt` — replace `https://example.com` with your real Pages URL.

## Security

- Never paste GitHub passwords or tokens into AI chat
- Use `gh auth login` or a fine-grained token with **repo** scope only
