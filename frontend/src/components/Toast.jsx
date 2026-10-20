import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function Toast() {
  const [toast, setToast] = useState(null);

  const show = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (typeof window !== 'undefined') {
    window.showVladToast = show;
  }

  if (!toast) return null;

  const colors = {
    info: 'bg-blue-500/90 border-blue-400',
    success: 'bg-emerald-500/90 border-emerald-400',
    error: 'bg-rose-500/90 border-rose-400',
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
      <AlertCircle className="w-5 h-5" />
      <span className="text-sm font-medium">{toast.msg}</span>
    </div>
  );
}
