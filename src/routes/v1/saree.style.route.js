const express = require('express');
const auth = require('../../middlewares/auth');
const { sareeStyleController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), sareeStyleController.createSareetyle)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), sareeStyleController.querySareetyle);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), sareeStyleController.getSareetyleById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), sareeStyleController.updateSareetyleById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), sareeStyleController.deleteSareetyleById);

module.exports = router;
