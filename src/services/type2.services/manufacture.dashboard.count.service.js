const redisClient = require('../../utils/redis');
const {
  PORetailerToManufacturer,
  M2RPerformaInvoice,
  ProductType2,
  ReturnR2M,
  MtoRCreditNote,
  User,
  Wholesaler,
  Retailer,
  Request,
  Invitation,
  RetailerCategory,
  WholesalerCategory,
  ManufactureInventory,
  ManufactureRawMaterialInventory,
} = require('../../models');

const getRetailerPoCounts = async ({ email, matchBy }) => {
  const matchQuery = {
    [matchBy]: email,
  };

  const [result] = await PORetailerToManufacturer.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,

        total: { $sum: 1 },

        pending: {
          $sum: {
            $cond: [{ $eq: ['$statusAll', 'pending'] }, 1, 0],
          },
        },

        confirmed: {
          $sum: {
            $cond: [{ $eq: ['$statusAll', 'm_order_confirmed'] }, 1, 0],
          },
        },

        partialDelivery: {
          $sum: {
            $cond: [{ $eq: ['$statusAll', 'm_partial_delivery'] }, 1, 0],
          },
        },

        makeToOrder: {
          $sum: {
            $cond: [{ $eq: ['$statusAll', 'make_to_order'] }, 1, 0],
          },
        },

        delivered: {
          $sum: {
            $cond: [{ $eq: ['$statusAll', 'delivered'] }, 1, 0],
          },
        },
      },
    },
  ]);

  return {
    retailerPO: {
      total: result?.total || 0,
      pending: result?.pending || 0,
      confirmed: result?.confirmed || 0,
      partialDelivery: result?.partialDelivery || 0,
      makeToOrder: result?.makeToOrder || 0,
      delivered: result?.delivered || 0,
    },
  };
};

const getManufacturerPORetailerCounts = async ({ email, role }) => {
  let retailerPO;

  if (role === 'manufacture') {
    retailerPO = await getRetailerPoCounts({
      email,
      matchBy: 'manufacturerEmail',
    });
  }

  if (role === 'retailer') {
    retailerPO = await getRetailerPoCounts({
      email,
      matchBy: 'email',
    });
  }

  return {
    ...retailerPO,
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
          $sum: { $cond: [{ $eq: ['$bomFilled', true] }, 1, 0] },
        },
        bomFilledFalse: {
          $sum: { $cond: [{ $eq: ['$bomFilled', false] }, 1, 0] },
        },
      },
    },
  ]);

  return {
    productDashboard: {
      totalProducts: result?.totalProducts || 0,
      bomFilled: result?.bomFilledTrue || 0,
      bomNotFilled: result?.bomFilledFalse || 0,
    },
  };
};

const getPerformaInvoiceDashboardCounts = async ({ email, role }) => {
  const matchQuery = role === 'manufacture' ? { manufacturerEmail: email } : { retailerEmail: email };

  const [result] = await M2RPerformaInvoice.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,

        totalInvoices: { $sum: 1 },
        delivered: {
          $sum: { $cond: [{ $eq: ['$statusAll', 'delivered'] }, 1, 0] },
        },
        inTransit: {
          $sum: { $cond: [{ $eq: ['$statusAll', 'in_transit'] }, 1, 0] },
        },
        cancelled: {
          $sum: { $cond: [{ $eq: ['$statusAll', 'cancelled'] }, 1, 0] },
        },
        totalAmount: { $sum: '$totalAmount' },
        finalAmount: { $sum: '$finalAmount' },
        totalDiscount: { $sum: '$discountApplied' },
        creditUsed: { $sum: '$totalCreditNoteAmountUsed' },
        payableAmount: { $sum: '$finalAmountPayable' },
      },
    },
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
      payableAmount: result?.payableAmount || 0,
    },
  };
};

