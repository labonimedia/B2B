const express = require('express');
//const auth = require('../../../middlewares/auth');
const { referralCodeUsedController } = require('../../../controllers');

const router = express.Router();

router.post(
  '/',
  // auth('channelPartner'),
  referralCodeUsedController.add
);

router.post(
  '/check',
  //auth('channelPartner'),
  referralCodeUsedController.check
);

router.get(
  '/',
  //auth('channelPartner'),
  referralCodeUsedController.get
);

router.delete(
  '/:id',
  // auth('channelPartner'),
  referralCodeUsedController.remove
);

module.exports = router;
