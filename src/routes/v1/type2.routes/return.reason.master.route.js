const express = require('express');
const auth = require('../../../middlewares/auth');
const { returnReasonController } = require('../../../controllers');

const router = express.Router();

router
  .route('/array')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), returnReasonController.arrayUpload)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), returnReasonController.queryReturnReason);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), returnReasonController.getReturnReasonById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), returnReasonController.updateReturnReasonById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), returnReasonController.deleteReturnReasonById);

module.exports = router;
