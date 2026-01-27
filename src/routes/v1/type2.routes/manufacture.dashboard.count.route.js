const express = require('express');
const auth = require('../../../middlewares/auth');
const { manufactureDashboardCountsController } = require('../../../controllers');

const router = express.Router();

router
  .route('/retailer-po-counts')
  .get(
    auth('superadmin', 'manufacture', 'retailer', 'wholesaler'),
    manufactureDashboardCountsController.manufacturerDashboard
  );

module.exports = router;
