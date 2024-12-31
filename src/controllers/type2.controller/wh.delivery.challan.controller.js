const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { whDeliveryChallanService } = require('../../services');

const createWhDeliveryChallan = catchAsync(async (req, res) => {
    const createdItems = await whDeliveryChallanService.createWhDeliveryChallan(req.body);
    res.status(httpStatus.CREATED).send(createdItems);
});

const queryWhDeliveryChallan = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['productBy', 'email', 'status']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const PurchaseOrderType2Items = await whDeliveryChallanService.queryWhDeliveryChallan(filter, options);
    res.status(httpStatus.OK).send(PurchaseOrderType2Items);
});

const getWhDeliveryChallanById = catchAsync(async (req, res) => {
    const cartItem = await whDeliveryChallanService.getWhDeliveryChallanById(req.params.id);
    if (!cartItem) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
    }
    res.status(httpStatus.OK).send(cartItem);
});

const genratedeChallNO = catchAsync(async (req, res) => {
    const cartItem = await whDeliveryChallanService.genratedeChallNO(req.params.wholesalerEmail);
    if (!cartItem) {
        throw new ApiError(httpStatus.NOT_FOUND, 'delivery challan not found');
    }
    res.status(httpStatus.OK).send(cartItem);
});

const updateWhDeliveryChallanById = catchAsync(async (req, res) => {
    const updatedCartItem = await whDeliveryChallanService.updateWhDeliveryChallanById(req.params.id, req.body);
    res.status(httpStatus.OK).send(updatedCartItem);
});

const deleteWhDeliveryChallanById = catchAsync(async (req, res) => {
    await whDeliveryChallanService.deleteWhDeliveryChallanById(req.params.id);
    res.status(httpStatus.NO_CONTENT).send();
});

// const getDeliveryChallanByManufactureEmail = async (req, res) => {
//     const { manufacturerEmail, page, limit, sortBy, filter } = req.query;
//     const options = {
//         page: parseInt(page, 10) || 1,
//         limit: parseInt(limit, 10) || 10,
//         sortBy: sortBy || '-createdAt', // default sorting by newest first
//     };
//     const data = await whDeliveryChallanService.getDeliveryChallanByManufactureEmail(manufacturerEmail, filter, options);
//     res.status(200).send({ success: true, data });
// };

module.exports = {
    createWhDeliveryChallan,
    queryWhDeliveryChallan,
    getWhDeliveryChallanById,
    genratedeChallNO,
    updateWhDeliveryChallanById,
    deleteWhDeliveryChallanById,
    // getDeliveryChallanByManufactureEmail,
};
