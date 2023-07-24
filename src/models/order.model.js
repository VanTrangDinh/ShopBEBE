'use strict';

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

const orderSchema = new Schema(
  {
    order_userId: { type: Object, required: true },
    order_checkout: { type: Object, default: {} },
    order_shipping: { type: Object, default: {} },
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, required: true },
    order_trackingNumber: { type: String, default: '#0000114052023' },
    order_status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: 'createOn',
      updatedAt: 'modifiedOn',
    },
  }
);

module.exports = {
  order: model(DOCUMENT_NAME, orderSchema),
};
