const JWT = require('jsonwebtoken');
const { AuthFailureError, NotFoundError } = require('../../../src/core/error.response');
const asyncHandle = require('../../../src/helpers/asyncHandle');

// Import the functions you want to test
const { createTokenPair, authenticationV2 } = require('../../../src/middlewares/authUtils');

// Mocks for findByUserId
const findByUserId = jest.fn();

// Mocks for JWT sign and verify methods
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

// Mock for the next middleware function
const next = jest.fn();

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization', //AT
  REFRESHTOKEN: 'x-rtoken-id',
};

// Mock the findByUserId function
jest.mock('../../../src/services/keyToken.service', () => ({
  findByUserId: jest.fn(),
}));

// Mock the JWT.verify function
// jest.mock('jsonwebtoken', () => ({
//   sign: jest.fn(),
//   verify: jest.fn(),
// }));

// Mock the next middleware function
// const next = jest.fn();

describe('Authentication Middleware', () => {
  describe('createTokenPair', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return the access and refresh tokens when provided with valid input', async () => {
      // Mock data
      const payload = {
        userId: 'user1',
      };
      const publicKey = 'public-key';
      const privateKey = 'private-key';
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';

      // Mock JWT.sign to return the tokens
      JWT.sign.mockImplementation((_, __, options) => {
        if (options.expiresIn === '2 days') {
          return accessToken;
        } else if (options.expiresIn === '7 days') {
          return refreshToken;
        }
      });

      // Call the function
      const tokens = await createTokenPair(payload, publicKey, privateKey);

      // Expectations
      expect(tokens).toEqual({
        accessToken,
        refreshToken,
      });
      expect(JWT.sign).toHaveBeenCalledTimes(2);
      expect(JWT.sign).toHaveBeenCalledWith(payload, publicKey, {
        expiresIn: '2 days',
      });
      expect(JWT.sign).toHaveBeenCalledWith(payload, privateKey, {
        expiresIn: '7 days',
      });
      expect(JWT.verify).toHaveBeenCalledWith(accessToken, publicKey, expect.any(Function));
    });

    it('should throw an AuthFailureError if the payload is invalid', async () => {
      // Call the function with an invalid payload
      await expect(createTokenPair(null, 'public-key', 'private-key')).rejects.toThrow(AuthFailureError);

      // Expectations
      expect(JWT.sign).not.toHaveBeenCalled();
      expect(JWT.verify).not.toHaveBeenCalled();
    });

    it('should return undefined if there is an error during token creation', async () => {
      // Mock JWT.sign to throw an error
      JWT.sign.mockImplementation(() => {
        throw new Error('Token creation error');
      });

      // Call the function
      const tokens = await createTokenPair(
        {
          userId: 'user1',
        },
        'public-key',
        'private-key'
      );

      // Expectations
      expect(tokens).toBeUndefined();
      expect(JWT.sign).toHaveBeenCalledTimes(1);
      expect(JWT.verify).not.toHaveBeenCalled();
    });
  });

  describe('authenticationV2', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should throw AuthFailureError if request is invalid', async () => {
      const req = {
        headers: {},
      };

      await expect(authenticationV2(req, {}, jest.fn())).rejects.toBeInstanceOf(new AuthFailureError());
    });

    // it('should throw an AuthFailureError if the x-client-id header is missing', async () => {
    //   const req = {
    //     headers: {},
    //   };
    //   const res = {};
    //   await expect(() => authenticationV2(req, res, next)).toThrow(new AuthFailureError('Invalid request'));
    //   expect(next).not.toHaveBeenCalled();
    // });

    // test('should throw an AuthFailureError if the x-client-id header is missing', async () => {
    //   const req = {
    //     headers: {},
    //   };

    //   const result = await authenticationV2(req, {}, jest.fn());

    //   expect(result).rejects.toBeInstanceOf(AuthFailureError);
    // });

    test('should throw an AuthFailureError if the x-client-id header is missing', async () => {
      const req = {
        headers: {},
      };

      const result = await authenticationV2(req, {}, jest.fn());

      result.then(
        () => {
          throw new Error('This should not be called');
        },
        (err) => {
          expect(err).toBeInstanceOf(AuthFailureError);
        }
      );
    });

    it('should throw a NotFoundError if no key store is found for the provided user', async () => {
      const userId = 'user1';
      const req = {
        headers: {
          [HEADER.CLIENT_ID]: userId,
        },
      };
      const res = {};

      findByUserId.mockResolvedValueOnce(null);

      await expect(async () => {
        await authenticationV2(req, res, next);
      }).rejects.toThrow(NotFoundError);

      expect(findByUserId).toHaveBeenCalledWith(userId);
      expect(next).not.toHaveBeenCalled();
    });

    it('should throw an AuthFailureError if the x-rtoken-id header is provided but verification fails', async () => {
      const userId = 'user1';
      const refreshToken = 'refresh-token';
      const req = {
        headers: {
          [HEADER.CLIENT_ID]: userId,
          [HEADER.REFRESHTOKEN]: refreshToken,
        },
      };
      const res = {};

      const keyStore = {
        privateKey: 'private-key',
      };
      const decodeUser = {
        userId,
      };
      findByUserId.mockResolvedValueOnce(keyStore);
      JWT.verify.mockImplementationOnce(() => {
        throw new Error('Token verification error');
      });

      await expect(async () => {
        await authenticationV2(req, res, next);
      }).rejects.toThrow(AuthFailureError);

      expect(findByUserId).toHaveBeenCalledWith(userId);
      expect(JWT.verify).toHaveBeenCalledWith(refreshToken, keyStore.privateKey);
      expect(next).not.toHaveBeenCalled();
    });

    it('should throw an AuthFailureError if the x-rtoken-id header is provided but user IDs do not match', async () => {
      const userId = 'user1';
      const refreshToken = 'refresh-token';
      const req = {
        headers: {
          [HEADER.CLIENT_ID]: userId,
          [HEADER.REFRESHTOKEN]: refreshToken,
        },
      };
      const res = {};

      const keyStore = {
        privateKey: 'private-key',
      };
      const decodeUser = {
        userId: 'user2', // Different user ID
      };
      findByUserId.mockResolvedValueOnce(keyStore);
      JWT.verify.mockReturnValueOnce(decodeUser);

      await expect(async () => {
        await authenticationV2(req, res, next);
      }).rejects.toThrow(AuthFailureError);

      expect(findByUserId).toHaveBeenCalledWith(userId);
      expect(JWT.verify).toHaveBeenCalledWith(refreshToken, keyStore.privateKey);
      expect(next).not.toHaveBeenCalled();
    });

    it('should set req.keyStore, req.user, and req.refreshToken and call next if x-rtoken-id header is provided and verification is successful', async () => {
      const userId = 'user1';
      const refreshToken = 'refresh-token';
      const req = {
        headers: {
          [HEADER.CLIENT_ID]: userId,
          [HEADER.REFRESHTOKEN]: refreshToken,
        },
      };
      const res = {};

      const keyStore = {
        privateKey: 'private-key',
      };
      const decodeUser = {
        userId,
      };
      findByUserId.mockResolvedValueOnce(keyStore);
      JWT.verify.mockReturnValueOnce(decodeUser);

      await authenticationV2(req, res, next);

      expect(findByUserId).toHaveBeenCalledWith(userId);
      expect(JWT.verify).toHaveBeenCalledWith(refreshToken, keyStore.privateKey);
      expect(req.keyStore).toBe(keyStore);
      expect(req.user).toBe(decodeUser);
      expect(req.refreshToken).toBe(refreshToken);
      expect(next).toHaveBeenCalled();
    });

    it('should throw an AuthFailureError if the authorization header is missing', async () => {
      const userId = 'user1';
      const req = {
        headers: {
          [HEADER.CLIENT_ID]: userId,
        },
      };
      const res = {};

      const keyStore = {
        publicKey: 'public-key',
      };
      findByUserId.mockResolvedValueOnce(keyStore);

      await expect(async () => {
        await authenticationV2(req, res, next);
      }).rejects.toThrow(AuthFailureError);

      expect(findByUserId).toHaveBeenCalledWith(userId);
      expect(JWT.verify).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should throw an AuthFailureError if verification of the access token fails', async () => {
      const userId = 'user1';
      const accessToken = 'access-token';
      const req = {
        headers: {
          [HEADER.CLIENT_ID]: userId,
          [HEADER.AUTHORIZATION]: accessToken,
        },
      };
      const res = {};

      const keyStore = {
        publicKey: 'public-key',
      };
      const decodeUser = {
        userId: 'user2', // Different user ID
      };
      findByUserId.mockResolvedValueOnce(keyStore);
      JWT.verify.mockImplementationOnce(() => {
        throw new Error('Token verification error');
      });

      await expect(async () => {
        await authenticationV2(req, res, next);
      }).rejects.toThrow(AuthFailureError);

      expect(findByUserId).toHaveBeenCalledWith(userId);
      expect(JWT.verify).toHaveBeenCalledWith(accessToken, keyStore.publicKey);
      expect(next).not.toHaveBeenCalled();
    });

    it('should throw an AuthFailureError if the user IDs do not match in the access token', async () => {
      const userId = 'user1';
      const accessToken = 'access-token';
      const req = {
        headers: {
          [HEADER.CLIENT_ID]: userId,
          [HEADER.AUTHORIZATION]: accessToken,
        },
      };
      const res = {};

      const keyStore = {
        publicKey: 'public-key',
      };
      const decodeUser = {
        userId: 'user2', // Different user ID
      };
      findByUserId.mockResolvedValueOnce(keyStore);
      JWT.verify.mockReturnValueOnce(decodeUser);

      await expect(async () => {
        await authenticationV2(req, res, next);
      }).rejects.toThrow(AuthFailureError);

      expect(findByUserId).toHaveBeenCalledWith(userId);
      expect(JWT.verify).toHaveBeenCalledWith(accessToken, keyStore.publicKey);
      expect(next).not.toHaveBeenCalled();
    });

    it('should set req.keyStore, req.user, and call next if authorization header is provided and verification is successful', async () => {
      const userId = 'user1';
      const accessToken = 'access-token';
      const req = {
        headers: {
          [HEADER.CLIENT_ID]: userId,
          [HEADER.AUTHORIZATION]: accessToken,
        },
      };
      const res = {};

      const keyStore = {
        publicKey: 'public-key',
      };
      const decodeUser = {
        userId,
      };
      findByUserId.mockResolvedValueOnce(keyStore);
      JWT.verify.mockReturnValueOnce(decodeUser);

      await authenticationV2(req, res, next);

      expect(findByUserId).toHaveBeenCalledWith(userId);
      expect(JWT.verify).toHaveBeenCalledWith(accessToken, keyStore.publicKey);
      expect(req.keyStore).toBe(keyStore);
      expect(req.user).toBe(decodeUser);
      expect(next).toHaveBeenCalled();
    });
  });
});

