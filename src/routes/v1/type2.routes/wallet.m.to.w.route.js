const express = require('express');
const auth = require('../../../middlewares/auth');
const { mToWWalletController } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler'), mToWWalletController.createWallet)
  .get(auth('superadmin', 'manufacture', 'wholesaler'), mToWWalletController.queryWallets);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler'), mToWWalletController.getWalletById)
  .patch(auth('superadmin', 'manufacture'), mToWWalletController.updateWallet) // ✅ added
  .delete(auth('superadmin'), mToWWalletController.deleteWallet); // ✅ added

router.route('/debit/:walletId').patch(auth('manufacture'), mToWWalletController.debitWalletById);

module.exports = router;
