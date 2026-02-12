const express = require('express');
const auth = require('../../../middlewares/auth');
const { mtoWCreditNoteController } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('manufacture'), mtoWCreditNoteController.createCreditNote)
  .get(auth('superadmin', 'manufacture', 'wholesaler'), mtoWCreditNoteController.queryCreditNotes);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler'), mtoWCreditNoteController.getCreditNoteById)
  .delete(auth('manufacture'), mtoWCreditNoteController.deleteCreditNote);

module.exports = router;
