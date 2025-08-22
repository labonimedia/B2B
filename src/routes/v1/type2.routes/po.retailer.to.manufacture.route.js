const express = require('express');
const auth = require('../../../middlewares/auth');
const { poRetailerToManufactureController } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    poRetailerToManufactureController.createRetailerPurchaseOrderType2
  )
    .get(
      auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
      poRetailerToManufactureController.getAllPoRetailerToManufacture
    );

router
  .route('/make-to-order')
  .post(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    poRetailerToManufactureController.makeToOrderPO
  )
router
  .route('/retailers-po-list-view/manufacture/:manufacturerEmail')
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    poRetailerToManufactureController.getRetailerPOByManufacture
  );

// update set quantity and other details for retailer PO ( manufacture and retailer can update the any data in po )
router
  .route('/update-po-data/:poId')
  .patch(
     auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
     poRetailerToManufactureController.updateRetailerPOSetItem
  );

router
  .route('/:id')
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    poRetailerToManufactureController.getSinglePoRetailerToManufacture
  ) // Get SinglePoRetailerTOManufacture by ID
  .patch(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    poRetailerToManufactureController.updateSinglePoRetailerToManufacture
  ) // Update SinglePoRetailerTOManufacture by ID
  .delete(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    poRetailerToManufactureController.deleteSinglePoRetailerToManufacture
  ); // Delete SinglePoRetailerTOManufacture by ID

module.exports = router;
