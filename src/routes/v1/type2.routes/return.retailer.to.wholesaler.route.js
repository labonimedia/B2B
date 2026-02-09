const express = require('express');
const auth = require('../../../middlewares/auth');
const { rtoWReturnRequestController } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtoWReturnRequestController.returnRequest)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtoWReturnRequestController.queryR2WReturnRequest);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtoWReturnRequestController.getR2WReturnRequestById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtoWReturnRequestController.updateR2WReturnRequestById)
  .delete(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    rtoWReturnRequestController.deleteR2WReturnRequestById
  );

module.exports = router;
