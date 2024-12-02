const express = require('express');
const auth = require('../../../middlewares/auth');
const { purchaseOrderType2Controller } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), purchaseOrderType2Controller.createPurchaseOrderType2)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), purchaseOrderType2Controller.queryPurchaseOrderType2);

router
  .route('/getby/supplier')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), purchaseOrderType2Controller.getProductOrderBySupplyer);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), purchaseOrderType2Controller.getPurchaseOrderType2ById) // Get PurchaseOrderType2 by ID
  .patch(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    purchaseOrderType2Controller.updatePurchaseOrderType2ById
  ) // Update PurchaseOrderType2 by ID
  .delete(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    purchaseOrderType2Controller.deletePurchaseOrderType2ById
  ); // Delete PurchaseOrderType2 by ID
router
  .route('/purchase-orders/manufacturer-email')
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    purchaseOrderType2Controller.getPurchaseOrdersByManufactureEmail
  );
module.exports = router;
