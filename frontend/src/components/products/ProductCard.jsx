import { Link } from 'react-router-dom';
import { formatPrice, getDiscountedPrice, getImageUrl } from '../../utils/format';

function PlaceholderImage() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-100">
      <svg className="h-16 w-16 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  );
}

export default function ProductCard({ product, showAdminActions, onEdit, onDelete }) {
  const salePrice = getDiscountedPrice(product.price, product.discount);
  const hasDiscount = product.discount > 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {product.image ? (
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <PlaceholderImage />
          )}
          {hasDiscount && (
            <span className="absolute left-3 top-3 rounded-full bg-forest px-3 py-1 text-xs font-semibold text-white">
              {product.discount}% off
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
              {product.category}
            </span>
            {product.stock <= 10 && product.stock > 0 && (
              <span className="text-xs text-orange-500">Low stock</span>
            )}
          </div>
          <h3 className="mb-2 font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gold">{formatPrice(salePrice)}</span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
      </Link>

      {showAdminActions && (
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition group-hover:opacity-100">
          <button
            onClick={(e) => { e.preventDefault(); onEdit(product); }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={(e) => { e.preventDefault(); onDelete(product); }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-red-50"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
}
