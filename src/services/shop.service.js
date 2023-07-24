'use strict';

const { NotFoundError, BadRequestError } = require('../core/error.response');
const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const findByEmail = async ({
  email,
  select = {
    email: 1,
    password: 2,
    name: 1,
    status: 1,
    roles: 1,
    verify: 1,
  },
}) => {
  return await shopModel.findOne({ email }).select(select).lean();
};

/**
 * Get shop by id
 * @param {ObjectId} id
 * @returns {Promise<Shop>}
 */
const getShopById = async (id) => {
  return shopModel.findById(id);
};

const verifyShop = async (id, updateBody) => {
  return await shopModel.findByIdAndUpdate(id, updateBody);
};

/**
 * Update Shop by id
 * @param {ObjectId} ShopId
 * @param {Object} updateBody
 * @returns {Promise<Shop>}
 */
const updateShopById = async (ShopId, updateBody) => {
  console.log(updateBody);
  const Shop = await getShopById(ShopId);
  if (!Shop) {
    throw new NotFoundError('Shop not found');
  }

  const passwordHash = await bcrypt.hash(updateBody.password, 10);

  Object.assign(Shop, passwordHash);
  await Shop.save();
  return Shop;
};

module.exports = {
  findByEmail,
  updateShopById,
  getShopById,
  verifyShop,
};
