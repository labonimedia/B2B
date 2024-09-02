const express = require('express');
const auth = require('../../middlewares/auth');
const { trouserFitTypeController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), trouserFitTypeController.createTrouserFitType)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), trouserFitTypeController.queryTrouserFitType);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), trouserFitTypeController.getTrouserFitTypeById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), trouserFitTypeController.updateTrouserFitTypeById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), trouserFitTypeController.deleteTrouserFitTypeById);

module.exports = router;
