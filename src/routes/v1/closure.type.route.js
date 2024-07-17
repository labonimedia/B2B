const express = require('express');
const auth = require('../../middlewares/auth');
const { closureTypeController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'),  closureTypeController.createClosureType)
  .get(auth('superadmin', 'manufacture'),  closureTypeController.queryClosureType);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), closureTypeController.getClosureTypeById)
  .patch(auth('superadmin', 'manufacture'), closureTypeController.updateClosureTypeById)
  .delete(auth('superadmin', 'manufacture'), closureTypeController.deleteClosureTypeById);

module.exports = router;

