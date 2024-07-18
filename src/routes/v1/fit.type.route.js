const express = require('express');
const auth = require('../../middlewares/auth');
const { fitTypeController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'), fitTypeController.createFitType)
  .get(auth('superadmin', 'manufacture'), fitTypeController.queryFitType);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), fitTypeController.getFitTypeById)
  .patch(auth('superadmin', 'manufacture'), fitTypeController.updateFitTypeById)
  .delete(auth('superadmin', 'manufacture'), fitTypeController.deleteFitTypeById);

module.exports = router;
