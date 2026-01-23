const express = require('express');
const auth = require('../../../middlewares/auth');
const { rtoMReturnRequestController } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtoMReturnRequestController.returnRequest)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtoMReturnRequestController.queryMtoRReturnRequest);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtoMReturnRequestController.getMtoRReturnRequestById)
  .patch(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    rtoMReturnRequestController.updateMtoRReturnRequestById
  )
  .delete(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    rtoMReturnRequestController.deleteMtoRReturnRequestById
  );

module.exports = router;
