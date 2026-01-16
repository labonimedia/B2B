// // const express = require('express');
// // const auth = require('../../../middlewares/auth');
// // const router = express.Router();
// // const { manufactureItemController } = require('../../../controllers');

// // // Create + List Items
// // router
// //   .route('/')
// //   .post(
// //     auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
// //     manufactureItemController.createItem
// //   )
// //   .get(
// //     auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
// //     manufactureItemController.getItems
// //   );

// // // Get / Update / Delete Item by ID
// // router
// //   .route('/:id')
// //   .get(
// //     auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
// //     manufactureItemController.getItemById
// //   )
// //   .patch(
// //     auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
// //     manufactureItemController.updateItemById
// //   )
// //   .delete(
// //     auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
// //     manufactureItemController.deleteItemById
// //   );

// // module.exports = router;

// const express = require('express');
// const auth = require('../../../middlewares/auth');
// const router = express.Router();

// const { manufactureItemController } = require('../../../controllers');
// const { commonUploadMiddleware } = require('../../../utils/upload');

// // CREATE ITEM + UPLOAD PHOTOS
// router
//   .route('/')
//   .post(
//     auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
//     commonUploadMiddleware([
//       { name: 'photo1', maxCount: 1 },
//       { name: 'photo2', maxCount: 1 },
//     ]),
//     manufactureItemController.createItem
//   )
//   .get(
//     auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
//     manufactureItemController.getItems
//   );

// // UPDATE ITEM + UPLOAD PHOTOS
// router
//   .route('/:id')
//   .get(
//     auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
//     manufactureItemController.getItemById
//   )
//   .patch(
//     auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
//     commonUploadMiddleware([
//       { name: 'photo1', maxCount: 1 },
//       { name: 'photo2', maxCount: 1 },
//     ]),
//     manufactureItemController.updateItemById
//   )
//   .delete(
//     auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
//     manufactureItemController.deleteItemById
//   );
  
// router.post(
//   '/filter',
//   auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
//   manufactureItemController.getItemsByCategorySubcategory
// );
// module.exports = router;
const express = require('express');
const router = express.Router();

const auth = require('../../../middlewares/auth');
const { manufactureItemController } = require('../../../controllers');
const { commonUploadMiddleware } = require('../../../utils/upload');

/**
 * Common Middlewares
 */
const authRoles = auth(
  'superadmin',
  'manufacture',
  'wholesaler',
  'retailer'
);

const itemUpload = commonUploadMiddleware([
  { name: 'photo1', maxCount: 1 },
  { name: 'photo2', maxCount: 1 },
]);

/**
 * Custom Routes (Always above :id)
 */
router.post(
  '/filter',
  authRoles,
  manufactureItemController.getItemsByCategorySubcategory
);

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
