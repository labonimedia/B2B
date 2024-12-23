const express = require('express');
const auth = require('../../../middlewares/auth');
const { wholesalerReturnController } = require('../../../controllers');

const router = express.Router();

router
    .route('/')
    .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerReturnController.createWholesalerReturn)
    .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerReturnController.queryWholesalerReturn);

router
    .route('/:id')
    .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerReturnController.getWholesalerReturnById)

module.exports = router;
