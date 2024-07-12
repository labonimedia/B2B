const express = require('express');
const auth = require('../../middlewares/auth');
const { manufactureController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'),  manufactureController.createManufacture)
  .get(auth('superadmin', 'manufacture'),  manufactureController.queryManufacture);

router
  .route('/:email')
  .get(manufactureController.getManufactureById)
  .patch(auth('superadmin', 'manufacture'), manufactureController.updateManufactureById)
  .delete(auth('superadmin', 'manufacture'), manufactureController.deleteManufactureById);

module.exports = router;

