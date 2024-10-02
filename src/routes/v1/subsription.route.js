const express = require('express');
const auth = require('../../middlewares/auth');
const { subscriptionController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), subscriptionController.createSubscription)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), subscriptionController.querySubscription);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), subscriptionController.getSubscriptionById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), subscriptionController.updateSubscriptionById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), subscriptionController.deleteSubscriptionById);

module.exports = router;
