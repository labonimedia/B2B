const express = require('express');
const auth = require('../../middlewares/auth');
const { includeComponentController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'),  includeComponentController.createIncludeComponent)
  .get(auth('superadmin', 'manufacture'),  includeComponentController.queryIncludeComponent);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), includeComponentController.getIncludeComponentById)
  .patch(auth('superadmin', 'manufacture'), includeComponentController.updateIncludeComponentById)
  .delete(auth('superadmin', 'manufacture'), includeComponentController.deleteIncludeComponentById);

module.exports = router;

