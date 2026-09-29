const httpStatus = require('http-status');

const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

const {
  weaverProductService,
} = require('../../services');

const {
  deleteFile,
} = require('../../utils/upload');

/**
 * =========================================================
 * Create Product
 * =========================================================
 */

const createProduct = catchAsync(
  async (req, res) => {
    /**
     * Product images are uploaded through
     * commonUploadMiddleware.
     */

    if (
      !req.body.productImages ||
      !Array.isArray(req.body.productImages) ||
      req.body.productImages.length === 0
    ) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'At least one product image is required'
      );
    }

    /**
     * Maximum 5 images
     */

    if (
      req.body.productImages.length > 5
    ) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Maximum 5 product images are allowed'
      );
    }

    /**
     * Owner should come from logged-in user
     */

    if (req.user && req.user.email) {
      req.body.productOwner =
        req.user.email.toLowerCase();
    }

    const product =
      await weaverProductService.createProduct(
        req.body
      );

    res
      .status(httpStatus.CREATED)
      .send(product);
  }
);

/**
 * =========================================================
 * Query Products
 * =========================================================
 */

const queryProduct = catchAsync(
  async (req, res) => {
    const {
      designNumber,
      brand,
      productOwner,
      productType,
      weaveType,
      fabricsType,
      isActive,
    } = req.query;

    const filter = {};

    if (designNumber) {
      filter.designNumber = {
        $regex: designNumber,
        $options: 'i',
      };
    }

    if (brand) {
      filter.brand = {
        $regex: brand,
        $options: 'i',
      };
    }

    if (productOwner) {
      filter.productOwner =
        productOwner.toLowerCase();
    }

    if (productType) {
      filter.productType = {
        $regex: productType,
        $options: 'i',
      };
    }

    if (weaveType) {
      filter.weaveType = {
        $regex: weaveType,
        $options: 'i',
      };
    }

    if (fabricsType) {
      filter.fabricsType = {
        $regex: fabricsType,
        $options: 'i',
      };
    }

    if (isActive !== undefined) {
      filter.isActive =
        isActive === 'true';
    }

    const options = pick(
      req.query,
      [
        'sortBy',
        'limit',
        'page',
      ]
    );

    const result =
      await weaverProductService.queryProduct(
        filter,
        options
      );

    res.send(result);
  }
);

/**
 * =========================================================
 * Get Product By ID
 * =========================================================
 */

const getProductById = catchAsync(
  async (req, res) => {
    const product =
      await weaverProductService.getProductById(
        req.params.id
      );

    if (!product) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Product not found'
      );
    }

    res.send(product);
  }
);

/**
 * =========================================================
 * Get Product By Design Number
 * =========================================================
 */

const getProductByDesignNumber =
  catchAsync(
    async (req, res) => {
      const {
        designNumber,
        productOwner,
      } = req.query;

      if (!designNumber) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'designNumber is required'
        );
      }

      /**
       * If owner is not passed,
       * use logged-in user's email.
       */

      const owner =
        productOwner ||
        req.user.email;

      const product =
        await weaverProductService
          .getProductByDesignNumber(
            designNumber,
            owner
          );

      if (!product) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'Product not found'
        );
      }

      res.send(product);
    }
  );

/**
 * =========================================================
 * Update Product
 * =========================================================
 */

const updateProductById =
  catchAsync(
    async (req, res) => {
      /**
       * If new product images are uploaded,
       * commonUploadMiddleware will put them
       * inside req.body.productImages.
       */

      const existingProduct =
        await weaverProductService
          .getProductById(
            req.params.id
          );

      if (!existingProduct) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'Product not found'
        );
      }

      /**
       * If new images are provided,
       * replace existing images.
       */

      if (
        req.body.productImages &&
        Array.isArray(
          req.body.productImages
        )
      ) {
        if (
          req.body.productImages.length > 5
        ) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            'Maximum 5 product images are allowed'
          );
        }

        /**
         * Delete old images
         */

        if (
          existingProduct.productImages &&
          existingProduct.productImages.length
        ) {
          await Promise.all(
            existingProduct.productImages.map(
              (image) =>
                deleteFile(image)
            )
          );
        }
      }

      const updatedProduct =
        await weaverProductService
          .updateProductById(
            req.params.id,
            req.body
          );

      res.send(updatedProduct);
    }
  );

/**
 * =========================================================
 * Delete Product
 * =========================================================
 */

const deleteProductById =
  catchAsync(
    async (req, res) => {
      const product =
        await weaverProductService
          .deleteProductById(
            req.params.id
          );

      /**
       * Delete product images
       */

      if (
        product.productImages &&
        product.productImages.length
      ) {
        await Promise.all(
          product.productImages.map(
            (image) =>
              deleteFile(image)
          )
        );
      }

      res
        .status(httpStatus.NO_CONTENT)
        .send();
    }
  );

/**
 * =========================================================
 * Search Products
 * =========================================================
 */

const searchProducts =
  catchAsync(
    async (req, res) => {
      const {
        search,
        ...bodyFilters
      } = req.body;

      const filter = {};

      /**
       * Remove empty filters
       */

      Object.keys(bodyFilters).forEach(
        (key) => {
          const value =
            bodyFilters[key];

          if (
            value !== '' &&
            value !== null &&
            value !== undefined
          ) {
            filter[key] = value;
          }
        }
      );

      /**
       * For Weaver Manufacture:
       * always restrict product owner
       */

      if (req.user?.email) {
        filter.productOwner =
          req.user.email.toLowerCase();
      }

      const options = {
        limit:
          parseInt(
            req.body.limit,
            10
          ) || 10,

        page:
          parseInt(
            req.body.page,
            10
          ) || 1,

        sortBy:
          req.body.sortBy ||
          'createdAt:desc',
      };

      const products =
        await weaverProductService
          .searchProducts(
            search,
            filter,
            options
          );

      res
        .status(httpStatus.OK)
        .send(products);
    }
  );

/**
 * =========================================================
 * Check Product Existence
 * =========================================================
 */

const checkProductExistence =
  catchAsync(
    async (req, res) => {
      const {
        designNumber,
      } = req.body;

      if (!designNumber) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'designNumber is required'
        );
      }

      const product =
        await weaverProductService
          .checkProductExistence(
            designNumber,
            req.user.email
          );

      if (product) {
        return res
          .status(httpStatus.OK)
          .send({
            exists: true,
            product,
          });
      }

      return res
        .status(httpStatus.OK)
        .send({
          exists: false,
          product: null,
        });
    }
  );

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