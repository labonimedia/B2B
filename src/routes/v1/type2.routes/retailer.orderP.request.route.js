const express = require('express');
const auth = require('../../../middlewares/auth');
const { rtlOPReuestController } = require('../../../controllers');

const router = express.Router();

router
    .route('/')
    .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtlOPReuestController.createRetailerPartialReq)
    .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtlOPReuestController.queryRetailerPartialReq);

router
    .route('/:id')
    .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtlOPReuestController.getRetailerPartialReqById)
    .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtlOPReuestController.updateRetailerPartialReqById)
    .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtlOPReuestController.deleteRetailerPartialReqById);

module.exports = router;
