#!/bin/sh
git commit -am "New site changes (post, project, music)."
set -e
git push
curl https://marioslab.io/api/reloadhtml?password=$MARIOSLAB_PWD
