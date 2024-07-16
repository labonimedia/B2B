const express = require('express');
const auth = require('../../middlewares/auth');
const { materialController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'),  materialController.createMaterial)
  .get(auth('superadmin', 'manufacture'),  materialController.queryMaterial);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), materialController.getMaterialById)
  .patch(auth('superadmin', 'manufacture'), materialController.updateMaterialById)
  .delete(auth('superadmin', 'manufacture'), materialController.deleteMaterialById);

module.exports = router;

