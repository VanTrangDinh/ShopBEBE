const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Ecommerce API documentation',
    description:
      'Powerful and flexible API for seamless integration of eCommerce functionality.\n\nApikey example: 6ef27c712cb065c56e6e0176ccd817a399432c9749d54b871808a23d4c5166a3248d2e1894704ef1eae1767b32d26d450a0accde007e6e25b7cd40f884e88cd9',

    version: '1.0.0',
    version,
    // license: {

    //   name: 'MIT',
    //   url: 'https://github.com/hagopj13/node-express-boilerplate/blob/master/LICENSE',
    // },
  },
  // servers: [
  //   {
  //     url: `https://beshop.onrender.com/v1/api`,
  //     url: `http://localhost:3000/v1/api`,
  //   },
  // ],
  servers: [
    {
      url: `https://beshop.onrender.com/v1/api`,
      description: 'Production Server',
    },
    {
      url: `http://localhost:3000/v1/api`,
      description: 'Local Development Server',
    },
  ],
};

module.exports = swaggerDef;
