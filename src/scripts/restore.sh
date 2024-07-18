#!/bin/bash

# BACKUP_FILE="../dbs/dump.zip"

# mongorestore --host localhost --port 27017 --db MHEDU_Server --archive=$BACKUP_FILE --gzip



#!/bin/bash

# Extract the zip file directly into the ../dbs directory
# unzip -j -o ../dbs/dump.zip -d ../dbs

# Restore the database
# mongorestore --host localhost --port 27017 --db DMF ../dbs/DMF

mongorestore --host localhost --port 27017 --nsInclude 'DMF.*' ../dbs

# mongorestore --username root --password VRuAd2Nvmp4ELHh5 --authenticationDatabase admin --archive=$BACKUP_FILE --gzip --drop

