const express = require('express');
const auth = require('../../middlewares/auth');
const { collarStyleController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'), collarStyleController.createCollarStyle)
  .get(auth('superadmin', 'manufacture'), collarStyleController.queryCollarStyle);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), collarStyleController.getCollarStyleById)
  .patch(auth('superadmin', 'manufacture'), collarStyleController.updateCollarStyleById)
  .delete(auth('superadmin', 'manufacture'), collarStyleController.deleteCollarStyleById);

module.exports = router;
