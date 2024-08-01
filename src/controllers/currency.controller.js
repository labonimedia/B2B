const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { currencyService } = require('../services');

const queryCurrency = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'code']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await currencyService.queryCurrency(filter, options);
  res.send(result);
});

module.exports = {
  queryCurrency,
};
