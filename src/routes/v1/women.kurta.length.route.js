const express = require('express');
const auth = require('../../middlewares/auth');
const { womenKurtaLengthController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), womenKurtaLengthController.createWomenKurtaLength)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), womenKurtaLengthController.queryWomenKurtaLength);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), womenKurtaLengthController.getWomenKurtaLengthById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), womenKurtaLengthController.updateWomenKurtaLengthById)
  .delete(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    womenKurtaLengthController.deleteWomenKurtaLengthById
  );

module.exports = router;
