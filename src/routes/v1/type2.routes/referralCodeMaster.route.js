const express = require('express');
//const auth = require('../../../middlewares/auth');
const { referralCodeMasterController } = require('../../../controllers');

const router = express.Router();

router.post('/', referralCodeMasterController.add);
router.get('/', referralCodeMasterController.get);
router.delete('/:id', referralCodeMasterController.remove);
router.post('/check', referralCodeMasterController.checkReferralCode);

module.exports = router;
