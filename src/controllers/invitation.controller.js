const httpStatus = require('http-status');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { invitationService } = require('../services');
const staticFolder = path.join(__dirname, '../');
const uploadsFolder = path.join(staticFolder, 'uploads');

const bulkUploadHandler = async (req, res) => {
  if (!req.file) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'No file uploaded' });
  }

  const invitations = [];
  const filePath = path.join(uploadsFolder, req.file.filename);

  try {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        invitations.push(row);
      })
      .on('end', async () => {
        try {
          const result = await invitationService.bulkUploadInvitations(invitations);
          res.status(httpStatus.CREATED).send(result);
        } catch (error) {
          throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
        }
      });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
  }
};

const createInvitation = catchAsync(async (req, res) => {
  const user = await invitationService.createInvitation(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryInvitation = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await invitationService.queryInvitation(filter, options);
  res.send(result);
});

const getInvitationById = catchAsync(async (req, res) => {
  const user = await invitationService.getUserByEmail(req.params.email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invitation not found');
  }
  res.send(user);
});

const updateInvitationById = catchAsync(async (req, res) => {
  const user = await invitationService.updateInvitationById(req.params.email, req.body);
  res.send(user);
});

const deleteInvitationById = catchAsync(async (req, res) => {
  await invitationService.deleteInvitationById(req.params.email);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createInvitation,
  queryInvitation,
  getInvitationById,
  updateInvitationById,
  deleteInvitationById,
  bulkUploadHandler,
};
