import { useState } from 'react';
import { ArrowLeft, Theme, Bell, Save, Info, User, LogOut } from 'lucide-react';

export default function SettingsPage({ user, onLogout, onBack }) {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="max-w-lg mx-auto py-8 space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="p-2 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-xl">Impostazioni</h2>
      </div>

      <div className="glass-panel p-6 space-y-6">
        <div>
          <h3 className="font-bold text-slate-200 mb-4">Aspetto</h3>
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
            <span className="text-sm text-slate-300">Tema scuro / chiaro</h3>
            <span className="text-xs text-slate-500">Cambia dall'header</span>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-200 mb-4">Notifiche</h3>
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
            <div>
              <p className="text-sm text-slate-200">Promemoria studio</p>
              <p className="text-xs text-slate-500">Ricevi avvisi per le scadenze</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <h3 className="font-bold text-slate-200 mb-4">Account</h3>
          <p className="text-sm text-slate-300 mb-3">{user?.email || 'Nessun account'}</p>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Esci
          </button>
        </div>
      </div>

      <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
        <Info className="w-4 h-4 text-slate-500 mb-2" />
        <p className="text-xs text-slate-500">VladSchool v1 — PWA offline-first</p>
      </div>
    </div>
  );
}
