'use strict';

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const inventorySchema = new Schema(
  {
    inventory_product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
    inventory_location: { type: String, default: 'unknown' },
    inventory_stock: { type: Number, required: true },
    inventory_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    inventory_reservations: { type: Array, default: [] },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = {
  inventory: model(DOCUMENT_NAME, inventorySchema),
};
