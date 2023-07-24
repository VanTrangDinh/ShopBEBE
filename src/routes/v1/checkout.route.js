'use strict';

const express = require('express');
const checkoutController = require('../../controllers/checkout.controller');
const asyncHandler = require('../../helpers/asyncHandle');
const auth = require('../../middlewares/auth');
const { authenticationV2 } = require('../../middlewares/authUtils');

const router = express.Router();

router.post('/review', auth(), asyncHandler(checkoutController.checkoutReview));
router.post('/order', auth(), asyncHandler(checkoutController.orderByUser));
router.get('/order', auth(), asyncHandler(checkoutController.getOrderByUser));
router.patch('/order/:orderId', auth(), asyncHandler(checkoutController.cancelOrderByUser));

router.use(authenticationV2);

router.patch('/accept', asyncHandler(checkoutController.updateOrderStatusByShop));

module.exports = router;

/**
 * @swagger
 * tags:
 *   - name: Checkout
 *     description: Manages the checkout process
 */

/**
 * @swagger
 * /checkout/review:
 *   post:
 *     summary: Review Checkout
 *     tags: [Checkout]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartId:
 *                 type: string
 *               shop_order_ids:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     shopId:
 *                       type: string
 *                     shop_discounts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           shopId:
 *                             type: string
 *                           discountId:
 *                             type: string
 *                           codeId:
 *                             type: string
 *                     item_products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           price:
 *                             type: number
 *                           quantity:
 *                             type: integer
 *                           productId:
 *                             type: string
 *           example:
 *             cartId: "649a7fb43a2dcf30b1e75972"
 *             shop_order_ids:
 *               - shopId: "6497bae63831453bf96906c4"
 *                 shop_discounts:
 *                   - shopId: "6497bae63831453bf96906c4"
 *                     discountId: "649a3c487f1e7e18f52c0dac"
 *                     codeId: "SHOP-1122"
 *                 item_products:
 *                   - price: 249000
 *                     quantity: 2
 *                     productId: "6499184c727e5b4b7c917a57"
 *               - shopId: "649ae8f093c7602eb5e694dd"
 *                 shop_discounts: []
 *                 item_products:
 *                   - price: 249000
 *                     quantity: 3
 *                     productId: "649ae98b93c7602eb5e694e2"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     shop_order_ids:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           shopId:
 *                             type: string
 *                           shop_discounts:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 shopId:
 *                                   type: string
 *                                 discountId:
 *                                   type: string
 *                                 codeId:
 *                                   type: string
 *                           item_products:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 price:
 *                                   type: number
 *                                 quantity:
 *                                   type: integer
 *                                 productId:
 *                                   type: string
 *                     shop_order_ids_new:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           shopId:
 *                             type: string
 *                           shop_discounts:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 shopId:
 *                                   type: string
 *                                 discountId:
 *                                   type: string
 *                                 codeId:
 *                                   type: string
 *                           priceRaw:
 *                             type: number
 *                           priceApplyDiscount:
 *                             type: number
 *                           item_products:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 price:
 *                                   type: number
 *                                 quantity:
 *                                   type: integer
 *                                 productId:
 *                                   type: string
 *                     checkout_order:
 *                       type: object
 *                       properties:
 *                         totalPrice:
 *                           type: number
 *                         feeShip:
 *                           type: number
 *                         totalDiscount:
 *                           type: number
 *                         totalCheckout:
 *                           type: number
 *             example:
 *               message: "Checkout successfully"
 *               status: 200
 *               metadata:
 *                 shop_order_ids:
 *                   - shopId: "6497bae63831453bf96906c4"
 *                     shop_discounts:
 *                       - shopId: "6497bae63831453bf96906c4"
 *                         discountId: "649a3c487f1e7e18f52c0dac"
 *                         codeId: "SHOP-1122"
 *                     item_products:
 *                       - price: 249000
 *                         quantity: 2
 *                         productId: "6499184c727e5b4b7c917a57"
 *                   - shopId: "649ae8f093c7602eb5e694dd"
 *                     shop_discounts: []
 *                     item_products:
 *                       - price: 249000
 *                         quantity: 3
 *                         productId: "649ae98b93c7602eb5e694e2"
 *                 shop_order_ids_new:
 *                   - shopId: "6497bae63831453bf96906c4"
 *                     shop_discounts:
 *                       - shopId: "6497bae63831453bf96906c4"
 *                         discountId: "649a3c487f1e7e18f52c0dac"
 *                         codeId: "SHOP-1122"
 *                     priceRaw: 1398000
 *                     priceApplyDiscount: 1258200
 *                     item_products:
 *                       - price: 699000
 *                         quantity: 2
 *                         productId: "6499184c727e5b4b7c917a57"
 *                   - shopId: "649ae8f093c7602eb5e694dd"
 *                     shop_discounts: []
 *                     priceRaw: 747000
 *                     priceApplyDiscount: 747000
 *                     item_products:
 *                       - price: 249000
 *                         quantity: 3
 *                         productId: "649ae98b93c7602eb5e694e2"
 *                 checkout_order:
 *                   totalPrice: 747000
 *                   feeShip: 0
 *                   totalDiscount: 139800
 *                   totalCheckout: 747000
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /checkout/order:
 *   post:
 *     summary: Place an order
 *     tags:
 *       - Checkout
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_payment:
 *                 type: string
 *                 description: The payment method chosen by the user.
 *               user_address:
 *                 type: string
 *                 description: The address where the order will be shipped.
 *               cartId:
 *                 type: string
 *                 description: The ID of the user's cart.
 *               shop_order_ids:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     shopId:
 *                       type: string
 *                       description: The ID of the shop.
 *                     shop_discounts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           shopId:
 *                             type: string
 *                             description: The ID of the shop.
 *                           discountId:
 *                             type: string
 *                             description: The ID of the discount applied.
 *                           codeId:
 *                             type: string
 *                             description: The ID of the discount code used.
 *                     item_products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           price:
 *                             type: number
 *                             description: The price of the product.
 *                           quantity:
 *                             type: integer
 *                             description: The quantity of the product.
 *                           productId:
 *                             type: string
 *                             description: The ID of the product.
 *           example:
 *             user_payment: "Cash on Delivery"
 *             user_address: "Dien Duong, Dien Ban, Quang Nam"
 *             cartId: "649a7fb43a2dcf30b1e75972"
 *             shop_order_ids:
 *               - shopId: "6497bae63831453bf96906c4"
 *                 shop_discounts:
 *                   - shopId: "6497bae63831453bf96906c4"
 *                     discountId: "649a3c487f1e7e18f52c0dac"
 *                     codeId: "SHOP-1122"
 *                 item_products:
 *                   - price: 249000
 *                     quantity: 2
 *                     productId: "6499184c727e5b4b7c917a57"
 *               - shopId: "649ae8f093c7602eb5e694dd"
 *                 shop_discounts: []
 *                 item_products:
 *                   - price: 249000
 *                     quantity: 3
 *                     productId: "649ae98b93c7602eb5e694e2"
 *
 *     responses:
 *       "200":
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code for the response.
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     order_products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           shopId:
 *                             type: string
 *                             description: The ID of the shop.
 *                           shop_discounts:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 shopId:
 *                                   type: string
 *                                   description: The ID of the shop.
 *                                 discountId:
 *                                   type: string
 *                                   description: The ID of the discount applied.
 *                                 codeId:
 *                                   type: string
 *                                   description: The ID of the discount code used.
 *                           priceRaw:
 *                             type: number
 *                             description: The raw price of the order.
 *                           priceApplyDiscount:
 *                             type: number
 *                             description: The price of the order after applying discounts.
 *                           item_products:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 price:
 *                                   type: number
 *                                   description: The price of the product.
 *                                 quantity:
 *                                   type: integer
 *                                   description: The quantity of the product.
 *                                 productId:
 *                                   type: string
 *                                   description: The ID of the product.
 *             example:
 *               message: "Checkout successfully"
 *               status: 200
 *               metadata:
 *                 order_products:
 *                   - shopId: "6497bae63831453bf96906c4"
 *                     shop_discounts:
 *                       - shopId: "6497bae63831453bf96906c4"
 *                         discountId: "649a3c487f1e7e18f52c0dac"
 *                         codeId: "SHOP-1122"
 *                     priceRaw: 1398000
 *                     priceApplyDiscount: 1398000
 *                     item_products:
 *                       - price: 699000
 *                         quantity: 2
 *                         productId: "6499184c727e5b4b7c917a57"
 *                   - shopId: "649ae8f093c7602eb5e694dd"
 *                     shop_discounts: []
 *                     priceRaw: 747000
 *                     priceApplyDiscount: 747000
 *                     item_products:
 *                       - price: 249000
 *                         quantity: 3
 *                         productId: "649ae98b93c7602eb5e694e2"
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /checkout/order:
 *   get:
 *     summary: Get order by user
 *     tags: [Checkout]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *                 metadata:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       order_products:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             shopId:
 *                               type: string
 *                             shop_discounts:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   shopId:
 *                                     type: string
 *                                   discountId:
 *                                     type: string
 *                                   codeId:
 *                                     type: string
 *                             priceRaw:
 *                               type: number
 *                             priceApplyDiscount:
 *                               type: number
 *                             item_products:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   price:
 *                                     type: number
 *                                   quantity:
 *                                     type: integer
 *                                   productId:
 *                                     type: string
 *                       order_trackingNumber:
 *                         type: string
 *                       order_status:
 *                         type: string
 *                       _id:
 *                         type: string
 *                       order_userId:
 *                         type: string
 *                       order_checkout:
 *                         type: object
 *                         properties:
 *                           totalPrice:
 *                             type: number
 *                           feeShip:
 *                             type: number
 *                           totalDiscount:
 *                             type: number
 *                           totalCheckout:
 *                             type: number
 *                       order_shipping:
 *                         type: string
 *                       order_payment:
 *                         type: string
 *                       createOn:
 *                         type: string
 *                       modifiedOn:
 *                         type: string
 *                       __v:
 *                         type: number
 *             example:
 *               message: "Get order successfully"
 *               status: 200
 *               metadata:
 *                 - order_products:
 *                     - shopId: "6497bae63831453bf96906c4"
 *                       shop_discounts:
 *                         - shopId: "6497bae63831453bf96906c4"
 *                           discountId: "649a3c487f1e7e18f52c0dac"
 *                           codeId: "SHOP-1122"
 *                       priceRaw: 1398000
 *                       priceApplyDiscount: 1398000
 *                       item_products:
 *                         - price: 699000
 *                           quantity: 2
 *                           productId: "6499184c727e5b4b7c917a57"
 *                   order_trackingNumber: "#0000114052023"
 *                   order_status: "pending"
 *                   _id: "649e433fcca2f230df07efde"
 *                   order_userId: "649a61593a07483a01fc9f1f"
 *                   order_checkout:
 *                     totalPrice: 1398000
 *                     feeShip: 0
 *                     totalDiscount: 0
 *                     totalCheckout: 1398000
 *                   order_shipping: "Dien Duong, Dien Ban,Quang Nam"
 *                   order_payment: "Cash on Delivery"
 *                   createOn: "2023-06-30T02:51:43.056Z"
 *                   modifiedOn: "2023-06-30T02:51:43.056Z"
 *                   __v: 0
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /checkout/{orderId}:
 *   patch:
 *     summary: Cancel order by user
 *     tags: [Checkout]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the order to cancel
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     order_products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           shopId:
 *                             type: string
 *                           shop_discounts:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 shopId:
 *                                   type: string
 *                                 discountId:
 *                                   type: string
 *                                 codeId:
 *                                   type: string
 *                           priceRaw:
 *                             type: number
 *                           priceApplyDiscount:
 *                             type: number
 *                           item_products:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 price:
 *                                   type: number
 *                                 quantity:
 *                                   type: integer
 *                                 productId:
 *                                   type: string
 *                     order_trackingNumber:
 *                       type: string
 *                     order_status:
 *                       type: string
 *                     _id:
 *                       type: string
 *                     order_userId:
 *                       type: string
 *                     order_checkout:
 *                       type: object
 *                       properties:
 *                         totalPrice:
 *                           type: number
 *                         feeShip:
 *                           type: number
 *                         totalDiscount:
 *                           type: number
 *                         totalCheckout:
 *                           type: number
 *                     order_shipping:
 *                       type: string
 *                     order_payment:
 *                       type: string
 *                     createOn:
 *                       type: string
 *                     modifiedOn:
 *                       type: string
 *                     __v:
 *                       type: number
 *             example:
 *               message: "Cancel order successfully"
 *               status: 200
 *               metadata:
 *                 order_products:
 *                   - shopId: "6497bae63831453bf96906c4"
 *                     shop_discounts:
 *                       - shopId: "6497bae63831453bf96906c4"
 *                         discountId: "649a3c487f1e7e18f52c0dac"
 *                         codeId: "SHOP-1122"
 *                     priceRaw: 1398000
 *                     priceApplyDiscount: 1398000
 *                     item_products:
 *                       - price: 699000
 *                         quantity: 2
 *                         productId: "6499184c727e5b4b7c917a57"
 *                 order_trackingNumber: "#0000114052023"
 *                 order_status: "cancelled"
 *                 _id: "649e433fcca2f230df07efde"
 *                 order_userId: "649a61593a07483a01fc9f1f"
 *                 order_checkout:
 *                   totalPrice: 1398000
 *                   feeShip: 0
 *                   totalDiscount: 0
 *                   totalCheckout: 1398000
 *                 order_shipping: "Dien Duong, Dien Ban,Quang Nam"
 *                 order_payment: "Cash on Delivery"
 *                 createOn: "2023-06-30T02:51:43.056Z"
 *                 modifiedOn: "2023-06-30T03:38:32.933Z"
 *                 __v: 0
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /checkout/order/accept:
 *   patch:
 *     summary: Update order status by shop
 *     tags: [Checkout]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *       - client-id: []
 *       - authorization: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID of the order to update
 *                 example: 649e433fcca2f230df07efde
 *               newStatus:
 *                 type: string
 *                 description: The new status of the order
 *                 example: confirmed
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     order_products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           shopId:
 *                             type: string
 *                           shop_discounts:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 shopId:
 *                                   type: string
 *                                 discountId:
 *                                   type: string
 *                                 codeId:
 *                                   type: string
 *                           priceRaw:
 *                             type: number
 *                           priceApplyDiscount:
 *                             type: number
 *                           item_products:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 price:
 *                                   type: number
 *                                 quantity:
 *                                   type: integer
 *                                 productId:
 *                                   type: string
 *                     order_trackingNumber:
 *                       type: string
 *                     order_status:
 *                       type: string
 *                     _id:
 *                       type: string
 *                     order_userId:
 *                       type: string
 *                     order_checkout:
 *                       type: object
 *                       properties:
 *                         totalPrice:
 *                           type: number
 *                         feeShip:
 *                           type: number
 *                         totalDiscount:
 *                           type: number
 *                         totalCheckout:
 *                           type: number
 *                     order_shipping:
 *                       type: string
 *                     order_payment:
 *                       type: string
 *                     createOn:
 *                       type: string
 *                     modifiedOn:
 *                       type: string
 *                     __v:
 *                       type: number
 *             example:
 *               message: "Update order successfully"
 *               status: 200
 *               metadata:
 *                 order_products:
 *                   - shopId: "6497bae63831453bf96906c4"
 *                     shop_discounts:
 *                       - shopId: "6497bae63831453bf96906c4"
 *                         discountId: "649a3c487f1e7e18f52c0dac"
 *                         codeId: "SHOP-1122"
 *                     priceRaw: 1398000
 *                     priceApplyDiscount: 1398000
 *                     item_products:
 *                       - price: 699000
 *                         quantity: 2
 *                         productId: "6499184c727e5b4b7c917a57"
 *                 order_trackingNumber: "#0000114052023"
 *                 order_status: "confirmed"
 *                 _id: "649e433fcca2f230df07efde"
 *                 order_userId: "649a61593a07483a01fc9f1f"
 *                 order_checkout:
 *                   totalPrice: 1398000
 *                   feeShip: 0
 *                   totalDiscount: 0
 *                   totalCheckout: 1398000
 *                 order_shipping: "Dien Duong, Dien Ban,Quang Nam"
 *                 order_payment: "Cash on Delivery"
 *                 createOn: "2023-06-30T02:51:43.056Z"
 *                 modifiedOn: "2023-06-30T04:07:03.918Z"
 *                 __v: 0
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
