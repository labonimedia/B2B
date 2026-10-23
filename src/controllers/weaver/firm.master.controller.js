const httpStatus = require('http-status');

const catchAsync = require('../../utils/catchAsync');

const pick = require('../../utils/pick');

const { firmMasterService } = require('../../services');

const createFirmMaster = catchAsync(async (req, res) => {
  const firm = await firmMasterService.createFirmMaster(req.body, req.user);

  res.status(httpStatus.CREATED).send(firm);
});

const queryFirmMaster = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['firmName', 'firmCode', 'gstNo', 'panNo', 'stateName', 'city', 'isActive']);

  // Only show current user's firms
  filter.userId = req.user._id;

  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await firmMasterService.queryFirmMaster(filter, options);

  res.send(result);
});

const searchFirmMaster = catchAsync(async (req, res) => {
  const filter = pick(req.body, ['search', 'firmName', 'firmCode', 'gstNo', 'panNo', 'stateName', 'city', 'isActive']);

  filter.userId = req.user._id;

  const options = pick(req.body, ['sortBy', 'limit', 'page']);

  const result = await firmMasterService.searchFirmMaster(filter, options);

  res.send(result);
});

const getFirmMasterById = catchAsync(async (req, res) => {
  const firm = await firmMasterService.getFirmMasterById(req.params.id);

  res.send(firm);
});

const updateFirmMasterById = catchAsync(async (req, res) => {
  const firm = await firmMasterService.updateFirmMasterById(req.params.id, req.body);

  res.send(firm);
});

const deleteFirmMasterById = catchAsync(async (req, res) => {
  await firmMasterService.deleteFirmMasterById(req.params.id);

  res.status(httpStatus.NO_CONTENT).send();
});

const setDefaultFirm = catchAsync(async (req, res) => {
  const firm = await firmMasterService.setDefaultFirm(req.params.id, req.user._id);

  res.send(firm);
});

const getDefaultFirm = catchAsync(async (req, res) => {
  const firm = await firmMasterService.getDefaultFirm(req.user._id);

  res.send(firm);
});

module.exports = {
  createFirmMaster,
  queryFirmMaster,
  searchFirmMaster,
  getFirmMasterById,
  updateFirmMasterById,
  deleteFirmMasterById,
  setDefaultFirm,
  getDefaultFirm,
};
