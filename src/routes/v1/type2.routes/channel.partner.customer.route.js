const express = require('express');
const auth = require('../../../middlewares/auth');
const { channelPartnerCostumerController } = require('../../../controllers');

const router = express.Router();

router.route('/bulk').post(auth('channelPartner'), channelPartnerCostumerController.bulkUpload);

router
  .route('/')
  .post(
    auth('channelPartner'), // only CP can add
    channelPartnerCostumerController.addRetailer
  )
  .get(auth('channelPartner', 'manufacture', 'wholesaler', 'superadmin'), channelPartnerCostumerController.queryRetailers);

router
  .route('/:id')
  .get(auth('channelPartner', 'manufacture', 'wholesaler', 'superadmin'), channelPartnerCostumerController.getRetailerById)
  .patch(
    auth('channelPartner'), // only CP can update
    channelPartnerCostumerController.updateRetailerById
  )
  .delete(
    auth('channelPartner'), // only CP can delete
    channelPartnerCostumerController.deleteRetailerById
  );

module.exports = router;
