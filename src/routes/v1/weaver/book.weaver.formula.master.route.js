const express = require('express');
const multer = require('multer');
const path = require('path');

const auth = require('../../../middlewares/auth');

const { weaverFormulaMasterController } = require('../../../controllers');

const router = express.Router();

const staticFolder = path.join(__dirname, '../../../');

const uploadsFolder = path.join(staticFolder, 'uploads');

const upload = multer({
  dest: uploadsFolder,
});

router.post(
  '/bulk-upload',

  auth('superadmin', 'manufacture', 'weaverManufacture'),

  upload.single('file'),

  weaverFormulaMasterController.bulkUploadFile
);

router.post(
  '/search',

  auth('superadmin', 'manufacture', 'weaverManufacture', 'wholesaler', 'retailer'),

  weaverFormulaMasterController.searchWeaverFormulaMaster
);

router
  .route('/')

  .post(
    auth('superadmin', 'manufacture', 'weaverManufacture'),

    weaverFormulaMasterController.createWeaverFormulaMaster
  )

  .get(
    auth('superadmin', 'manufacture', 'weaverManufacture', 'wholesaler', 'retailer'),

    weaverFormulaMasterController.queryWeaverFormulaMaster
  );

router
  .route('/:id')

  .get(
    auth('superadmin', 'manufacture', 'weaverManufacture', 'wholesaler', 'retailer'),

    weaverFormulaMasterController.getWeaverFormulaMasterById
  )

  .patch(
    auth('superadmin', 'manufacture', 'weaverManufacture'),

    weaverFormulaMasterController.updateWeaverFormulaMasterById
  )

  .delete(
    auth('superadmin', 'manufacture', 'weaverManufacture'),

    weaverFormulaMasterController.deleteWeaverFormulaMasterById
  );

module.exports = router;
