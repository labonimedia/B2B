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
  const data = await manufactureDashboardCountsService.getProductDashboardCounts({
    email,
    role,
  });

  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
};

const getPerformaInvoiceDashboardCounts = async (req, res) => {
  const { email, role } = req.query;

  const data = await manufactureDashboardCountsService.getPerformaInvoiceDashboardCounts({
    email,
    role,
  });

  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
};

const getReturnDashboardCounts = async (req, res) => {
  const { email, role } = req.query;

  const data = await manufactureDashboardCountsService.getReturnDashboardCounts({
    email,
    role,
  });

  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
};

const getCreditNoteDashboardCounts = async (req, res) => {
  const { email, role } = req.query;

  const data = await manufactureDashboardCountsService.getCreditNoteDashboardCounts({
    email,
    role,
  });

  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
};

const getReferredUsersDashboardCounts = async (req, res) => {
  const { refByEmail } = req.query;

  const data =
    await manufactureDashboardCountsService.getReferredUsersDashboardCounts(refByEmail);

  res.status(httpStatus.OK).send({
    success: true,
    data
  });
};

module.exports = {
  getManufacturerPORetailerCounts,
  getProductDashboardCounts,
  getPerformaInvoiceDashboardCounts,
  getReturnDashboardCounts,
  getCreditNoteDashboardCounts,
  getReferredUsersDashboardCounts,
};
