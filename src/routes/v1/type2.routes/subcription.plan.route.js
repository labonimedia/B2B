const express = require('express');
//const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');

const subscriptionPlanValidation = require('../../../validations/subscription.plan.validation');
const subscriptionPlanController = require('../../../controllers/type2.controller/subcription.plan.controller');

const router = express.Router();

router
  .route('/')
  .post(
    // auth('superadmin'),
    validate(subscriptionPlanValidation.createSubscriptionPlan),
    subscriptionPlanController.createSubscriptionPlan
  )
  .get(
    // auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
    validate(subscriptionPlanValidation.getSubscriptionPlans),
    subscriptionPlanController.getSubscriptionPlans
  );

router
  .route('/:subscriptionPlanId')
  .get(
    // auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
    validate(subscriptionPlanValidation.getSubscriptionPlan),
    subscriptionPlanController.getSubscriptionPlan
  )
  .patch(
    // auth('superadmin'),
    validate(subscriptionPlanValidation.updateSubscriptionPlan),
    subscriptionPlanController.updateSubscriptionPlan
  )
  .delete(
    // auth('superadmin'),
    validate(subscriptionPlanValidation.deleteSubscriptionPlan),
    subscriptionPlanController.deleteSubscriptionPlan
  );

router.patch(
  '/status/:subscriptionPlanId',
  // auth('superadmin'),
  validate(subscriptionPlanValidation.changeStatus),
  subscriptionPlanController.changeStatus
);

router.get('/active/list', subscriptionPlanController.getActivePlans);

router.get('/dropdown/list', subscriptionPlanController.getSubscriptionDropdown);

module.exports = router;
