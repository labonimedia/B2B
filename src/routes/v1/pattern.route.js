const express = require('express');
const auth = require('../../middlewares/auth');
const { patternController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'), patternController.createPattern)
  .get(auth('superadmin', 'manufacture'), patternController.queryPattern);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), patternController.getPatternById)
  .patch(auth('superadmin', 'manufacture'), patternController.updatePatternById)
  .delete(auth('superadmin', 'manufacture'), patternController.deletePatternById);

module.exports = router;
