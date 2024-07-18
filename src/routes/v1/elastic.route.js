const express = require('express');
const auth = require('../../middlewares/auth');
const { elasticController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'),  elasticController.createElastic)
  .get(auth('superadmin', 'manufacture'),  elasticController.queryElastic);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), elasticController.getElasticById)
  .patch(auth('superadmin', 'manufacture'), elasticController.updateElasticById)
  .delete(auth('superadmin', 'manufacture'), elasticController.deleteElasticById);

module.exports = router;

