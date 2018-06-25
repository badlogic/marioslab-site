#!/bin/sh
while :
do
git pull
mvn clean package -U
java -jar target/marioslab.jar -i site -o output -w -d -p $MARIOSLAB_PWD
done
