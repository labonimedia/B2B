const express = require('express');
const auth = require('../../middlewares/auth');
const { waistBandController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'), waistBandController.createWaistBand)
  .get(auth('superadmin', 'manufacture'), waistBandController.queryWaistBand);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), waistBandController.getWaistBandById)
  .patch(auth('superadmin', 'manufacture'), waistBandController.updateWaistBandById)
  .delete(auth('superadmin', 'manufacture'), waistBandController.deleteWaistBandById);

module.exports = router;
