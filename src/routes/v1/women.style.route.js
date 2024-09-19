const express = require('express');
const auth = require('../../middlewares/auth');
const { womenStyleController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), womenStyleController.createWomenStyle)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), womenStyleController.queryWomenStyle);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), womenStyleController.getWomenStyleById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), womenStyleController.updateWomenStyleById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), womenStyleController.deleteWomenStyleById);

module.exports = router;
