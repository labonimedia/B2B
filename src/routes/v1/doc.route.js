const express = require('express');
const auth = require('../../middlewares/auth');
const { docController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'weaverManufacture'), docController.createDoc)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'weaverManufacture'), docController.queryDoc);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'weaverManufacture'), docController.getDocById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'weaverManufacture'), docController.updateDocById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'weaverManufacture'), docController.deleteDocById);

module.exports = router;
