#!/bin/sh
git commit -am "New site changes (post, project, music)."
set -e
git push
mvn clean package -U
java -jar target/marioslab.jar -i site -o output -w -d -go -p "foobar"
