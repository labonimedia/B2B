
const express = require('express');

const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');

const validation = require('../../../validations/salesRegistration.validation');
const controller = require('../../../controllers/type2.controller/salesRegistration.controller');

const router = express.Router();

/**
 * Register Customer with Discount
 */
router.post(
  '/',
  auth('sales', 'superadmin'),
  validate(validation.createSalesRegistration),
  controller.createSalesRegistration
);

/**
 * My Referred Customers
 */
router.get(
  '/',
  auth('sales', 'superadmin'),
  validate(validation.getSalesRegistrations),
  controller.getSalesRegistrations
);

/**
 * Sales Dashboard
 */
router.get(
  '/dashboard',
  auth('sales', 'superadmin'),
  controller.getSalesDashboard
);

module.exports = router;
