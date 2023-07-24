'use strict';

const CartService = require('../services/cart.service');
const { SuccesResponse } = require('../core/success.response');

class CartController {
  addToCart = async (req, res, next) => {
    new SuccesResponse({
      message: 'A new cart was successfully created.',
      metadata: await CartService.addTocart(req.body, req.user._id),
    }).send(res);
  };

  // - +
  update = async (req, res, next) => {
    new SuccesResponse({
      message: 'Cart successfully updated!',
      metadata: await CartService.addToCartV2(req.body, req.user._id),
    }).send(res);
  };
  delete = async (req, res, next) => {
    new SuccesResponse({
      message: 'Cart successfully deleted!',
      metadata: await CartService.deleteUserCart(req.body, req.user._id),
    }).send(res);
  };
  getListCart = async (req, res, next) => {
    new SuccesResponse({
      message: 'List cart successfully',
      metadata: await CartService.getListUserCart(req.user._id),
    }).send(res);
  };
}

module.exports = new CartController();
