const express = require('express');
const auth = require('../../middlewares/auth');
const { occasionController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'),  occasionController.createOccasion)
  .get(auth('superadmin', 'manufacture'),  occasionController.queryOccasion);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), occasionController.getOccasionById)
  .patch(auth('superadmin', 'manufacture'), occasionController.updateOccasionById)
  .delete(auth('superadmin', 'manufacture'), occasionController.deleteOccasionById);

module.exports = router;

