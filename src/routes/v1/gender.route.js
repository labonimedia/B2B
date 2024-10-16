const express = require('express');
const auth = require('../../middlewares/auth');
const { genderController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), genderController.createGender)
  .get(genderController.queryGender);

router
  .route('/:id')
  .get(genderController.getGenderById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), genderController.updateGenderById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), genderController.deleteGenderById);

module.exports = router;
