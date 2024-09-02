const express = require('express');
const auth = require('../../middlewares/auth');
const { topStyleController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), topStyleController.createTopStyle)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), topStyleController.queryTopType);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), topStyleController.getTopTypeById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), topStyleController.updateTopTypeById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), topStyleController.deleteTopTypeById);

module.exports = router;
