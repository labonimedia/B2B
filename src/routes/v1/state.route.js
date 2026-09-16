const express = require('express');
const auth = require('../../middlewares/auth');
const { stateController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'weaverManufacture'), stateController.createState)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'weaverManufacture'), stateController.queryState);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'weaverManufacture' ), stateController.getStateById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'weaverManufacture'), stateController.updateStateById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'weaverManufacture'), stateController.deleteStateById);
router
  .route('/searchby/country')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'weaverManufacture'), stateController.getState);
module.exports = router;