// describe('Authentication Middleware', () => {
//   // describe('createTokenPair', () => {
//   //   it('should return access token and refresh token when provided with valid input', async () => {
//   //     // Mock data
//   //     const payload = { userId: 'user1' };
//   const publicKey = 'public-key';
//   const privateKey = 'private-key';
//   const accessToken = 'access-token';
//   const refreshToken = 'refresh-token';

//   //     // Mock the JWT.sign function to return the access and refresh tokens
//   //     JWT.sign.mockResolvedValueOnce(accessToken).mockResolvedValueOnce(refreshToken);

//   //     // Call the function
//   //     const tokens = await createTokenPair(payload, publicKey, privateKey);

//   //     // Expectations
//   //     expect(tokens).toEqual({ accessToken, refreshToken });
//   //     expect(JWT.sign).toHaveBeenNthCalledWith(1, payload, publicKey, { expiresIn: '2 days' });
//   //     expect(JWT.sign).toHaveBeenNthCalledWith(2, payload, privateKey, { expiresIn: '7 days' });
//   //     expect(JWT.verify).toHaveBeenCalledWith(accessToken, publicKey, expect.any(Function));
//   //   });

//   //   it('should return undefined if there is an error during token creation', async () => {
//   //     // Mock data
//   //     const payload = { userId: 'user1' };
//   //     const publicKey = 'public-key';
//   //     const privateKey = 'private-key';

