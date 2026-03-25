// const { PORetailerToWholesaler, POWholesalerToManufacturer } = require('../../models');

// const wholesalerDashboardCountsService = async (role, email) => {
//   const response = {};
//   if (role === 'retailer') {
//     const total = await PORetailerToWholesaler.countDocuments({
//       email,
//     });

//     const pending = await PORetailerToWholesaler.countDocuments({
//       email,
//       statusAll: 'pending',
//     });

//     const wholesalerPartial = await PORetailerToWholesaler.countDocuments({
//       email,
//       statusAll: 'w_partial',
//     });

//     const makeToOrder = await PORetailerToWholesaler.countDocuments({
//       email,
//       statusAll: 'w_make_to_order',
//     });

//     const wholesalerConfirmed = await PORetailerToWholesaler.countDocuments({
//       email,
//       statusAll: 'w_confirmed',
//     });

//     response.retailerToWholesaler = {
//       total,
//       pending,
//       w_partial: wholesalerPartial,
//       w_make_to_order: makeToOrder,
//       w_confirmed: wholesalerConfirmed,
//     };
//   }
//   if (role === 'wholesaler') {
//     /* -------- Retailer → Wholesaler -------- */

//     const rTotal = await PORetailerToWholesaler.countDocuments({
//       wholesalerEmail: email,
//     });

//     const rPending = await PORetailerToWholesaler.countDocuments({
//       wholesalerEmail: email,
//       statusAll: 'pending',
//     });

//     const rPartial = await PORetailerToWholesaler.countDocuments({
//       wholesalerEmail: email,
//       statusAll: 'w_partial',
//     });

//     const rMakeToOrder = await PORetailerToWholesaler.countDocuments({
//       wholesalerEmail: email,
//       statusAll: 'w_make_to_order',
//     });

//     const rConfirmed = await PORetailerToWholesaler.countDocuments({
//       wholesalerEmail: email,
//       statusAll: 'w_confirmed',
//     });

//     const wTotal = await POWholesalerToManufacturer.countDocuments({
//       wholesalerEmail: email,
//     });

//     const wPending = await POWholesalerToManufacturer.countDocuments({
//       wholesalerEmail: email,
//       statusAll: 'pending',
//     });

//     const wConfirmed = await POWholesalerToManufacturer.countDocuments({
//       wholesalerEmail: email,
//       statusAll: 'm_order_confirmed',
//     });

//     const wPartial = await POWholesalerToManufacturer.countDocuments({
//       wholesalerEmail: email,
//       statusAll: 'm_partial_delivery',
//     });

//     const wCancelled = await POWholesalerToManufacturer.countDocuments({
//       wholesalerEmail: email,
//       statusAll: 'm_order_cancelled',
//     });

//     response.retailerToWholesaler = {
//       total: rTotal,
//       pending: rPending,
//       w_partial: rPartial,
//       w_make_to_order: rMakeToOrder,
//       w_confirmed: rConfirmed,
//     };

//     response.wholesalerToManufacturer = {
//       total: wTotal,
//       pending: wPending,
//       confirmed: wConfirmed,
//       partial: wPartial,
//       cancelled: wCancelled,
//     };
//   }

//   if (role === 'manufacture') {
//     const total = await POWholesalerToManufacturer.countDocuments({
//       manufacturerEmail: email,
//     });

//     const pending = await POWholesalerToManufacturer.countDocuments({
//       manufacturerEmail: email,
//       statusAll: 'pending',
//     });

//     const confirmed = await POWholesalerToManufacturer.countDocuments({
//       manufacturerEmail: email,
//       statusAll: 'm_order_confirmed',
//     });

//     const partial = await POWholesalerToManufacturer.countDocuments({
//       manufacturerEmail: email,
//       statusAll: 'm_partial_delivery',
//     });

//     const cancelled = await POWholesalerToManufacturer.countDocuments({
//       manufacturerEmail: email,
//       statusAll: 'm_order_cancelled',
//     });

//     response.wholesalerToManufacturer = {
//       total,
//       pending,
//       confirmed,
//       partial,
//       cancelled,
//     };
//   }

//   return response;
// };

// module.exports = {
//   wholesalerDashboardCountsService,
// };

const {
  PORetailerToWholesaler,
  POWholesalerToManufacturer,
  W2RPerformaInvoice,
  M2WPerformaInvoice,
  ReturnR2W,
  ReturnW2M,
  WtoRCreditNote,
  MtoWCreditNote,
} = require('../../models');

// ============================================
// 🔹 COMMON AGGREGATION BUILDER
// ============================================
const buildStatusCounts = async (Model, matchQuery, statusField = 'statusAll', statuses = []) => {
  const groupStage = {
    _id: null,
    total: { $sum: 1 },
  };

  statuses.forEach((status) => {
    groupStage[status] = {
      $sum: {
        $cond: [{ $eq: [`$${statusField}`, status] }, 1, 0],
      },
    };
  });

  const [result] = await Model.aggregate([{ $match: matchQuery }, { $group: groupStage }]);

  return result || {};
};

