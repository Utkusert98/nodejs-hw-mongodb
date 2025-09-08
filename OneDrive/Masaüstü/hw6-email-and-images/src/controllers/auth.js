// src/controllers/auth.js
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../db/models/user.js';
import Session from '../db/models/session.js';
import { sendEmail } from '../utils/sendMail.js';

/**
 * POST /auth/send-reset-email
 * Body: { email }
 * 200 -> { status:200, message:"Reset password email has been successfully sent.", data:{} }
 * 404 -> "User not found!"
 * 500 -> "Failed to send the email, please try again later."
 */
export const sendResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(createHttpError(404, 'User not found!'));
    }

    // 5 dk süreli token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    try {
      await sendEmail(
        email,
        'Reset your password',
        `<p>Şifrenizi sıfırlamak için linke tıklayın:
           <a href="${resetLink}">${resetLink}</a></p>`
      );
    } catch (e) {
      return next(createHttpError(500, 'Failed to send the email, please try again later.'));
    }

    return res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /auth/reset-pwd
 * Body: { token, password }
 * 200 -> { status:200, message:"Password has been successfully reset.", data:{} }
 * 401 -> "Token is expired or invalid."
 * 404 -> "User not found!"
 */
export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (_e) {
      return next(createHttpError(401, 'Token is expired or invalid.'));
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) return next(createHttpError(404, 'User not found!'));

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();

    // tüm oturumları sil
    await Session.deleteMany({ userId: user._id });

    return res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /auth/register
 * Body: { email, password, name }
 */
export const registerController = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return next(createHttpError(409, 'Email in use'));

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash, name });

    return res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: { _id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /auth/login
 * Body: { email, password }
 */
export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return next(createHttpError(401, 'Invalid credentials'));

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return next(createHttpError(401, 'Invalid credentials'));

    const accessToken = jwt.sign(
      { sub: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { sub: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '30d' }
    );

    await Session.create({ userId: user._id, refreshToken });

    return res.status(200).json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /auth/refresh
 * Body: { refreshToken }
 */
export const refreshController = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return next(createHttpError(401, 'Refresh token missing'));

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (_e) {
      return next(createHttpError(401, 'Invalid refresh token'));
    }

    const session = await Session.findOne({ refreshToken });
    if (!session) return next(createHttpError(401, 'Session not found'));

    // eski oturumu kaldır
    await Session.deleteOne({ _id: session._id });

    // yeni tokenlar
    const newAccessToken = jwt.sign(
      { sub: decoded.sub },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
    const newRefreshToken = jwt.sign(
      { sub: decoded.sub },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '30d' }
    );

    await Session.create({ userId: decoded.sub, refreshToken: newRefreshToken });

    return res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /auth/logout
 * Body: { refreshToken }
 */
export const logoutController = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await Session.deleteOne({ refreshToken });
    }
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
