# rohitshende.dev — portfolio

Personal portfolio site for **Rohit Shende** — AI engineer working on LLM agents, RAG
pipelines and the backend infrastructure that keeps them running in production.

A small Flask app rendering five pages from a shared Jinja template, with a
hand-crafted dark theme and a pixel-art bot that greets visitors.

The site has no server-side behaviour, so `build.py` renders it to static HTML and
GitHub Actions publishes that to GitHub Pages on every push to `main`. The Flask app
is kept for local preview (and can still be deployed to Vercel — see below).

**Live:** _add your Pages URL here once deployed_

---

## Stack

| Layer | What's used |
| --- | --- |
| Templating | Flask 3 + Jinja2 (build-time only) |
| Frontend | Hand-written CSS + vanilla JS — no framework, no bundler |
| Fonts | JetBrains Mono, Inter, Caveat (Google Fonts) |
| Hosting | GitHub Pages (static), optionally Vercel |

No `node_modules`. The CSS and JS are served as-is.

## Project structure

```text
├── build.py              # Renders the templates to static HTML in dist/
├── server.py             # Flask routes — local preview and the build's source
├── .github/workflows/
│   └── pages.yml         # Builds and publishes dist/ to GitHub Pages
├── api/index.py          # Vercel entrypoint (optional — see Deploying)
├── vercel.json           # Vercel routing (optional)
├── requirements.txt
├── templates/
│   ├── base.html         # Shared layout: nav, footer, the pixel bot
│   ├── index.html        # Home
│   ├── works.html        # Projects
│   ├── about.html        # Bio, skills, experience, education
│   ├── contact.html      # Contact details
│   └── blog.html         # Links to Medium posts
└── static/
    ├── css/style.css
    ├── js/main.js        # Nav, typing effect, scroll reveal, bot behaviour
    └── assets/           # Images, favicon, resume PDF
```

All links in the templates are relative, so the built site works both at a domain
root and under a `/repo-name` subpath.

## Running locally

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

flask --app server run --port 5000 --debug
```

Then open <http://127.0.0.1:5000>. Edits to templates or CSS reload on refresh.

## Building the static site

```bash
python build.py          # renders every page into dist/
cd dist && python3 -m http.server 5100   # preview exactly what Pages will serve
```

## Deploying

### GitHub Pages (primary)

`.github/workflows/pages.yml` builds and deploys on every push to `main`. Enable it
once under **Settings → Pages → Build and deployment → Source: GitHub Actions**.

### Vercel (optional)

The Flask app can also run as a Vercel serverless function — `vercel.json` and
`api/index.py` are still in the repo. Import the project at
[vercel.com/new](https://vercel.com/new) with framework preset **Other**. No
environment variables are needed.

## Notes

- There is no contact form. The site is fully static, so the contact page lists an
  email, phone number and social links instead. `database.csv` holds submissions from
  the old form and is no longer read or written.
- `CNAME` (`rohitshende.ml`) is a leftover from an earlier GitHub Pages setup. Delete
  it or replace it with a domain you actually own — otherwise Pages will try to serve
  the site from that hostname.
