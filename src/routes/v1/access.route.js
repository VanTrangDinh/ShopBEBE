'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const asyncHandler = require('../../helpers/asyncHandle');
const { authenticationV2 } = require('../../middlewares/authUtils');

const router = express.Router();

router.post('/register', asyncHandler(accessController.signUp));

router.post('/login', asyncHandler(accessController.logIn));
router.post('/forgot-password', asyncHandler(accessController.forgetPassword));
router.post('/reset-password', asyncHandler(accessController.resetPassword));
router.post('/verify-email', asyncHandler(accessController.verifyEmail));

router.use(authenticationV2);

router.post('/logout', asyncHandler(accessController.logOut));
router.post('/refresh-tokens', asyncHandler(accessController.handlerRefreshToken));
router.post('/send-verification-email', asyncHandler(accessController.sendVerificationEmail));

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Shop
 *   description: Operations about shop
 */

/**
 * @swagger
 * /shop/register:
 *   post:
 *     summary: Register as shop
 *     tags: [Shop]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registered OK!"
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 201
 *                     metadata:
 *                       type: object
 *                       properties:
 *                         shop:
 *                           $ref: '#components/schemas/Shop'
 *                         tokens:
 *                           $ref: '#components/schemas/Tokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /shop/login:
 *   post:
 *     summary: Login
 *     tags: [Shop]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: fake@example.com
 *               password: password1
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
 *                   example: "Success"
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 metadata:
 *                   type: object
 *                   properties:
 *                         shop:
 *                           $ref: '#components/schemas/Shop'
 *                         tokens:
 *                           $ref: '#components/schemas/Tokens'
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Invalid email or password
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /shop/logout:
 *   post:
 *     summary: Logout
 *     tags: [Shop]
 *     security:
 *       - apiKeyAuth: []
 *       - client-id: []
 *       - authorization: []
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /shop/refresh-tokens:
 *   post:
 *     summary: Refresh auth tokens
 *     tags: [Shop]
 *     security:
 *       - apiKeyAuth: []
 *       - client-id: []
 *       - refresh-token: []
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
 *                   example: "Get token success!"
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 metadata:
 *                    type: object
 *                    properties:
 *                       status:
 *                          type: integer
 *                          example: 200
 *                       metadata:
 *                          type: string
 *                          example: "null"
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /shop/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: An email will be sent to reset password.
 *     tags: [Shop]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             example:
 *               email: fake@example.com
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
 *                   example: "Get Password Success"
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 200
 *                     metadata:
 *                       type: string
 *                       example: null
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /shop/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Shop]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The reset password token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               email: fake@example.com
 *               password: password2
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
 *                   example: "Reset Password Success"
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 200
 *                     metadata:
 *                       type: object
 *                       properties:
 *                         shop:
 *                           $ref: '#components/schemas/Shop'
 *                         tokens:
 *                           $ref: '#components/schemas/Tokens'
 *       "204":
 *         description: No content
 *       "401":
 *         description:  Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Shop not registered!
 *       "403":
 *         description:  Forbidden request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 403
 *               message: Something wrong happed! Please relogin
 *       "404":
 *         description:  Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 404
 *               message: Not found keystore
 */

/**
 * @swagger
 * /shop/send-verification-email:
 *   post:
 *     summary: Send verification email
 *     description: An email will be sent to verify email.
 *     tags: [Shop]
 *     security:
 *       - apiKeyAuth: []
 *       - client-id: []
 *       - refresh-token: []
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
 *                   example: "Send Verification Email Success"
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 200
 *                     metadata:
 *                       type: string
 *                       example: null
 *       "400":
 *         description:  Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 403
 *               message: Shop are already verified
 *
 *       "401":
 *         description:  Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Shop not registered!
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         description:  Forbidden Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 403
 *               message: Something wrong happed! Please relogin
 */

/**
 * @swagger
 * /shop/verify-email:
 *   post:
 *     summary: verify email
 *     tags: [Shop]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The verify email token
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
 *                   example: "Verify Email Success"
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 200
 *                     metadata:
 *                       type: object
 *                       properties:
 *                         shop:
 *                           $ref: '#components/schemas/Shop'
 *                         tokens:
 *                           $ref: '#components/schemas/Tokens'
 *       "401":
 *         description: Verify email failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: verify email failed
 *       "404":
 *         description:  Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Shop not registered!
 */
