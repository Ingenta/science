#!/bin/bash
# Move database

mongodump --host $1 --port 27017 --db meteor
mongorestore --host $2 --port 27017 --db meteor --drop ./dump/meteor
rm -rf dump
