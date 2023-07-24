'use strict';

const express = require('express');
const productController = require('../../controllers/product.controller');
const asyncHandler = require('../../helpers/asyncHandle');
const { authenticationV2 } = require('../../middlewares/authUtils');
const { uploadPhoto, productImageResize } = require('../../services/uploadImage.service');

const router = express.Router();

router.post('/search', asyncHandler(productController.searchProduct));
router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct));

router.get('', asyncHandler(productController.findAllProduct));
router.get('/:productId', asyncHandler(productController.findOneProduct));

//authentication

router.use(authenticationV2);

router.patch('/upload/:id', uploadPhoto.array('images', 10), productImageResize, asyncHandler(productController.uploadImg));

router.post('/', asyncHandler(productController.createProduct));
router.patch('/:productId', asyncHandler(productController.updateProduct));
router.post('/publish/:id', asyncHandler(productController.publishProductByShops));

router.post('/unpublish/:id', asyncHandler(productController.unpublishProductByShops));

router.get('/drafts/all', asyncHandler(productController.getAllDraftShop));
router.get('/published/all', asyncHandler(productController.getAllPublishShop));

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Retrieves and manages all products
 */

/**
 * @swagger
 * /product/search:
 *   post:
 *     summary: Search Products
 *     tags: [Product]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               searchTerm:
 *                 type: string
 *               product_type:
 *                 type: string
 *               min_price:
 *                 type: number
 *               max_price:
 *                 type: number
 *             required:
 *               - searchTerm
 *               - product_type
 *           example:
 *               searchTerm: "music"
 *               product_type: "Electronics"
 *               min_price: 100
 *               max_price: 200
 *     responses:
 *       "200":
 *         description: Success
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
 *                     totalCount:
 *                       type: integer
 *                     products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product_attribute:
 *                             type: object
 *                             properties:
 *                               battery_life:
 *                                 type: string
 *                               color:
 *                                 type: string
 *                               connectivity:
 *                                 type: string
 *                             additionalProperties: false
 *                           product_description:
 *                             type: string
 *                           product_images:
 *                             type: array
 *                             items:
 *                               type: string
 *                           product_name:
 *                             type: string
 *                           product_price:
 *                             type: number
 *                           product_quantity:
 *                             type: integer
 *                           product_slug:
 *                             type: string
 *                           product_thumb:
 *                             type: string
 *                           product_type:
 *                             type: string
 *                           product_variations:
 *                             type: array
 *                             items: {}
 *                         required:
 *                           - product_attribute
 *                           - product_description
 *                           - product_images
 *                           - product_name
 *                           - product_price
 *                           - product_quantity
 *                           - product_slug
 *                           - product_thumb
 *                           - product_type
 *                           - product_variations
 *             example:
 *                 message: "Search Products success!"
 *                 status: 200
 *                 metadata:
 *                   totalCount: 1
 *                   products:
 *                     - product_attribute:
 *                         battery_life: "20 hours"
 *                         color: "Black"
 *                         connectivity: "Bluetooth"
 *                       product_description: "Immerse yourself in music with these high-quality wireless headphones."
 *                       product_images: []
 *                       product_name: "Wireless Headphones"
 *                       product_price: 149.99
 *                       product_quantity: 10
 *                       product_shop: "64aa3fb9f234f8494330d55c"
 *                       product_slug: "wireless-headphones"
 *                       product_thumb: "https://example.com/headphones_thumb.jpg"
 *                       product_type: "Electronics"
 *                       product_variations: []
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /product/search/{keySearch}:
 *   get:
 *     summary: Get List Search Product
 *     tags: [Product]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: keySearch
 *         required: true
 *         description: The search keyword
 *         schema:
 *           type: string
 *         example: sofa...
 *
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
 *                     $ref: '#/components/schemas/Product'
 *             example:
 *                   message: "Get List Search Product success!"
 *                   status: 200
 *                   metadata:
 *                     - _id: "649830c3a9c1941e8aa44bef"
 *                       product_variations: []
 *                       product_name: "Sofa Kandy Grey"
 *                       product_thumb: "product_thumb"
 *                       product_description: "new product"
 *                       product_price: 249
 *                       product_quantity: 200
 *                       product_shop: "6497bae63831453bf96906c4"
 *                       product_attribute:
 *                         manufacturer: "abcde"
 *                         model: "abc"
 *                         color: "gold"
 *                       product_type: "Furniture"
 *                       createdAt: "2023-06-25T12:19:15.637Z"
 *                       updatedAt: "2023-06-26T04:04:45.136Z"
 *                       product_slug: "sofa-kandy-grey"
 *                       __v: 0
 *                       score: 0.6666666666666666
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Find All Products
 *     tags: [Product]
 *     security:
 *       - apiKeyAuth: []
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
 *                     $ref: '#/components/schemas/Product'
 *             example:
 *                   message: "Find All Product success!"
 *                   status: 200
 *                   metadata:
 *                     - _id: "649830c3a9c1941e8aa44bef"
 *                       product_name: "Sofa Kandy Grey"
 *                       product_thumb: "product_thumb"
 *                       product_price: 249
 *                       product_shop: "6497bae63831453bf96906c4"
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a Product
 *     tags: [Product]
 *     security:
 *       - apiKeyAuth: []
 *       - client-id: []
 *       - authorization: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewProduct'
 *           examples:
 *             example1:
 *               value:
 *                 product_name: "Sofa Kandy Grey"
 *                 product_thumb: "product_thumb"
 *                 product_description: "New product"
 *                 product_price: 249
 *                 product_quantity: 200
 *                 product_type: "Furniture"
 *                 product_attribute:
 *                   manufacturer: "abcde"
 *                   model: "abc"
 *                   color: "gold"
 *             example2:
 *               value:
 *                 product_name: "Mobile Phone"
 *                 product_thumb: "product_thumb"
 *                 product_description: "Brand new mobile phone"
 *                 product_price: 699
 *                 product_quantity: 50
 *                 product_type: "Electronics"
 *                 product_attribute:
 *                   manufacturer: "XYZ Corporation"
 *                   model: "ABC123"
 *                   color: "Black"
 *             example3:
 *               value:
 *                 product_name: "T-Shirt"
 *                 product_thumb: "product_thumb"
 *                 product_description: "High-quality cotton t-shirt"
 *                 product_price: 29.99
 *                 product_quantity: 100
 *                 product_type: "Clothing"
 *                 product_attribute:
 *                   brand: "ABC Clothing"
 *                   size: "M"
 *                   color: "White"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *             examples:
 *               example1:
 *                 value:
 *                   message: "Create new product success!"
 *                   status: 200
 *                   metadata:
 *                     product_variations: []
 *                     isDraft: true
 *                     isPublished: false
 *                     _id: "6498f4255d175915007961a9"
 *                     product_name: "Sofa Kandy Grey"
 *                     product_thumb: "product_thumb"
 *                     product_description: "new product"
 *                     product_price: 249
 *                     product_quantity: 200
 *                     product_shop: "6497bae63831453bf96906c4"
 *                     product_attribute:
 *                       manufacturer: "abcde"
 *                       model: "abc"
 *                       color: "gold"
 *                     product_type: "Furniture"
 *                     createdAt: "2023-06-26T02:12:54.049Z"
 *                     updatedAt: "2023-06-26T02:12:54.049Z"
 *                     product_slug: "sofa-kandy-grey"
 *                     __v: 0
 *               example2:
 *                 value:
 *                   message: "Create new product success!"
 *                   status: 200
 *                   metadata:
 *                     product_variations: []
 *                     isDraft: true
 *                     isPublished: false
 *                     _id: "6498f4255d175915007961a9"
 *                     product_name: "Mobile Phone"
 *                     product_thumb: "product_thumb"
 *                     product_description: "Brand new mobile phone"
 *                     product_price: 699
 *                     product_quantity: 50
 *                     product_shop: "6497bae63831453bf96906c4"
 *                     product_attribute:
 *                       manufacturer: "XYZ Corporation"
 *                       model: "ABC123"
 *                       color: "Black"
 *                     product_type: "Electronics"
 *                     createdAt: "2023-06-26T02:12:54.049Z"
 *                     updatedAt: "2023-06-26T02:12:54.049Z"
 *                     product_slug: "mobile-phone"
 *                     __v: 0
 *               example3:
 *                 value:
 *                   message: "Create new product success!"
 *                   status: 200
 *                   metadata:
 *                     product_variations: []
 *                     isDraft: true
 *                     isPublished: false
 *                     _id: "6498f4255d175915007961a9"
 *                     product_name: "T-Shirt"
 *                     product_thumb: "product_thumb"
 *                     product_description: "High-quality cotton t-shirt"
 *                     product_price: 29.99
 *                     product_quantity: 100
 *                     product_shop: "6497bae63831453bf96906c4"
 *                     product_attribute:
 *                       brand: "ABC Clothing"
 *                       size: "M"
 *                       color: "White"
 *                     product_type: "Clothing"
 *                     createdAt: "2023-06-26T02:12:54.049Z"
 *                     updatedAt: "2023-06-26T02:12:54.049Z"
 *                     product_slug: "t-shirt"
 *                     __v: 0
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /product/upload/{id}:
 *   post:
 *     summary: Upload product images
 *     tags: [Product]
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
 *         description: The ID of the product
 *     requestBody:
 *         content:
 *             multipart/form-data:
 *               schema:
 *                 type: object
 *                 properties:
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: binary
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *             example:
 *               message: "Upload image of product success!"
 *               status: 200
 *               metadata:
 *                 product_images:
 *                   - url: "http://res.cloudinary.com/djcsnpiy1/image/upload/v1688832303/a38mmwizt4riy6zgl2re.png"
 *                     id: "a38mmwizt4riy6zgl2re"
 *                   - url: "http://res.cloudinary.com/djcsnpiy1/image/upload/v1688832306/pr2tfhpqwtppummaevbj.png"
 *                     id: "pr2tfhpqwtppummaevbj"
 *                   - url: "http://res.cloudinary.com/djcsnpiy1/image/upload/v1688832326/ylznujelqiwkeus87j8g.png"
 *                     id: "ylznujelqiwkeus87j8g"
 *                 product_variations: []
 *                 _id: "64a95c0bc3abc724686d7196"
 *                 product_name: "Sofa Kandy Grey"
 *                 product_thumb: "product_thumb"
 *                 product_description: "New product"
 *                 product_price: 249
 *                 product_quantity: 200
 *                 product_shop: "6497bae63831453bf96906c4"
 *                 product_attribute:
 *                   manufacturer: "abcde"
 *                   model: "abc"
 *                   color: "gold"
 *                 product_type: "Furniture"
 *                 createdAt: "2023-07-08T12:52:27.110Z"
 *                 updatedAt: "2023-07-08T16:06:25.154Z"
 *                 product_slug: "sofa-kandy-grey"
 *                 __v: 3
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /product/{productId}:
 *   patch:
 *     summary: Update a Product
 *     tags: [Product]
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
 *         description: The ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewProduct'
 *           examples:
 *             example1:
 *               value:
 *                 product_name: "Sofa Kandy Grey"
 *                 product_thumb: "product_thumb"
 *                 product_description: "New product"
 *                 product_price: 249
 *                 product_quantity: 200
 *                 product_type: "Furniture"
 *                 product_attribute:
 *                   manufacturer: "abcde"
 *                   model: "abc"
 *                   color: "gold"
 *             example2:
 *               value:
 *                 product_name: "Mobile Phone"
 *                 product_thumb: "product_thumb"
 *                 product_description: "Brand new mobile phone"
 *                 product_price: 699
 *                 product_quantity: 50
 *                 product_type: "Electronics"
 *                 product_attribute:
 *                   manufacturer: "XYZ Corporation"
 *                   model: "ABC123"
 *                   color: "Black"
 *             example3:
 *               value:
 *                 product_name: "T-Shirt"
 *                 product_thumb: "product_thumb"
 *                 product_description: "High-quality cotton t-shirt"
 *                 product_price: 29.99
 *                 product_quantity: 100
 *                 product_type: "Clothing"
 *                 product_attribute:
 *                   brand: "ABC Clothing"
 *                   size: "M"
 *                   color: "White"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *             examples:
 *               example1:
 *                 value:
 *                   message: "Update product success!"
 *                   status: 200
 *                   metadata:
 *                     product_variations: []
 *                     _id: "6498f4255d175915007961a9"
 *                     product_name: "Sofa Kandy Grey"
 *                     product_thumb: "product_thumb"
 *                     product_description: "new product"
 *                     product_price: 249
 *                     product_quantity: 200
 *                     product_shop: "6497bae63831453bf96906c4"
 *                     product_attribute:
 *                       manufacturer: "abcde"
 *                       model: "abc"
 *                       color: "gold"
 *                     product_type: "Furniture"
 *                     createdAt: "2023-06-26T02:12:54.049Z"
 *                     updatedAt: "2023-06-26T02:12:54.049Z"
 *                     product_slug: "sofa-kandy-grey"
 *                     __v: 0
 *               example2:
 *                 value:
 *                   message: "Update product success!"
 *                   status: 200
 *                   metadata:
 *                     product_variations: []
 *                     _id: "6498f4255d175915007961a9"
 *                     product_name: "Mobile Phone"
 *                     product_thumb: "product_thumb"
 *                     product_description: "Brand new mobile phone"
 *                     product_price: 699
 *                     product_quantity: 50
 *                     product_shop: "6497bae63831453bf96906c4"
 *                     product_attribute:
 *                       manufacturer: "XYZ Corporation"
 *                       model: "ABC123"
 *                       color: "Black"
 *                     product_type: "Electronics"
 *                     createdAt: "2023-06-26T02:12:54.049Z"
 *                     updatedAt: "2023-06-26T02:12:54.049Z"
 *                     product_slug: "mobile-phone"
 *                     __v: 0
 *               example3:
 *                 value:
 *                   message: "Update product success!"
 *                   status: 200
 *                   metadata:
 *                     product_variations: []
 *                     _id: "6498f4255d175915007961a9"
 *                     product_name: "T-Shirt"
 *                     product_thumb: "product_thumb"
 *                     product_description: "High-quality cotton t-shirt"
 *                     product_price: 29.99
 *                     product_quantity: 100
 *                     product_shop: "6497bae63831453bf96906c4"
 *                     product_attribute:
 *                       brand: "ABC Clothing"
 *                       size: "M"
 *                       color: "White"
 *                     product_type: "Clothing"
 *                     createdAt: "2023-06-26T02:12:54.049Z"
 *                     updatedAt: "2023-06-26T02:12:54.049Z"
 *                     product_slug: "t-shirt"
 *                     __v: 0
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /product/{productId}:
 *   get:
 *     summary: Get a Product by ID
 *     tags: [Product]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         description: ID of the product
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 status:
 *                   type: number
 *                   description: Status code
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     product_variations:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           // Define properties of product variations
 *                     _id:
 *                       type: string
 *                       description: ID of the product
 *                     product_name:
 *                       type: string
 *                       description: Name of the product
 *                     product_thumb:
 *                       type: string
 *                       description: Thumbnail image URL of the product
 *                     product_description:
 *                       type: string
 *                       description: Description of the product
 *                     product_price:
 *                       type: number
 *                       description: Price of the product
 *                     product_quantity:
 *                       type: number
 *                       description: Quantity of the product
 *                     product_shop:
 *                       type: string
 *                       description: ID of the shop associated with the product
 *                     product_attribute:
 *                       type: object
 *                       properties:
 *                         manufacturer:
 *                           type: string
 *                           description: Manufacturer of the product
 *                         model:
 *                           type: string
 *                           description: Model of the product
 *                         color:
 *                           type: string
 *                           description: Color of the product
 *                     product_type:
 *                       type: string
 *                       description: Type of the product
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Date and time when the product was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Date and time when the product was last updated
 *                     product_slug:
 *                       type: string
 *                       description: Slug of the product
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /product/publish/{id}:
 *   post:
 *     summary: Publish a Product by Shops
 *     tags: [Product]
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
 *         description: The ID of the product
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
 *                   example: Pubish Product By Shop success!
 *                 status:
 *                   type: number
 *                   example: 200
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *
 */

