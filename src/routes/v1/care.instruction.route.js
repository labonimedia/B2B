const express = require('express');
const auth = require('../../middlewares/auth');
const { careInstructionController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'),  careInstructionController.createCareInstruction)
  .get(auth('superadmin', 'manufacture'),  careInstructionController.queryCareInstruction);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), careInstructionController.getCareInstructionById)
  .patch(auth('superadmin', 'manufacture'), careInstructionController.updateCareInstructionById)
  .delete(auth('superadmin', 'manufacture'), careInstructionController.deleteCareInstructionById);

module.exports = router;

