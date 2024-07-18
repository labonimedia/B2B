#!/bin/bash
BACKUP_FILE="../dbs"

# rm $BACKUP_FILE

# mongodump --host localhost --port 27017 --db MHEDU_Server --out ../dbs


#!/bin/bash

# Run mongodump command to create dump files
mongodump --host localhost --port 27017 --db B2B --out ../dbs

