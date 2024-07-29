const express = require('express');
const auth = require('../../middlewares/auth');
const { wholesalerController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler'), wholesalerController.createWholesaler)
  .get(auth('superadmin', 'manufacture', 'wholesaler'), wholesalerController.queryWholesaler);

router
  .route('/:email')
  .get(auth('superadmin', 'manufacture', 'wholesaler'), wholesalerController.getWholesalerById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler'), wholesalerController.updateWholesalerById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler'), wholesalerController.deleteWholesalerById);
router
  .route('/manufactureList')
  .post(auth('superadmin', 'manufacture', 'wholesaler'), wholesalerController.getManufactureList);

module.exports = router;
