const express = require('express');
const auth = require('../../middlewares/auth');
const { currencyControlller } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), currencyControlller.queryCurrency);

module.exports = router;
