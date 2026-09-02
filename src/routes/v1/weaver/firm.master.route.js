const express = require('express');
const auth = require('../../../middlewares/auth');

const { firmMasterController } = require('../../../controllers');

const { commonUploadMiddleware } = require('../../../utils/upload');

const router = express.Router();

const firmUploadFields = commonUploadMiddleware([
  {
    name: 'firmLogoLeft',
    maxCount: 1,
  },

  {
    name: 'firmLogoRight',
    maxCount: 1,
  },

  {
    name: 'invoiceSign',
    maxCount: 1,
  },

  {
    name: 'challanSign',
    maxCount: 1,
  },

  {
    name: 'envelopLogo',
    maxCount: 1,
  },
]);

router.post('/search', auth('superadmin', 'manufacture'), firmMasterController.searchFirmMaster);

router.get('/default', auth('superadmin', 'manufacture'), firmMasterController.getDefaultFirm);

router.post('/', auth('superadmin', 'manufacture'), firmUploadFields, firmMasterController.createFirmMaster);

router.get('/', auth('superadmin', 'manufacture'), firmMasterController.queryFirmMaster);
router.patch('/:id/set-default', auth('superadmin', 'manufacture'), firmMasterController.setDefaultFirm);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), firmMasterController.getFirmMasterById)

  .patch(auth('superadmin', 'manufacture'), firmMasterController.updateFirmMasterById)

  .delete(auth('superadmin', 'manufacture'), firmMasterController.deleteFirmMasterById);

module.exports = router;
