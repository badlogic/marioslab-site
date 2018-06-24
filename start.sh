#!/bin/sh
set -e

while :
do
git pull
mvn clean package
java -jar target/marioslab.jar
done
