const httpStatus = require('http-status');
const { FinalProductW } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create multiple WholesalerReturn items
 * @param {Array<Object>} reqBody - Contains an array of item objects
 * @returns {Promise<FinalProductW>}
 */
const createFinalProductW = async (reqBody) => {
    return await FinalProductW.create(reqBody);
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
const queryFinalProductW = async (filter, options) => {
    const finalProductWs = await FinalProductW.paginate(filter, options);
    return finalProductWs;
};

/**
 * Get WholesalerReturn by id
 * @param {ObjectId} id
 * @returns {Promise<WholesalerReturn>}
 */
const getFinalProductWById = async (id) => {
    return FinalProductW.findById(id);
};


const disctributeProductToRetailer = async (finalProductId) => {
    const finalProduct = await getFinalProductWById(finalProductId);
    if (!finalProduct) {
        throw new Error('FinalProduct not found');
    }

    // Step 2: Extract the retailerPOs array
    const retailerPOs = finalProduct.retailerPOs;
    if (!retailerPOs || retailerPOs.length === 0) {
        throw new Error('No retailerPOs associated with this FinalProduct');
    }

    // Step 3: Fetch data from RetailerPO collection for each retailerPO
    const retailerDataPromises = retailerPOs.map(async (po) => {
        const retailerData = await RetailerPO.findOne({
            email: po.email,
            poNumber: po.poNumber,
        }).lean();
        return retailerData || { email: po.email, poNumber: po.poNumber, notFound: true };
    });

    // Wait for all promises to resolve
    const retailerData = await Promise.all(retailerDataPromises);

    // Step 4: Return the combined data
    return {
        ...finalProduct,
        retailerDetails: retailerData,
    };
}


module.exports = {
    createFinalProductW,
    queryFinalProductW,
    getFinalProductWById,
    disctributeProductToRetailer
};
