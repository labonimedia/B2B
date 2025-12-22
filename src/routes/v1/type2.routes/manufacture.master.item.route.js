const express = require('express');
const auth = require('../../../middlewares/auth');
const router = express.Router();
const { manufactureItemController } = require('../../../controllers');

// Create + List Items
router
  .route('/')
  .post(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    manufactureItemController.createItem
  )
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    manufactureItemController.getItems
  );

// Get / Update / Delete Item by ID
router
  .route('/:id')
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    manufactureItemController.getItemById
  )
  .patch(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    manufactureItemController.updateItemById
  )
  .delete(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    manufactureItemController.deleteItemById
  );

module.exports = router;
