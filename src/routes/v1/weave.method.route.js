const express = require('express');
const auth = require('../../middlewares/auth');
const { weaveMethodController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), weaveMethodController.create)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), weaveMethodController.query);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), weaveMethodController.getById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), weaveMethodController.updateById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), weaveMethodController.deleteById);

module.exports = router;
