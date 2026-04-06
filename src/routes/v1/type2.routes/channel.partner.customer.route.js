const express = require('express');
const auth = require('../../../middlewares/auth');
const { channelPartnerCostumerController } = require('../../../controllers');

const router = express.Router();

router.route('/bulk').post(auth('channelPartner'), channelPartnerCostumerController.bulkUpload);

router
  .route('/')
  .post(
    auth('channelPartner', 'manufacture', 'wholesaler', 'superadmin', 'retailer'), // only CP can add
    channelPartnerCostumerController.addRetailer
  )
  .get(
    auth('channelPartner', 'manufacture', 'wholesaler', 'superadmin', 'retailer'),
    channelPartnerCostumerController.queryRetailers
  );

router
  .route('/:id')
  .get(
    auth('channelPartner', 'manufacture', 'wholesaler', 'superadmin', 'retailer'),
    channelPartnerCostumerController.getRetailerById
  )
  .patch(
    auth('channelPartner', 'manufacture', 'wholesaler', 'superadmin', 'retailer'), // only CP can update
    channelPartnerCostumerController.updateRetailerById
  )
  .delete(
    auth('channelPartner', 'manufacture', 'wholesaler', 'superadmin', 'retailer'), // only CP can delete
    channelPartnerCostumerController.deleteRetailerById
  );

module.exports = router;
