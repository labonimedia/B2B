const express = require('express');
const auth = require('../../middlewares/auth');
const { cdnPathController } = require('../../controllers');

const router = express.Router();

router
    .route('/')
    .post(
        auth('superadmin'), cdnPathController.createCDNPath)
    .get(
        auth('superadmin'),
        cdnPathController.queryCDNPath);

router
    .route('/:id')
    .get(auth('superadmin'), cdnPathController.getCDNPathById)
    .patch(auth('superadmin'), cdnPathController.updateCDNPathById)
    .delete(auth('superadmin'), cdnPathController.deleteCDNPathById);

module.exports = router;
