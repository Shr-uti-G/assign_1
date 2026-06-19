const Product = require('../models/Product');

const formatProduct = (product) => {
  const obj = product.toJSON ? product.toJSON() : product;
  return {
    id: obj.id || obj._id?.toString(),
    name: obj.name,
    price: obj.price,
    discount: obj.discount || 0,
    category: obj.category,
    description: obj.description || '',
    stock: obj.stock ?? 0,
    brand: obj.brand || '',
    sku: obj.sku || '',
    image: obj.image,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

const getAllProducts = async () => {
  const products = await Product.find().sort({ createdAt: -1 });
  return products.map(formatProduct);
};

const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) return null;
  return formatProduct(product);
};

const parseProductBody = (body) => {
  const data = {};
  if (body.name !== undefined) data.name = String(body.name).trim();
  if (body.price !== undefined) data.price = parseFloat(body.price);
  if (body.discount !== undefined) data.discount = parseFloat(body.discount) || 0;
  if (body.category !== undefined) data.category = String(body.category).trim();
  if (body.description !== undefined) data.description = String(body.description).trim();
  if (body.stock !== undefined) data.stock = parseInt(body.stock, 10) || 0;
  if (body.brand !== undefined) data.brand = String(body.brand).trim();
  if (body.sku !== undefined) data.sku = String(body.sku).trim();
  return data;
};

const validateProduct = (data, isUpdate = false) => {
  const errors = [];
  if (!isUpdate || data.name !== undefined) {
    if (!data.name || !data.name.trim()) errors.push('Name is required');
  }
  if (!isUpdate || data.price !== undefined) {
    if (data.price === undefined || isNaN(data.price) || data.price < 0) {
      errors.push('Price must be a number >= 0');
    }
  }
  if (!isUpdate || data.category !== undefined) {
    if (!data.category || !data.category.trim()) errors.push('Category is required');
  }
  if (data.discount !== undefined && (isNaN(data.discount) || data.discount < 0 || data.discount > 100)) {
    errors.push('Discount must be between 0 and 100');
  }
  return errors;
};

const createProduct = async (body, file) => {
  const data = parseProductBody(body);
  const errors = validateProduct(data);
  if (errors.length) {
    const err = new Error(errors.join(', '));
    err.status = 400;
    throw err;
  }
  if (file) data.image = `/uploads/${file.filename}`;
  const product = await Product.create(data);
  return formatProduct(product);
};

const updateProduct = async (id, body, file) => {
  const data = parseProductBody(body);
  const errors = validateProduct(data, true);
  if (errors.length) {
    const err = new Error(errors.join(', '));
    err.status = 400;
    throw err;
  }
  if (file) data.image = `/uploads/${file.filename}`;
  const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!product) return null;
  return formatProduct(product);
};

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  return !!product;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
