const httpStatus = require('http-status');
const { MtoRCreditNote, Retailer, Manufacture } = require('../../models');
const ApiError = require('../../utils/ApiError');
/**
 * Bulk upload HSN GST records (allowing duplicates)
 * @param {Array<Object>} dataArray
 * @returns {Promise<Array<HsnGst>>}
 */
const bulkUploadMtoRCreditNote = async (dataArray) => {
  const results = await MtoRCreditNote.insertMany(dataArray, { ordered: false });
  return results;
};



// /**
//  * Create a MtoRCreditNote
//  * @param {Object} reqBody
//  * @returns {Promise<MtoRCreditNote>}
//  */
// const createMtoRCreditNote = async (reqBody) => {
//   return MtoRCreditNote.create(reqBody);
// };

/**
 * Create a MtoRCreditNote with unique creditNoteNumber per manufacturer
 * @param {Object} reqBody
 * @returns {Promise<MtoRCreditNote>}
 */
const createMtoRCreditNote = async (reqBody) => {
  const { manufacturerEmail } = reqBody;

  if (!manufacturerEmail) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "'manufacturerEmail' is required to generate credit note number."
    );
  }

  // Get last credit note for this manufacturer
  const lastCreditNote = await MtoRCreditNote.findOne({ manufacturerEmail })
    .sort({ creditNoteNumber: -1 }) // highest number first
    .lean();

  let nextNumber = 1;
  if (lastCreditNote && lastCreditNote.creditNoteNumber) {
    nextNumber = lastCreditNote.creditNoteNumber + 1;
  }

  reqBody.creditNoteNumber = nextNumber;

  const creditNote = await MtoRCreditNote.create(reqBody);
  return creditNote;
};

