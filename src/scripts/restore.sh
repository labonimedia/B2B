#!/bin/bash

# const path = require('../dbs')
# Restore the database C:\Users\Admin\Desktop\B2BBackend\B2B\src\dbs\B2B

mongorestore --host localhost --port 27017 --nsInclude 'B2B.*' ../dbs

# mongorestore --host localhost --port 27017 --nsInclude 'B2B.*' C:\Users\Admin\Desktop\B2BBackend\B2B\src\dbs


# mongorestore --username root --password VRuAd2Nvmp4ELHh5 --authenticationDatabase admin --archive=$BACKUP_FILE --gzip --drop

