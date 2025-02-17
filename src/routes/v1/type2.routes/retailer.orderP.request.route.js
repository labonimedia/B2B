const express = require('express');
const auth = require('../../../middlewares/auth');
const { rtlOPReuestController } = require('../../../controllers');

const router = express.Router();

router
    .route('/')
    .post(auth('superadmin'), rtlOPReuestController.createRetailerPartialReq)
    .get(auth('superadmin'), rtlOPReuestController.queryRetailerPartialReq);

router
    .route('/:id')
    .get(auth('superadmin'), rtlOPReuestController.getRetailerPartialReqById)
    .patch(auth('superadmin'), rtlOPReuestController.updateRetailerPartialReqById)
    .delete(auth('superadmin'), rtlOPReuestController.deleteRetailerPartialReqById);
module.exports = router;