/**
 * @swagger
 * /product/unpublish/{id}:
 *   post:
 *     summary: Unpublish a Product by Shops
 *     tags: [Product]
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
 *         description: The ID of the product
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
 *                   example: Unpubish Product By Shop success!
 *                 status:
 *                   type: number
 *                   example: 200
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /product/drafts/all:
 *   get:
 *     summary: Get All Draft Products by Shop
 *     tags: [Product]
 *     security:
 *       - apiKeyAuth: []
 *       - client-id: []
 *       - authorization: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *             example:
 *                   message: "Get list draft success!"
 *                   status: 200
 *                   metadata:
 *                     - _id: "649830c3a9c1941e8aa44bef"
 *                       product_variations: []
 *                       product_name: "Sofa Kandy Grey"
 *                       product_thumb: "product_thumb"
 *                       product_description: "new product"
 *                       product_price: 249
 *                       product_quantity: 200
 *                       product_shop:
 *                         name: "fake name"
 *                         email: "fake@example.com"
 *                       product_attribute:
 *                         manufacturer: "abcde"
 *                         model: "abc"
 *                         color: "gold"
 *                       product_type: "Furniture"
 *                       createdAt: "2023-06-25T12:19:15.637Z"
 *                       updatedAt: "2023-06-25T12:19:15.637Z"
 *                       product_slug: "sofa-kandy-grey"
 *                       __v: 0
 *                     - _id: "6498f4255d175915007961a9"
 *                       product_variations: []
 *                       product_name: "Sofa Kandy Grey"
 *                       product_thumb: "product_thumb"
 *                       product_description: "new product"
 *                       product_price: 249
 *                       product_quantity: 200
 *                       product_shop:
 *                         name: "fake name"
 *                         email: "fake@example.com"
 *                       product_attribute:
 *                         manufacturer: "abcde"
 *                         model: "abc"
 *                         color: "gold"
 *                       product_type: "Furniture"
 *                       createdAt: "2023-06-26T02:12:54.049Z"
 *                       updatedAt: "2023-06-26T02:12:54.049Z"
 *                       product_slug: "sofa-kandy-grey"
 *                       __v: 0
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /product/published/all:
 *   get:
 *     summary: Get All Published Products by Shop
 *     tags: [Product]
 *     security:
 *       - apiKeyAuth: []
 *       - client-id: []
 *       - authorization: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *             example:
 *                   message: "Get list draft success!"
 *                   status: 200
 *                   metadata:
 *                     - _id: "649830c3a9c1941e8aa44bef"
 *                       product_variations: []
 *                       product_name: "Sofa Kandy Grey"
 *                       product_thumb: "product_thumb"
 *                       product_description: "new product"
 *                       product_price: 249
 *                       product_quantity: 200
 *                       product_shop:
 *                         name: "fake name"
 *                         email: "fake@example.com"
 *                       product_attribute:
 *                         manufacturer: "abcde"
 *                         model: "abc"
 *                         color: "gold"
 *                       product_type: "Furniture"
 *                       createdAt: "2023-06-25T12:19:15.637Z"
 *                       updatedAt: "2023-06-25T12:19:15.637Z"
 *                       product_slug: "sofa-kandy-grey"
 *                       __v: 0
 *                     - _id: "6498f4255d175915007961a9"
 *                       product_variations: []
 *                       product_name: "Sofa Kandy Grey"
 *                       product_thumb: "product_thumb"
 *                       product_description: "new product"
 *                       product_price: 249
 *                       product_quantity: 200
 *                       product_shop:
 *                         name: "fake name"
 *                         email: "fake@example.com"
 *                       product_attribute:
 *                         manufacturer: "abcde"
 *                         model: "abc"
 *                         color: "gold"
 *                       product_type: "Furniture"
 *                       createdAt: "2023-06-26T02:12:54.049Z"
 *                       updatedAt: "2023-06-26T02:12:54.049Z"
 *                       product_slug: "sofa-kandy-grey"
 *                       __v: 0
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
