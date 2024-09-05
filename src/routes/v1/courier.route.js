const express = require('express');
const auth = require('../../middlewares/auth');
const { courierController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), courierController.createCourier)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), courierController.queryCourier);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), courierController.getCourierById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), courierController.updateCourierById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), courierController.deleteCourierById);

module.exports = router;
