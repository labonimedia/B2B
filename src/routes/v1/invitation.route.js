const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../../middlewares/auth');
const { invitationController } = require('../../controllers');

const staticFolder = path.join(__dirname, '../../');
const uploadsFolder = path.join(staticFolder, 'uploads');

const router = express.Router();

const upload = multer({ dest: uploadsFolder });

router.post('/bulk-upload', auth('superadmin', 'manufacture'), upload.single('file'), invitationController.bulkUploadFile);

router.post('/array-upload', auth('superadmin', 'manufacture'), invitationController.arrayInvitations);

router
  .route('/')
  .post(auth('superadmin', 'manufacture'), invitationController.createInvitation)
  .get(auth('superadmin', 'manufacture'), invitationController.queryInvitation);

router
  .route('/:email')
  .get(invitationController.getInvitationById)
  .patch(auth('superadmin', 'manufacture'), invitationController.updateInvitationById)
  .delete(auth('superadmin', 'manufacture'), invitationController.deleteInvitationById);

module.exports = router;
