'use strict';

const DisCountService = require('../services/discount.service');
const { SuccesResponse } = require('../core/success.response');

class DiscountController {
  createDiscount = async (req, res, next) => {
    new SuccesResponse({
      message: 'Successful code generation',
      metadata: await DisCountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCode = async (req, res, next) => {
    new SuccesResponse({
      message: 'Get all discount code by shop successfully',
      metadata: await DisCountService.getAllDiscountCodeByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountAmount = async (req, res, next) => {
    new SuccesResponse({
      message: 'Get all discount amount successfully',
      metadata: await DisCountService.getDiscountAmount({
        ...req.body,
        userId: req.user._id,
      }),
    }).send(res);
  };

  getAllDiscountWithProduct = async (req, res, next) => {
    new SuccesResponse({
      message: 'Get all discount successfully',
      metadata: await DisCountService.getAllDiscountCodesWithProduct({
        ...req.query,
      }),
    }).send(res);
  };

  deleteDiscountCode = async (req, res, next) => {
    new SuccesResponse({
      message: 'Delete code discount successfully',
      metadata: await DisCountService.deleteDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  cancelDiscountCode = async (req, res, next) => {
    new SuccesResponse({
      message: 'Cancel discount successfully',
      metadata: await DisCountService.cancelDiscountCode({
        ...req.body,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
