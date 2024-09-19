const express = require('express');
const auth = require('../../middlewares/auth');
const { braPadTypeController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), braPadTypeController.createBraPadType)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), braPadTypeController.queryBraPadType);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), braPadTypeController.getBraPadTypeById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), braPadTypeController.updateBraPadTypeById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), braPadTypeController.deleteBraPadTypeById);

module.exports = router;
