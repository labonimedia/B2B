const express = require('express');
const auth = require('../../middlewares/auth');
const { clothingMensController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer'), clothingMensController.createClothingMens)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer'), clothingMensController.queryClothingMens);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer'), clothingMensController.getClothingMensById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer'), clothingMensController.updateClothingMensById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer'), clothingMensController.deleteClothingMensById);

module.exports = router;
