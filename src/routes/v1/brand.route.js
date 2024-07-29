const express = require('express');
const auth = require('../../middlewares/auth');
const { brandController } = require('../../controllers');
const { commonUploadMiddleware } = require('../../utils/upload');

const router = express.Router();

router
  .route('/')
  .post(
    auth('superadmin', 'manufacture'),
    commonUploadMiddleware([{ name: 'brandLogo', maxCount: 1 }]),
    brandController.createBrand
  )
  .get(auth('superadmin', 'manufacture'), brandController.queryBrand);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), brandController.getBrandById)
  .patch(
    auth('superadmin', 'manufacture'),
    commonUploadMiddleware([{ name: 'brandLogo', maxCount: 1 }]),
    brandController.updateBrandById
  )
  .delete(auth('superadmin', 'manufacture'), brandController.deleteBrandById);

module.exports = router;
