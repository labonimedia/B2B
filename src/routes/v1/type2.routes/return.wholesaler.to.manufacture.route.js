const express = require('express');
const auth = require('../../../middlewares/auth');
const { wToMReturnRequestController } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('wholesaler'), wToMReturnRequestController.returnRequest)
  .get(auth('wholesaler', 'manufacture'), wToMReturnRequestController.queryReturnRequest);

router
  .route('/:id')
  .get(auth('wholesaler', 'manufacture'), wToMReturnRequestController.getReturnRequestById)
  .patch(auth('wholesaler', 'manufacture'), wToMReturnRequestController.updateReturnRequestById)
  .delete(auth('wholesaler'), wToMReturnRequestController.deleteReturnRequestById);

module.exports = router;
