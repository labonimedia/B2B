const express = require('express');
const auth = require('../../../middlewares/auth');
const { manufactureCommisionController } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('manufacture', 'superadmin', 'channelPartner'), manufactureCommisionController.createCommissionCategory)
  .get(auth('manufacture', 'superadmin', 'channelPartner'), manufactureCommisionController.queryCommissionCategory);

router
  .route('/:id')
  .get(auth('manufacture', 'superadmin', 'channelPartner'), manufactureCommisionController.getCommissionCategoryById)
  .patch(auth('manufacture', 'superadmin', 'channelPartner'), manufactureCommisionController.updateCommissionCategoryById)
  .delete(auth('manufacture', 'superadmin', 'channelPartner'), manufactureCommisionController.deleteCommissionCategoryById);

module.exports = router;
