const express = require('express');
const auth = require('../../middlewares/auth');
const { stateController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), stateController.createState)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), stateController.queryState);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), stateController.getStateById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), stateController.updateStateById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), stateController.deleteStateById);
router
  .route('/searchby/country')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), stateController.getState);
module.exports = router;
