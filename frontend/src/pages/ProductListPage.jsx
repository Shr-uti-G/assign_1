import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import ProductCard from '../components/products/ProductCard';
import DeleteConfirmModal from '../components/products/DeleteConfirmModal';
import { ProductGridSkeleton } from '../components/products/ProductSkeleton';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ProductListPage() {
  const { products, loading, error, refetch, deleteProduct } = useProducts();
  const { isAdmin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))].sort(),
    [products]
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchCategory = !category || p.category === category;
      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      addToast(`"${deleteTarget.name}" deleted successfully`);
      setDeleteTarget(null);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-gray-100 py-8">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-sm text-gray-500">Home / Shop</p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">Shop</h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field max-w-xs"
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory('')}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                  !category ? 'bg-forest text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                    category === cat ? 'bg-forest text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          {isAdmin && (
            <Link to="/products/new" className="btn-forest shrink-0">
              + Add Product
            </Link>
          )}
        </div>

        {loading && <ProductGridSkeleton />}

        {error && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <p className="mb-4 text-gray-600">{error}</p>
            <button onClick={refetch} className="btn-primary">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 text-3xl">
              🛍️
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">No products found</h3>
            <p className="mb-6 text-gray-500">
              {products.length === 0
                ? 'The catalog is empty.'
                : 'Try adjusting your search or filters.'}
            </p>
            {isAdmin && products.length === 0 && (
              <Link to="/products/new" className="btn-forest">
                Add your first product
              </Link>
            )}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <p className="mb-4 text-sm text-gray-500">
              Showing {filtered.length} of {products.length} products
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showAdminActions={isAdmin}
                  onEdit={() => navigate(`/products/${product.id}/edit`)}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <footer className="mt-12 border-t border-gray-200 bg-white py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-3">
          {[
            { icon: '📦', title: 'Free Shipping', desc: 'Free shipping for orders above $50' },
            { icon: '💳', title: 'Flexible Payment', desc: 'Multiple secure payment options' },
            { icon: '🎧', title: '24×7 Support', desc: 'We support online all days' },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-4">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </footer>

      <DeleteConfirmModal
        product={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
