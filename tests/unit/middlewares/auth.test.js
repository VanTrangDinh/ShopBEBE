const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../../../src/utils/ApiError');
const { roleRights } = require('../../../src/config/roles');
const { auth, verifyCallback } = require('../../../src/middlewares/auth');
const { info } = require('winston');

jest.mock('passport');
jest.mock('../../../src/utils/ApiError');
jest.mock('../../../src/config/roles');

describe('Auth Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      params: {
        userId: 'user1',
      },
    };
    res = {};
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyCallback', () => {
    test('should reject with Unauthorized error if there is an error', async () => {
      const resolve = jest.fn();
      const reject = jest.fn();
      const err = new Error('Error');

      const callback = verifyCallback(req, resolve, reject, []);

      await callback(err);

      expect(ApiError).toHaveBeenCalledWith(httpStatus.UNAUTHORIZED, 'Please authenticate');
      expect(reject).toHaveBeenCalledWith(expect.any(ApiError));
    });

    test('should reject with Unauthorized error if info is provided', async () => {
      const resolve = jest.fn();
      const reject = jest.fn();
      const info = 'Info';

      const callback = verifyCallback(req, resolve, reject, []);

      await callback(null, {}, info);

      expect(ApiError).toHaveBeenCalledWith(httpStatus.UNAUTHORIZED, 'Please authenticate');
      expect(reject).toHaveBeenCalledWith(expect.any(ApiError));
    });

    test('should reject with Unauthorized error if user is not provided', async () => {
      const resolve = jest.fn();
      const reject = jest.fn();

      const callback = verifyCallback(req, resolve, reject, []);

      await callback(null, null);

      expect(ApiError).toHaveBeenCalledWith(httpStatus.UNAUTHORIZED, 'Please authenticate');
      expect(reject).toHaveBeenCalledWith(expect.any(ApiError));
    });

    test('should set req.user if user is provided', async () => {
      const resolve = jest.fn();
      const reject = jest.fn();
      const user = {
        id: 'user1',
        role: 'admin',
      };

      const callback = verifyCallback(req, resolve, reject, []);

      await callback(null, user);

      expect(req.user).toBe(user);
    });

    test('should reject with Forbidden error if required rights are not met and userId is different', async () => {
      const req = { params: { userId: 'user2' } };
      const resolve = jest.fn();
      const reject = jest.fn();
      const user = { id: 'user1', role: 'admin' };
      const requiredRights = ['read'];

      const callback = verifyCallback(req, resolve, reject, requiredRights);

      await callback(null, user, null);

      expect(ApiError).toHaveBeenCalledWith(httpStatus.FORBIDDEN, 'Forbidden');
      expect(reject).toHaveBeenCalledWith(expect.any(ApiError));
    });

    test('should resolve if required rights are met', async () => {
      const resolve = jest.fn();
      const reject = jest.fn();
      const user = {
        id: 'user1',
        role: 'admin',
      };
      const requiredRights = ['read'];

      const callback = verifyCallback(req, resolve, reject, requiredRights);

      await callback(null, user);

      expect(resolve).toHaveBeenCalled();
    });

    test('should resolve if no required rights are provided', async () => {
      const resolve = jest.fn();
      const reject = jest.fn();
      const user = {
        id: 'user1',
        role: 'admin',
      };
      const requiredRights = [];

      const callback = verifyCallback(req, resolve, reject, requiredRights);

      await callback(null, user);

      expect(resolve).toHaveBeenCalled();
    });

    test('should resolve if required rights are met and userId matches', async () => {
      const resolve = jest.fn();
      const reject = jest.fn();
      const user = {
        id: 'user1',
        role: 'admin',
      };
      const requiredRights = ['read'];

      req.params.userId = 'user1';

      const callback = verifyCallback(req, resolve, reject, requiredRights);

      await callback(null, user);

      expect(resolve).toHaveBeenCalled();
    });
  });

  describe('auth', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
      mockReq = {};
      mockRes = {};
      mockNext = jest.fn();
      passport.authenticate.mockImplementation((strategy, options, callback) => {
        return (req, res, next) => {
          callback(null, null, null)(req, res, next);
        };
      });
    });

    test('should call passport.authenticate with proper arguments', async () => {
      const requiredRights = ['read'];

      await auth(...requiredRights)(mockReq, mockRes, mockNext);

      expect(passport.authenticate).toHaveBeenCalledWith('jwt', { session: false }, expect.any(Function));
    });

    test('should call next if the promise resolves', async () => {
      const requiredRights = ['read'];

      const middleware = auth(...requiredRights);

      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test('should call next with error if the promise rejects', async () => {
      const requiredRights = ['read'];
      passport.authenticate.mockImplementation((strategy, options, callback) => {
        return (req, res, next) => {
          callback(error, null, null)(req, res, next);
        };
      });

      await auth(...requiredRights)(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