// ============================================
// 🔹 RETAILER → WHOLESALER
// ============================================
const getR2WCounts = async (email, role) => {
  const matchQuery = role === 'retailer' ? { email } : { wholesalerEmail: email };

  const po = await buildStatusCounts(PORetailerToWholesaler, matchQuery, 'statusAll', [
    'pending',
    'partial_delivery',
    'w_make_to_orde',
    'wholesaler_confirmed',
  ]);

  const invoice = await buildStatusCounts(
    W2RPerformaInvoice,
    role === 'wholesaler' ? { wholesalerEmail: email } : { retailerEmail: email },
    'statusAll',
    ['delivered', 'in_transit', 'cancelled']
  );

  const returns = await buildStatusCounts(ReturnR2W, matchQuery, 'statusAll', [
    'return_requested',
    'return_approved',
    'return_rejected',
    'return_in_transit',
    'return_received',
  ]);

  const creditNotes = await buildStatusCounts(WtoRCreditNote, matchQuery, 'used', [true, false]);

  return {
    po: {
      total: po.total || 0,
      pending: po.pending || 0,
      partial: po.w_partial || 0,
      makeToOrder: po.w_make_to_order || 0,
      confirmed: po.w_confirmed || 0,
    },
    invoice: {
      total: invoice.total || 0,
      delivered: invoice.delivered || 0,
      inTransit: invoice.in_transit || 0,
      cancelled: invoice.cancelled || 0,
    },
    returns: {
      total: returns.total || 0,
      requested: returns.return_requested || 0,
      approved: returns.return_approved || 0,
      rejected: returns.return_rejected || 0,
      inTransit: returns.return_in_transit || 0,
      received: returns.return_received || 0,
    },
    creditNotes: {
      total: creditNotes.total || 0,
      used: creditNotes.true || 0,
      unused: creditNotes.false || 0,
    },
  };
};

// ============================================
// 🔹 WHOLESALER → MANUFACTURER
// ============================================
const getW2MCounts = async (email, role) => {
  const matchQuery = role === 'manufacture' ? { manufacturerEmail: email } : { wholesalerEmail: email };

  const po = await buildStatusCounts(POWholesalerToManufacturer, matchQuery, 'statusAll', [
    'pending',
    'm_order_confirmed',
    'm_partial_delivery',
    'make_to_order',
  ]);

  const invoice = await buildStatusCounts(
    M2WPerformaInvoice,
    role === 'manufacture' ? { manufacturerEmail: email } : { wholesalerEmail: email },
    'statusAll',
    ['delivered', 'in_transit', 'cancelled']
  );

  const returns = await buildStatusCounts(ReturnW2M, matchQuery, 'statusAll', [
    'return_requested',
    'return_approved',
    'return_rejected',
    'return_in_transit',
    'return_received',
  ]);

  const creditNotes = await buildStatusCounts(MtoWCreditNote, matchQuery, 'used', [true, false]);

  return {
    po: {
      total: po.total || 0,
      pending: po.pending || 0,
      confirmed: po.m_order_confirmed || 0,
      partial: po.m_partial_delivery || 0,
      makeToOrder: po.make_to_order || 0,
    },
    invoice: {
      total: invoice.total || 0,
      delivered: invoice.delivered || 0,
      inTransit: invoice.in_transit || 0,
      cancelled: invoice.cancelled || 0,
    },
    returns: {
      total: returns.total || 0,
      requested: returns.return_requested || 0,
      approved: returns.return_approved || 0,
      rejected: returns.return_rejected || 0,
      inTransit: returns.return_in_transit || 0,
      received: returns.return_received || 0,
    },
    creditNotes: {
      total: creditNotes.total || 0,
      used: creditNotes.true || 0,
      unused: creditNotes.false || 0,
    },
  };
};

// ============================================
// 🔥 MAIN SERVICE
// ============================================
const wholesalerDashboardCountsService = async (role, email) => {
  const response = {};

  if (role === 'retailer') {
    response.retailerToWholesaler = await getR2WCounts(email, role);
  }

  if (role === 'wholesaler') {
    const [r2w, w2m] = await Promise.all([getR2WCounts(email, role), getW2MCounts(email, role)]);

    response.retailerToWholesaler = r2w;
    response.wholesalerToManufacturer = w2m;
  }

  if (role === 'manufacture') {
    response.wholesalerToManufacturer = await getW2MCounts(email, role);
  }

  return response;
};

module.exports = {
  wholesalerDashboardCountsService,
};
