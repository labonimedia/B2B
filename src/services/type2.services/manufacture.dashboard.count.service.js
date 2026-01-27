const { Brand } = require('../../models');
const { PORetailerToManufacturer } = require('../../models');
const { POWholesalerToManufacturer } = require('../../models');

const getBrandCounts = async (manufacturerEmail) => {
  const [result] = await Brand.aggregate([
    { $match: { brandOwner: manufacturerEmail } },
    {
      $group: {
        _id: null,
        totalBrands: { $sum: 1 },
        visibleBrands: {
          $sum: { $cond: [{ $eq: ['$visibility', true] }, 1, 0] }
        },
        hiddenBrands: {
          $sum: { $cond: [{ $eq: ['$visibility', false] }, 1, 0] }
        }
      }
    }
  ]);

  return {
    totalBrands: result?.totalBrands || 0,
    visibleBrands: result?.visibleBrands || 0,
    hiddenBrands: result?.hiddenBrands || 0
  };
};


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

const getWholesalerPoCounts = async (manufacturerEmail) => {
  const [result] = await POWholesalerToManufacturer.aggregate([
    { $match: { manufacturerEmail } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: {
          $sum: { $cond: [{ $eq: ['$statusAll', 'pending'] }, 1, 0] }
        },
        confirmed: {
          $sum: {
            $cond: [
              { $in: ['$statusAll', ['m_order_confirmed', 'w_order_confirmed']] },
              1,
              0
            ]
          }
        },
        cancelled: {
          $sum: {
            $cond: [
              { $in: ['$statusAll', ['m_order_cancelled', 'w_order_cancelled']] },
              1,
              0
            ]
          }
        },
        delivered: {
          $sum: { $cond: [{ $eq: ['$statusAll', 'delivered'] }, 1, 0] }
        }
      }
    }
  ]);

  return {
    wholesalerPO: {
      total: result?.total || 0,
      pending: result?.pending || 0,
      confirmed: result?.confirmed || 0,
      cancelled: result?.cancelled || 0,
      delivered: result?.delivered || 0
    }
  };
};


const getManufacturerDashboardCounts = async ({ email, role }) => {
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

module.exports = {
  getManufacturerDashboardCounts,
};