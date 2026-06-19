export default function AlertModal({ open, title, message, type = 'error', onClose }) {
  if (!open) return null;

  const styles = {
    error: {
      icon: '⚠️',
      ring: 'border-red-200',
      title: 'text-red-800',
      body: 'text-red-700',
      btn: 'bg-red-600 hover:bg-red-700',
    },
    warning: {
      icon: '⚡',
      ring: 'border-amber-200',
      title: 'text-amber-800',
      body: 'text-amber-700',
      btn: 'bg-amber-500 hover:bg-amber-600',
    },
    success: {
      icon: '✓',
      ring: 'border-green-200',
      title: 'text-green-800',
      body: 'text-green-700',
      btn: 'bg-forest hover:bg-forest-dark',
    },
  };

  const s = styles[type] || styles.error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className={`w-full max-w-sm rounded-2xl border bg-white p-6 shadow-xl ${s.ring}`}
        role="alertdialog"
        aria-labelledby="alert-title"
      >
        <div className="mb-4 flex items-start gap-3">
          <span className="text-2xl">{s.icon}</span>
          <div>
            <h3 id="alert-title" className={`font-semibold ${s.title}`}>
              {title}
            </h3>
            {Array.isArray(message) ? (
              <ul className={`mt-2 list-inside list-disc space-y-1 text-sm ${s.body}`}>
                {message.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            ) : (
              <p className={`mt-1 text-sm ${s.body}`}>{message}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`rounded-full px-6 py-2 text-sm font-semibold text-white transition ${s.btn}`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
