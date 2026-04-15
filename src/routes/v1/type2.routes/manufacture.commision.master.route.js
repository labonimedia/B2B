const express = require('express');
const auth = require('../../../middlewares/auth');
const { manufactureCommisionController } = require('../../../controllers');

const router = express.Router();

router.post(
  '/assign',
  auth('manufacture', 'superadmin', 'channelPartner', 'retailer', 'wholesaler'),
  manufactureCommisionController.assignCommission
);

// ✅ Update Commission
router.patch(
  '/update',
  auth('manufacture', 'superadmin', 'channelPartner', 'retailer', 'wholesaler'),
  manufactureCommisionController.updateAssignedCommission
);

// ✅ Delete Commission
router.delete(
  '/delete',
  auth('manufacture', 'superadmin', 'channelPartner', 'retailer', 'wholesaler'),
  manufactureCommisionController.deleteAssignedCommission
);

router
  .route('/')
  .post(
    auth('manufacture', 'superadmin', 'channelPartner', 'retailer', 'wholesaler'),
    manufactureCommisionController.createCommissionCategory
  )
  .get(
    auth('manufacture', 'superadmin', 'channelPartner', 'retailer', 'wholesaler'),
    manufactureCommisionController.queryCommissionCategory
  );

router
  .route('/:id')
  .get(
    auth('manufacture', 'superadmin', 'channelPartner', 'retailer', 'wholesaler'),
    manufactureCommisionController.getCommissionCategoryById
  )
  .patch(
    auth('manufacture', 'superadmin', 'channelPartner', 'retailer', 'wholesaler'),
    manufactureCommisionController.updateCommissionCategoryById
  )
  .delete(
    auth('manufacture', 'superadmin', 'channelPartner', 'retailer', 'wholesaler'),
    manufactureCommisionController.deleteCommissionCategoryById
  );

module.exports = router;
