const express = require('express');
const auth = require('../../middlewares/auth');
const { sizeSetController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), sizeSetController.createSizeSet)
  .get(sizeSetController.querySizeSet); //auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), sizeSetController.getSizeSetById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), sizeSetController.updateSizeSetById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), sizeSetController.deleteSizeSetById);

router
  .route('/size-type/size-set')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), sizeSetController.getSizeSetByType);
module.exports = router;
