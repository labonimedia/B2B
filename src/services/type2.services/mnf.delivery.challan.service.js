const httpStatus = require('http-status');
const { MnfDeliveryChallan, PurchaseOrderType2, RetailerPartialReq, PurchaseOrderRetailerType2, Retailer } = require('../../models');
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
        { $set: { status: 'processing' } },
        { new: true }
    );

    const result = await MnfDeliveryChallan.create(reqBody);

    // Send real-time notification to the retailer
    // await sendNotification(email, `A new order ${result.orderNumber} has been created.`);

    // Enqueue notification and auto-processing jobs
    // await notificationQueue.add({ orderId: result._id });
    // await notificationQueue.add({ orderId: result._id, recurring: true }, { repeat: { every: 2 * 60 * 60 * 1000 } });
    await autoForwardQueue.add({ orderId: result._id }, { delay: 4 * 60 * 60 * 1000 });
    // await autoForwardQueue.add({ orderId: result._id }, { delay: 5 * 60 * 1000 }); // 4 * 60 * 60 * 1000

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
 * Get PurchaseOrderType2 by id
 * @param {ObjectId} id
 * @returns {Promise<PurchaseOrderType2>}
 */
const getConfirmRequsted = async (orderID) => {
    const retailerPo = await RetailerPartialReq.find({ deliveryChallanId: orderID })
    console.log(retailerPo);
    // Extract unique retailer emails
    const retailerEmails = [...new Set(retailerPo.map((po) => po.retailerEmail))];

    // Fetch retailer details
    const retailers = await Retailer.find({ email: { $in: retailerEmails } })
        .select('email fullName companyName');

    // Convert retailer data to a map for quick lookup
    const retailerMap = new Map(retailers.map((retailer) => [retailer.email, retailer]));

    // Attach retailer details to each order
    return retailerPo.map((po) => ({
        ...po.toObject(),
        fullName: retailerMap.get(po.retailerEmail)?.fullName || null,
        companyName: retailerMap.get(po.retailerEmail)?.companyName || null,
    }));
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
        // 1️⃣ Fetch Manufacturer's Delivery Challan (with pending status)
        const deliveryChallan = await MnfDeliveryChallan.findById(challanId);
        if (!deliveryChallan) {
            throw new Error('No pending delivery challan found');
        }

        // 2️⃣ Fetch all Retailer POs associated with the challan's retailerPOs (FIFO by retailerPoDate)
        let retailerOrders = await PurchaseOrderRetailerType2.find({
            $or: deliveryChallan.retailerPOs.map((po) => ({
                email: po.email,
                poNumber: po.poNumber
            }))
        }).sort({ retailerPoDate: 1 });

        // Clone available stock from the challan (avilableSet)
        let availableStock = [...deliveryChallan.avilableSet];

        // 3️⃣ Process each Retailer PO
        for (let order of retailerOrders) {
            let orderFulfilled = true;
            let partialItems = [];

            for (let item of order.set) {
                // Remove unwanted property 'role'
                delete item.role;

                let stockItem = availableStock.find(
                    (s) =>
                        s.designNumber === item.designNumber &&
                        s.colour === item.colour &&
                        s.size === item.size &&
                        s.colourName === item.colourName
                );

                if (stockItem) {
                    if (stockItem.quantity >= item.quantity) {
                        // Full order item can be fulfilled
                        stockItem.quantity -= item.quantity;
                    } else {
                        // Partial order fulfillment required
                        partialItems.push({
                            ...item.toObject(),
                            orderedQuantity: item.quantity,
                            availableQuantity: stockItem.quantity
                        });
                        orderFulfilled = false;
                        stockItem.quantity = 0; // Deplete available stock
                    }
                } else {
                    orderFulfilled = false;
                    partialItems.push({
                        ...item.toObject(),
                        orderedQuantity: item.quantity,
                        availableQuantity: 0
                    });
                }
            }

            if (orderFulfilled) {
                // ✅ If fully fulfilled, update the PO status to 'processing'
                await PurchaseOrderRetailerType2.updateOne(
                    { poNumber: order.poNumber },
                    { $set: { statusAll: 'processing' } }
                );
            } else {
                // 🚀 Save Partial Request for Retailer in one document per retailer PO
                const existingPartialReq = await RetailerPartialReq.findOne({
                    poNumber: order.poNumber,
                    retailerEmail: order.email,
                    wholesalerEmail: order.wholesalerEmail,
                    requestType: 'partial_delivery'
                });

                if (existingPartialReq) {
                    // Iterate through partialItems and update existing requestedItems
                    partialItems.forEach((newItem) => {
                        let existingItem = existingPartialReq.requestedItems.find(
                            (item) =>
                                item.designNumber === newItem.designNumber &&
                                item.colourName === newItem.colourName &&
                                item.size === newItem.size &&
                                item.colour === newItem.colour
                        );

                        if (existingItem) {
                            // Update quantities if the item already exists
                            existingItem.orderedQuantity += newItem.orderedQuantity;
                            existingItem.availableQuantity += newItem.availableQuantity;
                        } else {
                            // If the item does not exist, add it
                            existingPartialReq.requestedItems.push(newItem);
                        }
                    });
                    existingPartialReq.status = 'pending';
                    await existingPartialReq.save();
                } else {
                    await RetailerPartialReq.create({
                        deliveryChallanId: challanId,
                        poNumber: order.poNumber,
                        retailerEmail: order.email,
                        wholesalerEmail: order.wholesalerEmail,
                        requestType: 'partial_delivery',
                        requestedItems: partialItems
                    });
                }
            }
        }

        return { success: true, message: 'Retailer orders processed successfully' };
    } catch (error) {
        console.log(error.message);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error processing retailer orders');
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
    getConfirmRequsted,
};
