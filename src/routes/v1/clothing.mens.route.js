const express = require('express');
const auth = require('../../middlewares/auth');
const { clothingMensController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'),  clothingMensController.createClothingMens)
  .get(auth('superadmin', 'manufacture'),  clothingMensController.queryClothingMens);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), clothingMensController.getClothingMensById)
  .patch(auth('superadmin', 'manufacture'), clothingMensController.updateClothingMensById)
  .delete(auth('superadmin', 'manufacture'), clothingMensController.deleteClothingMensById);

module.exports = router;

