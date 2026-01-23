const express = require('express');
const router = express.Router();
const auth = require('../../../middlewares/auth');
const { manufactureItemController } = require('../../../controllers');
const { commonUploadMiddleware } = require('../../../utils/upload');

const authRoles = auth('superadmin', 'manufacture', 'wholesaler', 'retailer');

const itemUpload = commonUploadMiddleware([
  { name: 'photo1', maxCount: 1 },
  { name: 'photo2', maxCount: 1 },
]);

router.post('/filter', authRoles, manufactureItemController.getItemsByCategorySubcategory);

router
  .route('/')
  .post(authRoles, itemUpload, manufactureItemController.createItem)
  .get(authRoles, manufactureItemController.getItems);

router
  .route('/:id')
  .get(authRoles, manufactureItemController.getItemById)
  .patch(authRoles, itemUpload, manufactureItemController.updateItemById)
  .delete(authRoles, manufactureItemController.deleteItemById);

module.exports = router;
