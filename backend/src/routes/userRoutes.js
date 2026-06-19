const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const userService = require('../services/userService');

const router = express.Router();

router.use(authenticate, requireRole('admin'));

router.get('/', async (_req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }
    const user = await userService.createUser({ username, email, password, role: role || 'user' });
    res.status(201).json(user);
  } catch (err) {
    if (err.status === 400) return res.status(400).json({ error: err.message });
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await userService.deleteUser(req.params.id, req.user.username);
    if (result.notFound) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    if (err.status === 400) return res.status(400).json({ error: err.message });
    next(err);
  }
});

module.exports = router;
