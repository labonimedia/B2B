const express = require('express');

const auth = require('../../../middlewares/auth');

const {
  weaverProductController,
} = require('../../../controllers');

const {
  commonUploadMiddleware,
} = require('../../../utils/upload');

const router = express.Router();

/**
 * =========================================================
 * Create / Query Products
 * =========================================================
 */

/**
 * Create Weaver Product
 *
 * POST /weaver-product
 *
 * Multipart/form-data
 *
 * productImages -> maximum 5
 */

router
  .route('/')
  .post(
    auth(
      'superadmin',
      'weaverManufacture'
    ),

    commonUploadMiddleware([
      {
        name: 'productImages',
        maxCount: 5,
      },
    ]),

    weaverProductController.createProduct
  )

  /**
   * Get Products
   */

  .get(
    auth(
      'superadmin',
      'manufacture',
      'wholesaler',
      'retailer',
      'channelPartner',
      'weaverManufacture'
    ),

    weaverProductController.queryProduct
  );

/**
 * =========================================================
 * Search Products
 * =========================================================
 */

router.post(
  '/search',

  auth(
    'superadmin',
    'manufacture',
    'wholesaler',
    'retailer',
    'channelPartner',
    'weaverManufacture'
  ),

  weaverProductController.searchProducts
);

/**
 * =========================================================
 * Check Design Number
 * =========================================================
 */

router.post(
  '/check-existence',

  auth(
    'superadmin',
    'weaverManufacture'
  ),

  weaverProductController
    .checkProductExistence
);

/**
 * =========================================================
 * Get Product By Design Number
 * =========================================================
 */

router.get(
  '/by-design-number',

  auth(
    'superadmin',
    'manufacture',
    'wholesaler',
    'retailer',
    'channelPartner',
    'weaverManufacture'
  ),

  weaverProductController
    .getProductByDesignNumber
);

/**
 * =========================================================
 * Product By ID
 * =========================================================
 */

router
  .route('/:id')

  /**
   * Get Product
   */

  .get(
    auth(
      'superadmin',
      'manufacture',
      'wholesaler',
      'retailer',
      'channelPartner',
      'weaverManufacture'
    ),

    weaverProductController
      .getProductById
  )

  /**
   * Update Product
   */

  .patch(
    auth(
      'superadmin',
      'weaverManufacture'
    ),

    commonUploadMiddleware([
      {
        name: 'productImages',
        maxCount: 5,
      },
    ]),

    weaverProductController
      .updateProductById
  )

  /**
   * Delete Product
   */

  .delete(
    auth(
      'superadmin',
      'weaverManufacture'
    ),

    weaverProductController
      .deleteProductById
  );

module.exports = router;