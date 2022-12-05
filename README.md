# Mario's Lab - Site
Source code for https://marioslab.io. Uses [basis-site](https://github.com/badlogic/basis-site) to generate a static website from the content in the `site/` folder. Additionally implements dynamic content via a light-weight web server based on [Javalin](https://javalin.io/) for local "development".

Install a recent JDK and Maven, and away you go.

# Editing content
Run `local.sh`. This will spawn a web server on port 8000. It will also run the site generator. The generator observes files in the `site/` folder and spits out transformed files to the `output/` folder, which is served by the web server.

Open an editor on the right side of your screen, and a browser on the left while having the `local.sh` script running. Edit the content and watch it live update in the browser.

# Push content to the server
There's a duct-tape script called `publish.sh` which:

1. Pushes local changes to the GitHub repository.
2. Calls the endpoint https://marioslab.io/api/reloadstatic, which makes the server pull the changes from GitHub and re-generate the static content.

# Statistics
Install [goaccess](https://goaccess.io/) via the package manager. Then run the `stats.sh` file.

