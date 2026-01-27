const httpStatus = require('http-status');
const { manufactureDashboardCountsService } = require('../../services');

const manufacturerDashboard = async (req, res) => {
  const { email, role } = req.query;
  const data = await manufactureDashboardCountsService.getManufacturerDashboardCounts({
    email,
    role,
  });
  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
};

module.exports = { manufacturerDashboard };
