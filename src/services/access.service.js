'use strict';

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const shopService = require('./shop.service');
const { findByUserId, findByRefreshToken } = require('../services/keyToken.service');
const { createTokenPair, verifyJWT, authenticationV2 } = require('../middlewares/authUtils');
const { getInfoData } = require('../utils/index');
const { BadRequestError, AuthFailureError, ForbiddenError, NotFoundError } = require('../core/error.response');
const JWT = require('jsonwebtoken');
const { findByEmail, getShopById, verifyShop } = require('./shop.service');
const { sendResetPasswordEmail } = require('../services/email.service');

// ROLESHOP: ĐƯỢC KÍ HIỆU BẰNG '0001' CHỨ K GHI SẴN RA NHƯ VẬY, ĐỂ TRONG ENV
const RolesShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {
  static verifyEmail = async (verifyEmailToken) => {
    const keyStore = await findByRefreshToken(verifyEmailToken);

    if (!keyStore) throw new AuthFailureError('Verify email failed');
    const foundShop = await getShopById(keyStore.user);

    const { _id: userId, email } = foundShop;
    if (!foundShop) throw new NotFoundError('Shop not registered!!');

    const newShop = await verifyShop(userId, { verify: true });

    console.log(newShop);

    const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey);

    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: verifyEmailToken,
      },
    });
    return {
      shop: getInfoData({
        fileds: ['_id', 'name', 'email'],
        object: newShop,
      }),
      tokens,
    };
  };

  static sendVerificationEmail = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user;
    const foundShop = await findByEmail({ email });

    if (foundShop.verify === true) throw new BadRequestError('Shop are already verified');

    if (!foundShop) throw new AuthFailureError('Shop not registered!!');

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError('Something wrong happed! Please relogin');
    }

    const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey);

    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
    });

    await sendResetPasswordEmail(email, tokens.refreshToken);

    return {
      code: 200,
      metadata: null,
    };
  };

  static resetPassword = async (refreshToken, newPassword) => {
    const { password, email } = newPassword;

    const foundShop = await findByEmail({ email });
    const { _id: userId } = foundShop;
    if (!foundShop) throw new BadRequestError('Shop not registered!');

    const keyStore = await findByUserId(foundShop._id);

    if (!keyStore) throw new NotFoundError('Not found keystore');

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError('Something wrong happed! Please relogin');
    }
    if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registered!');

    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await shopModel.findByIdAndUpdate(userId, {
      password: passwordHash,
    });

    const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey);

    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      shop: getInfoData({
        fileds: ['_id', 'name', 'email'],
        object: newShop,
      }),
      tokens,
    };
  };
  static forgotPassword = async (email) => {
    const foundShop = await findByEmail(email);
    if (!foundShop) throw new AuthFailureError('Shop not registered!!');

    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

    const { _id: userId } = foundShop;
    const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId,
    });

    await sendResetPasswordEmail(email.email, tokens.refreshToken);

    return {
      code: 200,
      metadata: null,
    };
  };

  static handlerRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user;

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError('Something wrong happed! Please relogin');
    }

    if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registered!');

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError('Shop not registered!!');

    const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey);

    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user,
      tokens,
    };
  };

  static logOut = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };

  static logIn = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError('Shop not registered!');

    const match = await bcrypt.compare(password, foundShop.password);

    if (!match) throw new AuthFailureError('Authentication error');

    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

    const { _id: userId } = foundShop;
    const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId,
    });

    return {
      shop: getInfoData({
        fileds: ['_id', 'name', 'email'],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError('Email already taken');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RolesShop.SHOP],
    });

    if (newShop) {
      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError('KeyStore error');
      }

      const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fileds: ['_id', 'name', 'email'],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
