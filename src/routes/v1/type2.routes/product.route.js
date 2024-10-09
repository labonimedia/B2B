const express = require('express');
const auth = require('../../../middlewares/auth');
const { productType2Controller } = require('../../../controllers');
const { commonUploadMiddleware } = require('../../../utils/upload');

const router = express.Router();

router.route('/upload/colour-collection/:id').post(
  auth('superadmin', 'manufacture'),
  commonUploadMiddleware([
    { name: 'colourImage', maxCount: 1 },
    { name: 'productImages', maxCount: 10 },
    { name: 'productVideo', maxCount: 1 },
  ]),
  productType2Controller.fileupload
);
router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), productType2Controller.createProduct)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), productType2Controller.queryProduct);

router
  .route('/filter-products')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), productType2Controller.searchProducts);
router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), productType2Controller.getProductById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), productType2Controller.updateProductById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), productType2Controller.deleteProductById);

router.route('/update/colour-collection').patch(
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
  commonUploadMiddleware([
    { name: 'colourImage', maxCount: 1 },
    { name: 'productImages', maxCount: 10 },
    { name: 'productVideo', maxCount: 1 },
  ]),
  productType2Controller.updateColorCollection
);

router
  .route('/get-product/by-desingnumber')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), productType2Controller.getProductBydesigneNo);

// Delete route
router
  .route('/delete/colour-collection')
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), productType2Controller.deleteColorCollection);

router
  .route('/manufracturelist/byproduct')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), productType2Controller.getFilteredProducts);
module.exports = router;