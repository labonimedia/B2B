const httpStatus = require('http-status');
const { manufactureDashboardCountsService } = require('../../services');

const getManufacturerPORetailerCounts = async (req, res) => {
  const { email, role } = req.query;
  const data = await manufactureDashboardCountsService.getManufacturerPORetailerCounts({
    email,
    role,
  });
  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
};

const getProductDashboardCounts = async (req, res) => {
  const { email, role } = req.query;
  const data =
    await manufactureDashboardCountsService.getProductDashboardCounts({
      email,
      role
    });

  res.status(httpStatus.OK).send({
    success: true,
    data
  });
};

module.exports = {
   getManufacturerPORetailerCounts,
    getProductDashboardCounts,
   };
