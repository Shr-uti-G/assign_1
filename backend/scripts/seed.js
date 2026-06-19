require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Product = require('../src/models/Product');

const seedData = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Product.deleteMany({});

  await User.create([
    { username: 'admin', email: 'admin@shop.local', password: 'Admin@12345678', role: 'admin' },
    { username: 'user', email: 'user@shop.local', password: 'User@12345678', role: 'user' },
  ]);
  console.log('Seeded users: admin/Admin@12345678, user/User@12345678');

  await Product.create([
    {
      name: 'SilkSculpt Serum',
      price: 70,
      discount: 50,
      category: 'Skin Care',
      description: 'A luxurious serum that nourishes and revitalizes your skin for a radiant glow.',
      stock: 45,
      brand: 'SilkSculpt',
      sku: 'SS-SERUM-001',
    },
    {
      name: 'Velvet Matte Lipstick',
      price: 32,
      discount: 0,
      category: 'Makeup',
      description: 'Long-lasting matte lipstick with rich pigment and a comfortable velvet finish.',
      stock: 120,
      brand: 'GlowUp',
      sku: 'GU-LIP-002',
    },
    {
      name: 'Hydrating Face Cream',
      price: 55,
      discount: 20,
      category: 'Skin Care',
      description: 'Deep hydration cream with hyaluronic acid for all skin types.',
      stock: 78,
      brand: 'PureSkin',
      sku: 'PS-CREAM-003',
    },
    {
      name: 'Volume Boost Shampoo',
      price: 28,
      discount: 0,
      category: 'Hair Care',
      description: 'Gentle shampoo that adds volume and shine without weighing hair down.',
      stock: 200,
      brand: 'HairLux',
      sku: 'HL-SHMP-004',
    },
  ]);
  console.log('Seeded 4 sample products');

  await mongoose.disconnect();
  console.log('Seed complete');
};

seedData().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
