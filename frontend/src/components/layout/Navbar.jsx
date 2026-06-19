import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ variant = 'shop' }) {
  const { isAuthenticated, isAdmin, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (variant === 'login') {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-end px-4 py-4">
        {isAuthenticated && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Hi, <span className="font-medium text-gray-900">{username}</span>
            </span>
            {isAdmin && (
              <Link
                to="/admin"
                className="rounded-full bg-forest/10 px-4 py-1.5 text-sm font-medium text-forest hover:bg-forest/20 transition"
              >
                Admin Panel
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
