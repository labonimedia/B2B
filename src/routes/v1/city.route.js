const express = require('express');
const auth = require('../../middlewares/auth');
const { cityController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cityController.createCity)
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    cityController.queryCity);

router
  .route('/searchby/country/state').
  post(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    cityController.getCities);
router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cityController.getCityById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cityController.updateCityById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cityController.deleteCityById);

module.exports = router;
