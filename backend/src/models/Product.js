const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    brand: {
      type: String,
      default: '',
      trim: true,
    },
    sku: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

productSchema.set('toJSON', {
  virtuals: true,
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Product', productSchema);
