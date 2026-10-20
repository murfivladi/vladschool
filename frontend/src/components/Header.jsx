import { Menu, Sun, Moon, Search } from 'lucide-react';

export default function Header({ theme, onToggleTheme, onOpenSidebar, user, onLogout }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between px-4 bg-indigo-950/80 backdrop-blur-md border-b border-white/10">
      <button
        onClick={onOpenSidebar}
        className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
        aria-label="Apri menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2">
        <span className="hidden lg:block font-bold text-lg text-white tracking-tight">VladSchool</span>
        <div className="hidden lg:flex items-center">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cerca strumenti…"
            className="ml-2 bg-white/5 border border-white/10 text-xs text-slate-200 placeholder-slate-400 rounded-lg px-3 py-1.5 focus:outline-none focus:border-orange-500 w-32"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Cambia tema"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        {user ? (
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs text-slate-400">{user.email}</span>
            <button
              onClick={onLogout}
              className="text-xs font-medium text-red-400 hover:text-red-300 underline"
            >
              Esci
            </button>
          </div>
        ) : (
          <button
            onClick={() => {}}
            className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-orange-300 border border-orange-500/30 hover:bg-orange-500/10 transition-colors"
          >
            <User className="w-3 h-3" /> Accedi
          </button>
        )}
      </div>
    </header>
  );
}
