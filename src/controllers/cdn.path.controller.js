const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { cdnPathService } = require('../services');

const createCDNPath = catchAsync(async (req, res) => {
    const path = await cdnPathService.createCDNPath(req.body);
    res.status(httpStatus.CREATED).send(path);
});

const queryCDNPath = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'status']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await cdnPathService.queryCDNPath(filter, options);
    res.send(result);
});

const getCDNPathById = catchAsync(async (req, res) => {
    const path = await cdnPathService.getCDNPathById(req.params.id);
    if (!path) {
        throw new ApiError(httpStatus.NOT_FOUND, 'path not found');
    }
    res.send(path);
});

const updateCDNPathById = catchAsync(async (req, res) => {
    const path = await cdnPathService.updateCDNPathById(req.params.id, req.body);
    res.send(path);
});

const deleteCDNPathById = catchAsync(async (req, res) => {
    await cdnPathService.deleteCDNPathById(req.params.id);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createCDNPath,
    queryCDNPath,
    getCDNPathById,
    updateCDNPathById,
    deleteCDNPathById,
};
