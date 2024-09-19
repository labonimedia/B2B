const express = require('express');
const auth = require('../../middlewares/auth');
const { braClosureController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), braClosureController.createBraClosure)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), braClosureController.queryBraClosure);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), braClosureController.getBraClosureById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), braClosureController.updateBraClosureById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), braClosureController.deleteBraClosureById);

module.exports = router;