//   //     // Mock the JWT.sign function to throw an error for the first call
//   //     JWT.sign.mockImplementationOnce((payload, privateKey, options) => {
//   //       throw new Error('Token creation failed');
//   //     });

//   //     // Call the function
//   //     const tokens = await createTokenPair(payload, publicKey, privateKey);

//   //     // Expectations
//   //     expect(tokens).toBeUndefined();
//   //     expect(JWT.sign).toHaveBeenCalledTimes(1);
//   //     expect(JWT.verify).not.toHaveBeenCalled();
//   //   });
//   // });

//   describe('createTokenPair', () => {
//     test('should throw error if payload is invalid', async () => {
//       const payload = {};
//       const publicKey = 'public-key';
//       const privateKey = 'private-key';
//       const accessToken = 'access-token';
//       const refreshToken = 'refresh-token';
//       const error = new ApiError(httpStatus.BAD_REQUEST, 'Any error');
//       const tokens = await createTokenPair(payload, publicKey, privateKey);
//       await expect(tokens).rejects.toBeInstanceOf(Error);
//     });

//     test('should create token pair', async () => {
//       const payload = {
//         userId: '123',
//       };

//       const tokenPair = await createTokenPair(payload, 'publicKey', 'privateKey');

//       expect(tokenPair).toEqual({
//         accessToken: '1234567890',
//         refreshToken: '1234567890',
//       });
//     });

