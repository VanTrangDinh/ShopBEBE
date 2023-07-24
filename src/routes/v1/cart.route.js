'use strict';

const express = require('express');
const cartController = require('../../controllers/cart.controller');
const asyncHandler = require('../../helpers/asyncHandle');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.use(auth());

router.post('/', cartController.addToCart);
router.delete('/', cartController.delete);
router.patch('/update', cartController.update);
router.get('/', cartController.getListCart);

module.exports = router;

/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: Manages shopping carts and cart-related operations
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart]
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
 *               product:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                   shopId:
 *                     type: string
 *                   quantity:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *             example:
 *               product:
 *                 productId: "649a5e2411637037d6d492fc"
 *                 shopId: "6497bae63831453bf96906c4"
 *                 quantity: 3
 *                 name: "Áo Thun Nam Tay Ngắn Trơn Form Fitted"
 *                 price: 111
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
 *                     cart_state:
 *                       type: string
 *                     cart_products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                           shopId:
 *                             type: string
 *                           quantity:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           price:
 *                             type: number
 *                     cart_count_product:
 *                       type: integer
 *                     _id:
 *                       type: string
 *                     cart_userId:
 *                       type: string
 *                     __v:
 *                       type: integer
 *                     createdOn:
 *                       type: string
 *                       format: date-time
 *                     modifiedOn:
 *                       type: string
 *                       format: date-time
 *             example:
 *               message: "A new cart was successfully created."
 *               status: 200
 *               metadata:
 *                 cart_state: "active"
 *                 cart_products:
 *                   - productId: "649a5e2411637037d6d492fc"
 *                     shopId: "6497bae63831453bf96906c4"
 *                     quantity: 12
 *                     name: "Áo Thun Nam Tay Ngắn Trơn Form Fitted"
 *                     price: 111
 *                 cart_count_product: 0
 *                 _id: "649a7fb43a2dcf30b1e75972"
 *                 cart_userId: "649a61593a07483a01fc9f1f"
 *                 __v: 0
 *                 createdOn: "2023-06-27T06:20:36.036Z"
 *                 modifiedOn: "2023-06-27T06:24:06.389Z"
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /cart/update:
 *   patch:
 *     summary: Update cart items
 *     tags: [Cart]
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
 *               shop_order_ids:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     shopId:
 *                       type: string
 *                     item_products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                           shopId:
 *                             type: string
 *                           quantity:
 *                             type: integer
 *                           old_quantity:
 *                             type: integer
 *                           price:
 *                             type: number
 *                     version:
 *                       type: integer
 *             example:
 *               shop_order_ids:
 *                 - shopId: "6497bae63831453bf96906c4"
 *                   item_products:
 *                     - productId: "649a5e2411637037d6d492fc"
 *                       shopId: "6497bae63831453bf96906c4"
 *                       quantity: 15
 *                       old_quantity: 10
 *                       price: 111
 *                   version: 2000
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
 *                     cart_state:
 *                       type: string
 *                     cart_products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                           shopId:
 *                             type: string
 *                           quantity:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           price:
 *                             type: number
 *                     cart_count_product:
 *                       type: integer
 *                     _id:
 *                       type: string
 *                     cart_userId:
 *                       type: string
 *                     __v:
 *                       type: integer
 *                     createdOn:
 *                       type: string
 *                       format: date-time
 *                     modifiedOn:
 *                       type: string
 *                       format: date-time
 *             example:
 *               message: "Cart successfully updated!"
 *               status: 200
 *               metadata:
 *                 cart_state: "active"
 *                 cart_products:
 *                   - productId: "649a5e2411637037d6d492fc"
 *                     shopId: "6497bae63831453bf96906c4"
 *                     quantity: 15
 *                     name: "Áo Thun Nam Tay Ngắn Trơn Form Fitted"
 *                     price: 111
 *                 cart_count_product: 0
 *                 _id: "649a7fb43a2dcf30b1e75972"
 *                 cart_userId: "649a61593a07483a01fc9f1f"
 *                 __v: 0
 *                 createdOn: "2023-06-27T06:20:36.036Z"
 *                 modifiedOn: "2023-06-27T06:48:33.560Z"
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get list of cart items
 *     tags: [Cart]
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
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     cart_state:
 *                       type: string
 *                     cart_userId:
 *                       type: string
 *                     __v:
 *                       type: integer
 *                     cart_products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                           shopId:
 *                             type: string
 *                           quantity:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           price:
 *                             type: number
 *                     createdOn:
 *                       type: string
 *                       format: date-time
 *                     modifiedOn:
 *                       type: string
 *                       format: date-time
 *             example:
 *               message: "List cart successfully"
 *               status: 200
 *               metadata:
 *                 _id: "649a7fb43a2dcf30b1e75972"
 *                 cart_state: "active"
 *                 cart_userId: "649a61593a07483a01fc9f1f"
 *                 __v: 0
 *                 cart_products:
 *                   - productId: "649a5e2411637037d6d492fc"
 *                     shopId: "6497bae63831453bf96906c4"
 *                     quantity: 15
 *                     name: "Áo Thun Nam Tay Ngắn Trơn Form Fitted"
 *                     price: 111
 *                 createdOn: "2023-06-27T06:20:36.036Z"
 *                 modifiedOn: "2023-06-27T06:48:33.560Z"
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Delete Cart
 *     tags: [Cart]
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
 *               productId:
 *                 type: string
 *             example:
 *               productId: "649830c3a9c1941e8aa44bef"
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
 *                     cart_state:
 *                       type: string
 *                     cart_products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                           shopId:
 *                             type: string
 *                           quantity:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           price:
 *                             type: integer
 *                     cart_count_product:
 *                       type: integer
 *                     _id:
 *                       type: string
 *                     cart_userId:
 *                       type: string
 *                     __v:
 *                       type: integer
 *                     createdOn:
 *                       type: string
 *                       format: date-time
 *                     modifiedOn:
 *                       type: string
 *                       format: date-time
 *             example:
 *               message: "Cart successfully deleted!"
 *               status: 200
 *               metadata:
 *                 cart_state: "active"
 *                 cart_products:
 *                   - productId: "6499184c727e5b4b7c917a57"
 *                     shopId: "6497bae63831453bf96906c4"
 *                     quantity: 40
 *                     name: "Mobile Phone"
 *                     price: 699
 *                 cart_count_product: 0
 *                 _id: "649a7fb43a2dcf30b1e75972"
 *                 cart_userId: "649a61593a07483a01fc9f1f"
 *                 __v: 17
 *                 createdOn: "2023-06-27T06:20:36.036Z"
 *                 modifiedOn: "2023-06-27T13:29:45.483Z"
 */
