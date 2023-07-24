'use strict';
const AccessService = require('../services/access.service');
const { CREATED, SuccesResponse } = require('../core/success.response');
class AccessController {
  handlerRefreshToken = async (req, res, next) => {
    new SuccesResponse({
      message: 'Get token success!',
      metadata: await AccessService.handlerRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };

  logOut = async (req, res, next) => {
    new SuccesResponse({
      message: 'Logout success!',
      metadata: await AccessService.logOut(req.keyStore),
    }).send(res);
  };

  logIn = async (req, res, next) => {
    new SuccesResponse({
      metadata: await AccessService.logIn(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    new CREATED({
      message: 'Regiserted OK!',
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };

  forgetPassword = async (req, res, next) => {
    new SuccesResponse({
      message: 'Get Password Success',
      metadata: await AccessService.forgotPassword(req.body),
    }).send(res);
  };

  resetPassword = async (req, res, next) => {
    new SuccesResponse({
      message: 'Reset Password Success',
      metadata: await AccessService.resetPassword(req.query.token, req.body),
    }).send(res);
  };

  sendVerificationEmail = async (req, res, next) => {
    new SuccesResponse({
      message: 'Send Verification Email Success',
      metadata: await AccessService.sendVerificationEmail({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };

  verifyEmail = async (req, res, next) => {
    new SuccesResponse({
      message: 'Verify Email Success',
      metadata: await AccessService.verifyEmail(req.query.token),
    }).send(res);
  };
}

module.exports = new AccessController();
