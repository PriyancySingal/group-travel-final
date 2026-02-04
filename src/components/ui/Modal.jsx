export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-96">
        {children}

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
}
