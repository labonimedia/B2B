const express = require('express');
const auth = require('../../middlewares/auth');
const { patchworkDesignController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), patchworkDesignController.create)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), patchworkDesignController.query);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), patchworkDesignController.getById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), patchworkDesignController.updateById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), patchworkDesignController.deleteById);

module.exports = router;
