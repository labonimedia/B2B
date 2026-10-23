const catchAsync = require('../../utils/catchAsync');
const { referralCodeUsedService } = require('../../services');

const add = catchAsync(async (req, res) => {
  const data = await referralCodeUsedService.add(req.body);

  res.send(data);
});

const check = catchAsync(async (req, res) => {
  const { refEmail, refCode } = req.body;

  const data = await referralCodeUsedService.check(
    refEmail,
    refCode
  );

  res.send(data);
});

const get = catchAsync(async (req, res) => {
  const { byEmail, refEmail, refCode } = req.query;

  const data = await referralCodeUsedService.get({
    byEmail,
    refEmail,
    refCode,
  });

  res.send(data);
});

const remove = catchAsync(async (req, res) => {
  await referralCodeUsedService.remove(req.params.id);

  res.send({
    message: 'Removed successfully',
  });
});

module.exports = {
  add,
  check,
  get,
  remove,
};