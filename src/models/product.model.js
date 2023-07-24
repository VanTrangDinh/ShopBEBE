'use strict';

const { model, Schema, Types } = require('mongoose'); // Erase if already required
const slugify = require('slugify');
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema(
  {
    product_name: { type: String, required: true }, //quan jean cao cap
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: String, //quan-jean-cao-cap
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Furniture'],
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    product_attribute: {
      type: Schema.Types.Mixed,
      required: true,
    },
    product_images: [],

    //more
    product_ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => {
        Math.round(val * 10) / 10;
      },
    },
    //varidations: la property of product (examples: color property,..)
    product_variations: {
      type: Array,
      defaul: [],
    },
    isDraft: { type: Boolean, default: true, index: true, select: false }, // select: khi document.find or findOne se loai cai nay ra neu false
    isPublished: { type: Boolean, default: false, index: true, select: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//create index for search

productSchema.index({ product_name: 'text', product_description: 'text' });

// Pre-save middleware to generate slug
productSchema.pre('save', function (next) {
  const product = this;
  if (!product.isModified('product_name')) return next();

  const product_slug = slugify(product.product_name, {
    lower: true,
    strict: true,
  });
  product.product_slug = product_slug;
  next();
});

// Pre-update middleware to generate slug
productSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (!update.product_name) return next();

  const product_slug = slugify(update.product_name, {
    lower: true,
    strict: true,
  });
  update.product_slug = product_slug;
  next();
});

const clothingSchema = new Schema(
  {
    brand: { type: String, require: true },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    size: String,
    material: String,
  },
  {
    collection: 'Clothing',
    timestamps: true,
  }
);

const electronicsSchema = new Schema(
  {
    manufacturer: { type: String, require: true },
    model: String,
    color: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
  },
  {
    collection: 'Electronics',
    timestamps: true,
  }
);

const furnitureSchema = new Schema(
  {
    brand: { type: String, require: true },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    size: String,
    material: String,
  },
  {
    collection: 'Furniture',
    timestamps: true,
  }
);

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  electronic: model('Electronics', electronicsSchema),
  clothing: model('Clothing', clothingSchema),
  furniture: model('Furniture', furnitureSchema),
};
