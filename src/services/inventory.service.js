'use strict';

const { BadRequestError } = require('../core/error.response');
const { inventory } = require('../models/inventory.model');
const { getProductById, updateQuantityProduct } = require('../models/repository/product.repo');

class InventoryService {
  static async addStockToInventory({ stock, productId, shopId, location }) {
    const product = await getProductById(productId);
    if (!product) throw new BadRequestError('Product does not exist');

    const query = { inventory_shopId: shopId, inventory_product_id: productId },
      updateSet = {
        $inc: { inventory_stock: stock },
        $set: { inventory_location: location },
      },
      options = { upsert: true, new: true };
    const newInentory = await inventory.findOneAndUpdate(query, updateSet, options);

    if (newInentory) {
      await updateQuantityProduct(productId, stock);
    }

    return newInentory;
  }

  static async getInventoryById(inventoryId) {
    return await inventory.findById(inventoryId).select('-__v');
  }

  static async updateInventoryById(inventoryId, updateData) {
    return await inventory.findByIdAndUpdate(inventoryId, updateData, { new: true }).select('-__v');
  }

  static async deleteInventoryById(inventoryId) {
    return await inventory.findByIdAndDelete(inventoryId).select('-__v');
  }
}

module.exports = InventoryService;
