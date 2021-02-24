#!/bin/sh
git commit -am "New site changes (post, project, music)."
set -e
git push
mvn package
java -jar target/marioslab.jar -i site -o output -w -d -go -p "foobar"
rsync -avz output/ marioslab.io:/home/badlogic/marioslab.io/data/web/