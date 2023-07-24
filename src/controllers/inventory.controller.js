'use strict';

const InventoryService = require('../services/inventory.service');
const { SuccesResponse } = require('../core/success.response');

class inventoryController {
  addStockToInventory = async (req, res, next) => {
    new SuccesResponse({
      message: 'Successfully added the item to the inventory.',
      metadata: await InventoryService.addStockToInventory(req.body),
    }).send(res);
  };
  getInventoryById = async (req, res, next) => {
    const inventoryId = req.params.inventoryId;
    new SuccesResponse({
      message: 'Successfully retrieved the inventory.',
      metadata: await InventoryService.getInventoryById(inventoryId),
    }).send(res);
  };
}

module.exports = new inventoryController();
