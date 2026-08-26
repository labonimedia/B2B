const express = require('express');
// const validate = require('../../middlewares/validate');
// const auth = require('../../middlewares/auth');
const { weaverManufactureController } =  require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(
    weaverManufactureController.createWeaverManufacture
  )
  .get(
    weaverManufactureController.queryWeaverManufacture
  );

router
  .route('/:id')
  .get(
    weaverManufactureController.getWeaverManufactureById
  )
  .delete(
    weaverManufactureController.deleteWeaverManufactureById
  );

router
  .route('/email/:email')
  .get(
    weaverManufactureController.getWeaverManufactureByEmail
  )
  .patch(
    weaverManufactureController.updateWeaverManufactureById
  )
  .delete(
    weaverManufactureController.deleteWeaverManufactureByEmail
  );

router
  .route('/:id/upload')
  .patch(
    weaverManufactureController.fileUpload
  );

router
  .route('/:id/visibility')
  .patch(
    weaverManufactureController.updateVisibilitySettings
  );

router
  .route('/:id/profile')
  .get(
    weaverManufactureController.getVisibleProfile
  );

router
  .route('/ref-email')
  .get(
    weaverManufactureController.getWeaverManufactureByRefEmail
  );

module.exports = router;