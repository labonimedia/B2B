const express = require('express');
const auth = require('../../../middlewares/auth');
const { poRetailerToWholesalerController } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    poRetailerToWholesalerController.createRetailerPurchaseOrderType2
  )
    .get(
      auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
      poRetailerToWholesalerController.getAllPoRetailerToWholesaler
    );

router
  .route('/wholesaler/:wholesalerEmail')
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    poRetailerToWholesalerController.getRetailerPOByWholesaler
  );

router
  .route('/update-item/:poId')
  .patch(
     auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
     poRetailerToWholesalerController.updateRetailerPOSetItem
  );

router
  .route('/:id')
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    poRetailerToWholesalerController.getSinglePoRetailerToWholesaler
  ) // Get SinglePoRetailerTOwholesaler by ID
  .patch(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    poRetailerToWholesalerController.updateSinglePoRetailerToWholesaler
  ) // Update SinglePoRetailerTOwholesaler by ID
  .delete(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    poRetailerToWholesalerController.deleteSinglePoRetailerToWholesaler
  ); // Delete SinglePoRetailerTOwholesaler by ID

module.exports = router;
