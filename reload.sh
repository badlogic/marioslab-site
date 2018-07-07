#!/bin/sh
git commit -am "New site changes (post, project, music)."
set -e
git push
curl -X POST -F "password=$MARIOSLAB_PWD" http://localhost:8000/api/reload
