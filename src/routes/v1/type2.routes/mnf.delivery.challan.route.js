const express = require('express');
const auth = require('../../../middlewares/auth');
const { mnfDeliveryChallanController } = require('../../../controllers');

const router = express.Router();

router
    .route('/')
    .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), mnfDeliveryChallanController.createMnfDeliveryChallan)
    .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), mnfDeliveryChallanController.queryMnfDeliveryChallan);

router
    .route('/:id')
    .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), mnfDeliveryChallanController.getMnfDeliveryChallanById) // Get PurchaseOrderType2 by ID
    .patch(
        auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
        mnfDeliveryChallanController.updateMnfDeliveryChallanById
    ) // Update PurchaseOrderType2 by ID
    .delete(
        auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
        mnfDeliveryChallanController.deleteMnfDeliveryChallanById
    ); // Delete PurchaseOrderType2 by ID
router
    .route('/purchase-orders/manufacturer-email')
    .get(
        auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
        mnfDeliveryChallanController.getDeliveryChallanByManufactureEmail
    );

module.exports = router;