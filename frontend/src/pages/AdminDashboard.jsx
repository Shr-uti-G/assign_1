import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import ProductCard from '../components/products/ProductCard';
import DeleteConfirmModal from '../components/products/DeleteConfirmModal';
import { ProductGridSkeleton } from '../components/products/ProductSkeleton';
import { useProducts } from '../hooks/useProducts';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function UserManagement() {
  const { users, loading, error, refetch, addUser, removeUser } = useUsers();
  const { username: currentUser } = useAuth();
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' });
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.email.trim() || !form.password.trim()) return;
    setSubmitting(true);
    try {
      await addUser(form);
      addToast('User created successfully');
      setForm({ username: '', email: '', password: '', role: 'user' });
      setShowForm(false);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await removeUser(deleteId);
      addToast('User removed successfully');
      setDeleteId(null);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 rounded-xl bg-gray-100" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-center">
        <p className="mb-3 text-red-600">{error}</p>
        <button onClick={refetch} className="btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Users ({users.length})</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-forest text-sm">
          {showForm ? 'Cancel' : '+ Add User'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="form-label">Username</label>
              <input
                className="input-field"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="newuser"
              />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="input-field"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                className="input-field"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min 12 chars, 1 upper, 1 special"
              />
            </div>
            <div>
              <label className="form-label">Role</label>
              <select
                className="input-field"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500">Username</th>
              <th className="px-6 py-3 font-medium text-gray-500">Email</th>
              <th className="px-6 py-3 font-medium text-gray-500">Role</th>
              <th className="px-6 py-3 font-medium text-gray-500">Joined</th>
              <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {user.username}
                  {user.username === currentUser && (
                    <span className="ml-2 text-xs text-gray-400">(you)</span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-500">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      user.role === 'admin'
                        ? 'bg-forest/10 text-forest'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {user.username !== currentUser && (
                    <button
                      onClick={() => setDeleteId(user.id)}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 font-semibold">Remove User</h3>
            <p className="mb-4 text-sm text-gray-600">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary" disabled={deleting}>
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductManagement() {
  const { products, loading, error, refetch, deleteProduct } = useProducts();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      addToast(`"${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Products ({products.length})</h2>
        <Link to="/products/new" className="btn-forest text-sm">+ Add Product</Link>
      </div>

      {loading && <ProductGridSkeleton count={4} />}

      {error && (
        <div className="rounded-xl bg-red-50 p-6 text-center">
          <p className="mb-3 text-red-600">{error}</p>
          <button onClick={refetch} className="btn-primary">Retry</button>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <p className="mb-4 text-gray-500">No products yet.</p>
          <Link to="/products/new" className="btn-forest">Add your first product</Link>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showAdminActions
              onEdit={() => navigate(`/products/${product.id}/edit`)}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <DeleteConfirmModal
        product={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('products');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-500">Manage your store products and users</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex gap-2">
          {[
            { id: 'products', label: 'Products' },
            { id: 'users', label: 'Users' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition ${
                tab === t.id
                  ? 'bg-forest text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t.label}
            </button>
          ))}
          <Link
            to="/products"
            className="ml-auto rounded-full px-6 py-2 text-sm font-medium text-gray-500 hover:bg-white hover:text-forest transition"
          >
            View Storefront →
          </Link>
        </div>

        {tab === 'products' ? <ProductManagement /> : <UserManagement />}
      </div>
    </div>
  );
}
