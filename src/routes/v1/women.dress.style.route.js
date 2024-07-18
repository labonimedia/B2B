const express = require('express');
const auth = require('../../middlewares/auth');
const { womenDressStyleController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'), womenDressStyleController.createWomenDressStyle)
  .get(auth('superadmin', 'manufacture'), womenDressStyleController.queryWomenDressStyle);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), womenDressStyleController.getWomenDressStyleById)
  .patch(auth('superadmin', 'manufacture'), womenDressStyleController.updateWomenDressStyleById)
  .delete(auth('superadmin', 'manufacture'), womenDressStyleController.deleteWomenDressStyleById);

module.exports = router;
