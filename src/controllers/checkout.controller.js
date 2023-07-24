'use strict';

const CheckoutService = require('../services/checkout.service');
const { SuccesResponse } = require('../core/success.response');

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    new SuccesResponse({
      message: 'Checkout successfully',
      metadata: await CheckoutService.checkoutReview(req.body, req.user._id),
    }).send(res);
  };

  orderByUser = async (req, res, next) => {
    new SuccesResponse({
      message: 'Checkout successfully',
      metadata: await CheckoutService.orderByUser(req.body, req.user._id),
    }).send(res);
  };

  getOrderByUser = async (req, res, next) => {
    new SuccesResponse({
      message: 'Get order successfully',
      metadata: await CheckoutService.getOrdersByUser(req.user._id),
    }).send(res);
  };

  cancelOrderByUser = async (req, res, next) => {
    new SuccesResponse({
      message: 'Cancel order successfully',
      metadata: await CheckoutService.cancelOrderByUser(req.params.orderId, req.user._id),
    }).send(res);
  };

  updateOrderStatusByShop = async (req, res, next) => {
    new SuccesResponse({
      message: 'Update order successfully',
      metadata: await CheckoutService.updateOrderStatusByShop(req.body, req.user._id),
    }).send(res);
  };
}

module.exports = new CheckoutController();
