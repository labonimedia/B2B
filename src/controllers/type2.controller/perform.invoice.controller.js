const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { performInvoiceService } = require('../../services');

const createPerformInvoice = catchAsync(async (req, res) => {
    const createdItems = await performInvoiceService.createPerformInvoice(req.body);
    res.status(httpStatus.CREATED).send(createdItems);
});

const queryPerformInvoice = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['productBy', 'email', 'status']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const PurchaseOrderType2Items = await performInvoiceService.queryPerformInvoice(filter, options);
    res.status(httpStatus.OK).send(PurchaseOrderType2Items);
});

const getPerformInvoiceById = catchAsync(async (req, res) => {
    const cartItem = await performInvoiceService.getPerformInvoiceById(req.params.id);
    if (!cartItem) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
    }
    res.status(httpStatus.OK).send(cartItem);
});

const getPurchaseOrderWithOldAvailebleData = catchAsync(async (req, res) => {
    const cartItem = await performInvoiceService.getPurchaseOrderWithOldAvailebleData(req.params.id);
    if (!cartItem) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Purchase order not found');
    }
    res.status(httpStatus.OK).send(cartItem);
});

const genratedeChallNO = catchAsync(async (req, res) => {
    const cartItem = await performInvoiceService.genratedeChallNO(req.params.manufacturerEmail);
    if (!cartItem) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
    }
    res.status(httpStatus.OK).send(cartItem);
});

const updatePerformInvoiceById = catchAsync(async (req, res) => {
    const updatedCartItem = await performInvoiceService.updatePerformInvoiceById(req.params.id, req.body);
    res.status(httpStatus.OK).send(updatedCartItem);
});

const deletePerformInvoiceById = catchAsync(async (req, res) => {
    await performInvoiceService.deletePerformInvoiceById(req.params.id);
    res.status(httpStatus.NO_CONTENT).send();
});

const getPerformInvoiceByManufactureEmail = async (req, res) => {
    const { manufacturerEmail, page, limit, sortBy, filter } = req.query;
    const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        sortBy: sortBy || '-createdAt', // default sorting by newest first
    };
    const data = await performInvoiceService.getPerformInvoiceByManufactureEmail(manufacturerEmail, filter, options);
    res.status(200).send({ success: true, data });
};

module.exports = {
    createPerformInvoice,
    queryPerformInvoice,
    getPerformInvoiceById,
    genratedeChallNO,
    updatePerformInvoiceById,
    deletePerformInvoiceById,
    getPerformInvoiceByManufactureEmail,
    getPurchaseOrderWithOldAvailebleData,
};
