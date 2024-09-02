const express = require('express');
const auth = require('../../middlewares/auth');
const { trouserPocketController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), trouserPocketController.createTrouserPocket)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), trouserPocketController.queryTrouserPocket);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), trouserPocketController.getTrouserPocketById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), trouserPocketController.updateTrouserPocketById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), trouserPocketController.deleteTrouserPocketById);

module.exports = router;
