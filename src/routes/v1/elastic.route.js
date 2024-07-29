const express = require('express');
const auth = require('../../middlewares/auth');
const { elasticController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer'), elasticController.createElastic)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer'), elasticController.queryElastic);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer'), elasticController.getElasticById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer'), elasticController.updateElasticById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer'), elasticController.deleteElasticById);

module.exports = router;
