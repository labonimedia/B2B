const httpStatus = require('http-status');
const { MnfDeliveryChallan, PurchaseOrderType2, RetailerPartialReq, PurchaseOrderRetailerType2 } = require('../../models');
const ApiError = require('../../utils/ApiError');
const { autoForwardQueue, autoCancelQueue } = require("../../utils/queue");
const { sendNotification } = require("../../utils/notification");

/**
 * Create multiple PurchaseOrderType2 items
 * @param {Array<Object>} reqBody - Contains an array of item objects
 * @returns {Promise<Array<PurchaseOrderType2>>}
 */
const createMnfDeliveryChallan = async (reqBody) => {
    const { email, poNumber, retailerId } = reqBody;

    await PurchaseOrderType2.findOneAndUpdate(
        { email, poNumber },
        { $set: { status: 'shipped' } },
        { new: true }
    );

    const result = await MnfDeliveryChallan.create(reqBody);

    // Send real-time notification to the retailer
    await sendNotification(email, `A new order ${result.orderNumber} has been created.`);

    // Enqueue notification and auto-processing jobs
    // await notificationQueue.add({ orderId: result._id });
    // await notificationQueue.add({ orderId: result._id, recurring: true }, { repeat: { every: 2 * 60 * 60 * 1000 } });
    await autoForwardQueue.add({ orderId: result._id }, { delay: 5 * 60 * 1000 }); // 4 * 60 * 60 * 1000

    return result;
};

/**
 * Query for PurchaseOrderType2
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMnfDeliveryChallan = async (filter, options) => {
    const mnfDeliveryChallans = await MnfDeliveryChallan.paginate(filter, options);
    return mnfDeliveryChallans;
};

/**
 * Get PurchaseOrderType2 by id
 * @param {ObjectId} id
 * @returns {Promise<PurchaseOrderType2>}
 */
const getMnfDeliveryChallanById = async (id) => {
    return MnfDeliveryChallan.findById(id);
};

/**
 * genrate delivery challan number
 * @param {params} manufacturerEmail
 * @returns {Promise<MnfDeliveryChallan>}
 */
const genratedeChallNO = async (manufacturerEmail) => {
    const lastPO = await MnfDeliveryChallan.findOne({ productBy: manufacturerEmail })
        .sort({ deliveryChallanNumber: -1 })
        .lean();
    let nextdeliveryChallanNumber = lastPO ? lastPO.deliveryChallanNumber + 1 : 1;
    return {
        deliveryChallanNumber: nextdeliveryChallanNumber,
    }
};

/**
 * Update PurchaseOrderType2 by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<PurchaseOrderType2>}
 */
const updateMnfDeliveryChallanById = async (id, updateBody) => {
    const cart = await getMnfDeliveryChallanById(id);
    if (!cart) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Purchase Order not found');
    }
    Object.assign(cart, updateBody);
    await cart.save();
    return cart;
};

/**
 * Delete PurchaseOrderType2 by id
 * @param {ObjectId} id
 * @returns {Promise<PurchaseOrderType2>}
 */
const deleteMnfDeliveryChallanById = async (id) => {
    const cart = await getMnfDeliveryChallanById(id);
    if (!cart) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Purchase Order not found');
    }
    await cart.remove();
    return cart;
};

const getDeliveryChallanByManufactureEmail = async (manufacturerEmail, filter, options) => {
    // Apply additional filters
    if (filter) {
        const parsedFilter = JSON.parse(filter);
        Object.assign(query, parsedFilter);
    }

    // Use Mongoose paginate plugin
    const result = await MnfDeliveryChallan.paginate(query, {
        ...options,
        customLabels: { docs: 'mnfdeliverychallans' },
    });

    return result;
};

/**
 * Auto check retailer requirement and send request to full fill requirements
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<PurchaseOrderType2>}
 */
const processRetailerOrders = async (challanId) => {
    try {
        // 1️⃣ Fetch Manufacturer's Delivery Challan (where status is pending)
        const deliveryChallan = await MnfDeliveryChallan.findById(challanId);

        if (!deliveryChallan) {
            throw new Error('No pending delivery challan found');
        }

        // 2️⃣ Fetch all Retailer POs associated with the wholesaler's PO, sorted by PO date
        let retailerOrders = await PurchaseOrderRetailerType2.find({
            $or: deliveryChallan.retailerPOs.map((po) => ({
                email: po.email,
                poNumber: po.poNumber
            }))
        }).sort({ retailerPoDate: 1 });

        let availableStock = [...deliveryChallan.avilableSet]; // Clone available stock

        // 3️⃣ Process each Retailer PO
        for (let order of retailerOrders) {
            let orderFulfilled = true;
            let partialItems = [];

            for (let item of order.set) {
                let stockItem = availableStock.find(
                    (s) =>
                        s.designNumber === item.designNumber &&
                        s.colour === item.colour &&
                        s.size === item.size
                );

                if (stockItem) {
                    if (stockItem.quantity >= item.quantity) {
                        // Full order can be fulfilled
                        stockItem.quantity -= item.quantity;
                    } else {
                        // Partial order fulfillment required
                        partialItems.push({
                            ...item.toObject(),
                            availableQuantity: stockItem.quantity,
                        });

                        orderFulfilled = false;
                        stockItem.quantity = 0; // Deplete available stock
                    }
                } else {
                    orderFulfilled = false;
                    partialItems.push({ ...item.toObject(), availableQuantity: 0 });
                }
            }

            if (orderFulfilled) {
                // ✅ Update PO as fulfilled
                await PurchaseOrderRetailerType2.updateOne(
                    { poNumber: order.poNumber },
                    { $set: { statusAll: 'processing' } }
                );
            } else {
                // 🚀 Save Partial Request for Retailer
                await RetailerPartialReq.create({
                    poNumber: order.poNumber,
                    retailerEmail: order.email,
                    wholesalerEmail: order.wholesalerEmail,
                    status: 'pending',
                    requestType: 'partial_delivery',
                    requestedItems: partialItems,
                    responseByRetailer: null,
                    responseDate: null,
                });
            }
        }

        // // 🔹 Update Delivery Challan Stock
        // await MnfDeliveryChallan.updateOne(
        //     { poNumber: wholesalerPoNumber },
        //     { $set: { avilableSet: availableStock } }
        // );

        return { success: true, message: 'Retailer orders processed successfully' };
    } catch (error) {
        console.error('Error processing retailer orders:', error);
        return { success: false, message: error.message };
    }
};


// Create combined PO for wholesaler
module.exports = {
    createMnfDeliveryChallan,
    queryMnfDeliveryChallan,
    getMnfDeliveryChallanById,
    genratedeChallNO,
    updateMnfDeliveryChallanById,
    deleteMnfDeliveryChallanById,
    getDeliveryChallanByManufactureEmail,
    processRetailerOrders,
};
