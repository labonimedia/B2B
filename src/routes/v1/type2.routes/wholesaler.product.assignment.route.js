const express = require('express');
const auth = require('../../../middlewares/auth');
const { wholesalerProductAssignmentController } = require('../../../controllers');

const router = express.Router();

router.post(
  '/assign-multiple',
  auth('superadmin', 'manufacture', 'wholesaler'),
  wholesalerProductAssignmentController.assignProductsToMultipleWholesalers
);

router.post('/assign', auth('manufacture'), wholesalerProductAssignmentController.assignProductsToWholesaler);

router.get('/', auth('superadmin', 'manufacture', 'wholesaler'), wholesalerProductAssignmentController.getAssignments);

router.get('/:id', auth('superadmin', 'manufacture', 'wholesaler'), wholesalerProductAssignmentController.getAssignment);

router.delete('/remove', auth('manufacture'), wholesalerProductAssignmentController.removeAssignment);

router.patch('/:id/status', auth('manufacture'), wholesalerProductAssignmentController.toggleAssignmentStatus);

module.exports = router;
