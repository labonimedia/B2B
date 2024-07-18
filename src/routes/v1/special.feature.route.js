const express = require('express');
const auth = require('../../middlewares/auth');
const { specialFeatureController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'), specialFeatureController.createSpecialFeature)
  .get(auth('superadmin', 'manufacture'), specialFeatureController.querySpecialFeature);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), specialFeatureController.getSpecialFeatureById)
  .patch(auth('superadmin', 'manufacture'), specialFeatureController.updateSpecialFeatureById)
  .delete(auth('superadmin', 'manufacture'), specialFeatureController.deleteSpecialFeatureById);

module.exports = router;
