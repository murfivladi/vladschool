import { motion, AnimatePresence } from 'framer-motion';
import { Home, Calculator, Atom, Type, Landmark, Book, Clock, BarChart3, Schedule, Timer, Gamepad2, Layout, Image, User, LogOut, Settings, ChevronRight } from 'lucide-react';
import { TOOLS } from '../data/tools';

const ICONS = {
  Calculator, Atom, Type, Landmark, Book, Clock, BarChart3, Schedule, Timer, Gamepad2, Layout, Image, User, LogOut, Settings, ChevronRight,
};

const CATEGORY_ICONS = {
  matematica: Calculator,
  scienze: Atom,
  italiano: Type,
  storia: Landmark,
  inglese: Book,
  studio: Clock,
  organizza: Schedule,
  giochi: Gamepad2,
  creativita: Layout,
};

const CATEGORY_LABELS = {
  matematica: 'Matematica',
  scienze: 'Scienze',
  italiano: 'Italiano',
  storia: 'Storia & Geo',
  inglese: 'Inglese',
  studio: 'Studiare',
  organizza: 'Organizza',
  giochi: 'Giochi',
  creativita: 'Creatività',
};

export default function Sidebar({ open, onClose, onNavigate, user, onLogout }) {
  const categories = [
    { key: 'matematica', label: 'Matematica', icon: Calculator },
    { key: 'scienze', label: 'Scienze', icon: Atom },
    { key: 'italiano', label: 'Italiano', icon: Type },
    { key: 'storia', label: 'Storia', icon: Landmark },
    { key: 'inglese', label: 'Inglese', icon: Book },
    { key: 'studio', label: 'Studiare', icon: Clock },
    { key: 'organizza', label: 'Organizza', icon: Schedule },
    { key: 'giochi', label: 'Giochi', icon: Gamepad2 },
    { key: 'creativita', label: 'Creatività', icon: Layout },
  ];

  return (
    <motion.aside
      initial={{ x: '-100%' }}
      animate={open ? '0%' : '-100%'}
      exit={{ x: '-100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed left-0 top-0 h-full w-64 bg-indigo-950/90 backdrop-blur-xl border-r border-white/10 z-30 lg:relative lg:transform-none lg:w-64 lg:bg-transparent lg:border-0 lg:z-auto"
    >
      <div className="flex flex-col h-full">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-indigo-950 shadow-lg">🦇</div>
          <span className="font-bold text-xl tracking-tight text-white">VladSchool</span>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <h3 className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Strumenti</h3>
          {categories.map((cat) => {
            const tools = TOOLS.filter((t) => t.category === cat.key);
            const Icon = cat.icon;
            return (
              <div key={cat.key} className="mb-2">
                <button
                  onClick={() => {
                    onClose();
                    if (tools.length === 1) onNavigate('tool', tools[0].id);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                  <ChevronRight className="ml-auto w-3 h-3 text-slate-500" />
                </button>
                <div className="grid grid-cols-2 gap-1 px-3 pb-1">
                  {tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => { onClose(); onNavigate('tool', tool.id); }}
                      className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-white/10 hover:text-orange-300 transition-colors group"
                    >
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${tool.color === 'orange' ? 'bg-orange-500/20 text-orange-400 group-hover:bg-orange-500 group-hover:text-white' : 'bg-white/10 text-white'}`}>
                        <tool.icon className="w-3 h-3" />
                      </div>
                      <span className="text-[10px] leading-tight text-center">{tool.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <h3 className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Account</h3>
          {user ? (
            <>
              <button
                onClick={() => { onClose(); onNavigate('settings'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <User className="w-4 h-4" /> Impostazioni
              </button>
              <button
                onClick={() => { onClose(); onLogout(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-white/10 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Esci
              </button>
            </>
          ) : (
            <button
              onClick={() => { onClose(); onNavigate('login'); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <User className="w-4 h-4" /> Accedi / Registrati
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
