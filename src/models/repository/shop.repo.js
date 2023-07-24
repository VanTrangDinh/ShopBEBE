'use strict';
const Shop = require('../shop.model');

/**
 * Get shop by email
 * @param {string} email
 * @returns {Promise<Shop>}
 */
const getUserByEmail = async (email) => {
  return Shop.findOne({ email });
};

/**
 * Get shop by id
 * @param {ObjectId} id
 * @returns {Promise<Shop>}
 */
const getUserById = async (id) => {
  return Shop.findById(id);
};

module.exports = { getUserByEmail, getUserById };
