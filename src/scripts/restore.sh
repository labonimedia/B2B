#!/bin/bash

# Restore the database

mongorestore --host localhost --port 27017 --nsInclude 'B2B.*' ../dbs

# mongorestore --username root --password VRuAd2Nvmp4ELHh5 --authenticationDatabase admin --archive=$BACKUP_FILE --gzip --drop

