const express = require('express');
const auth = require('../../middlewares/auth');
const { channelPartnerController } = require('../../controllers');
const { commonUploadMiddleware } = require('../../utils/upload');

const router = express.Router();

router.post(
  '/link',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer'),
  channelPartnerController.linkChannelPartner
);

router.post(
  '/unlink',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer'),
  channelPartnerController.unlinkChannelPartner
);

router.post('/my-manufacturers', auth('channelPartner'), channelPartnerController.getMyManufacturers);

router.post(
  '/by-manufacturer',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer'),
  channelPartnerController.getCPByManufacturer
);

router.post(
  '/global-search',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner'),
  channelPartnerController.globalSearchCP
);

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

// Get Single Channel Partner
router.get(
  '/email/:email',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer'),
  channelPartnerController.getChannelPartnerByEmail
);

// Update Channel Partner
router.patch(
  '/email/:email',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner'),
  commonUploadMiddleware([
    { name: 'file', maxCount: 1 },
    { name: 'profileImg', maxCount: 1 },
  ]),
  channelPartnerController.updateChannelPartner
);

// Delete Channel Partner
router.delete(
  '/email/:email',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer'),
  channelPartnerController.deleteChannelPartner
);

module.exports = router;
