const express = require('express');
const { mtoRCreditNoteController } = require('../../../controllers');

const router = express.Router();

router.route('/array').post(mtoRCreditNoteController.arrayUpload);
router.route('/').post(mtoRCreditNoteController.createCreditNote).get(mtoRCreditNoteController.queryMtoRCreditNote);
router.route('/group').get(mtoRCreditNoteController.groupMtoRCreditNote);
router
  .route('/:id')
  .get(mtoRCreditNoteController.getMtoRCreditNoteById)
  .patch(mtoRCreditNoteController.updateMtoRCreditNoteById)
  .delete(mtoRCreditNoteController.deleteMtoRCreditNoteById);

  
module.exports = router;
