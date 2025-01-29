const express = require('express');
const auth = require('../../middlewares/auth');
const { retailerController } = require('../../controllers');
const { commonUploadMiddleware } = require('../../utils/upload');

const router = express.Router();

router.route('/upload/doc/:id').post(
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
  commonUploadMiddleware([
    { name: 'file', maxCount: 1 },
    { name: 'profileImg', maxCount: 1 },
  ]),
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

router
  .route('/wholesalerslist/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerController.getWholesalersByRetailerId);
  router
  .route('/manufacturelist/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerController.getManufactureByRetailerId);
module.exports = router;
