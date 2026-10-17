What to Watch?

The website for What to Watch?, a personal library for movies, series, and other things you want to watch.

Website: https://vito2211.github.io/WhatoToWatch/

About

What to Watch? is an Android app for keeping track of what you want to watch, what you’re currently watching, and what you’ve already finished.

This repository contains the website, including its landing page and shared-content preview.

Features

* English and Russian languages.
* Responsive layout for desktop and mobile.
* Preview shared content directly in the browser.
* Dark interface with restrained amber accents.
* No backend or account required to use the website.

Shared content is decoded locally in the browser. The website does not need a database or external API to display it.

Development

The site uses plain HTML, CSS, and JavaScript. There is no build step.

To run it locally, open a terminal in the website directory and run:

python3 -m http.server 8080

Then visit http://localhost:8080.

Deployment

The site is hosted with GitHub Pages.

To deploy from the repository root, the published directory should contain index.html, css/, js/, and assets/.

Sharing

The website can preview shared content from supported links or a pasted payload.

Opening content directly in the Android app uses the whattowatch:// deep-link scheme. Verified HTTPS App Links require a separately configured domain and Android domain verification.

⸻

Made as part of the What to Watch? project.
