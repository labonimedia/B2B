const { PORetailerToWholesaler, POWholesalerToManufacturer } = require('../../models');

const wholesalerDashboardCountsService = async (role, email) => {
  const response = {};
  if (role === 'retailer') {
    const total = await PORetailerToWholesaler.countDocuments({
      email,
    });

    const pending = await PORetailerToWholesaler.countDocuments({
      email,
      statusAll: 'pending',
    });

    const wholesalerPartial = await PORetailerToWholesaler.countDocuments({
      email,
      statusAll: 'w_partial',
    });

    const makeToOrder = await PORetailerToWholesaler.countDocuments({
      email,
      statusAll: 'w_make_to_order',
    });

    const wholesalerConfirmed = await PORetailerToWholesaler.countDocuments({
      email,
      statusAll: 'w_confirmed',
    });

    response.retailerToWholesaler = {
      total,
      pending,
      w_partial: wholesalerPartial,
      w_make_to_order: makeToOrder,
      w_confirmed: wholesalerConfirmed,
    };
  }
  if (role === 'wholesaler') {
    /* -------- Retailer → Wholesaler -------- */

    const rTotal = await PORetailerToWholesaler.countDocuments({
      wholesalerEmail: email,
    });

    const rPending = await PORetailerToWholesaler.countDocuments({
      wholesalerEmail: email,
      statusAll: 'pending',
    });

    const rPartial = await PORetailerToWholesaler.countDocuments({
      wholesalerEmail: email,
      statusAll: 'w_partial',
    });

    const rMakeToOrder = await PORetailerToWholesaler.countDocuments({
      wholesalerEmail: email,
      statusAll: 'w_make_to_order',
    });

    const rConfirmed = await PORetailerToWholesaler.countDocuments({
      wholesalerEmail: email,
      statusAll: 'w_confirmed',
    });

    const wTotal = await POWholesalerToManufacturer.countDocuments({
      wholesalerEmail: email,
    });

    const wPending = await POWholesalerToManufacturer.countDocuments({
      wholesalerEmail: email,
      statusAll: 'pending',
    });

    const wConfirmed = await POWholesalerToManufacturer.countDocuments({
      wholesalerEmail: email,
      statusAll: 'm_order_confirmed',
    });

    const wPartial = await POWholesalerToManufacturer.countDocuments({
      wholesalerEmail: email,
      statusAll: 'm_partial_delivery',
    });

    const wCancelled = await POWholesalerToManufacturer.countDocuments({
      wholesalerEmail: email,
      statusAll: 'm_order_cancelled',
    });

    response.retailerToWholesaler = {
      total: rTotal,
      pending: rPending,
      w_partial: rPartial,
      w_make_to_order: rMakeToOrder,
      w_confirmed: rConfirmed,
    };

    response.wholesalerToManufacturer = {
      total: wTotal,
      pending: wPending,
      confirmed: wConfirmed,
      partial: wPartial,
      cancelled: wCancelled,
    };
  }

  if (role === 'manufacture') {
    const total = await POWholesalerToManufacturer.countDocuments({
      manufacturerEmail: email,
    });

    const pending = await POWholesalerToManufacturer.countDocuments({
      manufacturerEmail: email,
      statusAll: 'pending',
    });

    const confirmed = await POWholesalerToManufacturer.countDocuments({
      manufacturerEmail: email,
      statusAll: 'm_order_confirmed',
    });

    const partial = await POWholesalerToManufacturer.countDocuments({
      manufacturerEmail: email,
      statusAll: 'm_partial_delivery',
    });

    const cancelled = await POWholesalerToManufacturer.countDocuments({
      manufacturerEmail: email,
      statusAll: 'm_order_cancelled',
    });

    response.wholesalerToManufacturer = {
      total,
      pending,
      confirmed,
      partial,
      cancelled,
    };
  }

  return response;
};

module.exports = {
  wholesalerDashboardCountsService,
};