//     test('should not call JWT.verify', async () => {
//       const payload = {
//         userId: '123',
//       };

//       const spy = jest.spyOn(JWT, 'verify');

//       await createTokenPair(payload, 'publicKey', 'privateKey');

//       expect(spy).not.toHaveBeenCalled();
//     });
//   });

//   describe('authenticationV2', () => {
//     // Helper function to create request with headers
//     const createRequest = (headers) => ({ headers });

//     it('should throw AuthFailureError if the request does not contain x-client-id header', async () => {
//       const req = createRequest({});
//       const res = {};
//       const next = jest.fn();

//       await expect(authenticationV2(req, res, next)).rejects.toThrow(AuthFailureError);
//       expect(next).not.toHaveBeenCalled();
//     });

//     it('should throw NotFoundError if no key store is found for the provided user', async () => {
//       const userId = 'user1';
//       const req = createRequest({ 'x-client-id': userId });
//       const res = {};
//       const next = jest.fn();

//       findByUserId.mockResolvedValueOnce(null);

//       await expect(authenticationV2(req, res, next)).rejects.toThrow(NotFoundError);
//       expect(next).not.toHaveBeenCalled();
//       expect(findByUserId).toHaveBeenCalledWith(userId);
//     });

//     it('should call next with error if x-rtoken-id header is provided but verification fails', async () => {
//       const userId = 'user1';
//       const req = createRequest({
//         'x-client-id': userId,
//         'x-rtoken-id': 'refresh-token',
//       });
//       const res = {};
//       const next = jest.fn();

//       const keyStore = { privateKey: 'private-key' };
//       findByUserId.mockResolvedValueOnce(keyStore);
//       JWT.verify.mockImplementationOnce(() => {
//         throw new Error('Verification failed');
//       });

//       await expect(authenticationV2(req, res, next)).rejects.toThrow(Error);
//       expect(next).toHaveBeenCalledWith(expect.any(Error));
//       expect(findByUserId).toHaveBeenCalledWith(userId);
//       expect(JWT.verify).toHaveBeenCalledWith('refresh-token', keyStore.privateKey);
//     });

