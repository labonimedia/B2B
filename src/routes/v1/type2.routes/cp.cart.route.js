const express = require('express');
const auth = require('../../../middlewares/auth');
const { cpCartController } = require('../../../controllers');

const router = express.Router();

router.post('/add', auth('channelPartner'), cpCartController.addToCart);
router.get('/', auth('channelPartner'), cpCartController.getCart);
router.patch('/item', auth('channelPartner'), cpCartController.updateItem);
router.delete('/item', auth('channelPartner'), cpCartController.deleteItem);
router.post('/discount', auth('channelPartner'), cpCartController.applyDiscount);
router.post('/confirm/:cartId', auth('channelPartner'), cpCartController.confirmCart);
router.post('/preview-po/:cartId', auth('channelPartner'), cpCartController.previewPO);
module.exports = router;
