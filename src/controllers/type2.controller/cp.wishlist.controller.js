const catchAsync = require('../../utils/catchAsync');
const { cpWishlistService } = require('../../services');

const add = catchAsync(async (req, res) => {
  const data = await cpWishlistService.add(req.body);
  res.send(data);
});

const get = catchAsync(async (req, res) => {
  const { cpEmail, shopkeeperEmail } = req.query;
  const data = await cpWishlistService.get(cpEmail, shopkeeperEmail);
  res.send(data);
});

const remove = catchAsync(async (req, res) => {
  await cpWishlistService.remove(req.params.id);
  res.send({ message: 'Removed successfully' });
});

module.exports = { add, get, remove };
