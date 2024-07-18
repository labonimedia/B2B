const express = require('express');
const auth = require('../../middlewares/auth');
const { lifestyleController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'), lifestyleController.createLifestyle)
  .get(auth('superadmin', 'manufacture'), lifestyleController.queryLifestyle);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), lifestyleController.getLifestyleById)
  .patch(auth('superadmin', 'manufacture'), lifestyleController.updateLifestyleById)
  .delete(auth('superadmin', 'manufacture'), lifestyleController.deleteLifestyleById);

module.exports = router;
