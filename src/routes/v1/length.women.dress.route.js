const express = require('express');
const auth = require('../../middlewares/auth');
const { lenthWomenDressController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'),  lenthWomenDressController.createLenthWomenDress)
  .get(auth('superadmin', 'manufacture'),  lenthWomenDressController.queryLenthWomenDress);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), lenthWomenDressController.getLenthWomenDressById)
  .patch(auth('superadmin', 'manufacture'), lenthWomenDressController.updateLenthWomenDressById)
  .delete(auth('superadmin', 'manufacture'), lenthWomenDressController.deleteLenthWomenDressById);

module.exports = router;

