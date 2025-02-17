const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { rtlOPReuestService } = require('../../services');

const createRetailerPartialReq = catchAsync(async (req, res) => {
    const path = await rtlOPReuestService.createRetailerPartialReq(req.body);
    res.status(httpStatus.CREATED).send(path);
});

const queryRetailerPartialReq = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'retailerEmail', 'status']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await rtlOPReuestService.queryRetailerPartialReq(filter, options);
    res.send(result);
});

const getRetailerPartialReqById = catchAsync(async (req, res) => {
    const path = await rtlOPReuestService.getRetailerPartialReqById(req.params.id);
    if (!path) {
        throw new ApiError(httpStatus.NOT_FOUND, 'req not found');
    }
    res.send(path);
});

const updateRetailerPartialReqById = catchAsync(async (req, res) => {
    const path = await rtlOPReuestService.updateRetailerPartialReqById(req.params.id, req.body);
    res.send(path);
});

const deleteRetailerPartialReqById = catchAsync(async (req, res) => {
    await rtlOPReuestService.deleteRetailerPartialReqById(req.params.id);
    res.status(httpStatus.NO_CONTENT).send();
});

const getSpaceUsagecontroller = catchAsync(async (req, res) => {
    const path = await getSpaceUsage(req.query.bucketName);
    if (!path) {
        throw new ApiError(httpStatus.NOT_FOUND, 'req not found');
    }
    res.send(path);
});

module.exports = {
    createRetailerPartialReq,
    queryRetailerPartialReq,
    getRetailerPartialReqById,
    updateRetailerPartialReqById,
    deleteRetailerPartialReqById,
    getSpaceUsagecontroller,
};
