const express = require('express');
const auth = require('../../middlewares/auth');
const { mappingController } = require('../../controllers');

const router = express.Router();

router
  .route('/filter-subcategory')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), mappingController.getMappingByQuery);
router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), mappingController.createMapping)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), mappingController.queryMapping);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), mappingController.getMappingById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), mappingController.updateMappingById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), mappingController.deleteMappingById);

module.exports = router;

// {{B2B}}mapping?productType=Clothing&gender=Men&category=T-shirts %26 Polos&subCategory=T-Shirts

// {{B2B}}mapping?productType=Clothing&gender=Men&category=T-shirts %26 Polos&subCategory=T-Shirt

// {{B2B}}mapping?productType=Clothing&gender=Men&category=T-shirts%20&%20Polos&subCategory=Polos
