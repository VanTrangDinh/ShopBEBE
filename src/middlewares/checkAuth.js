'use strict';

const { BadRequestError } = require('../core/error.response');
const { findById } = require('../services/apikey.service');

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
};
const apiKey = async (req, res, next) => {
  const key = req.headers[HEADER.API_KEY]?.toString();
  // console.log(key);
  if (!key) {
    return res.status(403).json({
      message: 'Forbidden Error',
    });
  }

  const objKey = await findById(key);
  if (!objKey) {
    return res.status(403).json({
      message: 'Forbidden Error',
    });
  }

  req.objKey = objKey;
  return next();
};

const permission = (permission) => {
  // console.log({ permission });
  return (req, res, next) => {
    // console.log(req.objKey.permissions);
    if (!req.objKey.permissions) {
      throw new BadRequestError('Permission denied');
    }

    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      throw new BadRequestError('Permission denied');
    }

    return next();
  };
};

module.exports = {
  apiKey,
  permission,
};
