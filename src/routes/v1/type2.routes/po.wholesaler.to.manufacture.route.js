const express = require('express');
const auth = require('../../../middlewares/auth');
const { poWholesalerToManufacturerController } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(
    auth('superadmin', 'manufacture', 'wholesaler'),
    poWholesalerToManufacturerController.createPurchaseOrderWholesalerToManufacturer
  )
  .get(
    auth('superadmin', 'manufacture', 'wholesaler'),
    poWholesalerToManufacturerController.getAllPOWholesalerToManufacturer
  );

router
  .route('/wholesaler/:wholesalerEmail')
  .get(
    auth('superadmin', 'manufacture', 'wholesaler'),
    poWholesalerToManufacturerController.getPOWholesalerToManufacturerByWholesaler
  );

router
  .route('/update-item/:poId')
  .patch(auth('superadmin', 'manufacture', 'wholesaler'), poWholesalerToManufacturerController.updatePOSetItem);

router
  .route('/:id')
  .get(
    auth('superadmin', 'manufacture', 'wholesaler'),
    poWholesalerToManufacturerController.getSinglePOWholesalerToManufacturer
  )
  .patch(
    auth('superadmin', 'manufacture', 'wholesaler'),
    poWholesalerToManufacturerController.updateSinglePOWholesalerToManufacturer
  )
  .delete(
    auth('superadmin', 'manufacture', 'wholesaler'),
    poWholesalerToManufacturerController.deleteSinglePOWholesalerToManufacturer
  );

router
  .route('/make-to-order')
  .post(auth('superadmin', 'manufacture', 'wholesaler'), poWholesalerToManufacturerController.makeToOrderPO);

router
  .route('/update-po-data/:poId')
  .patch(auth('manufacture', 'superadmin'), poWholesalerToManufacturerController.updatePoData);

module.exports = router;
