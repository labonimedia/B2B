const express = require('express');
const auth = require('../../middlewares/auth');
const { sleeveCutStyleController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'),  sleeveCutStyleController.createSleevCutStyle)
  .get(auth('superadmin', 'manufacture'),  sleeveCutStyleController.querySleevCutStyle);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), sleeveCutStyleController.getSleevCutStyleById)
  .patch(auth('superadmin', 'manufacture'), sleeveCutStyleController.updateSleevCutStyleById)
  .delete(auth('superadmin', 'manufacture'), sleeveCutStyleController.deleteSleevCutStyleById);

module.exports = router;

