const express = require('express');
const router = express.Router();
const { gstHsnController } = require('../../../controllers');

router
  .route('/')
  .get(
    gstHsnController.getHsnCodes
  );

router
  .route('/:hsnCode')
  .get(
    gstHsnController.getHsnCodeDetails
  );

module.exports = router;
