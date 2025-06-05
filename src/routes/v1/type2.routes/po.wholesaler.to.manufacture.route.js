const express = require('express');
const auth = require('../../../middlewares/auth');
const { poWholesalerToManufacturerController } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    poWholesalerToManufacturerController.createRetailerPurchaseOrderType2
  )
    .get(
      auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
      poWholesalerToManufacturerController.getAllPoWholesalerToManufacturer
    );
    router.get(
        '/generate-po-data-to-manufacturer/:wholesalerEmail',
        auth('wholesaler'),
        poWholesalerToManufacturerController.generatePOToManufacturer
      );

router
  .route('/wholesaler/:wholesalerEmail')
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    poWholesalerToManufacturerController.getRetailerPOByWholesaler
  );

router
  .route('/update-item/:poId')
  .patch(
     auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
     poWholesalerToManufacturerController.updateRetailerPOSetItem
  );
  router.get('/get-combined-po-items', auth('wholesaler'), poWholesalerToManufacturerController.getCombinedRetailerItems);

router
  .route('/:id')
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    poWholesalerToManufacturerController.getSinglePoWholesalerToManufacturer
  ) // Get SinglePoWholesalerToManufacturer by ID
  .patch(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    poWholesalerToManufacturerController.updateSinglePoWholesalerToManufacturer
  ) // Update SinglePoWholesalerToManufacturer by ID
  .delete(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    poWholesalerToManufacturerController.deleteSinglePoWholesalerToManufacturer
  ); // Delete SinglePoWholesalerToManufacturer by ID
router.get('/get-combined-po-items', auth('wholesaler'), poWholesalerToManufacturerController.getCombinedRetailerItems);

// router.post('/create-po-to-manufacturer', auth('wholesaler'), poWholesalerToManufacturerController.createPoToManufacturer);

module.exports = router;
