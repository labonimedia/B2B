const express = require('express');
const auth = require('../../../middlewares/auth');
const { channelPartnerController } = require('../../../controllers');

const router = express.Router();

router.post('/register', channelPartnerController.registerChannelPartner);

router.get('/', auth('superadmin', 'manufacture'), channelPartnerController.getAllChannelPartners);

router.get(
  '/:email',
  auth('superadmin', 'manufacture', 'channelPartner', 'retailer', 'wholesaler'),
  channelPartnerController.getChannelPartnerByEmail
);

router.patch(
  '/:email',
  auth('superadmin', 'manufacture', 'channelPartner', 'retailer', 'wholesaler'),
  channelPartnerController.updateChannelPartner
);

router.delete(
  '/:email',
  auth('superadmin', 'manufacture', 'channelPartner', 'retailer', 'wholesaler'),
  channelPartnerController.deleteChannelPartner
);

router.post(
  '/add-retailer',
  auth('superadmin', 'manufacture', 'channelPartner', 'retailer', 'wholesaler'),
  channelPartnerController.addRetailer
);

router.get(
  '/retailers/list',
  auth('superadmin', 'manufacture', 'channelPartner', 'retailer', 'wholesaler'),
  channelPartnerController.getRetailers
);

router.post(
  '/link-manufacturer',
  auth('superadmin', 'manufacture', 'channelPartner', 'retailer', 'wholesaler'),
  channelPartnerController.linkManufacturer
);

module.exports = router;
