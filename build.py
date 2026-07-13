"""Render the Flask app to static HTML in dist/, for GitHub Pages.

The site has no server-side behaviour left, so every page can be rendered once
and served as a flat file. Links in the templates are relative, so the output
works both at a domain root and under a /repo-name subpath.
"""

import shutil
import sys
from pathlib import Path

from server import PAGE_ACTIVE, app

DIST = Path("dist")


def build():
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir()

    shutil.copytree("static", DIST / "static")

    client = app.test_client()
    for page in PAGE_ACTIVE:
        response = client.get(f"/{page}")
        if response.status_code != 200:
            sys.exit(f"{page} returned {response.status_code}, aborting build")
        (DIST / page).write_bytes(response.data)
        print(f"  rendered {page}")

    # GitHub Pages otherwise runs the output through Jekyll, which strips
    # directories beginning with an underscore.
    (DIST / ".nojekyll").touch()

    print(f"\nBuilt {len(PAGE_ACTIVE)} pages into {DIST}/")


if __name__ == "__main__":
    build()
