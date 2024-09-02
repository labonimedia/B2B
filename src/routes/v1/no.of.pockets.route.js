const express = require('express');
const auth = require('../../middlewares/auth');
const { noOfPocketsController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), noOfPocketsController.createNoOfPockets)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), noOfPocketsController.queryTopType);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), noOfPocketsController.getTopTypeById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), noOfPocketsController.updateTopTypeById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), noOfPocketsController.deleteTopTypeById);

module.exports = router;
