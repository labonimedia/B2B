const express = require('express');
const { manufacturerVendorController } = require('../../../controllers');
const router = express.Router();

router
  .route('/')
  .post(manufacturerVendorController.createVendor)
  .get(manufacturerVendorController.queryVendors);

router
  .route('/:id')
  .get(manufacturerVendorController.getVendorById)
  .patch(manufacturerVendorController.updateVendorById)
  .delete(manufacturerVendorController.deleteVendorById);
  
router
  .route('/perment/:id')
  .delete(manufacturerVendorController.deleteVendorPerment);

module.exports = router;