//     it('should call next with error if x-rtoken-id header is provided but user IDs do not match', async () => {
//       const userId = 'user1';
//       const req = createRequest({
//         'x-client-id': userId,
//         'x-rtoken-id': 'refresh-token',
//       });
//       const res = {};
//       const next = jest.fn();

//       const keyStore = { privateKey: 'private-key' };
//       const decodeUser = { userId: 'user2' };
//       findByUserId.mockResolvedValueOnce(keyStore);
//       JWT.verify.mockReturnValueOnce(decodeUser);

//       await expect(authenticationV2(req, res, next)).rejects.toThrow(AuthFailureError);
//       expect(next).toHaveBeenCalledWith(expect.any(AuthFailureError));
//       expect(findByUserId).toHaveBeenCalledWith(userId);
//       expect(JWT.verify).toHaveBeenCalledWith('refresh-token', keyStore.privateKey);
//     });

//     it('should call next with error if authorization header is provided but verification fails', async () => {
//       const userId = 'user1';
//       const req = createRequest({
//         'x-client-id': userId,
//         authorization: 'access-token',
//       });
//       const res = {};
//       const next = jest.fn();

//       const keyStore = { publicKey: 'public-key' };
//       findByUserId.mockResolvedValueOnce(keyStore);
//       JWT.verify.mockImplementationOnce(() => {
//         throw new Error('Verification failed');
//       });

//       await expect(authenticationV2(req, res, next)).rejects.toThrow(Error);
//       expect(next).toHaveBeenCalledWith(expect.any(Error));
//       expect(findByUserId).toHaveBeenCalledWith(userId);
//       expect(JWT.verify).toHaveBeenCalledWith('access-token', keyStore.publicKey);
//     });

//     it('should call next with error if authorization header is provided but user IDs do not match', async () => {
//       const userId = 'user1';
//       const req = createRequest({
//         'x-client-id': userId,
//         authorization: 'access-token',
//       });
//       const res = {};
//       const next = jest.fn();

//       const keyStore = { publicKey: 'public-key' };
//       const decodeUser = { userId: 'user2' };
//       findByUserId.mockResolvedValueOnce(keyStore);
//       JWT.verify.mockReturnValueOnce(decodeUser);

//       await expect(authenticationV2(req, res, next)).rejects.toThrow(AuthFailureError);
//       expect(next).toHaveBeenCalledWith(expect.any(AuthFailureError));
//       expect(findByUserId).toHaveBeenCalledWith(userId);
//       expect(JWT.verify).toHaveBeenCalledWith('access-token', keyStore.publicKey);
//     });

//     it('should call next if x-rtoken-id header is not provided and authorization header is provided with valid user ID', async () => {
//       const userId = 'user1';
//       const req = createRequest({
//         'x-client-id': userId,
//         authorization: 'access-token',
//       });
//       const res = {};
//       const next = jest.fn();

//       const keyStore = { publicKey: 'public-key' };
//       const decodeUser = { userId };
//       findByUserId.mockResolvedValueOnce(keyStore);
//       JWT.verify.mockReturnValueOnce(decodeUser);

//       await authenticationV2(req, res, next);

//       expect(req.keyStore).toBe(keyStore);
//       expect(req.user).toBe(decodeUser);
//       expect(req.refreshToken).toBeUndefined();
//       expect(next).toHaveBeenCalled();
//       expect(findByUserId).toHaveBeenCalledWith(userId);
//       expect(JWT.verify).toHaveBeenCalledWith('access-token', keyStore.publicKey);
//     });

//     it('should call next with error if x-rtoken-id header is not provided and authorization header is missing', async () => {
//       const userId = 'user1';
//       const req = createRequest({
//         'x-client-id': userId,
//       });
//       const res = {};
//       const next = jest.fn();

//       await expect(authenticationV2(req, res, next)).rejects.toThrow(AuthFailureError);
//       expect(next).toHaveBeenCalledWith(expect.any(AuthFailureError));
//       expect(findByUserId).not.toHaveBeenCalled();
//       expect(JWT.verify).not.toHaveBeenCalled();
//     });
//   });
// });
