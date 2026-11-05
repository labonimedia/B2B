const express = require('express');
const auth = require('../../middlewares/auth');
const { requestController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner', 'weaverManufacture'), requestController.createRequest)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner', 'weaverManufacture'), requestController.queryRequests);
router
  .route('/multiplerequests')
  .post(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner', 'weaverManufacture'),
    requestController.createMultipleRequests
  );

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner', 'weaverManufacture'), requestController.getRequestById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner', 'weaverManufacture'), requestController.updateRequestById)
  .delete(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner', 'weaverManufacture'),
    requestController.deleteRequestById
  );

router
  .route('/accept/:id/:requestbyemail/:requesttoemail')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner', 'weaverManufacture'), requestController.acceptRequest);

router
  .route('/filterdata/status')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner', 'weaverManufacture'), requestController.filterRequests);

router
  .route('/check/status-request')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner', 'weaverManufacture' ), requestController.getRequestStatus);

module.exports = router;
