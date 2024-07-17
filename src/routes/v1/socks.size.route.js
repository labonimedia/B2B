const express = require('express');
const auth = require('../../middlewares/auth');
const { socksSizeController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'),  socksSizeController.createSocksSize)
  .get(auth('superadmin', 'manufacture'),  socksSizeController.querySocksSize);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), socksSizeController.getSocksSizeById)
  .patch(auth('superadmin', 'manufacture'), socksSizeController.updateSocksSizeById)
  .delete(auth('superadmin', 'manufacture'), socksSizeController.deleteSocksSizeById);

module.exports = router;

