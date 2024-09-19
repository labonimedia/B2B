const express = require('express');
const auth = require('../../middlewares/auth');
const { braStyleController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), braStyleController.createBraStyle)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), braStyleController.queryBraStyle);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), braStyleController.getBraStyleById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), braStyleController.updateBraStyleById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), braStyleController.deleteBraStyleById);

module.exports = router;
