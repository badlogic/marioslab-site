#!/bin/sh
git pull
mvn clean package -U
java -jar target/marioslab.jar -i site -o output -w -d -r -p ""