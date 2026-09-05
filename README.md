# Relay AMS — Web (v0.1.0)

<-- stating test-->
Static HTML/CSS/JS dashboard. No build step, no backend yet — `data.js`
stands in for the database and `app.js` simulates an agent picking up and
completing a job (pending → running → completed/failed) so you can see the
full flow before Supabase is wired in.

## Run it locally

No install needed. Two options:

**Option A — just open the file**
Double-click `index.html`, or open it in your browser directly.

**Option B — run a tiny local server (recommended)**
Some browsers restrict things when opened as a raw file. From this folder:

```
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## What to try

1. Go to **Run Operation**, pick a machine + operation, click **Run**
2. Watch the job go pending → running → completed on the **Dashboard** and **Jobs** tab
3. Check **History** and filter by machine/operation name
4. Check **Admin** to see the machine list and operation catalog

## Push to Git

```
cd ams-web
git init
git add .
git commit -m "Initial AMS web UI with mock data"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

Create a `staging` branch too, since we'll deploy that separately later:

```
git checkout -b staging
git push -u origin staging
```

## Next steps (not done yet)

- Replace `data.js` with real Supabase queries + Realtime subscription
- Add login/auth
- Wire GitHub Pages (or Cloudflare Pages) for prod + staging
- Jenkins pipeline to deploy on tagged commits
