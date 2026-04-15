const express = require('express');
const auth = require('../../../middlewares/auth');
const { channelPartnerCostumerController } = require('../../../controllers');
const { commonUploadMiddleware } = require('../../../utils/upload');

const router = express.Router();

router.post(
  '/upload/doc/:id',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer'),
  commonUploadMiddleware([
    { name: 'file', maxCount: 1 },
    { name: 'profileImg', maxCount: 1 },
  ]),
  channelPartnerCostumerController.fileupload
);

router.post(
  '/create-shopkeeper',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer'),
  channelPartnerCostumerController.createShopKeeper
);

router.get(
  '/',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer'),
  channelPartnerCostumerController.queryShopKeepers
);

router
  .route('/:id')
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer'),
    channelPartnerCostumerController.getShopKeeperById
  )
  .patch(
    auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer'),
    channelPartnerCostumerController.updateShopKeeper
  )
  .delete(
    auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer'),
    channelPartnerCostumerController.deleteShopKeeper
  );

module.exports = router;
