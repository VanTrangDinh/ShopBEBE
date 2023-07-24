'use strict';

const express = require('express');
const commentController = require('../../controllers/comment.controller');
const asyncHandler = require('../../helpers/asyncHandle');
const auth = require('../../middlewares/auth');
const { authenticationV2 } = require('../../middlewares/authUtils');

const router = express.Router();

router.post('/', auth(), asyncHandler(commentController.creatComment));
router.get('/', asyncHandler(commentController.getCommentByParentId));

router.use(authenticationV2);

module.exports = router;

/**
 * @swagger
 * tags:
 *   - name: Comment
 *     description: Manages comments for products
 */

/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Create Comment
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               content:
 *                 type: string
 *               parentCommentId:
 *                 type: string
 *             example:
 *               productId: "64b121f70d0b7f59069ca20a"
 *               content: "comment 1"
 *               parentCommentId: null
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
 *                     comment_content:
 *                       type: string
 *                     comment_left:
 *                       type: integer
 *                     comment_right:
 *                       type: integer
 *                     isdeleted:
 *                       type: boolean
 *                     _id:
 *                       type: string
 *                     comment_productId:
 *                       type: string
 *                     comment_userId:
 *                       type: string
 *                     comment_parentId:
 *                       type: string
 *                     createdOn:
 *                       type: string
 *                       format: date-time
 *                     modifiedOn:
 *                       type: string
 *                       format: date-time
 *                     __v:
 *                       type: integer
 *             example:
 *               message: "A new comment was successfully created."
 *               status: 200
 *               metadata:
 *                 comment_content: "comment 1"
 *                 comment_left: 1
 *                 comment_right: 2
 *                 isdeleted: false
 *                 _id: "64b2186543c283510701c81e"
 *                 comment_productId: "64b121f70d0b7f59069ca20a"
 *                 comment_userId: "64b2040722817231d78ea4b4"
 *                 comment_parentId: "64b2184343c283510701c810"
 *                 createdOn: "2023-07-15T03:54:14.608Z"
 *                 modifiedOn: "2023-07-15T03:54:14.608Z"
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
 * /comment:
 *   get:
 *     summary: Get Comments by Parent
 *     tags: [Comment]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the parent product
 *       - in: query
 *         name: parentCommentId
 *         schema:
 *           type: string
 *         description: ID of the parent comment
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
 *                       comment_content:
 *                         type: string
 *                       comment_left:
 *                         type: integer
 *                       comment_right:
 *                         type: integer
 *                       _id:
 *                         type: string
 *                       comment_parentId:
 *                         type: string
 *             example:
 *               message: "Get comment by parent successfully"
 *               status: 200
 *               metadata:
 *                 - comment_content: "comment 1.1.1"
 *                   comment_left: 3
 *                   comment_right: 8
 *                   _id: "64b2184343c283510701c810"
 *                   comment_parentId: "64b2178443c283510701c7df"
 *                 - comment_content: "comment 1.1.1.1"
 *                   comment_left: 4
 *                   comment_right: 5
 *                   _id: "64b2185c43c283510701c817"
 *                   comment_parentId: "64b2184343c283510701c810"
 *                 - comment_content: "comment 1.1.1.2"
 *                   comment_left: 6
 *                   comment_right: 7
 *                   _id: "64b2186543c283510701c81e"
 *                   comment_parentId: "64b2184343c283510701c810"
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
