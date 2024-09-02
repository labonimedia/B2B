const express = require('express');
const auth = require('../../middlewares/auth');
const { shirtSizeSetController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin','manufacture', 'wholesaler', 'retailer'), shirtSizeSetController.createShirtSizeSet)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), shirtSizeSetController.queryShirtSizeSet);

router
  .route('/:id')
  .get(auth('superadmin','manufacture', 'wholesaler', 'retailer'), shirtSizeSetController.getShirtSizeSetById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), shirtSizeSetController.updateShirtSizeSetById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), shirtSizeSetController.deleteShirtSizeSetById);

module.exports = router;
