const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { wholesalerDashboardService } = require('../../services');

const wholesalerDashboardCountsController = catchAsync(async (req, res) => {
  const { role, email } = req.params;
  const result = await wholesalerDashboardService.wholesalerDashboardCountsService(role, email);
  res.status(httpStatus.OK).json({
    success: true,
    role,
    data: result,
  });
});

module.exports = {
  wholesalerDashboardCountsController,
};
