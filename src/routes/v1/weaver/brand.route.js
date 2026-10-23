const express = require('express');
const auth = require('../../../middlewares/auth');
const { weaverBrandController } = require('../../../controllers');
const { commonUploadMiddleware } = require('../../../utils/upload');

const router = express.Router();

/**
 * =========================================================
 * Brand CRUD
 * =========================================================
 */

/**
 * Create Brand
 */
router
  .route('/')
  .post(
    auth('superadmin', 'weaverManufacture'),
    commonUploadMiddleware([
      {
        name: 'brandLogo',
        maxCount: 1,
      },
    ]),
    weaverBrandController.createBrand
  )

  /**
   * Get Brands
   */
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner', 'weaverManufacture'),
    weaverBrandController.queryBrand
  );

/**
 * =========================================================
 * Brand Search APIs
 * =========================================================
 */

/**
 * Search Brand + Manufacturer
 */
router.post(
  '/searchmanufacturelist',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner', 'weaverManufacture'),
  weaverBrandController.searchBrandAndOwnerDetails
);

/**
 * Search Brands Connected to Wholesalers
 */
router.post(
  '/search/brands-connected-to-wholesalers',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner', 'weaverManufacture'),
  weaverBrandController.getBrandsAndWholesalers
);

/**
 * =========================================================
 * Brand Owner APIs
 * =========================================================
 */

/**
 * Get brands by owner email
 *
 * GET /brandlist/:email
 */
router.get(
  '/brandlist/:email',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner', 'weaverManufacture'),
  weaverBrandController.getBrandByEmail
);

/**
 * Get visible brands by owner
 *
 * GET /visible/brandlist/:email/:visibility
 */
router.get(
  '/visible/brandlist/:email/:visibility',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner', 'weaverManufacture'),
  weaverBrandController.getBrandByEmailAndVisibility
);

/**
 * =========================================================
 * Brand Visibility
 * =========================================================
 */

/**
 * PATCH /updatevisibility/:id
 */
router.patch('/updatevisibility/:id', auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner', 'weaverManufacture'), weaverBrandController.updateVisibility);

/**
 * =========================================================
 * Brand by ID
 * =========================================================
 */

router
  .route('/:id')

  /**
   * Get Brand
   */
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner', 'weaverManufacture'),
    weaverBrandController.getBrandById
  )

  /**
   * Update Brand
   */
  .patch(
    auth('superadmin', 'weaverManufacture'),
    commonUploadMiddleware([
      {
        name: 'brandLogo',
        maxCount: 1,
      },
    ]),
    weaverBrandController.updateBrandById
  )

  /**
   * Delete Brand
   */
  .delete(auth('superadmin', 'weaverManufacture'), weaverBrandController.deleteBrandById);

module.exports = router;
