const express = require('express');
const auth = require('../../middlewares/auth');
const { channelPartnerController } = require('../../controllers');
const { commonUploadMiddleware } = require('../../utils/upload');

const router = express.Router();

router.post(
  '/',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer'),
  commonUploadMiddleware([
    { name: 'file', maxCount: 1 },
    { name: 'profileImg', maxCount: 1 },
  ]),
  channelPartnerController.createByManufacturer
);

router.post(
  '/register',
  commonUploadMiddleware([
    { name: 'file', maxCount: 1 },
    { name: 'profileImg', maxCount: 1 },
  ]),
  channelPartnerController.registerChannelPartner
);

// Get All Channel Partners
router.get(
  '/',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer'),
  channelPartnerController.getAllChannelPartners
);

// Get Single Channel Partner
router.get(
  '/:email',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer'),
  channelPartnerController.getChannelPartnerByEmail
);

// Update Channel Partner
router.patch(
  '/:email',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner'),
  commonUploadMiddleware([
    { name: 'file', maxCount: 1 },
    { name: 'profileImg', maxCount: 1 },
  ]),
  channelPartnerController.updateChannelPartner
);

// Delete Channel Partner
router.delete(
  '/:email',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer'),
  channelPartnerController.deleteChannelPartner
);

// Add Retailer under Channel Partner
router.post(
  '/:channelPartnerId/retailers',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer'),
  channelPartnerController.addRetailer
);

// Get Retailers of Channel Partner
router.get(
  '/:channelPartnerId/retailers',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer'),
  channelPartnerController.getRetailers
);

// Link Manufacturer to Channel Partner
router.post(
  '/:channelPartnerId/link-manufacturer',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer'),
  channelPartnerController.linkManufacturer
);

// Assign Commission
router.post(
  '/:channelPartnerId/commission',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer'),
  channelPartnerController.assignCommission
);

// Get Commission (by who gave)
router.get(
  '/:channelPartnerId/commission/:commissionGivenBy',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer'),
  channelPartnerController.getCommissionByGivenBy
);

router.post(
  '/by-manufacturer',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer'),
  channelPartnerController.getCPByManufacturer
);

module.exports = router;
