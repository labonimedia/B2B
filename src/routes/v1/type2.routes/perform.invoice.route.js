const express = require('express');
const auth = require('../../../middlewares/auth');
const { performInvoiceController } = require('../../../controllers');

const router = express.Router();

router
    .route('/')
    .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), performInvoiceController.createPerformInvoice)
    .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), performInvoiceController.queryPerformInvoice);

router
    .route('/:id')
    .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), performInvoiceController.getPerformInvoiceById) // Get PurchaseOrderType2 by ID
    .patch(
        auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
        performInvoiceController.updatePerformInvoiceById
    ) // Update PurchaseOrderType2 by ID
    .delete(
        auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
        performInvoiceController.deletePerformInvoiceById
    ); // Delete PurchaseOrderType2 by ID
router
    .route('/purchase-orders/manufacturer-email')
    .get(
        auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
        performInvoiceController.getPerformInvoiceByManufactureEmail
    );
router
    .route('/purchase-orders/genrate-chall-no')
    .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), performInvoiceController.genratedeChallNO);


router
    .route('/purchase-orders/old-availeble-data/:id')
    .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), performInvoiceController.getPurchaseOrderWithOldAvailebleData);

module.exports = router;
