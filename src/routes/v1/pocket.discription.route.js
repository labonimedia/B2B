const express = require('express');
const auth = require('../../middlewares/auth');
const { pocketDiscriptionController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'),  pocketDiscriptionController.createPocketDiscription)
  .get(auth('superadmin', 'manufacture'),  pocketDiscriptionController.queryPocketDiscription);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), pocketDiscriptionController.getPocketDiscriptionById)
  .patch(auth('superadmin', 'manufacture'), pocketDiscriptionController.updatePocketDiscriptionById)
  .delete(auth('superadmin', 'manufacture'), pocketDiscriptionController.deletePocketDiscriptionById);

module.exports = router;

