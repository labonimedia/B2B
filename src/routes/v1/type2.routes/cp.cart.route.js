const express = require('express');
const auth = require('../../../middlewares/auth');
const { cpCartController } = require('../../../controllers');

const router = express.Router();

router.post('/add', auth('channelPartner'), cpCartController.addToCart);
router.get('/', auth('channelPartner'), cpCartController.getCart);
router.get(
  '/shopkeepers',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer'),
  cpCartController.queryCart
);
router.patch('/item', auth('channelPartner'), cpCartController.updateItem);
router.delete('/item', auth('channelPartner'), cpCartController.deleteItem);
router.post('/discount', auth('channelPartner'), cpCartController.applyDiscount);
router.post('/confirm/:cartId', auth('channelPartner'), cpCartController.confirmCart);
router.post('/preview-po/:cartId', auth('channelPartner'), cpCartController.previewPO);
router.delete('/single-manufacturer-cart', auth('channelPartner'), cpCartController.deleteManufacturerCart);
router.post(
  '/preview-po-single/:cartId/:manufacturerEmail',
  auth('channelPartner'),
  cpCartController.previewSingleManufacturerPO
);

module.exports = router;
