const express = require('express');
const auth = require('../../../middlewares/auth');
const { manufactureBOMController } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('manufacture', 'superadmin'), manufactureBOMController.createBOM)
  .get(auth('manufacture', 'superadmin'), manufactureBOMController.getBOMs);
router.post('/search', auth('manufacture', 'superadmin'), manufactureBOMController.searchBOM);
router.get('/by-design', auth('manufacture', 'superadmin'), manufactureBOMController.getBOMByDesign);
router
  .route('/:id')
  .get(auth('manufacture', 'superadmin'), manufactureBOMController.getBOMById)
  .patch(auth('manufacture', 'superadmin'), manufactureBOMController.updateBOMById)
  .delete(auth('manufacture', 'superadmin'), manufactureBOMController.deleteBOMById);

module.exports = router;
