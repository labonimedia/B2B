const express = require('express');
const auth = require('../../middlewares/auth');
const { opacityController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), opacityController.createOpacity)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), opacityController.queryOpacity);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), opacityController.getOpacityById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), opacityController.updateOpacityById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), opacityController.deleteOpacityById);

module.exports = router;
