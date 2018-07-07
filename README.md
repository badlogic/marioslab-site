# Mario's Lab - Site
Source code for https://marioslab.io. Uses [basis-site](https://github.com/badlogic/basis-site) to generate a static website from the content in the `site/` folder. Additionally implements dynamic content via a light-weight web server based on [Javalin](https://javalin.io/), serving HTTP RPC requests for functionality like comments.

# Updating the content
There's a duct-tape script called `publish.sh` which:

1. Pushes local changes to the GitHub repository.
2. Calls the endpoint https://marioslab.io/api/reloadstatic, which makes the server pull the changes from GitHub and re-generate the static content.

# Updating the web server
There's a duct-tape script called `reload.sh` which:

1. Pushes local changes to the GitHub repository.
2. Calls the endpoint https://marioslab.io/api/reload, which makes the server pull the changes from GitHub and shuts down the server.
3. The `start.sh` script, with which the server was started, pulls in the latest changes from GitHub, recompiles the server, and re-starts it.

