const express = require('express');
const auth = require('../../../middlewares/auth');
const { finalProductWController } = require('../../../controllers');

const router = express.Router();

router
    .route('/')
    .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), finalProductWController.createFinalProductW)
    .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), finalProductWController.queryFinalProductW);

router
    .route('/:id')
    .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), finalProductWController.getFinalProductWById)

module.exports = router;
