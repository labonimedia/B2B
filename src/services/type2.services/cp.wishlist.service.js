const { CpWishlist } = require('../../models');

const add = async (body) => {
  return CpWishlist.create(body);
};

const get = async (cpEmail, shopkeeperEmail) => {
  return CpWishlist.find({ cpEmail, shopkeeperEmail });
};

const remove = async (id) => {
  return CpWishlist.findByIdAndDelete(id);
};

module.exports = { add, get, remove };
