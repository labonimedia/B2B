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

const getR2WCounts = async (email, role) => {
  const matchQuery = role === 'retailer' ? { email } : { wholesalerEmail: email };

  const po = await buildStatusCounts(PORetailerToWholesaler, matchQuery, 'statusAll', [
    'pending',
    'partial_delivery',
    'w_make_to_order',
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
      partial: po.partial_delivery || 0,
      makeToOrder: po.w_make_to_order || 0,
      confirmed: po.wholesaler_confirmed || 0,
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
