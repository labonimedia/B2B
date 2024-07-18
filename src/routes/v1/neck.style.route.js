const express = require('express');
const auth = require('../../middlewares/auth');
const { neckStyleController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'), neckStyleController.createNeckStyle)
  .get(auth('superadmin', 'manufacture'), neckStyleController.queryNeckStyle);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), neckStyleController.getNeckStyleById)
  .patch(auth('superadmin', 'manufacture'), neckStyleController.updateNeckStyleById)
  .delete(auth('superadmin', 'manufacture'), neckStyleController.deleteNeckStyleById);

module.exports = router;
