const express = require('express');
const router = express.Router();
const { WholesalerInventoryController } = require('../../../controllers');
const auth = require('../../../middlewares/auth');

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), WholesalerInventoryController.createInventory)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), WholesalerInventoryController.getInventories);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), WholesalerInventoryController.getInventoryById)
  .put(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), WholesalerInventoryController.updateInventory)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), WholesalerInventoryController.deleteInventory);

router
    .route('/bulk')
    .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
        WholesalerInventoryController.bulkCreateInventories
    );
module.exports = router;
