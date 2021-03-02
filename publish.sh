#!/bin/sh
if [ $# -lt 1 ]; then
	echo "Usage: publish.sh <commit-message>"
    exit 1;
fi

set -e
git commit -am "$1"
git push
mvn package
java -jar target/marioslab.jar -i site -o output -w -d -go -p "foobar"
rsync -avz output/ marioslab.io:/home/badlogic/marioslab.io/data/web/