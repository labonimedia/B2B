const express = require('express');
const auth = require('../../middlewares/auth');
const { embellishmentFeaturesController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), embellishmentFeaturesController.createEmbellishmentFeatures)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), embellishmentFeaturesController.queryEmbellishmentFeatures);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), embellishmentFeaturesController.getEmbellishmentFeaturesById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), embellishmentFeaturesController.updateEmbellishmentFeaturesById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), embellishmentFeaturesController.deleteEmbellishmentFeaturesById);

module.exports = router;
