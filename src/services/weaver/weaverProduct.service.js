const httpStatus = require('http-status');

const {
  WeaverProduct,
  WeaverBrand,
  WeaverManufacture,
} = require('../../models');

const ApiError = require('../../utils/ApiError');

/**
 * =========================================================
 * Create Weaver Product
 * =========================================================
 */

const createProduct = async (reqBody) => {
  const {
    productOwner,
    designNumber,
    brand,
    productTitle,
    price,
  } = reqBody;

  /**
   * Validate required fields
   */

  if (!productOwner) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Product owner is required'
    );
  }

  if (!designNumber) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Design number is required'
    );
  }

  if (!brand) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Brand is required'
    );
  }

  if (!productTitle) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Product title is required'
    );
  }

  if (
    price === undefined ||
    price === null ||
    price === ''
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Price is required'
    );
  }

  /**
   * =========================================================
   * Check duplicate design number for same owner
   * =========================================================
   */

  const existingProduct = await WeaverProduct.findOne({
    productOwner: productOwner.trim().toLowerCase(),
    designNumber: designNumber.trim(),
  });

  if (existingProduct) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Product with this design number already exists'
    );
  }

  /**
   * =========================================================
   * Validate Brand
   *
   * Brand should belong to the same owner.
   * =========================================================
   */

  const existingBrand = await WeaverBrand.findOne({
    brandName: brand.trim(),
    brandOwner: productOwner.trim().toLowerCase(),
  });

  if (!existingBrand) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Brand not found for this product owner'
    );
  }

  /**
   * =========================================================
   * Create Product
   * =========================================================
   */

  return WeaverProduct.create(reqBody);
};

/**
 * =========================================================
 * Query Products
 * =========================================================
 */

const queryProduct = async (filter, options) => {
  return WeaverProduct.paginate(filter, options);
};

/**
 * =========================================================
 * Get Product By ID
 * =========================================================
 */

const getProductById = async (id) => {
  return WeaverProduct.findById(id);
};

/**
 * =========================================================
 * Get Product By Design Number
 * =========================================================
 */

const getProductByDesignNumber = async (
  designNumber,
  productOwner
) => {
  return WeaverProduct.findOne({
    designNumber: designNumber.trim(),
    productOwner: productOwner.trim().toLowerCase(),
  });
};

/**
 * =========================================================
 * Update Product
 * =========================================================
 */

const updateProductById = async (
  id,
  updateBody
) => {
  const product = await getProductById(id);

  if (!product) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Product not found'
    );
  }

  /**
   * Check duplicate design number
   */

  if (
    updateBody.designNumber ||
    updateBody.productOwner
  ) {
    const designNumber =
      updateBody.designNumber ||
      product.designNumber;

    const productOwner =
      updateBody.productOwner ||
      product.productOwner;

    const duplicateProduct =
      await WeaverProduct.findOne({
        _id: {
          $ne: id,
        },

        productOwner:
          productOwner.trim().toLowerCase(),

        designNumber:
          designNumber.trim(),
      });

    if (duplicateProduct) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Product with this design number already exists'
      );
    }
  }

  /**
   * Prevent changing owner accidentally
   */

  if (updateBody.productOwner) {
    updateBody.productOwner =
      updateBody.productOwner
        .trim()
        .toLowerCase();
  }

  Object.assign(
    product,
    updateBody
  );

  await product.save();

  return product;
};

/**
 * =========================================================
 * Delete Product
 * =========================================================
 */

const deleteProductById = async (id) => {
  const product = await getProductById(id);

  if (!product) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Product not found'
    );
  }

  await WeaverProduct.deleteOne({
    _id: id,
  });

  return product;
};

/**
 * =========================================================
 * Search Products
 * =========================================================
 */

const searchProducts = async (
  search,
  filter,
  options
) => {
  const query = {
    ...filter,
  };

  if (search) {
    query.$text = {
      $search: search,
    };
  }

  return WeaverProduct.paginate(
    query,
    options
  );
};

/**
 * =========================================================
 * Check Product Existence
 * =========================================================
 */

const checkProductExistence = async (
  designNumber,
  productOwner
) => {
  return WeaverProduct.findOne({
    designNumber: designNumber.trim(),
    productOwner:
      productOwner.trim().toLowerCase(),
  });
};

module.exports = {
  createProduct,
  queryProduct,
  getProductById,
  getProductByDesignNumber,
  updateProductById,
  deleteProductById,
  searchProducts,
  checkProductExistence,
};