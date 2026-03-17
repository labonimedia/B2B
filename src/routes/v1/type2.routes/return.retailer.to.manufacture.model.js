const express = require('express');
const auth = require('../../../middlewares/auth');
const { rtoMReturnRequestController } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtoMReturnRequestController.returnRequest)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtoMReturnRequestController.queryReturnRequest);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtoMReturnRequestController.getReturnRequestById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtoMReturnRequestController.updateReturnRequestById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtoMReturnRequestController.deleteReturnRequestById);

module.exports = router;
