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

    const processing = await PORetailerToWholesaler.countDocuments({
      email,
      statusAll: 'processing',
    });

    const delivered = await PORetailerToWholesaler.countDocuments({
      email,
      statusAll: 'delivered',
    });

    const cancelled = await PORetailerToWholesaler.countDocuments({
      email,
      statusAll: 'retailer_cancelled',
    });

    response.retailerToWholesaler = {
      total,
      pending,
      processing,
      delivered,
      cancelled,
    };
  }

  if (role === 'wholesaler') {
    /* ---- Retailer → Wholesaler ---- */
    const rTotal = await PORetailerToWholesaler.countDocuments({
      wholesalerEmail: email,
    });

    const rPending = await PORetailerToWholesaler.countDocuments({
      wholesalerEmail: email,
      statusAll: 'pending',
    });

    const rProcessing = await PORetailerToWholesaler.countDocuments({
      wholesalerEmail: email,
      statusAll: 'processing',
    });

    const rDelivered = await PORetailerToWholesaler.countDocuments({
      wholesalerEmail: email,
      statusAll: 'delivered',
    });

    /* ---- Wholesaler → Manufacturer ---- */
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

    const wDelivered = await POWholesalerToManufacturer.countDocuments({
      wholesalerEmail: email,
      statusAll: 'delivered',
    });

    response.retailerToWholesaler = {
      total: rTotal,
      pending: rPending,
      processing: rProcessing,
      delivered: rDelivered,
    };

    response.wholesalerToManufacturer = {
      total: wTotal,
      pending: wPending,
      confirmed: wConfirmed,
      delivered: wDelivered,
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

    const delivered = await POWholesalerToManufacturer.countDocuments({
      manufacturerEmail: email,
      statusAll: 'delivered',
    });

    response.wholesalerToManufacturer = {
      total,
      pending,
      confirmed,
      partial,
      delivered,
    };
  }

  return response;
};

module.exports = {
  wholesalerDashboardCountsService,
};
