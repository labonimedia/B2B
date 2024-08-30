const express = require('express');
const auth = require('../../middlewares/auth');
const { manufactureController } = require('../../controllers');
const { commonUploadMiddleware } = require('../../utils/upload');

const router = express.Router();

router.route('/upload/doc/:id').post(
  auth('superadmin', 'manufacture'),
  commonUploadMiddleware([{ name: 'file', maxCount: 1 },{ name: 'profileImg', maxCount: 1 }]),
  manufactureController.fileupload
);

router
  .route('/')
  .post(auth('superadmin', 'manufacture'),manufactureController.createManufacture)
  .get(auth('superadmin', 'manufacture'), manufactureController.queryManufacture);

router
  .route('/:email')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), manufactureController.getManufactureById)
  .patch(auth('superadmin', 'manufacture'), manufactureController.updateManufactureById)
  .delete(auth('superadmin', 'manufacture'), manufactureController.deleteManufactureById);

  router
  .route('/get-referred/manufactures')
  .get(auth('superadmin', 'manufacture'), manufactureController.getManufactureByEmail);

  router
  .route('/get-referred/retailers')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), manufactureController.getRetailersByEmail);
  
module.exports = router;
