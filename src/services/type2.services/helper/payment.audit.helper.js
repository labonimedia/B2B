/**
 * Add Payment History
 */

const addPaymentHistory = (
  payment,
  event,
  status,
  message,
  payload = {}
) => {
  payment.history.push({
    event,
    status,
    message,
    payload,
  });
};

module.exports = {
  addPaymentHistory,
};