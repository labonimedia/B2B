const httpStatus = require('http-status');
const { SurfaceEmbellishment } = require('../models');
const ApiError = require('../utils/ApiError');

const create = (body) => SurfaceEmbellishment.create(body);

const query = (filter, options) => SurfaceEmbellishment.paginate(filter, options);

const getById = (id) => SurfaceEmbellishment.findById(id);

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
