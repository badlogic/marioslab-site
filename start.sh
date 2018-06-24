#!/bin/sh
while :
do
git pull
mvn clean package
java -jar target/marioslab.jar -i site -o output -w -d -p $MARIOSLAB_PWD
done
