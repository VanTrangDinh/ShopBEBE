'use strict';

const express = require('express');
const discountController = require('../../controllers/discount.controller');
const asyncHandler = require('../../helpers/asyncHandle');
const { authenticationV2 } = require('../../middlewares/authUtils');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/amount', auth(), asyncHandler(discountController.getAllDiscountAmount));
router.get('/list-product-code', asyncHandler(discountController.getAllDiscountWithProduct));
router.post('/cancel', asyncHandler(discountController.cancelDiscountCode));
//authentication

router.use(authenticationV2);
///////////////
router.post('', asyncHandler(discountController.createDiscount));
router.delete('', asyncHandler(discountController.deleteDiscountCode));
router.get('', asyncHandler(discountController.getAllDiscountCode));
module.exports = router;

/**
 * @swagger
 * tags:
 *   - name: Discount
 *     description: Manages discounts for products
 */

/**
 * @swagger
 * /discount:
 *   post:
 *     summary: Create Discount
 *     tags: [Discount]
 *     security:
 *       - apiKeyAuth: []
 *       - client-id: []
 *       - authorization: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *               value:
 *                 type: number
 *               max_value:
 *                 type: number
 *               code:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date-time
 *               end_date:
 *                 type: string
 *                 format: date-time
 *               max_uses:
 *                 type: integer
 *               uses_count:
 *                 type: integer
 *               users_used:
 *                 type: array
 *                 items:
 *                   type: string
 *               max_uses_per_users:
 *                 type: integer
 *               min_order_value:
 *                 type: integer
 *               created_by:
 *                 type: object
 *               is_active:
 *                 type: boolean
 *               applies_to:
 *                 type: string
 *               product_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *           examples:
 *             example1:
 *               value:
 *                  description: "description"
 *                  name: "bla bal percentage"
 *                  type: "percentage"
 *                  value: 100
 *                  max_value: 3000
 *                  code: "SHOP-1122"
 *                  start_date: "2023-05-15T09:00:00"
 *                  end_date: "2023-05-20T09:00:00"
 *                  max_uses: 100
 *                  uses_count: 0
 *                  users_used: []
 *                  max_uses_per_users: 1
 *                  min_order_value: 200000
 *                  created_by: {}
 *                  is_active: true
 *                  applies_to: "all"
 *             example2:
 *               value:
 *                name: "Discount for something"
 *                description: "description"
 *                type: "fixed_amount"
 *                value: 10000
 *                code: "SUMMER-111"
 *                start_date: "2023-05-15 09:00:00"
 *                end_date: "2023-05-20 09:00:00"
 *                max_uses: 100
 *                uses_count: 0
 *                users_used: []
 *                max_uses_per_users: 1
 *                min_order_value: 200000
 *                created_by: {}
 *                is_active: true
 *                applies_to: "specific"
 *                product_ids: ["649830c3a9c1941e8aa44bef"]
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
 *                     discount_users_used:
 *                       type: array
 *                       items:
 *                         type: string
 *                     discount_is_active:
 *                       type: boolean
 *                     discount_product_ids:
 *                       type: array
 *                       items:
 *                         type: string
 *                     _id:
 *                       type: string
 *                     discount_name:
 *                       type: string
 *                     discount_description:
 *                       type: string
 *                     discount_type:
 *                       type: string
 *                     discount_value:
 *                       type: number
 *                     discount_code:
 *                       type: string
 *                     discount_start_date:
 *                       type: string
 *                       format: date-time
 *                     discount_end_date:
 *                       type: string
 *                       format: date-time
 *                     discount_max_uses:
 *                       type: integer
 *                     discount_uses_count:
 *                       type: integer
 *                     discount_max_uses_per_users:
 *                       type: integer
 *                     discount_min_order_value:
 *                       type: integer
 *                     discount_shopId:
 *                       type: string
 *                     discount_applies_to:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     __v:
 *                       type: integer
 *             example:
 *               message: "Successful code generation"
 *               status: 200
 *               metadata:
 *                 discount_users_used: []
 *                 discount_is_active: true
 *                 discount_product_ids: []
 *                 _id: "649a3c487f1e7e18f52c0dac"
 *                 discount_name: "bla bal percentage"
 *                 discount_description: "description"
 *                 discount_type: "percentage"
 *                 discount_value: 100
 *                 discount_code: "SHOP-1122"
 *                 discount_start_date: "2023-05-15T02:00:00.000Z"
 *                 discount_end_date: "2023-05-20T02:00:00.000Z"
 *                 discount_max_uses: 100
 *                 discount_uses_count: 0
 *                 discount_max_uses_per_users: 1
 *                 discount_min_order_value: 200000
 *                 discount_shopId: "6497bae63831453bf96906c4"
 *                 discount_applies_to: "all"
 *                 createdAt: "2023-06-27T01:32:56.073Z"
 *                 updatedAt: "2023-06-27T01:32:56.073Z"
 *                 __v: 0
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /discount/list-product-code:
 *   get:
 *     summary: Get all discounts with product by code
 *     tags: [Discount]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The code of the discount
 *       - in: query
 *         name: shopId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the shop
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: The maximum number of results to return per page
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The page number
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
 *                       _id:
 *                         type: string
 *                       product_name:
 *                         type: string
 *             example:
 *                   message: "Get all discounts successfully"
 *                   status: 200
 *                   metadata:
 *                     - _id: "6499184c727e5b4b7c917a57"
 *                       product_name: "Mobile Phone"
 *                     - _id: "649830c3a9c1941e8aa44bef"
 *                       product_name: "Sofa Kandy Grey"
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /discount:
 *   get:
 *     summary: Get all discount codes
 *     tags: [Discount]
 *     security:
 *       - apiKeyAuth: []
 *       - client-id: []
 *       - authorization: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: The maximum number of results to return per page
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The page number
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
 *                       _id:
 *                         type: string
 *                       discount_name:
 *                         type: string
 *                       discount_code:
 *                         type: string
 *                     example:
 *                       _id: "649a3c487f1e7e18f52c0dac"
 *                       discount_name: "bla bal percentage"
 *                       discount_code: "SHOP-1122"
 *               example:
 *                 message: "Get all discount code by shop successfully"
 *                 status: 200
 *                 metadata:
 *                   - _id: "649a3c487f1e7e18f52c0dac"
 *                     discount_name: "bla bal percentage"
 *                     discount_code: "SHOP-1122"
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /discount/amount:
 *   post:
 *     summary: Apply the discount amount for an order
 *     tags: [Discount]
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
 *               codeId:
 *                 type: string
 *               userId:
 *                 type: integer
 *               shopId:
 *                 type: string
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *             example:
 *               codeId: "SHOP"
 *               shopId: "6497bae63831453bf96906c4"
 *               products:
 *                 - productId: "649830c3a9c1941e8aa44bef"
 *                   quantity: 5
 *                   price: 200000
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
 *                     totalOrders:
 *                       type: number
 *                     discount:
 *                       type: number
 *                     totalPrice:
 *                       type: number
 *             example:
 *               message: "Get all discount amount successfully"
 *               status: 200
 *               metadata:
 *                 totalOrders: 1000000
 *                 discount: 100000
 *                 totalPrice: 900000
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /discount/cancel:
 *   post:
 *     summary: Cancel Discount Code
 *     tags: [Discount]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codeId:
 *                 type: string
 *               userId:
 *                 type: integer
 *               shopId:
 *                 type: string
 *             example:
 *               codeId: "SUMMER-111"
 *               userId: 2
 *               shopId: "6497bae63831453bf96906c4"
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
 *                     discount_users_used:
 *                       type: array
 *                       items:
 *                         type: string
 *                     discount_is_active:
 *                       type: boolean
 *                     discount_product_ids:
 *                       type: array
 *                       items:
 *                         type: string
 *                     _id:
 *                       type: string
 *                     discount_name:
 *                       type: string
 *                     discount_description:
 *                       type: string
 *                     discount_type:
 *                       type: string
 *                     discount_value:
 *                       type: number
 *                     discount_code:
 *                       type: string
 *                     discount_start_date:
 *                       type: string
 *                       format: date-time
 *                     discount_end_date:
 *                       type: string
 *                       format: date-time
 *                     discount_max_uses:
 *                       type: integer
 *                     discount_uses_count:
 *                       type: integer
 *                     discount_max_uses_per_users:
 *                       type: integer
 *                     discount_min_order_value:
 *                       type: integer
 *                     discount_shopId:
 *                       type: string
 *                     discount_applies_to:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     __v:
 *                       type: integer
 *             example:
 *               message: "Cancel discount successfully"
 *               status: 200
 *               metadata:
 *                 discount_users_used: []
 *                 discount_is_active: true
 *                 discount_product_ids:
 *                   - "649830c3a9c1941e8aa44bef"
 *                 _id: "649a529176f0ff2a5cc91d91"
 *                 discount_name: "Discount for something"
 *                 discount_description: "description"
 *                 discount_type: "fixed_amount"
 *                 discount_value: 1000
 *                 discount_code: "SUMMER-111"
 *                 discount_start_date: "2023-05-15T02:00:00.000Z"
 *                 discount_end_date: "2023-05-20T02:00:00.000Z"
 *                 discount_max_uses: 100
 *                 discount_uses_count: 0
 *                 discount_max_uses_per_users: 1
 *                 discount_min_order_value: 200000
 *                 discount_shopId: "6497bae63831453bf96906c4"
 *                 discount_applies_to: "specific"
 *                 createdAt: "2023-06-27T03:08:01.691Z"
 *                 updatedAt: "2023-06-27T03:08:01.691Z"
 *                 __v: 0
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /discount:
 *   delete:
 *     summary: Delete Discount Code
 *     tags: [Discount]
 *     security:
 *       - apiKeyAuth: []
 *       - client-id: []
 *       - authorization: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codeId:
 *                 type: string
 *             example:
 *               codeId: "SHOP_222"
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
 *                     discount_users_used:
 *                       type: array
 *                       items:
 *                         type: string
 *                     discount_is_active:
 *                       type: boolean
 *                     discount_product_ids:
 *                       type: array
 *                       items:
 *                         type: string
 *                     _id:
 *                       type: string
 *                     discount_name:
 *                       type: string
 *                     discount_description:
 *                       type: string
 *                     discount_type:
 *                       type: string
 *                     discount_value:
 *                       type: number
 *                     discount_code:
 *                       type: string
 *                     discount_start_date:
 *                       type: string
 *                       format: date-time
 *                     discount_end_date:
 *                       type: string
 *                       format: date-time
 *                     discount_max_uses:
 *                       type: integer
 *                     discount_uses_count:
 *                       type: integer
 *                     discount_max_uses_per_users:
 *                       type: integer
 *                     discount_min_order_value:
 *                       type: integer
 *                     discount_shopId:
 *                       type: string
 *                     discount_applies_to:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     __v:
 *                       type: integer
 *             example:
 *               message: "Delete code discount successfully"
 *               status: 200
 *               metadata:
 *                 discount_users_used: []
 *                 discount_is_active: true
 *                 discount_product_ids: []
 *                 _id: "649a4c9a8b7ab126718d80ff"
 *                 discount_name: "bla bal percentage"
 *                 discount_description: "description"
 *                 discount_type: "percentage"
 *                 discount_value: 10
 *                 discount_code: "SHOP_222"
 *                 discount_start_date: "2023-05-15T02:00:00.000Z"
 *                 discount_end_date: "2023-05-20T02:00:00.000Z"
 *                 discount_max_uses: 100
 *                 discount_uses_count: 0
 *                 discount_max_uses_per_users: 1
 *                 discount_min_order_value: 200000
 *                 discount_shopId: "6497bae63831453bf96906c4"
 *                 discount_applies_to: "all"
 *                 createdAt: "2023-06-27T02:42:34.225Z"
 *                 updatedAt: "2023-06-27T02:42:34.225Z"
 *                 __v: 0
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
