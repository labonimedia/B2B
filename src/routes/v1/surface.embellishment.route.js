const express = require('express');
const auth = require('../../middlewares/auth');
const { surfaceEmbellishmentController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), surfaceEmbellishmentController.create)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), surfaceEmbellishmentController.query);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), surfaceEmbellishmentController.getById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), surfaceEmbellishmentController.updateById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), surfaceEmbellishmentController.deleteById);

module.exports = router;
