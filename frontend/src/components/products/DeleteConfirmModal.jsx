import { getImageUrl } from '../../utils/format';

export default function DeleteConfirmModal({ product, onConfirm, onCancel, loading }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">Delete Product</h3>
        <p className="mb-4 text-sm text-gray-600">
          Are you sure you want to delete <strong>{product.name}</strong>? This action cannot be undone.
        </p>
        {product.image && (
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="mb-4 h-24 w-24 rounded-xl object-cover"
          />
        )}
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
