const express = require('express');

const auth = require('../../../middlewares/auth');

const controller = require('../../../controllers/type2.controller/salesAdminDashboard.controller');

const router = express.Router();

// All routes restricted to superadmin
router.use(auth('superadmin'));

/**
 * 1. Main Dashboard Overview
 */
router.get(
  '/overview',
  controller.getDashboardOverview
);

/**
 * 2. Business Counts
 */
router.get(
  '/business-counts',
  controller.getBusinessCounts
);

/**
 * 3. Revenue Report
 */
router.get(
  '/revenue',
  controller.getRevenueReport
);

/**
 * 4. Discount Report
 */
router.get(
  '/discounts',
  controller.getDiscountReport
);

/**
 * 5. Salesman Performance
 */
router.get(
  '/sales-performance',
  controller.getSalesPerformance
);

/**
 * 6. Subscription Plan Performance
 */
router.get(
  '/plan-performance',
  controller.getPlanPerformance
);

/**
 * 7. Monthly Trends
 */
router.get(
  '/monthly-trends',
  controller.getMonthlyTrends
);

/**
 * 8. Top Salesmen
 */
router.get(
  '/top-salesmen',
  controller.getTopSalesmen
);

/**
 * 9. Recent Registrations
 */
router.get(
  '/recent-registrations',
  controller.getRecentRegistrations
);

/**
 * 10. All Customers
 */
router.get(
  '/customers',
  controller.getCustomers
);

/**
 * 11. Salesman Details
 */
router.get(
  '/salesman/:salesmanId',
  controller.getSalesmanDetails
);

/**
 * 12. Payment Report
 */
router.get(
  '/payment-report',
  controller.getPaymentReport
);

// =====================================================
// SUPERADMIN PAYMENT DASHBOARD
// =====================================================

router.get(
  '/payments/overview',
  auth('superadmin'),
  controller.getPaymentOverview
);

router.get(
  '/payments/transactions',
  auth('superadmin'),
  controller.getPaymentTransactions
);

router.get(
  '/payments/revenue',
  auth('superadmin'),
  controller.getPaymentRevenue
);

router.get(
  '/payments/monthly-trends',
  auth('superadmin'),
  controller.getPaymentMonthlyTrends
);

router.get(
  '/payments/payment-methods',
  auth('superadmin'),
  controller.getPaymentMethods
);

router.get(
  '/payments/plan-performance',
  auth('superadmin'),
  controller.getPaymentPlanPerformance
);

router.get(
  '/payments/salesman-performance',
  auth('superadmin'),
  controller.getPaymentSalesmanPerformance
);

router.get(
  '/payments/recent',
  auth('superadmin'),
  controller.getRecentPayments
);

router.get(
  '/payments/failed',
  auth('superadmin'),
    controller.getFailedPayments
);

router.get(
  '/payments/refunds',
  auth('superadmin'),
  controller.getRefundPayments
);

module.exports = router;