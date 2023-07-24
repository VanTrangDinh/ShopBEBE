'use strict';
const { cart } = require('../cart.model');
const { converToObjectInMongodb } = require('../../utils');

const findCartById = async (cartId) => {
	return cart
		.findOne({ _id: converToObjectInMongodb(cartId), cart_state: 'active' })
		.lean();
};

module.exports = { findCartById };
