const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { poWholesalerToManufactureService } = require('../../services');
const pick = require('../../utils/pick');

// const createRetailerPurchaseOrderType2 = catchAsync(async (req, res) => {
//   const createdPO  = await poWholesalerToManufactureService.createPoToManufacturer(req.user.email, req.body);
//   res.status(httpStatus.CREATED).send(createdPO);
// });

const createRetailerPurchaseOrderType2 = catchAsync(async (req, res) => {
    const wholesalerEmail = req.body.wholesalerEmail; // or req.body.wholesalerEmail
    const combinedPOData = req.body.data;
  
    const result = await poWholesalerToManufactureService.createPoToManufacturer(wholesalerEmail, combinedPOData);
  
    res.status(201).json({
      success: true,
      ...result
    });
  });

const getAllPoWholesalerToManufacturer = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['productBy', 'wholesalerEmail', 'email']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const RetailerPurchaseOrderType2Items = await poWholesalerToManufactureService.getAllPOWholesalerToManufacturer(
      filter,
      options
    );
    res.status(httpStatus.OK).send(RetailerPurchaseOrderType2Items);
  });

const getRetailerPOByWholesaler = catchAsync(async (req, res) => {
  const { wholesalerEmail } = req.params;
  const pos = await poWholesalerToManufactureService.getRetailerPOByWholesaler(wholesalerEmail);
  res.status(httpStatus.OK).send(pos);
});

const updateRetailerPOSetItem = catchAsync(async (req, res) => {
  const { poId } = req.params;
  const updatedPO = await poWholesalerToManufactureService.updateRetailerPOSetItem(poId, req.body);
  res.status(httpStatus.OK).send(updatedPO);
});

const getSinglePoWholesalerToManufacturer = catchAsync(async (req, res) => {
  const cartItem = await poWholesalerToManufactureService.getSinglePOWholesalerToManufacturer(req.params.id);
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Single Retailer To Wholesaler PO not found');
  }
  res.status(httpStatus.OK).send(cartItem);
});

const updateSinglePoWholesalerToManufacturer = catchAsync(async (req, res) => {
    const updatedCartItem = await poWholesalerToManufactureService.updateSinglePOWholesalerToManufacturer(
      req.params.id,
      req.body
    );
    res.status(httpStatus.OK).send(updatedCartItem);
  });
  
const deleteSinglePoWholesalerToManufacturer = catchAsync(async (req, res) => {
  await poWholesalerToManufactureService.deleteSinglePOWholesalerToManufacturer(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});
const getCombinedRetailerItems = catchAsync(async (req, res) => {
    const { wholesalerEmail } = req.query;

    if (!wholesalerEmail) {

      return res.status(400).json({
        success: false,
        message: 'wholesalerEmail is required',
      });
    }

    const resultArray = await poWholesalerToManufactureService.combinePendingRetailerPOItems(req.params.email);
    res.status(httpStatus.OK).send({ success: true, data: resultArray });
  });
module.exports = {
  createRetailerPurchaseOrderType2,
  getRetailerPOByWholesaler,
  updateRetailerPOSetItem,
  getAllPoWholesalerToManufacturer,
  deleteSinglePoWholesalerToManufacturer,
  updateSinglePoWholesalerToManufacturer,
  getSinglePoWholesalerToManufacturer,
  getCombinedRetailerItems,
};
