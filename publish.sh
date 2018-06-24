#!/bin/sh
set -e
git commit -am "New site changes (post, project, music)."
git push
curl https://marioslab.io/api/reloadhtml?password=$MARIOSLAB_PWD
