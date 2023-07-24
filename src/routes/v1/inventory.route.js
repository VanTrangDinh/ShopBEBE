'use strict';

const express = require('express');
const inventoryController = require('../../controllers/inventory.controller');
const asyncHandler = require('../../helpers/asyncHandle');
const { authenticationV2 } = require('../../middlewares/authUtils');

const router = express.Router();

router.use(authenticationV2);

router.post('/', asyncHandler(inventoryController.addStockToInventory));
router.get('/:inventoryId', asyncHandler(inventoryController.getInventoryById));

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Manages inventory items
 */

/**
 * @swagger
 * /inventory:
 *   post:
 *     summary: Add Stock to Inventory
 *     tags: [Inventory]
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
 *               stock:
 *                 type: integer
 *               productId:
 *                 type: string
 *               shopId:
 *                 type: string
 *               location:
 *                 type: string
 *             example:
 *               stock: 1000
 *               productId: "649830c3a9c1941e8aa44bef"
 *               shopId: "6497bae63831453bf96906c4"
 *               location: "29, Ly Thuong Kiet, HCM City"
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
 *                     inventory_location:
 *                       type: string
 *                     inventory_reservations:
 *                       type: array
 *                       items:
 *                         type: object
 *                     _id:
 *                       type: string
 *                     inventory_product_id:
 *                       type: string
 *                     inventory_shopId:
 *                       type: string
 *                     __v:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     inventory_stock:
 *                       type: integer
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *             example:
 *               message: "Successfully added the item to the inventory."
 *               status: 200
 *               metadata:
 *                 inventory_location: "29, Ly Thuong Kiet, HCM City"
 *                 inventory_reservations: []
 *                 _id: "64991eb15f06550670764c88"
 *                 inventory_product_id: "649830c3a9c1941e8aa44bef"
 *                 inventory_shopId: "6497bae63831453bf96906c4"
 *                 __v: 0
 *                 createdAt: "2023-06-26T05:14:25.387Z"
 *                 inventory_stock: 1000
 *                 updatedAt: "2023-06-26T05:14:25.387Z"
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /inventory/{inventoryId}:
 *   get:
 *     summary: Get  Inventory
 *     tags: [Inventory]
 *     security:
 *       - apiKeyAuth: []
 *       - client-id: []
 *       - authorization: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the inventory to retrieve
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
 *                     inventory_location:
 *                       type: string
 *                     inventory_reservations:
 *                       type: array
 *                       items:
 *                         type: object
 *                     _id:
 *                       type: string
 *                     inventory_product_id:
 *                       type: string
 *                     inventory_shopId:
 *                       type: string
 *                     __v:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     inventory_stock:
 *                       type: integer
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *             example:
 *               message: "Successfully added the item to the inventory."
 *               status: 200
 *               metadata:
 *                 inventory_location: "29, Ly Thuong Kiet, HCM City"
 *                 inventory_reservations: []
 *                 _id: "64991eb15f06550670764c88"
 *                 inventory_product_id: "649830c3a9c1941e8aa44bef"
 *                 inventory_shopId: "6497bae63831453bf96906c4"
 *                 __v: 0
 *                 createdAt: "2023-06-26T05:14:25.387Z"
 *                 inventory_stock: 1000
 *                 updatedAt: "2023-06-26T05:14:25.387Z"
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
