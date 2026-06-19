import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useProduct } from '../hooks/useProducts';
import { useAuth } from '../context/AuthContext';
import { formatPrice, getDiscountedPrice, getImageUrl } from '../utils/format';

function PlaceholderImage() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <svg className="h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const { isAdmin } = useAuth();
  const [quantity, setQuantity] = useState(1);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="mx-auto max-w-7xl animate-pulse px-4 py-10">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="aspect-square rounded-2xl bg-gray-200" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-6 w-1/3 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <p className="mb-4 text-gray-600">{error || 'Product not found'}</p>
          <Link to="/products" className="btn-primary">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const salePrice = getDiscountedPrice(product.price, product.discount);
  const hasDiscount = product.discount > 0;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-6">
        <p className="text-sm text-gray-400">
          <Link to="/products" className="hover:text-forest">Shop</Link>
          {' / '}
          <span className="text-gray-600">{product.category}</span>
          {' / '}
          <span className="text-gray-800">{product.name}</span>
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-2xl bg-gray-50">
              <div className="aspect-square">
                {product.image ? (
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <PlaceholderImage />
                )}
              </div>
            </div>
          </div>

          <div>
            <span className="mb-3 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {product.category}
            </span>
            <h1 className="mb-3 text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="mb-6 text-gray-500 leading-relaxed">
              {product.description || 'No description available for this product.'}
            </p>

            <div className="mb-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(salePrice)}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
                  <span className="rounded-full bg-forest px-2.5 py-0.5 text-xs font-semibold text-white">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>

            {product.brand && (
              <p className="mb-2 text-sm text-gray-500">
                Brand: <span className="font-medium text-gray-700">{product.brand}</span>
              </p>
            )}
            {product.sku && (
              <p className="mb-6 text-sm text-gray-500">
                SKU: <span className="font-medium text-gray-700">{product.sku}</span>
              </p>
            )}

            <div className="mb-8 flex items-center gap-4">
              <div className="flex items-center rounded-xl border border-gray-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50"
                >
                  −
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
              {product.stock > 0 ? (
                <span className="text-sm text-orange-500">
                  Only <strong>{product.stock} items</strong> left!
                </span>
              ) : (
                <span className="text-sm text-red-500">Out of stock</span>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="btn-forest flex-1 sm:flex-none">View Details</button>
              {isAdmin && (
                <Link to={`/products/${product.id}/edit`} className="btn-secondary">
                  Edit Product
                </Link>
              )}
            </div>

            <div className="mt-8 space-y-3">
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm font-semibold text-gray-900">🚚 Free Delivery</p>
                <p className="text-xs text-gray-500">Enter your postal code for delivery availability</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm font-semibold text-gray-900">↩️ Return Delivery</p>
                <p className="text-xs text-gray-500">Free 30-day delivery returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
