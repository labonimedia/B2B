const express = require('express');
const auth = require('../../middlewares/auth');
const { sleeveLengthController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'), sleeveLengthController.createSleeveLength)
  .get(auth('superadmin', 'manufacture'), sleeveLengthController.querySleeveLength);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), sleeveLengthController.getSleeveLengthById)
  .patch(auth('superadmin', 'manufacture'), sleeveLengthController.updateSleeveLengthById)
  .delete(auth('superadmin', 'manufacture'), sleeveLengthController.deleteSleeveLengthById);

module.exports = router;
