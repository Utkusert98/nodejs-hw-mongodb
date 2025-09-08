import createHttpError from 'http-errors';
import Session from '../db/models/session.js';
import User from '../db/models/user.js';

export const authorize = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;
    if (!req.user) {
      return next(
        createHttpError(401, 'Please log in to access this resource')
      );
    }
    const session = await Session.findById(sessionId);
    if (!session) {
      return next(
        createHttpError(401, 'Invalid session. Please log in again.')
      );
    }

    if (new Date() > new Date(session.accessTokenValidUntil)) {
      return next(createHttpError(401, 'Oturum süresi dolmuş'));
    }

    const user = await User.findById(session.userId);

    if (!user) return next(createHttpError(401, 'Kullanıcı bulunamadı'));

    req.user = user;
    req.sessionId = session;

    next();

    // if (!roles.includes(req.user.role)) {
    //   return next(createHttpError(403, 'Forbidden: Insufficient role'));
    // }

    next();
  } catch (error) {
    next(createHttpError(500, 'Internal Server Error'), error);
  }
};
