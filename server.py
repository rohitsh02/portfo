import csv
import os

import requests
from flask import Flask, redirect, render_template, request

app = Flask(__name__)

PAGE_ACTIVE = {
    "index.html": "home",
    "works.html": "works",
    "about.html": "about",
    "contact.html": "contact",
    "blog.html": "blog",
}

RESEND_ENDPOINT = "https://api.resend.com/emails"
CONTACT_TO = os.environ.get("CONTACT_TO", "rohitshende020@gmail.com")
# onboarding@resend.dev needs no domain verification, but may only deliver to
# the Resend account's own address. Override once a custom domain is verified.
CONTACT_FROM = os.environ.get("CONTACT_FROM", "Portfolio <onboarding@resend.dev>")

# Vercel's filesystem is read-only, so the CSV fallback is local-dev only.
ON_SERVERLESS = bool(os.environ.get("VERCEL"))


@app.route("/")
def my_home():
    return render_template("index.html", active="home")


@app.route("/<string:page_name>")
def html_page(page_name):
    return render_template(page_name, active=PAGE_ACTIVE.get(page_name, ""))


def send_email(data):
    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        app.logger.warning("RESEND_API_KEY is not set; cannot deliver contact message")
        return False

    email = data.get("email", "").strip()
    subject = data.get("subject", "").strip() or "New message"
    message = data.get("message", "").strip()

    response = requests.post(
        RESEND_ENDPOINT,
        headers={"Authorization": f"Bearer {api_key}"},
        json={
            "from": CONTACT_FROM,
            "to": [CONTACT_TO],
            "reply_to": email,
            "subject": f"Portfolio: {subject}",
            "text": f"From: {email}\nSubject: {subject}\n\n{message}",
        },
        timeout=10,
    )
    response.raise_for_status()
    return True


def write_to_csv(data):
    with open("database.csv", mode="a", newline="") as handle:
        writer = csv.writer(handle, quoting=csv.QUOTE_MINIMAL)
        writer.writerow([data.get("email"), data.get("subject"), data.get("message")])


@app.route("/submit_form", methods=["POST"])
def submit_form():
    data = request.form.to_dict()

    delivered = False
    try:
        delivered = send_email(data)
    except Exception:
        app.logger.exception("Failed to deliver contact message")

    if not ON_SERVERLESS:
        write_to_csv(data)
        delivered = True

    # Never claim the message arrived when it didn't — send them to email instead.
    return render_template("thankyou.html", active="", delivered=delivered)
