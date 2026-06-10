const express = require('express');
const auth = require('../../middlewares/auth');
const { printDesignController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), printDesignController.create)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), printDesignController.query);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), printDesignController.getById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), printDesignController.updateById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), printDesignController.deleteById);

module.exports = router;
