// 'use strict';

// const redis = require('redis');
// const { promisify } = require('util');
// // const { getConnection } = require('../dbs/redisConnection');
// // const redisClient = getConnection();
// const { reservationInventory } = require('../models/repository/inventory.repo');
// const redisClient = redis.createClient();

// const pexpire = promisify(redisClient.pExpire).bind(redisClient);
// const setnxAsync = promisify(redisClient.set).bind(redisClient);

// const acquireLock = async (productId, quantity, cartId) => {
//   // Get a connection from the pool
//   await redisClient.connect();
//   const key = `lock_v2023_${productId}`;
//   const keys = 'lock_v2023';
//   const value = 'myValue';
//   const retryTime = 10; // so lan retrieved
//   const expireTime = '3000'; // 3 giay tam lock => het 3 giay reload

//   for (let i = 0; i < retryTime; i++) {
//     try {
//       console.log('checking');
//       //tao mot key, user nao giu key thi duoc vao thanh toan
//       const result = await setnxAsync(key, expireTime); // neu chua ai giu thi result  === 1, otherwise result = 0

//       // const result = await setAsync(key, expireTime);
//       // const result = await redisClient.set(keys, value);
//       console.log(`result`, result);

//       if (result === 1) {
//         // thao tac voi inventory
//         const isReservation = await reservationInventory({
//           productId,
//           quantity,
//           cartId,
//         });
//         //if update is successful, it means that inventory was updated
//         if (isReservation.modifiedCount) {
//           //set key expiration
//           await pexpire(key, expireTime);
//           return key;
//         }
//         return null;
//       } else {
//         await new Promise((resolve) => setTimeout(resolve, 50));
//       }
//     } catch (error) {
//       console.error('Redis error:', error);
//       // Handle the error here, e.g., retry or throw an exception
//     }
//   }
// };

// const releaseLock = async (keyLock) => {
//   const delAsyncKey = promisify(redisClient.del).bind(redisClient);
//   return await delAsyncKey(keyLock);
// };

// module.exports = {
//   acquireLock,
//   releaseLock,
// };

'use strict';

// const { getConnection } = require('../dbs/redisConnection');
// const redisClient = getConnection();
const redis = require('redis');
const redisClient = redis.createClient();
const { promisify } = require('util');
const { reservationInventory, getInventoryCount } = require('../models/repository/inventory.repo');

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

/*

setNX
Integer reply, specifically:

    1 if the key was set
    0 if the key was not set

       {
            "shopId": "649ae8f093c7602eb5e694dd",
            "shop_discounts": [],
            "item_products": [
                {
                    "price": 249000,
                    "quantity": 3,
                    "productId": "649ae98b93c7602eb5e694e2"
                }
            ]
        }

*/
const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`;
  const retryTime = 10;
  const expireTime = '3000';

  for (let i = 0; i < retryTime; i++) {
    //tao mot key, user nao giu key thi duoc vao thanh toan

    // const result = await setnxAsync(key, expireTime);
    const result = await setnxAsync(key, expireTime);
    console.log(`result`, result);

    // const result = await setnxAsync(key, expireTime);
    // console.log(`result`, result);

    if (result === 1) {
      // thao tac voi inventory
      const isReservation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });
      //if update is successful, it means that inventory was updated
      if (isReservation.modifiedCount) {
        //set key expiration
        await pexpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  return null; // Lock acquisition failed
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
