const express = require('express');
const auth = require('../../middlewares/auth');
const { fitTypeController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), fitTypeController.createFitType)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer' ), fitTypeController.queryFitType);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), fitTypeController.getFitTypeById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), fitTypeController.updateFitTypeById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), fitTypeController.deleteFitTypeById);

module.exports = router;
