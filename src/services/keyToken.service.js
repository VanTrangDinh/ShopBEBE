'use strict';

const keyTokenModel = require('../models/keyToken.model');
const { Types } = require('mongoose');
class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    const filter = { user: userId },
      update = {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken,
      },
      options = { upsert: true, new: true };
    const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);

    return tokens ? tokens.publicKey : null;
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({
      user: new Types.ObjectId(userId),
    });
  };

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteMany({ _id: id });
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({
      refreshTokensUsed: refreshToken,
    });
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({
      refreshToken,
    });
  };

  static deleteKeyById = async (userId) => {
    return await keyTokenModel.deleteOne({
      user: new Types.ObjectId(userId),
    });
  };
}

module.exports = KeyTokenService;
