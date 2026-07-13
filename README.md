# rohitshende.dev — portfolio

Personal portfolio site for **Rohit Shende** — AI engineer working on LLM agents, RAG
pipelines and the backend infrastructure that keeps them running in production.

A small Flask app rendering five pages from a shared Jinja template, with a
hand-crafted dark theme and a pixel-art bot that greets visitors. Deployed on Vercel.

**Live:** _add your vercel.app URL here once deployed_

---

## Stack

| Layer | What's used |
| --- | --- |
| Backend | Flask 3 (Jinja2 templates) |
| Frontend | Hand-written CSS + vanilla JS — no framework, no build step |
| Fonts | JetBrains Mono, Inter, Caveat (Google Fonts) |
| Contact form | [Resend](https://resend.com) email delivery |
| Hosting | Vercel (Python serverless) |

No bundler, no `node_modules`. The CSS and JS are served as-is.

## Project structure

```text
├── api/
│   └── index.py          # Vercel serverless entrypoint (exposes the Flask `app`)
├── server.py             # Flask routes + contact-form handling
├── vercel.json           # Static files → CDN, everything else → Flask
├── requirements.txt
├── templates/
│   ├── base.html         # Shared layout: nav, footer, the pixel bot
│   ├── index.html        # Home
│   ├── works.html        # Projects
│   ├── about.html        # Bio, skills, experience, education
│   ├── contact.html      # Contact form
│   ├── blog.html         # Links to Medium posts
│   └── thankyou.html     # Post-submit confirmation (and failure state)
└── static/
    ├── css/style.css
    ├── js/main.js        # Nav, typing effect, scroll reveal, bot behaviour
    └── assets/           # Images, favicon, resume PDF
```

## Running locally

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

flask --app server run --port 5000
```

Then open <http://127.0.0.1:5000>.

Locally the contact form appends submissions to `database.csv`, so you can test it
without an email provider. That fallback is **local only** — see below.

## Contact form

Vercel's filesystem is ephemeral, so writing submissions to disk would silently lose
them. In production the form sends an email via Resend instead.

Set one environment variable in **Vercel → Settings → Environment Variables**:

| Variable | Required | Default |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | — |
| `CONTACT_TO` | no | `rohitshende020@gmail.com` |
| `CONTACT_FROM` | no | `Portfolio <onboarding@resend.dev>` |

`onboarding@resend.dev` requires no domain verification, but Resend will only deliver
from it to your own account address. Once you verify a custom domain, override
`CONTACT_FROM`.

If the key is missing or delivery fails, the site does **not** pretend the message
went through — it shows an error and points the visitor at the email address directly.

## Deploying

The repo is wired for Vercel; `vercel.json` handles routing.

1. Import the repo at [vercel.com/new](https://vercel.com/new). Framework preset: **Other**.
2. Add `RESEND_API_KEY` under Settings → Environment Variables.
3. Redeploy so the running deployment picks up the variable.

Pushes to `main` deploy automatically after that.

## Notes

- `CNAME` (`rohitshende.ml`) is a leftover from GitHub Pages and is unused on Vercel.
- `database.csv` holds historical local submissions and is not written to in production.
