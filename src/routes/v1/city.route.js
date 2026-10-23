const express = require('express');
const auth = require('../../middlewares/auth');
const { cityController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'weaverManufacture'), cityController.createCity)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'weaverManufacture'), cityController.queryCity);

router
  .route('/searchby/country/state')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'weaverManufacture'), cityController.getCities);
router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'weaverManufacture'), cityController.getCityById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'weaverManufacture'), cityController.updateCityById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'weaverManufacture'), cityController.deleteCityById);

module.exports = router;
