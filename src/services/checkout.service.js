'use strict';

const { findCartById } = require('../models/repository/cart.repo');
const { checkProductByServer } = require('../models/repository/product.repo');
const { reservationInventory, getInventoryCount } = require('../models/repository/inventory.repo');
const { getDiscountAmount } = require('./discount.service');
const { BadRequestError, ForbiddenError, NotFoundError } = require('../core/error.response');
const { acquireLock, releaseLock } = require('./redis.service');
const { order } = require('../models/order.model');
const { cart } = require('../models/cart.model');
const { converToObjectInMongodb } = require('../utils/index');
const { deleteUserCart } = require('./cart.service');

class checkoutService {
  static async checkoutReview({ cartId, shop_order_ids = [] }, userId) {
    //check cartIt exists?
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new BadRequestError(`Cart ${cartId} does not exist`);
    const checkout_order = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      shop_order_ids_new = [];

    // check product in store

    for (let i = 0; i < shop_order_ids.length; i++) {
      const { item_products = [] } = shop_order_ids[i];

      //check product availability?
      const checkProductServer = await checkProductByServer(item_products);
      if (!checkProductServer[0]) throw new BadRequestError(`Order  ${i + 1} wrong, please check productId`);
    }

    //tinh tong tien bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i];

      //check product availability?
      const checkProductServer = await checkProductByServer(item_products);
      if (!checkProductServer[0]) throw new BadRequestError('order wrong', i);
      //check total order count

      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      //checkout total money after processing

      checkout_order.totalPrice = +checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, //price after discount
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      //if existing shop_discounts, check them validity
      if (shop_discounts.length > 0) {
        // be supposed to have one discount
        // get amount of discount

        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        });

        //total discount amount

        checkout_order.totalDiscount += discount;
        //if price of discount greater than 0
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      //total payment after discount

      checkout_order.totalCheckout = itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  //order
  static async orderByUser({ shop_order_ids, cartId, user_address, user_payment }, userId) {
    const { shop_order_ids_new, checkout_order } = await checkoutService.checkoutReview({ cartId, shop_order_ids }, userId);

    const products = shop_order_ids_new.flatMap((order) => order.item_products);

    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { quantity, productId } = products[i];
      const inventoryCount = await getInventoryCount(productId);
      console.log(inventoryCount);
      if (inventoryCount === 1) {
        const keyLock = await acquireLock(productId, quantity, cartId);
        acquireProduct.push(keyLock ? true : false);

        if (keyLock) {
          await releaseLock(keyLock);
        }
      } else {
        const isReservation = await reservationInventory({
          productId,
          quantity,
          cartId,
        });

        console.log(isReservation);
      }
    }
    console.log(acquireProduct);
    //check if product in inventory out of stock(sold out)

    if (acquireProduct.includes(false)) {
      console.log('Another process is currently handling the order or inventory has more than one product.');

      throw new BadRequestError('Some items have been updated. Please return to your shopping cart...');
    }

    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });

    //in case of successful insertion, remove the product from the cart
    if (newOrder) {
      const cartIdObject = converToObjectInMongodb(cartId);
      const productIds = products.map((p) => p.productId);

      const updatedCart = await cart.updateOne(
        { _id: cartIdObject },
        { $pull: { cart_products: { productId: { $in: productIds } } } }
      );

      console.log(updatedCart);
    }

    console.log(newOrder);
    return newOrder;
  }

  /* 
		query Orders [Users]
	*/

  static async getOrdersByUser(userId) {
    // Implement the logic to fetch orders associated with the given user ID
    // You can use appropriate database queries or API calls here
    // Return the retrieved orders
    const orders = await order.find({ order_userId: userId });
    return orders;
  }

  /* 
		cancel Order [Users]
	*/

  static async cancelOrderByUser(orderId, userId) {
    const Order = await order.findOne({ _id: orderId, order_userId: userId, order_status: 'pending' });

    if (!Order) {
      throw new NotFoundError('Order not found or cannot be canceled');
    }

    // Perform cancellation actions here

    // Update the order status to "cancelled"
    Order.order_status = 'cancelled';

    // Save the updated order
    await Order.save();

    // Return the updated order
    return Order;
  }

  /*
		update order status [Shop || Admin] 
	 */

  static async updateOrderStatusByShop(body, shopId) {
    const { orderId, newStatus } = body;
    const Order = await order.findOne({ _id: converToObjectInMongodb(orderId), shopId });

    if (!Order) {
      throw new NotFoundError('Order not found');
    }

    // Update the order status
    Order.order_status = newStatus;

    // Save the updated order
    await Order.save();

    // Return the updated order
    return Order;
  }
}

module.exports = checkoutService;
