const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validatePassword, validateEmail } = require('../utils/passwordValidation');

const generateToken = (user) =>
  jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );

const loginUser = async (username, password) => {
  const user = await User.findOne({ username: username.toLowerCase().trim() });
  if (!user) return null;
  const valid = await user.comparePassword(password);
  if (!valid) return null;
  return { token: generateToken(user), role: user.role, username: user.username };
};

const registerUser = async ({ username, email, password }) => {
  const normalizedUsername = username.toLowerCase().trim();
  const normalizedEmail = email.toLowerCase().trim();

  const emailErrors = validateEmail(normalizedEmail);
  if (emailErrors.length) {
    const err = new Error(emailErrors[0]);
    err.status = 400;
    throw err;
  }

  const passwordErrors = validatePassword(password);
  if (passwordErrors.length) {
    const err = new Error(passwordErrors.join('. '));
    err.status = 400;
    throw err;
  }

  const existingUsername = await User.findOne({ username: normalizedUsername });
  if (existingUsername) {
    const err = new Error('Username already exists');
    err.status = 400;
    throw err;
  }

  const existingEmail = await User.findOne({ email: normalizedEmail });
  if (existingEmail) {
    const err = new Error('Email already registered');
    err.status = 400;
    throw err;
  }

  const user = await User.create({
    username: normalizedUsername,
    email: normalizedEmail,
    password,
    role: 'user',
  });
  return { token: generateToken(user), role: user.role, username: user.username };
};

module.exports = { loginUser, registerUser, generateToken };
