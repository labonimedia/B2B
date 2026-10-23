const mongoose = require('mongoose');

const { toJSON, paginate } = require('../plugins');

const weaverProductSchema = mongoose.Schema(
  {
    /**
     * =========================================================
     * Owner Details
     * =========================================================
     */

    productOwner: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },

    /**
     * =========================================================
     * Basic Product Details
     * =========================================================
     */

    designNumber: {
      type: String,
      trim: true,
      required: true,
    },

    brand: {
      type: String,
      trim: true,
      required: true,
    },

    productTitle: {
      type: String,
      trim: true,
      required: true,
    },

    productDescription: {
      type: String,
      trim: true,
    },

    /**
     * =========================================================
     * Product Details
     * =========================================================
     */

    productType: {
      type: String,
      trim: true,
    },

    weaveType: {
      type: String,
      trim: true,
    },

    ethnicDesign: {
      type: String,
      trim: true,
    },

    fabricsType: {
      type: String,
      trim: true,
    },

    occasion: {
      type: String,
      trim: true,
    },

    includedComponents: {
      type: String,
      trim: true,
    },

    embellishmentFeature: {
      type: String,
      trim: true,
    },

    dyeingType: {
      type: String,
      trim: true,
    },

    finishType: {
      type: String,
      trim: true,
    },

    fabricsCut: {
      type: String,
      trim: true,
    },

    fabricPattern: {
      type: String,
      trim: true,
    },

    fabricsPanna: {
      type: String,
      trim: true,
    },

    /**
     * =========================================================
     * Fabric Materials
     *
     * Example:
     * [
     *   {
     *     materialNo: 1,
     *     enabled: true,
     *     pick: "72",
     *     panna: "50",
     *     material: "60/24-1000 TPM"
     *   }
     * ]
     * =========================================================
     */

    fabricMaterials: [
      {
        materialNo: {
          type: Number,
        },

        enabled: {
          type: Boolean,
          default: false,
        },

        pick: {
          type: String,
          trim: true,
        },

        panna: {
          type: String,
          trim: true,
        },

        material: {
          type: String,
          trim: true,
        },
      },
    ],

    /**
     * =========================================================
     * Size Set
     *
     * Example:
     * [
     *   {
     *     pick: "72",
     *     panna: "50",
     *     material: "60/24-1000 TPM"
     *   }
     * ]
     * =========================================================
     */

    sizeSet: [
      {
        pick: {
          type: String,
          trim: true,
        },

        panna: {
          type: String,
          trim: true,
        },

        material: {
          type: String,
          trim: true,
        },
      },
    ],

    /**
     * =========================================================
     * Tax Details
     * =========================================================
     */

    hsnCode: {
      type: String,
      trim: true,
    },

    gstRate: {
      type: Number,
      min: 0,
    },

    hsnDescription: {
      type: String,
      trim: true,
    },

    /**
     * =========================================================
     * Pricing
     * =========================================================
     */

    price: {
      type: Number,
      min: 0,
      required: true,
    },

    priceUnit: {
      type: String,
      trim: true,
      default: 'per meter',
    },

    /**
     * =========================================================
     * Packaging Dimensions
     * =========================================================
     */

    dimensions: {
      length: {
        type: String,
        trim: true,
      },

      width: {
        type: String,
        trim: true,
      },

      height: {
        type: String,
        trim: true,
      },

      weight: {
        type: String,
        trim: true,
      },
    },

    /**
     * =========================================================
     * Manufacturing Details
     * =========================================================
     */

    dateOfManufacture: {
      type: Date,
    },

    /**
     * =========================================================
     * Product Images
     * Maximum 5
     * =========================================================
     */

    productImages: [
      {
        type: String,
      },
    ],

    /**
     * =========================================================
     * Status
     * =========================================================
     */

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * =========================================================
 * Indexes
 * =========================================================
 */

weaverProductSchema.index(
  {
    productOwner: 1,
    designNumber: 1,
  },
  {
    unique: true,
  }
);

weaverProductSchema.index({
  designNumber: 'text',
  brand: 'text',
  productTitle: 'text',
  productDescription: 'text',
  productType: 'text',
  weaveType: 'text',
  ethnicDesign: 'text',
  fabricsType: 'text',
  occasion: 'text',
  fabricPattern: 'text',
  fabricsMaterials: 'text',
  hsnCode: 'text',
});

/**
 * Plugins
 */

weaverProductSchema.plugin(toJSON);
weaverProductSchema.plugin(paginate);

const WeaverProduct = mongoose.model(
  'WeaverProduct',
  weaverProductSchema
);

module.exports = WeaverProduct;