/**
 * Query for MtoRCreditNote
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMtoRCreditNote = async (filter, options) => {
  const mtoRCreditNote = await MtoRCreditNote.paginate(filter, options);
  return mtoRCreditNote;
};

// const groupMtoRCreditNote = async (query) => {
//   const { retailerEmail, manufacturerEmail, page = 1, limit = 10 } = query;

//   if (!retailerEmail && !manufacturerEmail) {
//     throw new Error('Either retailerEmail or manufacturerEmail must be provided');
//   }

//   const matchStage = retailerEmail
//     ? { retailerEmail }
//     : { manufacturerEmail };

//   const groupByField = retailerEmail ? "$manufacturerEmail" : "$retailerEmail";

//   const skip = (Number(page) - 1) * Number(limit);

//   // ✅ Single aggregation for used true and false
//   const pipeline = [
//     { $match: matchStage },
//     {
//       $group: {
//         _id: { groupKey: groupByField, used: "$used" },
//         totalCreditNotes: { $sum: 1 },
//         totalCreditAmount: { $sum: "$totalCreditAmount" },
//         creditNotes: {
//           $push: {
//             _id: "$_id",
//             creditNoteNumber: "$creditNoteNumber",
//             invoiceNumber: "$invoiceNumber",
//             manufacturerEmail: "$manufacturerEmail",
//             retailerEmail: "$retailerEmail",
//             totalCreditAmount: "$totalCreditAmount",
//             createdAt: "$createdAt",
//             used: "$used",
//           },
//         },
//       },
//     },
//     { $sort: { "_id.groupKey": 1 } },
//   ];

//   const grouped = await MtoRCreditNote.aggregate(pipeline);

//   // ✅ Split the grouped result efficiently
//   const usedTrueGroups = grouped.filter((g) => g._id.used === true);
//   const usedFalseGroups = grouped.filter((g) => g._id.used === false);

//   // ✅ Paginate at app level (after aggregation)
//   const paginateArray = (arr) => {
//     const totalCount = arr.length;
//     const paginatedData = arr.slice(skip, skip + Number(limit));
//     return {
//       totalCount,
//       totalPages: Math.ceil(totalCount / limit),
//       page: Number(page),
//       limit: Number(limit),
//       data: paginatedData.map((g) => ({
//         groupKey: g._id.groupKey,
//         totalCreditNotes: g.totalCreditNotes,
//         totalCreditAmount: g.totalCreditAmount,
//         creditNotes: g.creditNotes,
//       })),
//     };
//   };

//   return {
//     usedTrue: paginateArray(usedTrueGroups),
//     usedFalse: paginateArray(usedFalseGroups),
//   };
// };
// const groupMtoRCreditNote = async (query) => {
//   const { retailerEmail, manufacturerEmail, page = 1, limit = 10 } = query;

//   if (!retailerEmail && !manufacturerEmail) {
//     throw new Error("Either retailerEmail or manufacturerEmail must be provided");
//   }

//   const matchStage = retailerEmail ? { retailerEmail } : { manufacturerEmail };
//   const groupByField = retailerEmail ? "$manufacturerEmail" : "$retailerEmail";

//   const skip = (Number(page) - 1) * Number(limit);

//   // ✅ Aggregation pipeline for grouping
//   const pipeline = [
//     { $match: matchStage },
//     {
//       $group: {
//         _id: { groupKey: groupByField, used: "$used" },
//         totalCreditNotes: { $sum: 1 },
//         totalCreditAmount: { $sum: "$totalCreditAmount" },
//         creditNotes: { $push: "$$ROOT" }, // include entire credit note document
//       },
//     },
//     { $sort: { "_id.groupKey": 1 } },
//   ];

//   const grouped = await MtoRCreditNote.aggregate(pipeline);

//   // ✅ Split into used:true and used:false
//   const usedTrueGroups = grouped.filter((g) => g._id.used === true);
//   const usedFalseGroups = grouped.filter((g) => g._id.used === false);

//   // ✅ Pagination helper
//   const paginateArray = (arr) => {
//     const totalCount = arr.length;
//     const paginatedData = arr.slice(skip, skip + Number(limit));
//     return {
//       totalCount,
//       totalPages: Math.ceil(totalCount / limit),
//       page: Number(page),
//       limit: Number(limit),
//       data: paginatedData,
//     };
//   };

//   // ✅ Function to attach Manufacture and Retailer data (full profile)
//   const enrichWithProfiles = async (groups) => {
//     return Promise.all(
//       groups.map(async (group) => {
//         const groupKeyEmail = group._id.groupKey;

//         let manufacturerData = null;
//         let retailerData = null;

//         if (retailerEmail) {
//           // grouped by manufacturerEmail
//           manufacturerData = await Manufacture.findOne({ email: groupKeyEmail }).lean();
//           retailerData = await Retailer.findOne({ email: retailerEmail }).lean();
//         } else {
//           // grouped by retailerEmail
//           retailerData = await Retailer.findOne({ email: groupKeyEmail }).lean();
//           manufacturerData = await Manufacture.findOne({ email: manufacturerEmail }).lean();
//         }

//         return {
//           groupKey: group._id.groupKey,
//           used: group._id.used,
//           totalCreditNotes: group.totalCreditNotes,
//           totalCreditAmount: group.totalCreditAmount,
//           creditNotes: group.creditNotes, // full documents
//           manufacturer: manufacturerData || null,
//           retailer: retailerData || null,
//         };
//       })
//     );
//   };

//   // ✅ Enrich both used:true and used:false groups with full profiles
//   const usedTrueEnriched = await enrichWithProfiles(paginateArray(usedTrueGroups).data);
//   const usedFalseEnriched = await enrichWithProfiles(paginateArray(usedFalseGroups).data);

//   // ✅ Final structured response
//   return {
//     usedTrue: {
//       ...paginateArray(usedTrueGroups),
//       data: usedTrueEnriched,
//     },
//     usedFalse: {
//       ...paginateArray(usedFalseGroups),
//       data: usedFalseEnriched,
//     },
//   };
// };

const groupMtoRCreditNote = async (query) => {
  const { retailerEmail, manufacturerEmail, used, page = 1, limit = 10 } = query;

  if (!retailerEmail && !manufacturerEmail) {
    throw new Error("Either retailerEmail or manufacturerEmail must be provided");
  }

  if (used !== "true" && used !== "false") {
    throw new Error("Query parameter 'used' must be 'true' or 'false'");
  }

  const usedBool = used === "true";
  const matchStage = retailerEmail
    ? { retailerEmail, used: usedBool }
    : { manufacturerEmail, used: usedBool };
  const groupByField = retailerEmail ? "$manufacturerEmail" : "$retailerEmail";

  const skip = (Number(page) - 1) * Number(limit);

  // ✅ Aggregation to group & summarize
  const pipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: groupByField,
        totalCreditNotes: { $sum: 1 },
        totalCreditAmount: { $sum: "$totalCreditAmount" },
      },
    },
    { $sort: { _id: 1 } },
    { $skip: skip },
    { $limit: Number(limit) },
  ];

  const grouped = await MtoRCreditNote.aggregate(pipeline);
  const totalCount = await MtoRCreditNote.aggregate([
    { $match: matchStage },
    { $group: { _id: groupByField } },
    { $count: "count" },
  ]);

  const total = totalCount[0]?.count || 0;

  // ✅ Enrich grouped data with basic profile info
  const enriched = await Promise.all(
    grouped.map(async (group) => {
      const groupKeyEmail = group._id;

      let manufacturerData = null;
      let retailerData = null;

      if (retailerEmail) {
        // grouped by manufacturerEmail
        manufacturerData = await Manufacture.findOne(
          { email: groupKeyEmail },
          { fullName: 1, email: 1, companyName: 1, mobileNumber: 1, _id: 0 }
        ).lean();
        retailerData = await Retailer.findOne(
          { email: retailerEmail },
          { fullName: 1, email: 1, companyName: 1, mobileNumber: 1, _id: 0 }
        ).lean();
      } else {
        // grouped by retailerEmail
        retailerData = await Retailer.findOne(
          { email: groupKeyEmail },
          { fullName: 1, email: 1, companyName: 1, mobileNumber: 1, _id: 0 }
        ).lean();
        manufacturerData = await Manufacture.findOne(
          { email: manufacturerEmail },
          { fullName: 1, email: 1, companyName: 1, mobileNumber: 1, _id: 0 }
        ).lean();
      }

      return {
        groupKey: group._id,
        used: usedBool,
        totalCreditNotes: group.totalCreditNotes,
        totalCreditAmount: group.totalCreditAmount,
        manufacturer: manufacturerData || null,
        retailer: retailerData || null,
      };
    })
  );

  return {
    page: Number(page),
    limit: Number(limit),
    totalCount: total,
    totalPages: Math.ceil(total / limit),
    data: enriched,
  };
};
/**
 * Get MtoRCreditNote by id
 * @param {ObjectId} id
 * @returns {Promise<MtoRCreditNote>}
 */
