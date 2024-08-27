const express = require('express');
const auth = require('../../middlewares/auth');
const { requestController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(
    // auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), 
  requestController.createRequest)
  .get(
    // auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
     requestController.queryRequests);

router
  .route('/:id')
  .get(
    // auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
     requestController.getRequestById)
  .patch(
    // auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    requestController.updateRequestById)
  .delete(
    // auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), 
    requestController.deleteRequestById);

router
  .route('/accept/:id')
  .post(requestController.acceptRequest);

module.exports = router;
