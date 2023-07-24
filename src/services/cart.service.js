'use strict';

const { cart } = require('../models/cart.model');
const { BadRequestError, ForbiddenError, NotFoundError } = require('../core/error.response');
const { getProductById } = require('../models/repository/product.repo');
/* 
    key features:
    - add product to cart [User]
    - reduce product quantity by one [User]
    - increase product quantity by one [User]
    - get cart [User]
    - delete cart [User]
    - delete cart by item [User]
*/

class CartService {
  // Start repo cart service
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = { upsert: true, new: true };
    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        'cart_products.productId': productId,
        cart_state: 'active',
      },
      updateSet = {
        $inc: {
          'cart_products.$.quantity': +quantity, // $ update chinh phan tu sau no
        },
      },
      options = { upsert: true, new: true };
    return await cart.findOneAndUpdate(query, updateSet, options);
  }

  static async addTocart({ product = {} }, userId) {
    console.log(userId, product);
    //check cart exists
    const userCart = await cart.findOne({ cart_userId: userId });
    if (!userCart) {
      //create new cart
      return await CartService.createUserCart({ userId, product });
    }
    // if cart is already and cart is empty
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    // Check if the product with the same productId exists in the cart
    const existingProduct = userCart.cart_products.find((cartProduct) => cartProduct.productId === product.productId);

    if (!existingProduct) {
      // Product with the same productId does not exist, so add it to the cart
      userCart.cart_products.push(product);
      return await userCart.save();
    }
    // if cart existed and cart is not empty => update quantity

    return await CartService.updateUserCartQuantity({
      userId,
      product,
    });
  }

  static async addToCartV2({ shop_order_ids }, userId) {
    const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0];
    //check product
    const foundProduct = await getProductById(productId);

    if (!foundProduct) throw new NotFoundError('');

    //compare product_Shop with shopId in payload

    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError('Product not belong to the shop');
    }

    if (quantity === 0) {
      //delete
      // return await CartService.deleteUserCart({ userId, productId });
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteUserCart(productId, userId) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateSet = {
        $pull: {
          cart_products: productId,
        },
      };

    const deleteCart = await cart.findOneAndUpdate(query, updateSet);

    return deleteCart;
  }

  static async getListUserCart(userId) {
    return await cart
      .findOne({
        cart_userId: userId,
      })
      .lean();
  }
}

module.exports = CartService;
