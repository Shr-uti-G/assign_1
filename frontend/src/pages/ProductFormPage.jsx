import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/apiClient';
import Navbar from '../components/layout/Navbar';
import { useToast } from '../context/ToastContext';
import { getImageUrl } from '../utils/format';

const emptyForm = {
  name: '',
  price: '',
  discount: '0',
  category: '',
  description: '',
  stock: '0',
  brand: '',
  sku: '',
};

export default function ProductFormPage({ mode = 'create' }) {
  const { id } = useParams();
  const isEdit = mode === 'edit';
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (!isEdit || !id) return;
    setLoading(true);
    api
      .getProduct(id)
      .then((p) => {
        setForm({
          name: p.name || '',
          price: String(p.price ?? ''),
          discount: String(p.discount ?? 0),
          category: p.category || '',
          description: p.description || '',
          stock: String(p.stock ?? 0),
          brand: p.brand || '',
          sku: p.sku || '',
        });
        setExistingImage(p.image);
      })
      .catch((err) => setServerError(err.message))
      .finally(() => setLoading(false));
  }, [isEdit, id]);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleImageChange = (file) => {
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Product name is required';
    const price = parseFloat(form.price);
    if (isNaN(price) || price < 0) errs.price = 'Price must be 0 or greater';
    if (!form.category.trim()) errs.category = 'Category is required';
    const discount = parseFloat(form.discount);
    if (isNaN(discount) || discount < 0 || discount > 100) {
      errs.discount = 'Discount must be between 0 and 100';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError('');

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append('image', imageFile);

    try {
      if (isEdit) {
        await api.updateProduct(id, fd);
        addToast('Product updated successfully');
      } else {
        await api.createProduct(fd);
        addToast('Product created successfully');
      }
      navigate('/products');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-3xl animate-pulse px-4 py-10">
          <div className="h-8 w-48 rounded bg-gray-200 mb-8" />
          <div className="space-y-4 rounded-2xl bg-white p-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 rounded bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const preview = imagePreview || (existingImage ? getImageUrl(existingImage) : null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link to="/products" className="mb-6 inline-flex text-sm text-gray-500 hover:text-forest">
          ← Back to products
        </Link>
        <h1 className="mb-8 text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {serverError && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{serverError}</div>
          )}

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Basic Info</h2>
            <div className="space-y-4">
              <div>
                <label className="form-label">Product Name *</label>
                <input
                  className="input-field"
                  placeholder="e.g. SilkSculpt Serum"
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label className="form-label">Category *</label>
                <input
                  className="input-field"
                  placeholder="e.g. Skin Care, Makeup, Hair Care"
                  value={form.category}
                  onChange={(e) => setField('category', e.target.value)}
                />
                {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea
                  className="input-field min-h-[100px] resize-y"
                  placeholder="Describe your product..."
                  value={form.description}
                  onChange={(e) => setField('description', e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Pricing & Stock</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="form-label">Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="input-field"
                  placeholder="35.00"
                  value={form.price}
                  onChange={(e) => setField('price', e.target.value)}
                />
                {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
              </div>
              <div>
                <label className="form-label">Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="input-field"
                  placeholder="0"
                  value={form.discount}
                  onChange={(e) => setField('discount', e.target.value)}
                />
                {errors.discount && <p className="mt-1 text-xs text-red-500">{errors.discount}</p>}
              </div>
              <div>
                <label className="form-label">Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  className="input-field"
                  placeholder="100"
                  value={form.stock}
                  onChange={(e) => setField('stock', e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Brand</label>
                <input
                  className="input-field"
                  placeholder="Brand name"
                  value={form.brand}
                  onChange={(e) => setField('brand', e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="form-label">SKU</label>
                <input
                  className="input-field"
                  placeholder="Product SKU code"
                  value={form.sku}
                  onChange={(e) => setField('sku', e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Product Image</h2>
            <div
              className="relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 transition hover:border-primary hover:bg-teal-50/30"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleImageChange(e.dataTransfer.files[0]);
              }}
              onClick={() => document.getElementById('image-input').click()}
            >
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-48 rounded-xl object-contain" />
              ) : (
                <>
                  <span className="mb-2 text-3xl">📷</span>
                  <p className="text-sm font-medium text-gray-600">Drag & drop or click to upload</p>
                  <p className="text-xs text-gray-400">JPEG, PNG, WebP — max 5MB</p>
                </>
              )}
              <input
                id="image-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => handleImageChange(e.target.files[0])}
              />
            </div>
            {preview && (
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                  if (isEdit) setExistingImage(null);
                }}
                className="mt-2 text-sm text-red-500 hover:text-red-700"
              >
                Remove image
              </button>
            )}
          </section>

          <div className="flex justify-end gap-3">
            <Link to="/products" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={submitting} className="btn-forest">
              {submitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
