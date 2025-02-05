const express = require('express');
const auth = require('../../../middlewares/auth');
const { rtlToMnfPoController } = require('../../../controllers');

const router = express.Router();

router
    .route('/')
    .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtlToMnfPoController.createRetailerPurchaseOrderType2)
    .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtlToMnfPoController.queryRetailerPurchaseOrderType2);

router
    .route('/getby/supplier')
    .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtlToMnfPoController.getProductOrderBySupplyer);

router
    .route('/:id')
    .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtlToMnfPoController.getRetailerPurchaseOrderType2ById) // Get PurchaseOrderType2 by ID
    .patch(
        auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
        rtlToMnfPoController.updateRetailerPurchaseOrderType2ById
    ) // Update PurchaseOrderType2 by ID
    .delete(
        auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
        rtlToMnfPoController.deleteRetailerPurchaseOrderType2ById
    ); // Delete PurchaseOrderType2 by ID
router
    .route('/purchase-orders/manufacturer-email')
    .get(
        auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
        rtlToMnfPoController.getPurchaseOrdersByManufactureEmail
    );

module.exports = router;
