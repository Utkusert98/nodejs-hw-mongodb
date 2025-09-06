import createHttpError from 'http-errors';
import { verifyAccess } from '../utils/tokens.js';
import User from '../db/models/User.js';
import Session from '../db/models/Session.js';

export const authenticate = async (req, _res, next) => {
  try {
    const auth = req.get('authorization') || '';
    const [type, token] = auth.split(' ');
    if (type !== 'Bearer' || !token) throw createHttpError(401, 'No token provided');

    let payload;
    try {
      payload = verifyAccess(token);
    } catch (e) {
      if (e?.name === 'TokenExpiredError') throw createHttpError(401, 'Access token expired');
      throw createHttpError(401, 'Invalid token');
    }

    const session = await Session.findOne({ accessToken: token });
    if (!session || session.accessTokenValidUntil < new Date()) {
      throw createHttpError(401, 'Access token expired');
    }

    const user = await User.findById(payload.sub);
    if (!user) throw createHttpError(401, 'User not found');

    req.user = { _id: user._id, email: user.email, name: user.name };
    next();
  } catch (err) { next(err); }
};
