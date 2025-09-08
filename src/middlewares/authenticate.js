// import jwt from 'jsonwebtoken';
// import createHttpError from 'http-errors';

// export const authenticate = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       return next( createHttpError(401, 'Authorization header missing'));
//     }
//     const [bearer, token] = authHeader.split(' ');
//     if (bearer !== 'Bearer' || !token) {
//       throw createHttpError(401, 'Invalid authorization format');
//     }
//     const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     req.user = {
//       id: payload.sub,
//       email: payload.email,
//     };
//     next();
//   } catch (error) {
//     if (error.name === 'JsonWebTokenError') {
//       return next(createHttpError(401, 'Access token expired'));
//     }
//     next(createHttpError(401, 'Invalid token'));
//   }
// };

// import jwt from 'jsonwebtoken';
// import createHttpError from 'http-errors';

// export const authenticate = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return next(createHttpError(401, 'Missing Authorization header'));
//   }

//   const [scheme, token] = authHeader.split(' ');
//   if (scheme !== 'Bearer' || !token) {
//     return next(createHttpError(401, 'Invalid token'));
//   }

//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = payload; // req.user._id gibi kullanabilirsin
//     next();
//   } catch (error) {
//     console.log(error);
//     return next(createHttpError(401, 'Invalid token'));
//   }
// };

import createHttpError from 'http-errors';
import { findSessionByAccessToken } from '../services/auth.js';
import jwt from 'jsonwebtoken';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
      return next(createHttpError(401, 'Authorization header not found'));
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return next(
        createHttpError(401, 'Authorization header must be Bearer token')
      );
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    ((req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    }),
      next());

    const session = await findSessionByAccessToken(token);

    req.user = session.userId;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(createHttpError(401, 'Access token expired'));
    }
    next(createHttpError(401, 'Invalid token'));
  }
};
