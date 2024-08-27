const express = require('express');
const auth = require('../../middlewares/auth');
const { retailerController } = require('../../controllers');
const { commonUploadMiddleware } = require('../../utils/upload');

const router = express.Router();

router.route('/upload/doc/:id').post(
  auth('superadmin', 'manufacture','wholesaler', 'retailer'),
  commonUploadMiddleware([{ name: 'file', maxCount: 1 }]),
  retailerController.fileupload
);
router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerController.createRetailer)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerController.queryRetailer);

router
  .route('/:email')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerController.getRetailerById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerController.updateRetailerById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerController.deleteRetailerById);

module.exports = router;
