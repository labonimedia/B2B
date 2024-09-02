const express = require('express');
const auth = require('../../middlewares/auth');
const { riseStyleController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), riseStyleController.createRiseStyle)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), riseStyleController.queryRiseStyle);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), riseStyleController.getRiseStyleById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), riseStyleController.updateRiseStyleById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), riseStyleController.deleteRiseStyleById);

module.exports = router;
