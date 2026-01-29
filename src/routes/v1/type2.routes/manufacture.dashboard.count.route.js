const express = require('express');
const auth = require('../../../middlewares/auth');
const { manufactureDashboardCountsController } = require('../../../controllers');

const router = express.Router();

router
  .route('/retailer-po-counts')
  .get(
    auth('superadmin', 'manufacture', 'retailer', 'wholesaler'),
    manufactureDashboardCountsController.getManufacturerPORetailerCounts
  );

router
  .route('/product-counts')
  .get(
    auth('superadmin', 'manufacture', 'retailer', 'wholesaler'),
    manufactureDashboardCountsController.getProductDashboardCounts
  );

router.get(
  '/retailer-performa-invoice-counts',
  auth('superadmin', 'manufacture', 'retailer'),
  manufactureDashboardCountsController.getPerformaInvoiceDashboardCounts
);

router.get(
  '/retailer-return-counts',
  auth('manufacture', 'retailer', 'superadmin'),
  manufactureDashboardCountsController.getReturnDashboardCounts
);

router.get(
  '/retailer-credit-note-counts',
  auth('manufacture', 'retailer', 'superadmin'),
  manufactureDashboardCountsController.getCreditNoteDashboardCounts
);
module.exports = router;
