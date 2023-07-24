'use strict';

const JWT = require('jsonwebtoken');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const asyncHandle = require('../helpers/asyncHandle');

const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization', //AT
  REFRESHTOKEN: 'x-rtoken-id',
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  if (!payload) {
    throw new AuthFailureError('Payload is invalid');
  }
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: '2 days',
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '7 days',
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
      } else {
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {}
};

const authenticationV2 = asyncHandle(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];

  if (!userId) throw new AuthFailureError('Invalid request');

  const keyStore = await findByUserId(userId);

  if (!keyStore) throw new NotFoundError('Not found keystore');
  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];

      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);

      if (userId !== decodeUser.userId) {
        throw new AuthFailureError('Invalid UserId');
      }
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  //<<3>> verify AT::: logout phai truyen AT nha

  const accessToken = req.headers[HEADER.AUTHORIZATION]; //lay tu header truyen len
  // console.log(`accessToken:::`, accessToken);
  if (!accessToken) throw new AuthFailureError('Invalid request');

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);

    // console.log(`decodeUser:::`, decodeUser);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError('Invalid UserId');
    }
    req.keyStore = keyStore; //gans vao req neu auth success, thi ta put gia tri keystore mang theo, de khi di dau dung keystore nay cho de
    req.user = decodeUser;
    // console.log(`req.keyStore:::`, req.keyStore);
    return next();
  } catch (error) {
    throw error;
  }
});

module.exports = {
  createTokenPair,
  authenticationV2,
};
