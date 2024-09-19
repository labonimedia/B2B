const express = require('express');
const auth = require('../../middlewares/auth');
const { ethnicBottomsStyleController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), ethnicBottomsStyleController.createEthnicBottomsStyle)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), ethnicBottomsStyleController.queryEthnicBottomsStyle);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), ethnicBottomsStyleController.getEthnicBottomsStyleById)
  .patch(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    ethnicBottomsStyleController.updateEthnicBottomsStyleById
  )
  .delete(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    ethnicBottomsStyleController.deleteEthnicBottomsStyleById
  );

module.exports = router;