const getReturnDashboardCounts = async ({ email, role }) => {
  const matchQuery = role === 'manufacture' ? { manufacturerEmail: email } : { retailerEmail: email };

  const [result] = await ReturnR2M.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,

        // 📦 COUNTS
        total: { $sum: 1 },

        requested: {
          $sum: { $cond: [{ $eq: ['$statusAll', 'return_requested'] }, 1, 0] },
        },
        approved: {
          $sum: { $cond: [{ $eq: ['$statusAll', 'return_approved'] }, 1, 0] },
        },
        rejected: {
          $sum: { $cond: [{ $eq: ['$statusAll', 'return_rejected'] }, 1, 0] },
        },
        inTransit: {
          $sum: { $cond: [{ $eq: ['$statusAll', 'return_in_transit'] }, 1, 0] },
        },
        received: {
          $sum: { $cond: [{ $eq: ['$statusAll', 'return_received'] }, 1, 0] },
        },
        creditNoteCreated: {
          $sum: { $cond: [{ $eq: ['$statusAll', 'credit_note_created'] }, 1, 0] },
        },
        resolved: {
          $sum: { $cond: [{ $eq: ['$statusAll', 'resolved'] }, 1, 0] },
        },

        // 💰 AMOUNTS
        totalAmount: { $sum: '$totalAmount' },
        finalAmount: { $sum: '$finalAmount' },
        totalDiscount: { $sum: '$discountApplied' },
      },
    },
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
      totalDiscount: result?.totalDiscount || 0,
    },
  };
};

const getCreditNoteDashboardCounts = async ({ email, role }) => {
  const matchQuery = role === 'manufacture' ? { manufacturerEmail: email } : { retailerEmail: email };

  const [result] = await MtoRCreditNote.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,

        // 📦 COUNTS
        totalNotes: { $sum: 1 },

        usedNotes: {
          $sum: { $cond: [{ $eq: ['$used', true] }, 1, 0] },
        },

        unusedNotes: {
          $sum: { $cond: [{ $eq: ['$used', false] }, 1, 0] },
        },

        deletedNotes: {
          $sum: { $cond: [{ $eq: ['$isDeleted', true] }, 1, 0] },
        },

        // 📊 ITEM COUNTS
        totalReturnItems: { $sum: '$totalReturnItem' },
        totalAcceptedReturnItems: { $sum: '$totalAcceptedReturnItem' },

        // 💰 AMOUNTS
        totalCreditAmount: { $sum: '$totalCreditAmount' },

        usedCreditAmount: {
          $sum: {
            $cond: [{ $eq: ['$used', true] }, '$totalCreditAmount', 0],
          },
        },

        unusedCreditAmount: {
          $sum: {
            $cond: [{ $eq: ['$used', false] }, '$totalCreditAmount', 0],
          },
        },
      },
    },
  ]);

  return {
    creditNoteDashboard: {
      totalNotes: result?.totalNotes || 0,
      usedNotes: result?.usedNotes || 0,
      unusedNotes: result?.unusedNotes || 0,
      deletedNotes: result?.deletedNotes || 0,

      totalReturnItems: result?.totalReturnItems || 0,
      totalAcceptedReturnItems: result?.totalAcceptedReturnItems || 0,

      totalCreditAmount: result?.totalCreditAmount || 0,
      usedCreditAmount: result?.usedCreditAmount || 0,
      unusedCreditAmount: result?.unusedCreditAmount || 0,
    },
  };
};

const getReferredUsersDashboardCounts = async (refByEmail) => {
  // 1️⃣ Find referred users
  const users = await User.find({ refByEmail }).select('email');

  const referredEmails = users.map((u) => u.email);

  if (!referredEmails.length) {
    return {
      wholesalers: { total: 0, active: 0, kycVerified: 0, discountAssigned: 0 },
      retailers: { total: 0, active: 0, kycVerified: 0 },
    };
  }

  // 2️⃣ WHOLESALER COUNTS
  const wholesalerCounts = await Wholesaler.aggregate([
    { $match: { email: { $in: referredEmails } } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },

        active: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] },
        },

        kycVerified: {
          $sum: { $cond: [{ $eq: ['$kycVerified', true] }, 1, 0] },
        },

        discountAssigned: {
          $sum: {
            $cond: [{ $gt: [{ $size: '$discountGiven' }, 0] }, 1, 0],
          },
        },
      },
    },
  ]);

  // 3️⃣ RETAILER COUNTS
  const retailerCounts = await Retailer.aggregate([
    { $match: { email: { $in: referredEmails } } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },

        active: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] },
        },

        kycVerified: {
          $sum: { $cond: [{ $eq: ['$kycVerified', true] }, 1, 0] },
        },
      },
    },
  ]);

  return {
    wholesalers: {
      total: wholesalerCounts[0]?.total || 0,
      active: wholesalerCounts[0]?.active || 0,
      kycVerified: wholesalerCounts[0]?.kycVerified || 0,
      discountAssigned: wholesalerCounts[0]?.discountAssigned || 0,
    },
    retailers: {
      total: retailerCounts[0]?.total || 0,
      active: retailerCounts[0]?.active || 0,
      kycVerified: retailerCounts[0]?.kycVerified || 0,
    },
  };
};

