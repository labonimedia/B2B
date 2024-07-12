const express = require('express');
const auth = require('../../middlewares/auth');
const { invitationController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'),  invitationController.createInvitation)
  .get(auth('superadmin', 'manufacture'),  invitationController.queryInvitation);

router
  .route('/:Id')
  .get(auth('superadmin', 'manufacture'), invitationController.getInvitationById)
  .patch(auth('superadmin', 'manufacture'), invitationController.updateInvitationById)
  .delete(auth('superadmin', 'manufacture'), invitationController.deleteInvitationById);

module.exports = router;

