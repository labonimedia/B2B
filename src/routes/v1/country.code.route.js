const express = require('express');
const auth = require('../../middlewares/auth');
const { countryCodeController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'weaverManufacture'), countryCodeController.createCountryCode)
  .get(countryCodeController.queryCountryCode);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'weaverManufacture'), countryCodeController.getCountryCodeById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'weaverManufacture'), countryCodeController.updateCountryCodeById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'weaverManufacture'), countryCodeController.deleteCountryCodeById);

module.exports = router;
