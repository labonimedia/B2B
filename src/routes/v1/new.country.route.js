const express = require('express');
const auth = require('../../middlewares/auth');
const { newCountryController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), newCountryController.createNewCountry)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), newCountryController.queryNewCountry);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), newCountryController.getNewCountryById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), newCountryController.updateNewCountryById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), newCountryController.deleteNewCountryById);

module.exports = router;
