'use strict';

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discount';

const discountSchema = new Schema(
  {
    discount_name: { type: 'String', required: true },
    discount_discription: { type: 'String', required: true },
    discount_type: { type: 'String', required: 'fixed-amount' }, //percentage
    discount_value: { type: 'Number', required: true }, //10%
    discount_code: { type: 'String', required: true }, //discount code
    discount_start_date: { type: 'Date', required: true }, //ngay bat dau
    discount_end_date: { type: 'Date', required: true }, //ngay ket thuc
    discount_max_uses: { type: Number, required: true }, //so luong discount duoc ap dung
    discount_uses_count: { type: Number, required: true }, //so luong discount da su dung
    discount_users_used: { type: Array, required: true }, //ai da su dung
    discount_max_uses_per_users: { type: Number, required: true }, //so luong cho phep toi da su dung
    discount_min_order_value: { type: Number, required: true }, //so luong
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ['all', 'specific'],
    },
    discount_product_ids: { type: Array, required: true }, //so san pham da duoc su dung
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = {
  discount: model(DOCUMENT_NAME, discountSchema),
};
