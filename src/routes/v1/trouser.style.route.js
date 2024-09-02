const express = require('express');
const auth = require('../../middlewares/auth');
const { trouserStyleController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), trouserStyleController.createTrouserStyle)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), trouserStyleController.queryTrouserStyle);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), trouserStyleController.getTrouserStyleById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), trouserStyleController.updateTrouserStyleById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), trouserStyleController.deleteTrouserStyleById);

module.exports = router;
