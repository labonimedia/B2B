const express = require('express');
const auth = require('../../middlewares/auth');
const { requestController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), requestController.createRequest)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), requestController.queryRequests);
router
  .route('/multiplerequests')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), requestController.createMultipleRequests);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), requestController.getRequestById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), requestController.updateRequestById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), requestController.deleteRequestById);

router
  .route('/accept/:id/:requestbyemail/:requesttoemail')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), requestController.acceptRequest);

router
  .route('/filterdata/status')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), requestController.filterRequests);


router
  .route('/check/status-request')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), requestController.getRequestStatus);

module.exports = router;
