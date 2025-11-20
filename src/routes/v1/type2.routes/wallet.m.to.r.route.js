const express = require('express');
const auth = require('../../../middlewares/auth');
const { mToRWalletController } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), mToRWalletController.createWallet)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), mToRWalletController.queryWallets);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), mToRWalletController.getWalletById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), mToRWalletController.updateWallet)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), mToRWalletController.deleteWallet);

router
  .route('/debit/:walletId')
  // .patch(auth('manageWallet'), mtoRWalletController.debitWalletById);
  .patch(mToRWalletController.debitWalletById);
module.exports = router;
