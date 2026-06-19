const express = require('express');
const { loginUser, registerUser } = require('../services/authService');
const { validatePassword } = require('../utils/passwordValidation');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username?.trim() || !password?.trim()) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    const result = await loginUser(username, password);
    if (!result) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    if (!username?.trim() || !email?.trim() || !password?.trim() || !confirmPassword?.trim()) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length) {
      return res.status(400).json({ error: passwordErrors.join('. ') });
    }
    const result = await registerUser({ username, email, password });
    res.status(201).json(result);
  } catch (err) {
    if (err.status === 400) return res.status(400).json({ error: err.message });
    next(err);
  }
});

module.exports = router;
