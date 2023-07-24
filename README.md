# RESTful API Node Server Ecommerce Services

An Ecommerce project build RESTful APIs using Node.js, Express, and Mongoose.

By running a single command, you will get a production-ready Node.js app installed and fully configured on your machine. The app comes with many built-in features, such as authentication using JWT, request validation, unit and integration tests, continuous integration, docker support, API documentation, pagination, etc. For more details, check the features list below.

## [REST API Swagger](https://beshop.onrender.com)

## Manual Installation

If you would still prefer to do the installation manually, follow these steps:

Clone the repo:

```bash

git  clone  --depth  1  https://github.com/VanTrangDinh/BEShop.git

cd  BEShop

npx  rimraf  ./.git

```

Install the dependencies:

```bash

yarn  install

```

Set the environment variables:

```bash

cp  .env.example  .env



# open .env and modify the environment variables (if needed)

```

## Table of Contents

- [Features](#features)

- [Commands](#commands)

- [Environment Variables](#environment-variables)

- [Project Structure](#project-structure)

- [API Documentation](#api-documentation)

- [Error Handling](#error-handling)

- [Validation](#validation)

- [Authentication With User](#authentication-with-user)

- [Authentication With Shop](#authorization-with-shop)

- [Authorization ](#authorization)

- [Repository ](#repository)

- [ProductFactory ](#productfactory)

- [Control Order For Limited Products ](#control-order-for-limited-products)

## Features

- **NoSQL database**: [MongoDB](https://www.mongodb.com) object data modeling using [Mongoose](https://mongoosejs.com)

- **Authentication and authorization**: using [passport](http://www.passportjs.org)

- **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)

- **Logging**: using [winston](https://github.com/winstonjs/winston), [morgan](https://github.com/expressjs/morgan) and [discord bot](https://discord.bots.gg/bots/298822483060981760)

- **Testing**: unit and integration tests using [Jest](https://jestjs.io)

- **Error handling**: centralized error handling mechanism

- **API documentation**: with [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) and [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)

- **Process management**: advanced production process management using [PM2](https://pm2.keymetrics.io)

- **Dependency management**: with [Yarn](https://yarnpkg.com)

- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv) and [cross-env](https://github.com/kentcdodds/cross-env#readme)

- **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io)

- **Santizing**: sanitize request data against xss and query injection

- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)

- **Compression**: gzip compression with [compression](https://github.com/expressjs/compression)

- **CI**: continuous integration with [Travis CI](https://travis-ci.org)

- **Docker support**

- **Code coverage**: using [coveralls](https://coveralls.io)

- **Code quality**: with [Codacy](https://www.codacy.com)

- **Git hooks**: with [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged)

- **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)

- **Editor config**: consistent editor configuration using [EditorConfig](https://editorconfig.org)

## Commands

Running locally:

```bash

yarn  dev

```

Running in production:

```bash

yarn  start

```

Testing:

```bash

# run all tests

yarn  test



# run all tests in watch mode

yarn  test:watch



# run test coverage

yarn  coverage

```

Docker:

```bash

# run docker container in development mode

yarn  docker:dev



# run docker container in production mode

yarn  docker:prod



# run all tests in a docker container

yarn  docker:test

```

Linting:

```bash

# run ESLint

yarn  lint



# fix ESLint errors

yarn  lint:fix



# run prettier

yarn  prettier



# fix prettier errors

yarn  prettier:fix

```

## Environment Variables

The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash

# Port number

PORT=3000



# URL of the Mongo DB

MONGODB_URL=mongodb://127.0.0.1:27017/node-boilerplate



# JWT

# JWT secret key

JWT_SECRET=thisisasamplesecret

# Number of minutes after which an access token expires

JWT_ACCESS_EXPIRATION_MINUTES=30

# Number of days after which a refresh token expires

JWT_REFRESH_EXPIRATION_DAYS=30



# SMTP configuration options for the email service

# For testing, you can use a fake SMTP service like Ethereal: https://ethereal.email/create

SMTP_HOST=email-server

SMTP_PORT=587

SMTP_USERNAME=email-server-username

SMTP_PASSWORD=email-server-password

EMAIL_FROM=support@yourapp.com

```

## Project Structure

```

src\

|--config\ # Environment variables and configuration related things

|--controllers\ # Route controllers (controller layer)

|--docs\ # Swagger files

|--helpers\ # Check connect and async handle file

|--loggers\ # Handle log to server discord

|--middlewares\ # Custom express middlewares

|--models\ # Mongoose models (data layer)

|--routes\ # Routes

|--services\ # Business logic (service layer)

|--utils\ # Utility classes and functions

|--validations\ # Request data validation schemas

|--app.js # Express app

|--index.js # App entry point

```

## API Documentation

To view the list of available APIs and their specifications, run the server and go to `http://localhost:3000/v1/docs` in your browser. This documentation page is automatically generated using the [swagger](https://swagger.io/) definitions written as comments in the route files.

### API Endpoints

List of available routes:

**Shop routes**:\

`POST /v1/api/register` - register\

`POST /v1/api/login`- login\

`POST /v1/api/forgot-password` refresh auth tokens\

`POST /v1/api/reset-password`- send reset password email\

`POST /v1/api/verify-email`- reset password\

`POST /v1/api/logout` - log out\

`POST /v1/api/refresh-tokens`- send verification email\

`POST /v1/api/send-verification-email`- verify email

**Cart routes**:\

`POST /v1/api/cart` - add product\

`GET /v1/api/cart` - get list of cart items\

`DELETE /v1/api/cart` - delete cart\

`PATCH /v1/api/cart/update` - update\

**Checkout routes**:\

`POST /v1/api/checkout/review` - checkout\

`POST /v1/api/checkout/order` - order\

`GET /v1/api/checkout/order` - get order\

`PATCH /v1/api/checkout/order/:orderId` - cancel order\

`PATCH /v1/api/checkout/order/accept` - update status of order\

**Discount routes**:\

`POST /v1/api/discount` - create discount code\

`GET /v1/api/discount` - get discount\

`DELETE /v1/api/discount` - delete discount\

`GET /v1/api/discout/` - cancel order\

`GET /v1/api/discount/list-product-code` - get all discount\

`POST /v1/api/discount/amount` - apply discount code\

`POST /v1/api/discount/cancel` - cancel discount code\

**Product routes**:\

`GET /v1/api/product/search/:keysearch` - search fulltex product\

`GET /v1/api/product` - get all product\

`POST /v1/api/product` - create product\

`PATCH /v1/api/product/:productId` - update product\

`GET /v1/api/product/:productId` - get product\

`POST /v1/api/product/publish/:id` - publish product\

`POST /v1/api/product/unpublish/:id` - un publish product\

`GET /v1/api/product/drafts/all` - get drafts\

`GET /v1/api/product/published/all` - get all pushlished\

**Inventory routes**:\

`POST /v1/api/inventory` - add stock to inventory\

`GET /v1/api/inventory/:inventoryId` - get inventory\

**User routes**:\

`POST /v1/users` - create a user\

`GET /v1/users` - get all users\

`GET /v1/users/:userId` - get user\

`PATCH /v1/users/:userId` - update user\

`DELETE /v1/users/:userId` - delete user

## Error Handling

The app has a centralized error handling mechanism.

When designing routes, it is recommended for controllers to make an effort to capture errors and pass them to the error handling middleware by invoking `next(error)`. To simplify this process, you can also enclose the controller within the `asyncHandler` utility wrapper, which takes care of forwarding any errors.

```javascript
'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const asyncHandler = require('../../helpers/asyncHandle');

const router = express.Router();

router.post('/register', asyncHandler(accessController.signUp));
```

The error handling middleware sends an error response, which has the following format:

```json
{
  "code": 401,
  "message": "Please authenticate"
}
```

In development mode, the error response includes the error stack trace.

To facilitate error handling, the application provides an AuthFailureError utility class. You can assign a response code and a message to it, and then throw it from any location (asyncHandler will catch it).

For instance, if you are attempting to retrieve a user from the database but cannot find them, and you wish to send a 404 error, the code should resemble the following:

```javascript
'use strict'

const { AuthFailureError } = require('../core/error.response');
const { findByEmail, getShopById, verifyShop } =  require('./shop.service');

static  verifyEmail  =  async (verifyEmailToken) => {
 const  keyStore  =  await  findByRefreshToken(verifyEmailToken);
 if (!keyStore) throw  new  AuthFailureError('Verify email failed');
};
```

## Validation

Request data is validated using [Joi](https://joi.dev/). Check the [documentation](https://joi.dev/api/) for more details on how to write Joi validation schemas.

The validation schemas are defined in the `src/validations` directory and are used in the routes by providing them as parameters to the `validate` middleware.

```javascript
const express = require('express');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.post('/users', validate(userValidation.createUser), userController.createUser);
```

## Authentication With User

To require authentication for certain routes, you can use the `auth` middleware.

```javascript
const express = require('express');
const auth = require('../../middlewares/auth');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.post('/users', auth(), userController.createUser);
```

These routes require a valid JWT access token in the Authorization request header using the Bearer schema. If the request does not contain a valid access token, an Unauthorized (401) error is thrown.

**Generating Access Tokens**:

An access token can be generated by making a successful call to the register (`POST /v1/api/user/register`) or login (`POST /v1/api/user/login`) endpoints. The response of these endpoints also contains refresh tokens (explained below).

An access token is valid for 30 minutes. You can modify this expiration time by changing the `JWT_ACCESS_EXPIRATION_MINUTES` environment variable in the .env file.

**Refreshing Access Tokens**:

After the access token expires, a new access token can be generated, by making a call to the refresh token endpoint (`POST /v1/api/user/refresh-tokens`) and sending along a valid refresh token in the request body. This call returns a new access token and a new refresh token.

A refresh token is valid for 30 days. You can modify this expiration time by changing the `JWT_REFRESH_EXPIRATION_DAYS` environment variable in the .env file.

## Authentication With Shop

To require authentication for certain routes using an API key, you can implement the following approach:

- Generate and assign a unique API key to each user or client that needs access to protected routes.

```javascript
//Admin creates and assigns an API key to each API user.
const apikeyModel = require('../models/apikey.model');

const crypto = require('crypto');
const newKey = await apikeyModel.create({
  key: crypto.randomBytes(64).toString('hex'),
  permissions: ['0000'],
});
```

- When making requests to the protected routes, include the API key as part of the request headers or query parameters.

```javascript
'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const asyncHandler = require('../../helpers/asyncHandle');
const { apikey } = require('../../middlewares/authUtils');
const router = express.Router();

router.use(apikey);

router.post('/register', asyncHandler(accessController.signUp));
```

To require authentication for certain routes, you can use the `authenticationV2` middleware.

```javascript
'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const asyncHandler = require('../../helpers/asyncHandle');
const { authenticationV2 } = require('../../middlewares/authUtils');

const router = express.Router();

router.use(authenticationV2);
router.post('/logout', asyncHandler(accessController.logOut));
router.post('/refresh-tokens', asyncHandler(accessController.handlerRefreshToken));
router.post('/send-verification-email', asyncHandler(accessController.sendVerificationEmail));
```

These routes require a valid JWT access token in the Authorization request header using the Bearer schema. If the request does not contain a valid access token, an Unauthorized (401) error is thrown.

**Generating Access Tokens**:

An access token can be generated by making a successful call to the register (`POST /v1/api/shop/register`) or login (`POST /v1/api/shop/login`) endpoints. The response of these endpoints also contains refresh tokens (explained below).

An access token is valid for 30 minutes. You can modify this expiration time by changing the `JWT_ACCESS_EXPIRATION_MINUTES` environment variable in the .env file.

**Refreshing Access Tokens**:

After the access token expires, a new access token can be generated, by making a call to the refresh token endpoint (`POST /v1/api/shop/refresh-tokens`) and sending along a valid refresh token in the request body. This call returns a new access token and a new refresh token.

A refresh token is valid for 30 days. You can modify this expiration time by changing the `JWT_REFRESH_EXPIRATION_DAYS` environment variable in the .env file.

## Authorization

The `auth` middleware can also be used to require certain rights/permissions to access a route.

```javascript
const express = require('express');
const auth = require('../../middlewares/auth');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.post('/users', auth('manageUsers'), userController.createUser);
```

In the example above, an authenticated user can access this route only if that user has the `manageUsers` permission.

The permissions are role-based. You can view the permissions/rights of each role in the `src/config/roles.js` file.

If the user making the request does not have the required permissions to access this route, a Forbidden (403) error is thrown.

## Repository

The repository pattern is used in this project to handle data access and retrieval for the `cart` collection.

The `cart` repository provides an interface to interact with the `cart` collection in the database. It encapsulates the logic for finding a cart document by its ID.

```javascript
'use strict';

const { cart } = require('../cart.model');
const { converToObjectInMongodb } = require('../../utils');
const findCartById = async (cartId) => {
  return cart.findOne({ _id: converToObjectInMongodb(cartId), cart_state: 'active' }).lean();
};

module.exports = { findCartById };
```

## ProductFactory

The `ProductFactory` class combines the Factory and Strategy patterns to provide flexible object creation and behavior selection for different types of products.

**Factory Pattern**:

The Factory pattern is utilized in the `ProductFactory` class to encapsulate the creation logic of products. It provides a centralized factory that creates objects based on the provided parameters or configuration. This helps to abstract away the object creation details from the client code.

**Usage**:

To create products using the Factory pattern, follow these steps:

1.  Import the `ProductFactory` module:

```javascript
const ProductFactory = require('./path/to/product.factory');
```

- Use the factory to create products:

```javascript
const product = await ProductFactory.createProduct(type, payload);
```

Replace `type` with the desired product type (e.g., `'Electronics'`, `'Clothing'`, `'Furniture'`) and provide the necessary `payload` object to configure the product.

2.  The factory will create an instance of the appropriate product class based on the provided type and invoke the `createProduct` method of that class.

**Strategy Pattern**

The Strategy pattern is utilized in the `Product`, `Clothing`, `Electronics`, and `Furniture` classes to define different behaviors for creating and updating products. Each class represents a specific type of product and extends the `Product` class.

**Usage**

To use the Strategy pattern for different product types, follow these steps:

1.  Import the relevant modules:

    ```javascript
    const ProductFactory = require('./path/to/product.factory');
    const { BadRequestError } = require('../core/error.response');
    const { insertInventory } = require('../models/repository/inventory.repo');
    const { updateProductById } = require('../models/repository/product.repo');
    const { updateNestedObjectPraser } = require('../utils');
    ```

- Register the product types with the `ProductFactory`:

  ```javascript
  ProductFactory.registerProductType('Electronics', Electronics);
  ProductFactory.registerProductType('Clothing', Clothing);
  ProductFactory.registerProductType('Furniture', Furniture);
  ```

- Use the `ProductFactory` to create and update products:

  ```javascript
  const product = await ProductFactory.createProduct(type, payload);
  const updatedProduct = await ProductFactory.updateProduct(type, productId, payload);
  ```

Replace `type` with the desired product type (e.g., `'Electronics'`, `'Clothing'`, `'Furniture'`) and provide the necessary `payload` object to configure the product. The `updateProduct` method allows updating an existing product based on its `productId`

The Redis Lock module provides functionality for acquiring and releasing locks using Redis. It ensures that only one process or thread can access a particular resource at a time, preventing concurrency issues.
Installation

Install the required dependencies using `npm`:

## Control Order For Limited Products

The Control Order module provides functionality for managing order requests when a product has limited availability and multiple users are trying to order it simultaneously. It helps prevent overselling and ensures fair distribution of the available stock.

**Installation**

Install the required dependencies using `npm`:

```bash
npm install redis
```

**Usage**

To use the Redis Lock module, follow these steps:

1.  Import the necessary modules:

    ```javascript
    const redis = require('redis');
    const redisClient = redis.createClient();
    const { promisify } = require('util');
    const { reservationInventory } = require('../models/repository/inventory.repo');
    ```

- Create a Redis client and promisify Redis commands:

  ```javascript
  const pexpire = promisify(redisClient.pExpire).bind(redisClient);
  const setnxAsync = promisify(redisClient.setNX).bind(redisClient);
  ```

- Implement the `acquireLock` function:

  ```javascript
  const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`;
    const retryTime = 10;
    const expireTime = '3000';

    for (let i = 0; i < retryTime; i++) {
      const result = await setnxAsync(key, expireTime);

      if (result === 1) {
        const isReservation = await reservationInventory({
          productId,
          quantity,
          cartId,
        });

        if (isReservation.modifiedCount) {
          await pexpire(key, expireTime);
          return key;
        }
        return null;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    return null;
  };
  ```

  The `acquireLock` function attempts to acquire a lock for a specific `productId` and `quantity` by setting a Redis key using `setnxAsync`. It retries a certain number of times and returns the acquired lock key or `null` if the lock acquisition fails.

- Implement the `releaseLock` function:

  ```javascript
  const releaseLock = async (keyLock) => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient);
    return await delAsyncKey(keyLock);
  };
  ```

  The `releaseLock` function releases the lock associated with the provided `keyLock`.

- Export the functions:

      ```javascript
       module.exports = {acquireLock,releaseLock};
      ```

**API**

- acquireLock(productId, quantity, cartId)

Attempts to acquire a lock for the specified `productId` and `quantity`. The `cartId` parameter is used for reservation purposes. If the lock is successfully acquired and the inventory is updated, the lock key is returned. Otherwise, `null` is returned.

- releaseLock(keyLock)

Releases the lock associated with the provided `keyLock`.

**Dependencies**

The Control Order module depends on the following packages:

- `redis`: Redis client for Node.js.
- `util`: Utility module for working with Promises.

Make sure to install these dependencies using `npm` or any other package manager before using the Control Order module.
