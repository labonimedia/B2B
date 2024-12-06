const express = require('express');
const auth = require('../../../middlewares/auth');
const { retailerPurchaseOrderType2Controller } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post
  (
    //auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
   retailerPurchaseOrderType2Controller.createRetailerPurchaseOrderType2
   )
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerPurchaseOrderType2Controller.queryRetailerPurchaseOrderType2);

router
  .route('/getby/supplier')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerPurchaseOrderType2Controller.getProductOrderBySupplyer);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerPurchaseOrderType2Controller.getRetailerPurchaseOrderType2ById) // Get PurchaseOrderType2 by ID
  .patch(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    retailerPurchaseOrderType2Controller.updateRetailerPurchaseOrderType2ById
  ) // Update PurchaseOrderType2 by ID
  .delete(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    retailerPurchaseOrderType2Controller.deleteRetailerPurchaseOrderType2ById
  ); // Delete PurchaseOrderType2 by ID
router
  .route('/purchase-orders/manufacturer-email')
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    retailerPurchaseOrderType2Controller.getPurchaseOrdersByManufactureEmail
  );

  router
  .route('/purchase-orders/wholesaler-email/combined-order')
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    retailerPurchaseOrderType2Controller.combinePurchaseOrders
  );

module.exports = router;
