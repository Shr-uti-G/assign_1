const User = require('../models/User');
const { validatePassword, validateEmail } = require('../utils/passwordValidation');

const getAllUsers = async () => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  return users.map((u) => ({
    id: u._id.toString(),
    username: u.username,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
  }));
};

const createUser = async ({ username, email, password, role = 'user' }) => {
  const normalizedUsername = username.toLowerCase().trim();
  const normalizedEmail = email?.toLowerCase().trim();

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

  const existing = await User.findOne({ username: normalizedUsername });
  if (existing) {
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

  if (!['admin', 'user'].includes(role)) {
    const err = new Error('Invalid role');
    err.status = 400;
    throw err;
  }

  const user = await User.create({
    username: normalizedUsername,
    email: normalizedEmail,
    password,
    role,
  });
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

const deleteUser = async (id, requestingUsername) => {
  const user = await User.findById(id);
  if (!user) return { notFound: true };
  if (user.username === requestingUsername) {
    const err = new Error('Cannot delete your own account');
    err.status = 400;
    throw err;
  }
  await User.findByIdAndDelete(id);
  return { deleted: true };
};

module.exports = { getAllUsers, createUser, deleteUser };
