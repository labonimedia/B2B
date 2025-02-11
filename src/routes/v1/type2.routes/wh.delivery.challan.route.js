const express = require('express');
const auth = require('../../../middlewares/auth');
const { whDeliveryChallanController } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), whDeliveryChallanController.createWhDeliveryChallan)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), whDeliveryChallanController.queryWhDeliveryChallan);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), whDeliveryChallanController.getWhDeliveryChallanById) // Get PurchaseOrderType2 by ID
  .patch(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    whDeliveryChallanController.updateWhDeliveryChallanById
  ) // Update PurchaseOrderType2 by ID
  .delete(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    whDeliveryChallanController.deleteWhDeliveryChallanById
  ); // Delete PurchaseOrderType2 by ID
// router
//     .route('/purchase-orders/wholesaler-email')
//     .get(
//         auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
//         whDeliveryChallanController.
//     );
router
  .route('/purchase-orders/genrate-chall-no')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), whDeliveryChallanController.genratedeChallNO);

module.exports = router;
