import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import User from '../db/models/User.js';
import Session from '../db/models/Session.js';
import { createTokens, verifyRefresh } from '../utils/tokens.js';

const REFRESH_COOKIE = 'refreshToken';
const SESSION_COOKIE = 'sessionId';

function cookieOptions(days = 30) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: days * 24 * 60 * 60 * 1000,
    path: '/',
  };
}

export async function registerUser({ name, email, password }) {
  const exists = await User.findOne({ email });
  if (exists) throw createHttpError(409, 'Email in use');
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });
  return user; // toJSON hides password
}

export async function loginUser(
  { email, password },
  { res } = {}
) {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401, 'Invalid email or password');

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw createHttpError(401, 'Invalid email or password');

  await Session.deleteMany({ userId: user._id });

  const { accessToken, refreshToken, accessTokenValidUntil, refreshTokenValidUntil } =
    createTokens({ sub: String(user._id) });

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  res?.cookie(REFRESH_COOKIE, refreshToken, cookieOptions());
  res?.cookie(SESSION_COOKIE, String(session._id), cookieOptions());

  return { accessToken };
}

export async function refreshSession({ req, res }) {
  const refreshToken = req.cookies?.[REFRESH_COOKIE];
  const sessionId = req.cookies?.[SESSION_COOKIE];
  if (!refreshToken || !sessionId) throw createHttpError(401, 'No refresh token');

  let payload;
  try {
    payload = verifyRefresh(refreshToken);
  } catch {
    throw createHttpError(401, 'Refresh token invalid or expired');
  }

  const session = await Session.findOne({ _id: sessionId, refreshToken });
  if (!session) throw createHttpError(401, 'Session not found');

  await Session.deleteOne({ _id: session._id });

  const { accessToken, refreshToken: newRefresh, accessTokenValidUntil, refreshTokenValidUntil } =
    createTokens({ sub: payload.sub });

  const newSession = await Session.create({
    userId: payload.sub,
    accessToken,
    refreshToken: newRefresh,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  res.cookie(REFRESH_COOKIE, newRefresh, cookieOptions());
  res.cookie(SESSION_COOKIE, String(newSession._id), cookieOptions());

  return { accessToken };
}

export async function logoutUser({ req, res }){
  const refreshToken = req.cookies?.[REFRESH_COOKIE];
  const sessionId = req.cookies?.[SESSION_COOKIE];

  if (sessionId) await Session.deleteOne({ _id: sessionId });
  if (refreshToken) await Session.deleteMany({ refreshToken });

  res.clearCookie(REFRESH_COOKIE, { path: '/' });
  res.clearCookie(SESSION_COOKIE, { path: '/' });
}
