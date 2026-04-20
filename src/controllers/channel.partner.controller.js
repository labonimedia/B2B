const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { channelPartnerService } = require('../services');

const registerChannelPartner = catchAsync(async (req, res) => {
    const body = {
    ...req.body,
    file: req.files?.file,
    profileImg: req.files?.profileImg,
  };
  const result = await channelPartnerService.registerChannelPartner(body);

  res.status(httpStatus.CREATED).send(result);
});

const createByManufacturer = catchAsync(async (req, res) => {
  const manufacturer = req.user;
  const body = {
    ...req.body,
    file: req.files?.file,
    profileImg: req.files?.profileImg,
  };

  const result = await channelPartnerService.createByManufacturer(
    body,
   manufacturer
  );
  res.status(201).send(result);
});
 
const getAllChannelPartners = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    'status',
    'city',
    'state',
    'country',
    'email',
    'mobNumber',
    'companyName',
    'fullName',
    'role',
    'retailer',
    'invitedBy',
    'userCode',
    'leagalStatusOfFirm',
    'referralCode',
  ]);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await channelPartnerService.queryChannelPartners(filter, options);
  res.send(result);
});

const getChannelPartnerByEmail = catchAsync(async (req, res) => {
  const cp = await channelPartnerService.getByEmail(req.params.email);
  if (!cp) throw new ApiError(httpStatus.NOT_FOUND, 'Channel Partner not found');
  res.send(cp);
});

const updateChannelPartner = catchAsync(async (req, res) => {
  const cp = await channelPartnerService.updateByEmail(req.params.email, req.body);
  res.send(cp);
});

const deleteChannelPartner = catchAsync(async (req, res) => {
  await channelPartnerService.deleteByEmail(req.params.email);
  res.status(httpStatus.NO_CONTENT).send();
});

const addRetailer = catchAsync(async (req, res) => {
  const cp = await channelPartnerService.addRetailer(req.user.email, req.body);
  res.send(cp);
});

const getRetailers = catchAsync(async (req, res) => {
  const retailers = await channelPartnerService.getRetailers(req.user.email);
  res.send(retailers);
});

const linkManufacturer = catchAsync(async (req, res) => {
  const result = await channelPartnerService.linkManufacturer(req.body, req.user);
  res.send(result);
});

const assignCommission = catchAsync(async (req, res) => {
  const { email, id, commissionGivenBy, category, productCommission, shippingCommission } = req.body;

  const result = await channelPartnerService.assignOrUpdateCommission(
    email,
    id,
    commissionGivenBy,
    category,
    productCommission,
    shippingCommission
  );

  res.status(httpStatus.OK).send({
    success: true,
    message: 'Commission assigned successfully',
    data: result,
  });
});

const getCommissionByGivenBy = catchAsync(async (req, res) => {
  const { channelPartnerId, commissionGivenBy } = req.params;

  const result = await channelPartnerService.getCommissionByGivenBy(channelPartnerId, commissionGivenBy);

  res.status(httpStatus.OK).send({
    success: true,
    data: result,
  });
});

const getCPByManufacturer = catchAsync(async (req, res) => {
  const {
    manufacturerEmail,
    limit = 10,
    page = 1,
    search,
    status,
    isApproved,
  } = req.body;

  // ✅ fallback (logged-in manufacturer)
  const finalManufacturerEmail =
    manufacturerEmail || req.user.email;

  const filter = {
    'linkedManufacturers.manufacturerEmail': finalManufacturerEmail,
  };

  // ✅ Optional filters
  if (status) {
    filter.status = status;
  }

  if (typeof isApproved === 'boolean') {
    filter['linkedManufacturers.isApproved'] = isApproved;
  }

  // 🔍 Search
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { companyName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const options = {
    limit: parseInt(limit, 10),
    page: parseInt(page, 10),
    sortBy: 'createdAt:desc',
  };

  const result = await channelPartnerService.getCPByManufacturer(
    filter,
    options,
    finalManufacturerEmail
  );

  res.status(httpStatus.OK).send(result);
});

const linkChannelPartner = catchAsync(async (req, res) => {
  const manufacturer = req.user;
  const { cpEmail } = req.body;

  const result = await channelPartnerService.linkChannelPartner(
    cpEmail,
    manufacturer
  );

  res.status(httpStatus.OK).send(result);
});

// ✅ UNLINK CP
const unlinkChannelPartner = catchAsync(async (req, res) => {
  const manufacturer = req.user;
  const { cpEmail } = req.body;

  const result = await channelPartnerService.unlinkChannelPartner(
    cpEmail,
    manufacturer
  );

  res.status(httpStatus.OK).send(result);
});

const globalSearchCP = catchAsync(async (req, res) => {
  const {
    search,
    limit = 10,
    page = 1,
    excludeLinked = true, // optional
  } = req.body;

  const manufacturer = req.user;

  const filter = {};

  // 🔍 Search logic
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { companyName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { mobNumber: { $regex: search, $options: 'i' } },
      { city: { $regex: search, $options: 'i' } },
      { state: { $regex: search, $options: 'i' } },
    ];
  }

  const options = {
    limit: parseInt(limit, 10),
    page: parseInt(page, 10),
    sortBy: 'createdAt:desc',
  };

  const result = await channelPartnerService.globalSearchCP(
    filter,
    options,
    manufacturer,
    excludeLinked
  );

  res.status(200).send(result);
});

module.exports = {
  registerChannelPartner,
  getAllChannelPartners,
  getChannelPartnerByEmail,
  updateChannelPartner,
  deleteChannelPartner,
  addRetailer,
  getRetailers,
  linkManufacturer,
  getCommissionByGivenBy,
  assignCommission,
  createByManufacturer,
  getCPByManufacturer,
  linkChannelPartner,
  unlinkChannelPartner,
  globalSearchCP,
};
