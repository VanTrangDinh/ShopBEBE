'use strict';

const { inventory } = require('../inventory.model');
const { Type } = require('mongoose');
const { converToObjectInMongodb } = require('../../utils/index');
const insertInventory = async ({ productId, shopId, stock, location = 'unknown' }) => {
  return await inventory.create({
    inventory_product_id: productId,
    inventory_shopId: shopId,
    inventory_stock: stock,
    inventory_location: location,
  });
};

const reservationInventory = async ({ productId, cartId, quantity }) => {
  const query = {
      inventory_product_id: converToObjectInMongodb(productId),
      inventory_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: {
        inventory_stock: -quantity,
      },
      $push: {
        inventory_reservations: {
          quantity,
          cartId,
          createOn: new Date(),
        },
      },
    },
    options = { upsert: true, new: true };

  return await inventory.findOneAndUpdate(query, updateSet, options);
};

const getInventoryCount = async (productId) => {
  const newInventory = await inventory.findOne({ inventory_product_id: converToObjectInMongodb(productId) });
  return newInventory.inventory_stock;
};

module.exports = {
  insertInventory,
  reservationInventory,
  getInventoryCount,
};
