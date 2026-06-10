const httpStatus = require('http-status');
const { WeaveMethod } = require('../models');
const ApiError = require('../utils/ApiError');

const create = (body) => WeaveMethod.create(body);

const query = (filter, options) => WeaveMethod.paginate(filter, options);

const getById = (id) => WeaveMethod.findById(id);

const updateById = async (id, body) => {
  const data = await getById(id);
  if (!data) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  Object.assign(data, body);
  await data.save();
  return data;
};

const deleteById = async (id) => {
  const data = await getById(id);
  if (!data) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  await data.remove();
};

module.exports = { create, query, getById, updateById, deleteById };
