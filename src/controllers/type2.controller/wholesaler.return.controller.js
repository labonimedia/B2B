const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { wholesalerReturnService } = require('../../services');

const createWholesalerReturn = catchAsync(async (req, res) => {
    const returnOrder = await wholesalerReturnService.createWholesalerReturn(req.body);
    res.status(httpStatus.CREATED).send(returnOrder);
});

const queryWholesalerReturn = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['productBy', 'email', 'status']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const returnOrders = await wholesalerReturnService.queryWholesalerReturn(filter, options);
    res.status(httpStatus.OK).send(returnOrders);
});

const getWholesalerReturnById = catchAsync(async (req, res) => {
    const returnOrder = await wholesalerReturnService.getWholesalerReturnById(req.params.id);
    if (!returnOrder) {
        throw new ApiError(httpStatus.NOT_FOUND, 'return order not found');
    }
    res.status(httpStatus.OK).send(returnOrder);
});


module.exports = {
    createWholesalerReturn,
    queryWholesalerReturn,
    getWholesalerReturnById,
};
