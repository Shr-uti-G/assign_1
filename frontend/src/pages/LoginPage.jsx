import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertModal from '../components/common/AlertModal';
import { validateEmail, validatePassword, getPasswordStrengthHints } from '../utils/validation';

function AuthInput({ icon, label, type = 'text', value, onChange, placeholder }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-field pl-11"
        />
      </div>
    </div>
  );
}

function Illustration() {
  return (
    <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-teal-50 to-emerald-100 lg:flex">
      <div className="absolute -right-20 top-1/4 h-96 w-96 rounded-full bg-primary/20" />
      <div className="absolute -left-10 bottom-1/4 h-64 w-64 rounded-full bg-teal-200/40" />
      <div className="relative z-10 text-center">
        <div className="mx-auto mb-6 flex h-48 w-48 items-center justify-center rounded-3xl bg-white shadow-xl">
          <svg className="h-24 w-24 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="1.5" />
            <path d="M8 21h8M12 17v4" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M6 7h12M6 11h8" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <p className="mt-2 text-sm text-gray-500">Discover premium products</p>
      </div>
    </div>
  );
}

const emptySignup = { email: '', username: '', password: '', confirmPassword: '' };

export default function LoginPage() {
  const [mode, setMode] = useState('user');
  const [tab, setTab] = useState('login');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [signupForm, setSignupForm] = useState(emptySignup);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const { login, register, logout } = useAuth();
  const navigate = useNavigate();

  const showAlert = (title, message, type = 'error') => {
    setAlert({ title, message, type });
  };

  const resetForms = () => {
    setLoginForm({ username: '', password: '' });
    setSignupForm(emptySignup);
  };

  const switchToUser = () => {
    setMode('user');
    resetForms();
  };

  const switchToAdmin = () => {
    setMode('admin');
    setTab('login');
    resetForms();
  };

  const validateLogin = () => {
    const warnings = [];
    if (!loginForm.username.trim()) warnings.push('Username is required');
    if (!loginForm.password.trim()) warnings.push('Password is required');
    if (warnings.length) {
      showAlert('Missing Information', warnings, 'warning');
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    const errors = [
      ...validateEmail(signupForm.email),
      ...(signupForm.username.trim() ? [] : ['Username is required']),
      ...validatePassword(signupForm.password),
    ];
    if (signupForm.password !== signupForm.confirmPassword) {
      errors.push('Passwords do not match');
    }
    if (errors.length) {
      showAlert('Sign Up Failed', errors, 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (mode === 'user' && tab === 'signup') {
      if (!validateSignup()) return;
    } else if (!validateLogin()) {
      return;
    }

    setLoading(true);
    try {
      if (mode === 'admin') {
        const data = await login(loginForm.username, loginForm.password);
        if (data.role !== 'admin') {
          logout();
          showAlert('Access Denied', 'Admin access only. Please use a valid admin account.', 'error');
          return;
        }
        navigate('/admin');
      } else if (tab === 'login') {
        await login(loginForm.username, loginForm.password);
        navigate('/products');
      } else {
        await register(signupForm);
        showAlert('Welcome!', 'Your account was created successfully.', 'success');
      }
    } catch (err) {
      showAlert(
        mode === 'admin' ? 'Admin Login Failed' : tab === 'login' ? 'Login Failed' : 'Sign Up Failed',
        err.message || 'Invalid username or password',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordHints = getPasswordStrengthHints(signupForm.password);
  const isSignup = mode === 'user' && tab === 'signup';
  const canSubmit = loading
    ? false
    : isSignup
      ? signupForm.email && signupForm.username && signupForm.password && signupForm.confirmPassword
      : loginForm.username.trim() && loginForm.password.trim();

  return (
    <div className="relative min-h-screen bg-white">
      <AlertModal
        open={!!alert}
        title={alert?.title}
        message={alert?.message}
        type={alert?.type}
        onClose={() => {
          if (alert?.type === 'success') navigate('/products');
          setAlert(null);
        }}
      />

      <div className="flex min-h-screen">
        <div className="flex flex-1 flex-col justify-center px-8 py-12 lg:px-16">
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -left-20 top-0 h-48 w-48 rounded-full bg-teal-100/60" />
            <div className="absolute -right-10 bottom-0 h-32 w-32 rounded-full bg-primary/10" />

            <div className="relative">
              {mode === 'user' ? (
                <>
                  <h1 className="mb-2 text-3xl font-bold text-gray-900">Welcome</h1>
                  <p className="mb-8 text-gray-500">Browse our product catalog</p>

                  <div className="mb-8 flex items-center justify-between border-b border-gray-200">
                    <div className="flex gap-8">
                      {['login', 'signup'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => { setTab(t); resetForms(); }}
                          className={`pb-3 text-sm font-semibold capitalize transition ${
                            tab === t
                              ? 'border-b-2 border-primary text-primary'
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          {t === 'signup' ? 'Sign up' : 'Login'}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={switchToAdmin}
                      className="mb-2 rounded-full bg-forest/10 px-4 py-1.5 text-xs font-semibold text-forest transition hover:bg-forest/20"
                    >
                      Admin
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={switchToUser}
                    className="mb-6 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition"
                  >
                    ← Back to user login
                  </button>
                  <div className="mb-2 inline-flex rounded-full bg-forest/10 px-3 py-1 text-xs font-medium text-forest">
                    Admin Portal
                  </div>
                  <h1 className="mb-2 text-3xl font-bold text-gray-900">Admin Login</h1>
                  <p className="mb-8 text-gray-500">Manage products and users</p>
                </>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {isSignup ? (
                  <>
                    <AuthInput
                      icon="✉️"
                      label="Email"
                      type="email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      placeholder="you@example.com"
                    />
                    <AuthInput
                      icon="👤"
                      label="Username"
                      value={signupForm.username}
                      onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                      placeholder="Choose a username"
                    />
                    <AuthInput
                      icon="🔒"
                      label="Password"
                      type="password"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      placeholder="Create a strong password"
                    />
                    {signupForm.password && (
                      <ul className="space-y-1 rounded-lg bg-gray-50 px-4 py-3 text-xs">
                        {passwordHints.map((h) => (
                          <li key={h.label} className={h.ok ? 'text-green-600' : 'text-gray-400'}>
                            {h.ok ? '✓' : '○'} {h.label}
                          </li>
                        ))}
                      </ul>
                    )}
                    <AuthInput
                      icon="🔒"
                      label="Confirm Password"
                      type="password"
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                      placeholder="Re-enter your password"
                    />
                  </>
                ) : (
                  <>
                    <AuthInput
                      icon="👤"
                      label="Username"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                      placeholder={mode === 'admin' ? 'admin' : 'Enter your username'}
                    />
                    <AuthInput
                      icon="🔒"
                      label="Password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="Enter your password"
                    />
                  </>
                )}

                <div className="flex items-center justify-between pt-2">
                  {mode === 'user' && tab === 'login' && (
                    <span className="text-sm text-gray-400">Forgot your password?</span>
                  )}
                  <button type="submit" disabled={!canSubmit} className="btn-primary ml-auto">
                    {loading
                      ? 'Please wait...'
                      : mode === 'admin'
                        ? 'Access Admin Panel'
                        : tab === 'login'
                          ? 'Login'
                          : 'Sign up'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <Illustration />
      </div>
    </div>
  );
}
