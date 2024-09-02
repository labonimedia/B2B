const express = require('express');
const auth = require('../../middlewares/auth');
const { womenSleeveStyleController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), womenSleeveStyleController.createWomenSleeveType)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), womenSleeveStyleController.queryWomenSleeveType);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), womenSleeveStyleController.getWomenSleeveTypeById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), womenSleeveStyleController.updateWomenSleeveTypeById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), womenSleeveStyleController.deleteWomenSleeveTypeById);

module.exports = router;
