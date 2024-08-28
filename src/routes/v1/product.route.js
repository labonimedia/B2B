const express = require('express');
const auth = require('../../middlewares/auth');
const { productController } = require('../../controllers');
const { commonUploadMiddleware } = require('../../utils/upload');

const router = express.Router();

router.route('/upload/colour-collection/:id').post(
  auth('superadmin', 'manufacture'),
  commonUploadMiddleware([
    { name: 'colourImage', maxCount: 1 },
    { name: 'productImages', maxCount: 10 },
    { name: 'productVideo', maxCount: 1 },
  ]),
  productController.fileupload
);
router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), productController.createProduct)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), productController.queryProduct);

router
  .route('/filter-products')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), productController.searchProducts);
router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), productController.getProductById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), productController.updateProductById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), productController.deleteProductById);

router.route('/update/colour-collection').patch(
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
  commonUploadMiddleware([
    { name: 'colourImage', maxCount: 1 },
    { name: 'productImages', maxCount: 10 },
    { name: 'productVideo', maxCount: 1 },
  ]),
  productController.updateColorCollection
);

// Delete route
router
  .route('/delete/colour-collection')
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), productController.deleteColorCollection);

router.post('/manufracturelist/byproduct', productController.getFilteredProducts);
module.exports = router;
