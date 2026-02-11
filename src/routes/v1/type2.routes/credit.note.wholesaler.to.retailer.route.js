const express = require('express');
const { wtoRCreditNoteController } = require('../../../controllers');

const router = express.Router();

router.route('/bulk-update').post(wtoRCreditNoteController.bulkUpdateCreditNotes);
router.route('/group').get(wtoRCreditNoteController.groupW2RCreditNote);
router.route('/array').post(wtoRCreditNoteController.arrayUpload);
router.route('/').post(wtoRCreditNoteController.createCreditNote).get(wtoRCreditNoteController.queryW2RCreditNote);
router
  .route('/:id')
  .get(wtoRCreditNoteController.getW2RCreditNoteById)
  .patch(wtoRCreditNoteController.updateW2RCreditNoteById)
  .delete(wtoRCreditNoteController.deleteW2RCreditNoteById);

module.exports = router;
