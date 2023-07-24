'use strict';

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Commnent';
const COLLECTION_NAME = 'Commnents';

const commnentSchema = new Schema(
  {
    comment_productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    comment_userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    comment_content: {
      type: String,
      default: 'text',
    },
    comment_left: {
      type: Number,
      default: 0,
    },
    comment_right: {
      type: Number,
      default: 0,
    },
    comment_parentId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAME,
    },
    isdeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: 'createdOn',
      updatedAt: 'modifiedOn',
    },
  }
);

module.exports = model(DOCUMENT_NAME, commnentSchema);
