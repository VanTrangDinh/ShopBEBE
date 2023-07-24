'use strict';

const apikeyModel = require('../models/apikey.model');
const crypto = require('crypto');
const findById = async (key) => {
  //admin tao va cung cap apikey cho nguoi dung api
  // const newKey = await apikeyModel.create({
  //   key: crypto.randomBytes(64).toString('hex'),
  //   permissions: ['0000'],
  // });
  // console.log(newKey);

  const objKey = await apikeyModel.findOne({ key, status: true });
  return objKey;
};

module.exports = {
  findById,
};
