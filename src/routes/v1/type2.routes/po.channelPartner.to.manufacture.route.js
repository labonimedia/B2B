const express = require('express');
const auth = require('../../../middlewares/auth');
const { cpToManufacturerPOController } = require('../../../controllers');

const router = express.Router();

/**
 * 🔥 EXISTING ROUTES (UNCHANGED)
 */
router.post(
  '/create',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer', 'shopKeeper'),
  cpToManufacturerPOController.createPO
);

router.get(
  '/',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer', 'shopKeeper'),
  cpToManufacturerPOController.getPOList
);

router.get(
  '/:id',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer', 'shopKeeper'),
  cpToManufacturerPOController.getPO
);

router.patch(
  '/:id/status',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer', 'shopKeeper'),
  cpToManufacturerPOController.updateStatus
);

router.delete(
  '/:id',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer', 'shopKeeper'),
  cpToManufacturerPOController.deletePO
);

/**
 * 🔥 NEW ROUTES (ADDED)
 */

// pagination + filter
router.get(
  '/list/all',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer', 'shopKeeper'),
  cpToManufacturerPOController.getAllPO
);

// manufacturer wise
router.get(
  '/manufacture/:manufacturerEmail',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer', 'shopKeeper'),
  cpToManufacturerPOController.getPOByManufacture
);

// update items
router.patch(
  '/update-po-data/:poId',
  auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer', 'shopKeeper'),
  cpToManufacturerPOController.updatePOItems
);

module.exports = router;
