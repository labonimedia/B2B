const express = require('express');
const auth = require('../../middlewares/auth');
const { dileveryOrderController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), dileveryOrderController.createDileveryOrder)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), dileveryOrderController.queryDileveryOrder);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), dileveryOrderController.getDileveryOrderById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), dileveryOrderController.updateDileveryOrderById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), dileveryOrderController.deleteDileveryOrderById);

  router
  .route('/get/challan')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), dileveryOrderController.getManufactureChalanNo)
  
  router
  .route('/get/challan/number')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), dileveryOrderController.getManufactureChalanNo)

module.exports = router;
