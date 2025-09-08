import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import createHttpError from 'http-errors';
import User from '../db/models/user.js';
import Session from '../db/models/session.js';
import { sendEmail } from '../utils/sendMail.js';
import { env } from 'process';

// const JWT_SECRET = env('JWT_SECRET');
// const APP_DOMAIN = env('APP_DOMAIN');
const JWT_SECRET = process.env.JWT_SECRET;
const APP_DOMAIN = process.env.APP_DOMAIN;

export const sendResetEmailService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new createHttpError(404, 'User not found!');

  const token = jwt.sign({ email: user.email }, JWT_SECRET, {
    expiresIn: '5m',
  });

  const resetLink = `${APP_DOMAIN.replace(/\/$/, '')}/reset-password?token=${token}`;

  const html = `
  <p>You requested a password reset. Click the link below to reset your password:</p>
  <a href="${resetLink}">Reset Password</a>
  <p>This link will expire in 5 minutes.</p>
  `;
  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset',
      html,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw new createHttpError(500, 'Error sending email');
  }
  return true;
};

export const resetPasswordService = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { email } = decoded;
    const user = await User.findOne({ email });
    if (!user) {
      throw new createHttpError(404, 'User not found!');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    await Session.deleteMany({ userId: user._id });
    return true;
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      throw new createHttpError(401, 'Token is expired or invalid.');
    }
    throw error;
  }
};

export const resetPassword = async (payload) => {
  let enteries;
  try {
    enteries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (error) {
    if (error instanceof Error) throw new createHttpError(401, error.message);
    throw error;
  }
  const user = await User.findOne({ email: enteries.email, _id: enteries.sub });
  if (!user) throw new createHttpError(404, 'User not found!');

  const encryptedPassword = await bcrypt.hash(payload.Password, 12);
  await User.updateOne({ _id: user._id }, { password: encryptedPassword });
  await Session.deleteMany({ userId: user._id });
};

// export const resetPassword = async (token, newPassword) => {
// try {
//   const decoded = jwt.verify(token, JWT_SECRET);
//   const { email } = decoded;
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw new createHttpError(404, 'User not found!');
//   }
//   const hashedPassword = await bcrypt.hash(newPassword, 10);
//   user.password = hashedPassword;
//   await user.save();
//   await Session.deleteMany({ userId: user._id });
//   return true;
// } catch (error) {
//   if (
//     error.name === 'TokenExpiredError' ||
//     error.name === 'JsonWebTokenError'
//   ) {
//     throw new createHttpError(401, 'Token is expired or invalid.');
//   }
//   throw error;
// }
// };

const generateTokens = () => {
  return {
    accessToken: crypto.randomBytes(64).toString('hex'),
    refreshToken: crypto.randomBytes(64).toString('hex'),
  };
};

// export const registerUserService = async ({ name, email, password }) => {
//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     throw new createHttpError(409, 'Email is already in use');
//   }
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const newUser = await User.create({ name, email, password: hashedPassword });

//   const userData = newUser.toObject();
//   delete userData.password;
//   return userData;
// };

// export const loginUserService = async ({ email, password }) => {
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw new createHttpError(401, 'Invalid email or password');
//   }
//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) throw createHttpError(401, 'Invalid email or password');

//   await Session.deleteOne({ userId: user._id });

//   const accessToken = jwt.sign(
//     { sub: user._id },
//     process.env.ACCESS_TOKEN_SECRET,
//     { expiresIn: '15m' }
//   );
//   const refreshToken = jwt.sign(
//     { sub: user._id },
//     process.env.REFRESH_TOKEN_SECRET,
//     { expiresIn: '30d' }
//   );

//   const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
//   const refreshTokenValidUntil = new Date(
//     Date.now() + 30 * 24 * 60 * 60 * 1000
//   ); // 30 days

//   await Session.create({
//     userId: user._id,
//     accessToken,
//     refreshToken,
//     accessTokenValidUntil,
//     refreshTokenValidUntil,
//   });

//   return { accessToken, refreshToken };
// };

// export const refreshSessionService = async (refreshToken) => {
//   try {
//     const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
//     const session = await Session.findOne({
//       userId: payload.sub,
//       refreshToken,
//     });
//     if (!session) {
//       throw new createHttpError(401, 'Invalid refresh token');
//     }
//     await Session.deleteOne({ _id: session._id });
//     const accessToken = jwt.sign(
//       { sub: payload.sub },
//       process.env.ACCESS_TOKEN_SECRET,
//       { expiresIn: '15m' }
//     );
//     const newRefreshToken = jwt.sign(
//       { sub: payload.sub },
//       process.env.REFRESH_TOKEN_SECRET,
//       { expiresIn: '30d' }
//     );
//     await Session.create({
//       userId: payload.sub,
//       refreshToken: newRefreshToken,
//     });
//     return { accessToken, newRefreshToken };
//   } catch (error) {
//     console.log(error);
//     throw new createHttpError(401, 'Invalid refresh token');
//   }
// };

// export const logoutUserService = async (refreshToken) => {
//   try {
//     const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
//     const session = await Session.findOne({
//       userId: payload.sub,
//       refreshToken,
//     });
//     if (!session) {
//       throw new createHttpError(401, 'Invalid refresh token');
//     }
//     await Session.deleteOne({ _id: session._id });
//   } catch (error) {
//     console.log(error);
//     throw new createHttpError(401, 'Invalid refresh token');
//   }
// };

export const registerUserService = async (userData) => {
  const { email, password, name } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};

// Login user
export const loginUserService = async (email, password) => {
  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid credentials');
  }

  // Delete existing session
  await Session.deleteMany({ userId: user._id });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens();

  // Create session
  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });

  return { accessToken, refreshToken };
};

// Refresh session
export const refreshSessionService = async (refreshToken) => {
  // Find session
  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  // Check if refresh token is still valid
  if (new Date() > session.refreshTokenValidUntil) {
    await Session.deleteOne({ _id: session._id });
    throw createHttpError(401, 'Refresh token expired');
  }

  // Delete old session
  await Session.deleteOne({ _id: session._id });

  // Generate new tokens
  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    generateTokens();

  // Create new session
  const newSession = await Session.create({
    userId: session.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// Logout user
export const logoutUserService = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });
  if (session) {
    await Session.deleteOne({ _id: session._id });
  }
};

// Find session by access token
export const findSessionByAccessToken = async (accessToken) => {
  const session = await Session.findOne({ accessToken }).populate('userId');

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > session.accessTokenValidUntil) {
    await Session.deleteOne({ _id: session._id });
    throw createHttpError(401, 'Access token expired');
  }

  return session;
};
