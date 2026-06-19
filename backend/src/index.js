require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Image must be less than 5MB' });
    }
  }
  if (err.message?.includes('Only JPEG')) {
    return res.status(400).json({ error: err.message });
  }
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });
