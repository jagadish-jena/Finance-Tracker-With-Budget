import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {
  createAccessToken,
  createRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie
} from '../utils/auth.js';

const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email
});

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashedPassword });

    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);
    setRefreshTokenCookie(res, refreshToken);

    return res.status(201).json({ accessToken, user: userResponse(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.trim().toLowerCase() });

    if (!user || !(await bcrypt.compare(password || '', user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);
    setRefreshTokenCookie(res, refreshToken);

    return res.json({ accessToken, user: userResponse(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const accessToken = createAccessToken(user._id);
    return res.json({ accessToken, user: userResponse(user) });
  } catch {
    clearRefreshTokenCookie(res);
    return res.status(401).json({ message: 'Refresh token expired or invalid' });
  }
};

export const logout = async (req, res) => {
  clearRefreshTokenCookie(res);
  return res.json({ message: 'Logged out successfully' });
};
