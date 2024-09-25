const express = require('express');
const auth = require('../../middlewares/auth');
const { layerCompressionController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'), layerCompressionController.createLayerCompression)
  .get(auth('superadmin', 'manufacture'), layerCompressionController.queryLayerCompression);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), layerCompressionController.getLayerCompressionById)
  .patch(auth('superadmin', 'manufacture'), layerCompressionController.updateLayerCompressionById)
  .delete(auth('superadmin', 'manufacture'), layerCompressionController.deleteLayerCompressionById);

module.exports = router;
