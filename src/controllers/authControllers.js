import { registerUser, loginUser, refreshSession, logoutUser } from '../services/authServices.js';
import Joi from 'joi';

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(64).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export async function register(req, res, next) {
  try {
    const { value, error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ status: 'fail', message: error.message });
    const user = await registerUser(value);
    res.status(201).json({
      status: 'success',
      message: 'Successfully registered a user!',
      data: { user },
    });
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const { value, error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ status: 'fail', message: error.message });
    const { accessToken } = await loginUser(value, { res });
    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in an user!',
      data: { accessToken },
    });
  } catch (err) { next(err); }
}

export async function refresh(req, res, next) {
  try {
    const { accessToken } = await refreshSession({ req, res });
    res.status(200).json({
      status: 'success',
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (err) { next(err); }
}

export async function logout(req, res, next) {
  try {
    await logoutUser({ req, res });
    res.status(204).end();
  } catch (err) { next(err); }
}
