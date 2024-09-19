const express = require('express');
const auth = require('../../middlewares/auth');
const { apparelSilhouetteController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), apparelSilhouetteController.createApparelSilhouette)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), apparelSilhouetteController.queryApparelSilhouette);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), apparelSilhouetteController.getApparelSilhouetteById)
  .patch(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    apparelSilhouetteController.updateApparelSilhouetteById
  )
  .delete(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    apparelSilhouetteController.deleteApparelSilhouetteById
  );

module.exports = router;
