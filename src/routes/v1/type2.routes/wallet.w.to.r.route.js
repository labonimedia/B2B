const express = require('express');
const auth = require('../../../middlewares/auth');
const { wToRWalletController } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wToRWalletController.createWallet)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wToRWalletController.queryWallets);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wToRWalletController.getWalletById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wToRWalletController.updateWallet)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wToRWalletController.deleteWallet);

router.patch(
  '/debit/:walletId',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
  wToRWalletController.debitWalletById
);

module.exports = router;
