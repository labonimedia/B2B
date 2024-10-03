const express = require('express');
const auth = require('../../middlewares/auth');
const { subscriptionPlanController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), subscriptionPlanController.createSubscriptionPlan)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), subscriptionPlanController.querySubscriptionPlan);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), subscriptionPlanController.getSubscriptionPlanById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), subscriptionPlanController.updateSubscriptionPlanById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), subscriptionPlanController.deleteSubscriptionPlanById);

module.exports = router;
