// const express = require('express');
// const auth = require('../../../middlewares/auth');
// const { mtoWCreditNoteController } = require('../../../controllers');

// const router = express.Router();

// router
//   .route('/')
//   .post(auth('manufacture'), mtoWCreditNoteController.createCreditNote)
//   .get(auth('superadmin', 'manufacture', 'wholesaler'), mtoWCreditNoteController.queryCreditNotes);

// router
//   .route('/:id')
//   .get(auth('superadmin', 'manufacture', 'wholesaler'), mtoWCreditNoteController.getCreditNoteById)
//   .delete(auth('manufacture'), mtoWCreditNoteController.deleteCreditNote);

// module.exports = router;

const express = require('express');
const auth = require('../../../middlewares/auth');
const { mtoWCreditNoteController } = require('../../../controllers');

const router = express.Router();

router.route('/array').post(auth('manufacture'), mtoWCreditNoteController.arrayUpload);
router
  .route('/')
  .post(auth('manufacture'), mtoWCreditNoteController.createCreditNote)
  .get(auth('superadmin', 'manufacture', 'wholesaler'), mtoWCreditNoteController.queryCreditNotes);

router.route('/group').get(auth('superadmin', 'manufacture', 'wholesaler'), mtoWCreditNoteController.groupCreditNotes);

router.route('/bulk-update').post(auth('manufacture'), mtoWCreditNoteController.bulkUpdateCreditNotes);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler'), mtoWCreditNoteController.getCreditNoteById)
  .patch(auth('manufacture'), mtoWCreditNoteController.updateCreditNote)
  .delete(auth('manufacture'), mtoWCreditNoteController.deleteCreditNote);

module.exports = router;
