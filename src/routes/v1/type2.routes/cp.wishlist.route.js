const express = require('express');
const auth = require('../../../middlewares/auth');
const { cpWishlistController } = require('../../../controllers');

const router = express.Router();

router.post('/', auth('channelPartner'), cpWishlistController.add);
router.get('/', auth('channelPartner'), cpWishlistController.get);
router.delete('/:id', auth('channelPartner'), cpWishlistController.remove);

module.exports = router;
