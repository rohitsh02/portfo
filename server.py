from flask import Flask, render_template

app = Flask(__name__)

PAGE_ACTIVE = {
    "index.html": "home",
    "works.html": "works",
    "about.html": "about",
    "contact.html": "contact",
    "blog.html": "blog",
}


@app.route("/")
def my_home():
    return render_template("index.html", active="home")


@app.route("/<string:page_name>")
def html_page(page_name):
    return render_template(page_name, active=PAGE_ACTIVE.get(page_name, ""))
