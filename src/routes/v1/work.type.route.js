const express = require('express');
const auth = require('../../middlewares/auth');
const { workTypeController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), workTypeController.createWorkType)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), workTypeController.queryWorkType);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), workTypeController.getWorkTypeById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), workTypeController.updateWorkTypeById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), workTypeController.deleteWorkTypeById);

module.exports = router;
