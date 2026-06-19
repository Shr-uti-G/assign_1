const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const productService = require('../services/productService');

const router = express.Router();

router.get('/', authenticate, async (_req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.post('/', authenticate, requireRole('admin'), upload.single('image'), async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body, req.file);
    res.status(201).json(product);
  } catch (err) {
    if (err.status === 400) return res.status(400).json({ error: err.message });
    next(err);
  }
});

router.put('/:id', authenticate, requireRole('admin'), upload.single('image'), async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body, req.file);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    if (err.status === 400) return res.status(400).json({ error: err.message });
    next(err);
  }
});

router.delete('/:id', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const deleted = await productService.deleteProduct(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