const getRequestDashboardCounts = async ({ email, role }) => {
  const matchCondition = role === 'manufacture' ? { email } : { requestByEmail: email };

  const [result] = await Request.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },

        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
        },

        accepted: {
          $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] },
        },

        rejected: {
          $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] },
        },
      },
    },
  ]);

  return {
    requests: {
      total: result?.[0]?.total || 0,
      pending: result?.[0]?.pending || 0,
      accepted: result?.[0]?.accepted || 0,
      rejected: result?.[0]?.rejected || 0,
    },
  };
};

const getInvitationDashboardCounts = async (manufacturerEmail) => {
  const [result] = await Invitation.aggregate([
    {
      $match: {
        invitedBy: manufacturerEmail,
      },
    },
    {
      $group: {
        _id: null,

        // 🔹 TOTAL
        total: { $sum: 1 },

        // 🔹 STATUS BASED
        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
        },
        accepted: {
          $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] },
        },

        // 🔹 ROLE BASED
        retailer: {
          $sum: { $cond: [{ $eq: ['$role', 'retailer'] }, 1, 0] },
        },
        wholesaler: {
          $sum: { $cond: [{ $eq: ['$role', 'wholesaler'] }, 1, 0] },
        },
      },
    },
  ]);

  return {
    invitations: {
      total: result?.total || 0,
      pending: result?.pending || 0,
      accepted: result?.accepted || 0,
      retailer: result?.retailer || 0,
      wholesaler: result?.wholesaler || 0,
    },
  };
};

const getCategoryDashboardCounts = async (manufacturerEmail) => {
  const [retailerCount, wholesalerCount] = await Promise.all([
    RetailerCategory.countDocuments({ categoryBy: manufacturerEmail }),
    WholesalerCategory.countDocuments({ categoryBy: manufacturerEmail }),
  ]);

  return {
    categories: {
      retailer: {
        total: retailerCount,
      },
      wholesaler: {
        total: wholesalerCount,
      },
      overall: {
        total: retailerCount + wholesalerCount,
      },
    },
  };
};

const getDashboardOverview = async ({ email, role }) => {
  const cacheKey = `dashboard:${role}:${email}`;

  // 🔥 1. TRY CACHE
  const cached = await redisClient?.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // 🔥 2. PARALLEL EXECUTION
  const [
    po,
    products,
    returns,
    creditNotes,
    requests,
    invitations,
    categories,
  ] = await Promise.all([
    getRetailerPoCounts(email, role),
    getProductCounts(email),
    getReturnCounts(email, role),
    getCreditNoteCounts(email, role),
    getRequestCounts(email),
    getInvitationCounts(email),
    getCategoryDashboardCounts(email),
  ]);

  const dashboardData = {
    po,
    products,
    returns,
    creditNotes,
    requests,
    invitations,
    categories,
  };

  // 🔥 3. CACHE RESULT (30–60 sec is perfect)
  await redisClient?.setEx(cacheKey, 60, JSON.stringify(dashboardData));

  return dashboardData;
};

const getInventoryLowStockCounts = async (email) => {
  // Finished goods low stock
  const finishedGoodsLowStock = await ManufactureInventory.countDocuments({
    userEmail: email,
    $expr: { $lte: ['$quantity', '$minimumQuantityAlert'] },
  });

  // Raw material low stock
  const rawMaterialLowStock = await ManufactureRawMaterialInventory.countDocuments({
    email,
    $expr: { $lte: ['$currentStock', '$minimumStockLevel'] },
  });

  return {
    finishedGoodsLowStock,
    rawMaterialLowStock,
    totalLowStockItems: finishedGoodsLowStock + rawMaterialLowStock,
  };
};

module.exports = {
  getManufacturerPORetailerCounts,
  getProductDashboardCounts,
  getPerformaInvoiceDashboardCounts,
  getReturnDashboardCounts,
  getCreditNoteDashboardCounts,
  getReferredUsersDashboardCounts,
  getRequestDashboardCounts,
  getInvitationDashboardCounts,
  getCategoryDashboardCounts,
  getDashboardOverview,
  getInventoryLowStockCounts,
};
