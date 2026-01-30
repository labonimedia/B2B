// const httpStatus = require('http-status');
// const catchAsync = require('../../utils/catchAsync');
// const { manufactureDashboardCountsService } = require('../../services');

// const getManufacturerPORetailerCounts = async (req, res) => {
//   const { email, role } = req.query;
//   const data = await manufactureDashboardCountsService.getManufacturerPORetailerCounts({
//     email,
//     role,
//   });
//   res.status(httpStatus.OK).send({
//     success: true,
//     data,
//   });
// };

// const getProductDashboardCounts = async (req, res) => {
//   const { email, role } = req.query;
//   const data = await manufactureDashboardCountsService.getProductDashboardCounts({
//     email,
//     role,
//   });

//   res.status(httpStatus.OK).send({
//     success: true,
//     data,
//   });
// };

// const getPerformaInvoiceDashboardCounts = async (req, res) => {
//   const { email, role } = req.query;

//   const data = await manufactureDashboardCountsService.getPerformaInvoiceDashboardCounts({
//     email,
//     role,
//   });

//   res.status(httpStatus.OK).send({
//     success: true,
//     data,
//   });
// };

// const getReturnDashboardCounts = async (req, res) => {
//   const { email, role } = req.query;

//   const data = await manufactureDashboardCountsService.getReturnDashboardCounts({
//     email,
//     role,
//   });

//   res.status(httpStatus.OK).send({
//     success: true,
//     data,
//   });
// };

// const getCreditNoteDashboardCounts = async (req, res) => {
//   const { email, role } = req.query;

//   const data = await manufactureDashboardCountsService.getCreditNoteDashboardCounts({
//     email,
//     role,
//   });

//   res.status(httpStatus.OK).send({
//     success: true,
//     data,
//   });
// };

// const getReferredUsersDashboardCounts = async (req, res) => {
//   const { refByEmail } = req.query;

//   const data = await manufactureDashboardCountsService.getReferredUsersDashboardCounts(refByEmail);

//   res.status(httpStatus.OK).send({
//     success: true,
//     data,
//   });
// };

// const getRequestDashboardCounts = async (req, res) => {
//   const { email, role } = req.query;

//   const data = await manufactureDashboardCountsService.getRequestDashboardCounts({
//     email,
//     role,
//   });

//   res.status(httpStatus.OK).send({
//     success: true,
//     data,
//   });
// };

// const getInvitationDashboardCounts = async (req, res) => {
//   const { email } = req.query;

//   const data = await manufactureDashboardCountsService.getInvitationDashboardCounts(email);

//   res.status(httpStatus.OK).send({
//     success: true,
//     data,
//   });
// };

// const getCategoryDashboardCounts = async (req, res) => {
//   const { manufacturerEmail } = req.query;

//   const data = await manufactureDashboardCountsService.getCategoryDashboardCounts(manufacturerEmail);

//   res.status(httpStatus.OK).send({
//     success: true,
//     data,
//   });
// };

// const getDashboardOverview = async (req, res) => {
//   const { email, role } = req.query;

//   const data = await manufactureDashboardCountsService.getDashboardOverview({
//     email,
//     role,
//   });

//   res.status(httpStatus.OK).send({
//     success: true,
//     data,
//   });
// };

// const getInventoryLowStockDashboardCounts = catchAsync(async (req, res) => {
//   const email = req.query;
//   const inventoryAlerts = await manufactureDashboardCountsService.getInventoryLowStockCounts(email);
//   res.status(httpStatus.OK).send({
//     success: true,
//     data: {
//       inventoryAlerts,
//     },
//   });
// });

// module.exports = {
//   getManufacturerPORetailerCounts,
//   getProductDashboardCounts,
//   getPerformaInvoiceDashboardCounts,
//   getReturnDashboardCounts,
//   getCreditNoteDashboardCounts,
//   getReferredUsersDashboardCounts,
//   getRequestDashboardCounts,
//   getInvitationDashboardCounts,
//   getCategoryDashboardCounts,
//   getDashboardOverview,
//   getInventoryLowStockDashboardCounts,
// };
const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { manufactureDashboardCountsService } = require('../../services');

const getManufacturerPORetailerCounts = catchAsync(async (req, res) => {
  const { email, role } = req.query;
  const data = await manufactureDashboardCountsService.getManufacturerPORetailerCounts({
    email,
    role,
  });
  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
});

const getProductDashboardCounts = catchAsync(async (req, res) => {
  const { email, role } = req.query;
  const data = await manufactureDashboardCountsService.getProductDashboardCounts({
    email,
    role,
  });
  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
});

const getPerformaInvoiceDashboardCounts = catchAsync(async (req, res) => {
  const { email, role } = req.query;
  const data = await manufactureDashboardCountsService.getPerformaInvoiceDashboardCounts({
    email,
    role,
  });
  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
});

const getReturnDashboardCounts = catchAsync(async (req, res) => {
  const { email, role } = req.query;
  const data = await manufactureDashboardCountsService.getReturnDashboardCounts({
    email,
    role,
  });
  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
});

const getCreditNoteDashboardCounts = catchAsync(async (req, res) => {
  const { email, role } = req.query;
  const data = await manufactureDashboardCountsService.getCreditNoteDashboardCounts({
    email,
    role,
  });
  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
});

const getReferredUsersDashboardCounts = catchAsync(async (req, res) => {
  const { refByEmail } = req.query;
  const data = await manufactureDashboardCountsService.getReferredUsersDashboardCounts(refByEmail);
  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
});

const getRequestDashboardCounts = catchAsync(async (req, res) => {
  const { email, role } = req.query;
  const data = await manufactureDashboardCountsService.getRequestDashboardCounts({
    email,
    role,
  });
  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
});

const getInvitationDashboardCounts = catchAsync(async (req, res) => {
  const { email } = req.query;
  const data = await manufactureDashboardCountsService.getInvitationDashboardCounts(email);
  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
});

const getCategoryDashboardCounts = catchAsync(async (req, res) => {
  const { manufacturerEmail } = req.query;
  const data = await manufactureDashboardCountsService.getCategoryDashboardCounts(manufacturerEmail);
  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
});


const getInventoryLowStockDashboardCounts = catchAsync(async (req, res) => {
  const { email } = req.query;
  const inventoryAlerts =
    await manufactureDashboardCountsService.getInventoryLowStockCounts(email);
  res.status(httpStatus.OK).send({
    success: true,
    data: {
      inventoryAlerts,
    },
  });
});

const getDashboardOverview = catchAsync(async (req, res) => {
  const { email, role } = req.query;

  const data = await manufactureDashboardCountsService.getDashboardOverview({
    email,
    role,
  });

  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
});

module.exports = {
  getManufacturerPORetailerCounts,
  getProductDashboardCounts,
  getPerformaInvoiceDashboardCounts,
  getReturnDashboardCounts,
  getCreditNoteDashboardCounts,
  getReferredUsersDashboardCounts,
  getRequestDashboardCounts,
  getInvitationDashboardCounts,
  getCategoryDashboardCounts,
  getInventoryLowStockDashboardCounts,
  getDashboardOverview,
};
