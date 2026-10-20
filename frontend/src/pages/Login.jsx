import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';

export default function Login({ onLogin, onBack }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('api/auth/' + mode, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.ok) {
        onLogin(data.user);
      } else {
        setError(data.error || 'Errore');
      }
    } catch {
      setError('Server non raggiungibile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onBack} className="p-2 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-xl">{mode === 'login' ? 'Accedi' : 'Crea account'}</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5" />
          <span className="text-sm text-rose-200">{error}</span>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 space-y-4"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-3 input-glass"
                  placeholder="nome@esempio.it"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-3 input-glass"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-orange disabled:opacity-50"
            >
              {loading ? 'Attendi…' : mode === 'login' ? 'Accedi' : 'Crea account'}
            </button>
          </div>
        </form>
        <p className="text-center text-xs text-slate-500 mt-3">
          L'uso anonimo funziona senza account (dati in locale).
        </p>
        <button
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="w-full py-2 rounded-lg text-sm font-medium text-orange-400 hover:bg-orange-500/10 transition-colors"
        >
          {mode === 'login' ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'}
        </button>
      </motion.div>
    </div>
  );
}
