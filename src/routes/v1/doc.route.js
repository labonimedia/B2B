const express = require('express');
const auth = require('../../middlewares/auth');
const { docController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'), docController.createDoc)
  .get(auth('superadmin', 'manufacture'), docController.queryDoc);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), docController.getDocById)
  .patch(auth('superadmin', 'manufacture'), docController.updateDocById)
  .delete(auth('superadmin', 'manufacture'), docController.deleteDocById);

module.exports = router;
