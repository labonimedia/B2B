const express = require('express');
const auth = require('../../middlewares/auth');
const { countryCodeController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), countryCodeController.createCountryCode)
  .get(countryCodeController.queryCountryCode);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), countryCodeController.getCountryCodeById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), countryCodeController.updateCountryCodeById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), countryCodeController.deleteCountryCodeById);

module.exports = router;
