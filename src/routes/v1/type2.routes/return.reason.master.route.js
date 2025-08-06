const express = require('express');
const { returnReasonController } = require('../../../controllers');

const router = express.Router();

router
  .route('/array')
  .post(returnReasonController.arrayUpload)
  .get(returnReasonController.queryReturnReason);

router
  .route('/:id')
  .get( returnReasonController.getReturnReasonById)
  .patch( returnReasonController.updateReturnReasonById)
  .delete( returnReasonController.deleteReturnReasonById);

module.exports = router;
