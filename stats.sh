#!/bin/sh
set -e
scp marioslab.io:/home/badlogic/marioslab.io/data/logs/access.log access.log
goaccess access.log -o report.html --log-format=COMBINED
rm access.log
open report.html