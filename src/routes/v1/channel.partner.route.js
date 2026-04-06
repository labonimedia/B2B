const express = require('express');
const auth = require('../../middlewares/auth');
const { channelPartnerController } = require('../../controllers');

const router = express.Router();

// Register (self + invited)
router.post('/register', channelPartnerController.registerChannelPartner);

// Get all Channel Partners
router.get('/', auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), channelPartnerController.getAllChannelPartners);

// Get single Channel Partner
router.get(
  '/:email',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
  channelPartnerController.getChannelPartnerByEmail
);

// Update Channel Partner
router.patch(
  '/:email',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
  channelPartnerController.updateChannelPartner
);

// Delete Channel Partner
router.delete(
  '/:email',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
  channelPartnerController.deleteChannelPartner
);

// Add retailer (ONLY CP)
router.post(
  '/retailers',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
  channelPartnerController.addRetailer
);

// Get own retailers
router.get(
  '/retailers',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
  channelPartnerController.getRetailers
);


// Link manufacturer to CP
router.post('/link-manufacturer', auth('superadmin', 'manufacture'), channelPartnerController.linkManufacturer);

module.exports = router;