const getMtoRCreditNoteById = async (id) => {
  return MtoRCreditNote.findById(id);
};

/**
 * Update MtoRCreditNote by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<MtoRCreditNote>}
 */
const updateMtoRCreditNoteById = async (id, updateBody) => {
  const mtoRCreditNote = await getMtoRCreditNoteById(id);
  if (!mtoRCreditNote) {
    throw new ApiError(httpStatus.NOT_FOUND, 'mtoRCreditNote not found');
  }
  Object.assign(mtoRCreditNote, updateBody);
  await mtoRCreditNote.save();
  return mtoRCreditNote;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<MtoRCreditNote>}
 */
const deleteMtoRCreditNoteById = async (id) => {
  const mtoRCreditNote = await getMtoRCreditNoteById(id);
  if (!mtoRCreditNote) {
    throw new ApiError(httpStatus.NOT_FOUND, 'mtoRCreditNote not found');
  }
  await mtoRCreditNote.remove();
  return mtoRCreditNote;
};

// const bulkUpdateCreditNotes = async (creditNotes) => {
//   if (!Array.isArray(creditNotes) || creditNotes.length === 0) {
//     throw new Error('Invalid request: creditNotes array required');
//   }

//   const bulkOps = creditNotes.map((note) => {
//     return {
//       updateOne: {
//         filter: { _id: note.id },
//         update: {
//           $set: {
//             used: note.used,
//             usedInInvoiceId: note.usedInInvoiceId || null,
//             usedInInvoiceNumber: note.usedInInvoiceNumber || null,
//             usedAt: note.used ? note.usedAt || new Date() : null,
//           },
//         },
//       },
//     };
//   });

//   const result = await MtoRCreditNote.bulkWrite(bulkOps, { ordered: false });
//   return result;
// };

const bulkUpdateCreditNotes = async (creditNotes) => {
  if (!Array.isArray(creditNotes) || creditNotes.length === 0) {
    throw new Error('Invalid request: creditNotes array required');
  }

  const ids = creditNotes.map((note) => note.id);

  const bulkOps = creditNotes.map((note) => ({
    updateOne: {
      filter: { _id: note.id },
      update: {
        $set: {
          used: note.used,
          usedInInvoiceId: note.usedInInvoiceId || null,
          usedInInvoiceNumber: note.usedInInvoiceNumber || null,
          usedAt: note.used ? note.usedAt || new Date() : null,
        },
      },
    },
  }));

  // Perform bulk update
  await MtoRCreditNote.bulkWrite(bulkOps, { ordered: false });

  // Fetch updated documents
  const updatedDocs = await MtoRCreditNote.find({ _id: { $in: ids } });

  return updatedDocs;
};

module.exports = {
  createMtoRCreditNote,
  queryMtoRCreditNote,
  getMtoRCreditNoteById,
  updateMtoRCreditNoteById,
  deleteMtoRCreditNoteById,
  bulkUploadMtoRCreditNote,
  groupMtoRCreditNote,
  bulkUpdateCreditNotes,
};
