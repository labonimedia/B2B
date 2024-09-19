const express = require('express');
const auth = require('../../middlewares/auth');
const { entityController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), entityController.createEntity)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), entityController.queryEntity);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), entityController.getEntityById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), entityController.updateEntityById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), entityController.deleteEntityById);

module.exports = router;
