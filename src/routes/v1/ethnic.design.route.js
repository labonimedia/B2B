const express = require('express');
const auth = require('../../middlewares/auth');
const { ethnicDesignController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), ethnicDesignController.createEthnicDesign)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), ethnicDesignController.queryEthnicDesign);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), ethnicDesignController.getEthnicDesignById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), ethnicDesignController.updateEthnicDesignById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), ethnicDesignController.deleteEthnicDesignById);

module.exports = router;
