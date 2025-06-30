const express = require('express');
const router = express.Router();
const { ManufactureInventoryController } = require('../../../controllers');
const auth = require('../../../middlewares/auth');

router
    .route('/bulk')
    .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
        ManufactureInventoryController.bulkCreateInventories
    );
    
router
    .route('/')
    .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), ManufactureInventoryController.createInventory)
    .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), ManufactureInventoryController.getInventories);

router
    .route('/:id')
    .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), ManufactureInventoryController.getInventoryById)
    .put(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), ManufactureInventoryController.updateInventory)
    .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), ManufactureInventoryController.deleteInventory);

module.exports = router;
