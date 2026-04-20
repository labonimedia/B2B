const express = require('express');
const auth = require('../../../middlewares/auth');
const { cpCartController } = require('../../../controllers');

const router = express.Router();

router.post('/', auth('channelPartner'), cpCartController.addToCart);
router.get('/', auth('channelPartner'), cpCartController.getCart);
router.patch('/:cartId/set/:setId', auth('channelPartner'), cpCartController.updateSetItem);
router.delete('/:cartId/set/:setId', auth('channelPartner'), cpCartController.deleteItem);

module.exports = router;
