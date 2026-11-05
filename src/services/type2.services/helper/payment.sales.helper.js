
const { Payment, SalesRegistration } = require('../../../models');

/**
 * Record successful salesman discount usage.
 *
 * This is called only after payment is verified.
 * Existing payments without salesRegistrationId are ignored.
 */
const recordSalesDiscountUsage = async (payment) => {
  if (!payment.salesRegistrationId) {
    return;
  }

  // Atomically claim this payment for discount accounting.
  const claimedPayment = await Payment.findOneAndUpdate(
    {
      _id: payment._id,
      status: 'paid',
      discountApplied: false,
      salesRegistrationId: { $ne: null },
    },
    {
      $set: {
        discountApplied: true,
      },
    },
    {
      new: true,
    }
  );

  if (!claimedPayment) {
    return;
  }

  const registration = await SalesRegistration.findOneAndUpdate(
    {
      _id: claimedPayment.salesRegistrationId,
      status: 'active',
      isDeleted: false,
      $expr: {
        $lt: ['$discountUsedCount', '$discountMaxUses'],
      },
    },
    {
      $inc: {
        discountUsedCount: 1,
        totalPaid: claimedPayment.payableAmount,
      },
    },
    {
      new: true,
    }
  );

  if (!registration) {
    // This should be treated as an accounting inconsistency.
    // Do not silently discard the payment record.
    await Payment.updateOne(
      { _id: claimedPayment._id },
      { $set: { discountApplied: false } }
    );

    throw new Error(
      'Unable to record salesman discount usage. Registration may be exhausted.'
    );
  }

  if (registration.discountUsedCount >= registration.discountMaxUses) {
    registration.status = 'completed';
    await registration.save();
  }

  return registration;
};

module.exports = {
  recordSalesDiscountUsage,
};
