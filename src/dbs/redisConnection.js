// const redisObject = require('redis');
// const config = require('../config/config');
// const logger = require('../config/logger');

// let subConnection;
// let con;

// const createConnection = function () {
//   const redis = redisObject.createClient({
//     url: config.redis.redis_host,
//   });

//   redis.on('connect', function () {
//     logger.info('Connected to Redis at ' + config.redis.redis_host);
//   });
//   redis.on('Error', function (err) {
//     logger.error('er', err);
//   });

//   redis.connect();

//   return redis;
// };

// const createSubConnection = async function () {
//   const redis = redisObject.createClient({ url: config.redis.redis_host });
//   redis.on('connect', function () {
//     logger.info('Redis subscribe Connected');
//   });
//   redis.on('Error', function (err) {
//     logger.error('er', err);
//   });

//   // await redis.connect();

//   return redis;
// };

// module.exports.getSubConnection = async function () {
//   if (!subConnection) {
//     subConnection = await createSubConnection();
//   }

//   return subConnection;
// };

// module.exports.getConnection = function () {
//   if (!con) con = createConnection();

//   return con;
// };
