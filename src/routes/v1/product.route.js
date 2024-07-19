const express = require('express');
const auth = require('../../middlewares/auth');
const { productController } = require('../../controllers');
const { commonUploadMiddleware } = require('../../utils/upload');

const router = express.Router();

router
  .route('/upload/colour-collection/:id')
  .post(auth('superadmin', 'manufacture'),  commonUploadMiddleware([
    { name: 'colourImage', maxCount: 1 },
    { name: 'productImages', maxCount: 10 },
    { name: 'productVideo', maxCount: 1 }
  ]), productController.fileupload)
router
  .route('/')
  .post(auth('superadmin', 'manufacture'), productController.createProduct)
  .get(auth('superadmin', 'manufacture'), productController.queryProduct);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), productController.getProductById)
  .patch(auth('superadmin', 'manufacture'), productController.updateProductById)
  .delete(auth('superadmin', 'manufacture'), productController.deleteProductById);

module.exports = router;
