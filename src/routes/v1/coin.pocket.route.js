const express = require('express');
const auth = require('../../middlewares/auth');
const { coinPocketsController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), coinPocketsController.createCoinPockets)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), coinPocketsController.queryCoinPockets);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), coinPocketsController.getCoinPocketsById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), coinPocketsController.updateCoinPocketsById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), coinPocketsController.deleteCoinPocketsById);

module.exports = router;
