const express = require('express');
const auth = require('../../middlewares/auth');
const { socksStyleController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'),  socksStyleController.createSocksStyle)
  .get(auth('superadmin', 'manufacture'),  socksStyleController.querySocksStyle);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), socksStyleController.getSocksStyleById)
  .patch(auth('superadmin', 'manufacture'), socksStyleController.updateSocksStyleById)
  .delete(auth('superadmin', 'manufacture'), socksStyleController.deleteSocksStyleById);

module.exports = router;

