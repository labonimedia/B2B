const catchAsync = require('../../utils/catchAsync');
const { referralCodeMasterService } = require('../../services');

const add = catchAsync(async (req, res) => {
  const data = await referralCodeMasterService.add(req.body);
  res.send(data);
});

const get = catchAsync(async (req, res) => {
  const data = await referralCodeMasterService.get();
  res.send(data);
});

const remove = catchAsync(async (req, res) => {
  await referralCodeMasterService.remove(req.params.id);
  res.send({ message: 'Removed successfully' });
});


const checkReferralCode = catchAsync(async (req, res) => {
  const { refCode } = req.body;

  const data = await referralCodeMasterService.checkReferralCode(refCode);

  res.send(data);
});

module.exports = { add, get, remove, checkReferralCode };