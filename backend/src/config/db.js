const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined');
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
    return;
  } catch (err) {
    if (process.env.USE_MEMORY_DB === 'false') {
      throw err;
    }
    console.warn('Atlas/local MongoDB unavailable, starting in-memory database...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    await mongoose.connect(memoryServer.getUri());
    console.log('In-memory MongoDB connected');

    const User = require('../models/User');
    const Product = require('../models/Product');
    const count = await User.countDocuments();
    if (count === 0) {
      await User.create([
        { username: 'admin', email: 'admin@shop.local', password: 'Admin@12345678', role: 'admin' },
        { username: 'user', email: 'user@shop.local', password: 'User@12345678', role: 'user' },
      ]);
      await Product.create([
        {
          name: 'SilkSculpt Serum',
          price: 70,
          discount: 50,
          category: 'Skin Care',
          description: 'A luxurious serum that nourishes and revitalizes your skin.',
          stock: 45,
          brand: 'SilkSculpt',
          sku: 'SS-SERUM-001',
        },
        {
          name: 'Velvet Matte Lipstick',
          price: 32,
          discount: 0,
          category: 'Makeup',
          description: 'Long-lasting matte lipstick with rich pigment.',
          stock: 120,
          brand: 'GlowUp',
          sku: 'GU-LIP-002',
        },
        {
          name: 'Hydrating Face Cream',
          price: 55,
          discount: 20,
          category: 'Skin Care',
          description: 'Deep hydration cream with hyaluronic acid.',
          stock: 78,
          brand: 'PureSkin',
          sku: 'PS-CREAM-003',
        },
        {
          name: 'Volume Boost Shampoo',
          price: 28,
          discount: 0,
          category: 'Hair Care',
          description: 'Gentle shampoo that adds volume and shine.',
          stock: 200,
          brand: 'HairLux',
          sku: 'HL-SHMP-004',
        },
      ]);
      console.log('Seeded default users (admin/Admin@12345678, user/User@12345678) and sample products');
    }
  }
};

module.exports = connectDB;
