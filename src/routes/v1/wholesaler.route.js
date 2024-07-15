const express = require('express');
const auth = require('../../middlewares/auth');
const { wholesalerController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'),  wholesalerController.createWholesaler)
  .get(auth('superadmin', 'manufacture'),  wholesalerController.queryWholesaler);

router
  .route('/:email')
  .get(auth('superadmin', 'manufacture'), wholesalerController.getWholesalerById)
  .patch(auth('superadmin', 'manufacture'), wholesalerController.updateWholesalerById)
  .delete(auth('superadmin', 'manufacture'), wholesalerController.deleteWholesalerById);

module.exports = router;

