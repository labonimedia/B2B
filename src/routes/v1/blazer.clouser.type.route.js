const express = require('express');
const auth = require('../../middlewares/auth');
const { blazerClouserTypeController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), blazerClouserTypeController.createBlazerClouserType)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), blazerClouserTypeController.queryBlazerClouserType);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), blazerClouserTypeController.getBlazerClouserTypeById)
  .patch(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    blazerClouserTypeController.updateBlazerClouserTypeById
  )
  .delete(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    blazerClouserTypeController.deleteBlazerClouserTypeById
  );

module.exports = router;
