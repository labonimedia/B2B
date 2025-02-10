const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../../middlewares/auth');
const { invitationController } = require('../../controllers');

const staticFolder = path.join(__dirname, '../../');
const uploadsFolder = path.join(staticFolder, 'uploads');

const router = express.Router();

const upload = multer({ dest: uploadsFolder });
router.post(
  '/bulk-upload',
  auth('superadmin', 'manufacture', 'wholesaler'),
  upload.single('file'),
  invitationController.bulkUploadFile
);
router.post('/array-upload', auth('superadmin', 'manufacture', 'wholesaler'), invitationController.arrayInvitations);

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler'), invitationController.createInvitation)
  .get(invitationController.queryInvitation); // auth('superadmin', 'manufacture', 'wholesaler'),

router
  .route('/:email')
  .get(invitationController.getInvitationById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler'), invitationController.updateInvitationById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler'), invitationController.deleteInvitationById);

router
  .route('/re-invitation/:email')
  .get(auth('superadmin', 'manufacture', 'wholesaler'), invitationController.sendReInvitation);

router
  .route('/bulk/re-invitation/array')
  .post(auth('superadmin', 'manufacture', 'wholesaler'), invitationController.sendReInvitationBulk);
module.exports = router;
