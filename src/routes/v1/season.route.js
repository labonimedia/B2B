const express = require('express');
const auth = require('../../middlewares/auth');
const { seasonController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'), seasonController.createSeason)
  .get(auth('superadmin', 'manufacture'), seasonController.querySeason);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), seasonController.getSeasonById)
  .patch(auth('superadmin', 'manufacture'), seasonController.updateSeasonById)
  .delete(auth('superadmin', 'manufacture'), seasonController.deleteSeasonById);

module.exports = router;
