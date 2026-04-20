const express = require('express');
const auth = require('../../middlewares/auth');
const { requestController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'), requestController.createRequest)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'), requestController.queryRequests);
router
  .route('/multiplerequests')
  .post(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
    requestController.createMultipleRequests
  );

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'), requestController.getRequestById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'), requestController.updateRequestById)
  .delete(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
    requestController.deleteRequestById
  );

router
  .route('/accept/:id/:requestbyemail/:requesttoemail')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'), requestController.acceptRequest);

router
  .route('/filterdata/status')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'), requestController.filterRequests);

router
  .route('/check/status-request')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'), requestController.getRequestStatus);

module.exports = router;
