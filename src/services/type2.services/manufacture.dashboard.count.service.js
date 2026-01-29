const { PORetailerToManufacturer , M2RPerformaInvoice, ProductType2, ReturnR2M } = require('../../models');

const getRetailerPoCounts = async ({ email, matchBy }) => {
  const matchQuery = {
    [matchBy]: email
  };

  const [result] = await PORetailerToManufacturer.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,

        total: { $sum: 1 },

        pending: {
          $sum: {
            $cond: [{ $eq: ['$statusAll', 'pending'] }, 1, 0]
          }
        },

        confirmed: {
          $sum: {
            $cond: [{ $eq: ['$statusAll', 'm_order_confirmed'] }, 1, 0]
          }
        },

        partialDelivery: {
          $sum: {
            $cond: [{ $eq: ['$statusAll', 'm_partial_delivery'] }, 1, 0]
          }
        },

        makeToOrder: {
          $sum: {
            $cond: [{ $eq: ['$statusAll', 'make_to_order'] }, 1, 0]
          }
        },

        delivered: {
          $sum: {
            $cond: [{ $eq: ['$statusAll', 'delivered'] }, 1, 0]
          }
        }
      }
    }
  ]);

  return {
    retailerPO: {
      total: result?.total || 0,
      pending: result?.pending || 0,
      confirmed: result?.confirmed || 0,
      partialDelivery: result?.partialDelivery || 0,
      makeToOrder: result?.makeToOrder || 0,
      delivered: result?.delivered || 0
    }
  };
};

const getManufacturerPORetailerCounts = async ({ email, role }) => {
  let retailerPO;

  if (role === 'manufacture') {
    retailerPO = await getRetailerPoCounts({
      email,
      matchBy: 'manufacturerEmail'
    });
  }

  if (role === 'retailer') {
    retailerPO = await getRetailerPoCounts({
      email,
      matchBy: 'email'
    });
  }

  return {
    ...retailerPO
  };
};


const getProductDashboardCounts = async ({ email, role }) => {
  let matchQuery = {};

  if (role === 'manufacture') {
    matchQuery = { productBy: email };
  }

  const [result] = await ProductType2.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        bomFilledTrue: {
          $sum: { $cond: [{ $eq: ['$bomFilled', true] }, 1, 0] }
        },
        bomFilledFalse: {
          $sum: { $cond: [{ $eq: ['$bomFilled', false] }, 1, 0] }
        }
      }
    }
  ]);

  return {
    productDashboard: {
      totalProducts: result?.totalProducts || 0,
      bomFilled: result?.bomFilledTrue || 0,
      bomNotFilled: result?.bomFilledFalse || 0
    }
  };
};

const getPerformaInvoiceDashboardCounts = async ({ email, role }) => {
  const matchQuery =
    role === 'manufacture'
      ? { manufacturerEmail: email }
      : { retailerEmail: email };

  const [result] = await M2RPerformaInvoice.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,

        totalInvoices: { $sum: 1 },
        delivered: {
          $sum: { $cond: [{ $eq: ['$statusAll', 'delivered'] }, 1, 0] }
        },
        inTransit: {
          $sum: { $cond: [{ $eq: ['$statusAll', 'in_transit'] }, 1, 0] }
        },
        cancelled: {
          $sum: { $cond: [{ $eq: ['$statusAll', 'cancelled'] }, 1, 0] }
        },
        totalAmount: { $sum: '$totalAmount' },
        finalAmount: { $sum: '$finalAmount' },
        totalDiscount: { $sum: '$discountApplied' },
        creditUsed: { $sum: '$totalCreditNoteAmountUsed' },
        payableAmount: { $sum: '$finalAmountPayable' }
      }
    }
  ]);

  return {
    invoiceDashboard: {
      totalInvoices: result?.totalInvoices || 0,
      delivered: result?.delivered || 0,
      inTransit: result?.inTransit || 0,
      cancelled: result?.cancelled || 0,
      totalAmount: result?.totalAmount || 0,
      finalAmount: result?.finalAmount || 0,
      totalDiscount: result?.totalDiscount || 0,
      creditUsed: result?.creditUsed || 0,
      payableAmount: result?.payableAmount || 0
    }
  };
};

const getReturnDashboardCounts = async ({ email, role }) => {
  const matchQuery =
    role === 'manufacture'
      ? { manufacturerEmail: email }
      : { retailerEmail: email };

  const [result] = await ReturnR2M.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,

        // 📦 COUNTS
        total: { $sum: 1 },

        requested: {
          $sum: { $cond: [{ $eq: ['$statusAll', 'return_requested'] }, 1, 0] }
        },
        approved: {
          $sum: { $cond: [{ $eq: ['$statusAll', 'return_approved'] }, 1, 0] }
        },
        rejected: {
          $sum: { $cond: [{ $eq: ['$statusAll', 'return_rejected'] }, 1, 0] }
        },
        inTransit: {
          $sum: { $cond: [{ $eq: ['$statusAll', 'return_in_transit'] }, 1, 0] }
        },
        received: {
          $sum: { $cond: [{ $eq: ['$statusAll', 'return_received'] }, 1, 0] }
        },
        creditNoteCreated: {
          $sum: { $cond: [{ $eq: ['$statusAll', 'credit_note_created'] }, 1, 0] }
        },
        resolved: {
          $sum: { $cond: [{ $eq: ['$statusAll', 'resolved'] }, 1, 0] }
        },

        // 💰 AMOUNTS
        totalAmount: { $sum: '$totalAmount' },
        finalAmount: { $sum: '$finalAmount' },
        totalDiscount: { $sum: '$discountApplied' }
      }
    }
  ]);

  return {
    returnDashboard: {
      total: result?.total || 0,
      requested: result?.requested || 0,
      approved: result?.approved || 0,
      rejected: result?.rejected || 0,
      inTransit: result?.inTransit || 0,
      received: result?.received || 0,
      creditNoteCreated: result?.creditNoteCreated || 0,
      resolved: result?.resolved || 0,

      totalAmount: result?.totalAmount || 0,
      finalAmount: result?.finalAmount || 0,
      totalDiscount: result?.totalDiscount || 0
    }
  };
};


module.exports = {
  getManufacturerPORetailerCounts,
  getProductDashboardCounts,
  getPerformaInvoiceDashboardCounts,
  getReturnDashboardCounts,
};