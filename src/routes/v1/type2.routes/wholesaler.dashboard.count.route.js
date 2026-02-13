const express = require('express');
const auth = require('../../../middlewares/auth');
const { wholesalerDashboardController } = require('../../../controllers');

const router = express.Router();

router.get(
  '/dashboard-counts/:role/:email',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
  wholesalerDashboardController.wholesalerDashboardCountsController
);

module.exports = router;
