const express = require('express');
const auth = require('../../middlewares/auth');
const { menStandardSizeController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'),  menStandardSizeController.createMenStandardSize)
  .get(auth('superadmin', 'manufacture'),  menStandardSizeController.queryMenStandardSize);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), menStandardSizeController.getMenStandardSizeById)
  .patch(auth('superadmin', 'manufacture'), menStandardSizeController.updateMenStandardSizeById)
  .delete(auth('superadmin', 'manufacture'), menStandardSizeController.deleteMenStandardSizeById);

module.exports = router;

