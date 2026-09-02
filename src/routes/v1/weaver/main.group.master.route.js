const express = require('express');

const multer = require('multer');
const path = require('path');

const auth = require('../../../middlewares/auth');

const { weaverMainGroupMasterController } = require('../../../controllers');

const router = express.Router();

const staticFolder = path.join(__dirname, '../../../');

const uploadsFolder = path.join(staticFolder, 'uploads');

const upload = multer({
  dest: uploadsFolder,
});

router.post(
  '/bulk-upload',
  auth('superadmin', 'manufacture'),
  upload.single('file'),
  weaverMainGroupMasterController.bulkUploadFile
);

router.post(
  '/search',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
  weaverMainGroupMasterController.searchWeaverMainGroupMaster
);

router
  .route('/')
  .post(auth('superadmin', 'manufacture'), weaverMainGroupMasterController.createWeaverMainGroupMaster)
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    weaverMainGroupMasterController.queryWeaverMainGroupMaster
  );

router
  .route('/:id')
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    weaverMainGroupMasterController.getWeaverMainGroupMasterById
  )
  .patch(auth('superadmin', 'manufacture'), weaverMainGroupMasterController.updateWeaverMainGroupMasterById)
  .delete(auth('superadmin', 'manufacture'), weaverMainGroupMasterController.deleteWeaverMainGroupMasterById);

module.exports = router;
