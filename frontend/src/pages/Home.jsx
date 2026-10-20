import { motion } from 'framer-motion';
import ToolCard from '../components/ToolCard';
import { TOOLS } from '../data/tools';

export default function Home({ onToolSelect, user }) {
  const categories = [
    'matematica', 'scienze', 'italiano', 'storia', 'inglese', 'studio', 'organizza', 'giochi', 'creativita',
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <h1 className="text-3xl font-bold text-balance">
          Benvenuto in <span className="text-orange-500">VladSchool</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-md">
          Tutta la scuola in un'app. Scegli uno strumento per iniziare.
        </p>
        {user && (
          <p className="text-xs text-slate-500">Connesso come <span className="text-slate-200 font-medium">{user.email}</span></p>
        )}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const tools = TOOLS.filter((t) => t.category === cat);
          const labels = {
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
          return (
            <motion.div
              key={cat}
              whileHover={{ y: -4 }}
              className="glass-card p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                <span className="font-bold text-xs text-slate-300 uppercase tracking-wider">{labels[cat]}</span>
              </div>
              <div className="space-y-2">
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => onToolSelect('tool', tool.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-orange-300 transition-colors group"
                  >
                    <span className="flex items-center gap-2">
                      <tool.icon className="w-4 h-4 text-orange-400 group-hover:text-orange-300 transition-colors" />
                      {tool.title}
                    </span>
                    <span className="w-3 h-3 text-slate-500 group-hover:text-orange-400 transition-colors">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}></span>
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="glass-card p-6">
        <h3 className="font-bold text-slate-200 mb-4">Funzioni AI</h3>
        <p className="text-sm text-slate-400 mb-4">
          Gli strumenti con AI usano <span className="font-medium text-slate-200">polza.ai</span>. Il modello è scelto per ogni singolo tool per la massima precisione.
        </p>
        <div className="flex flex-wrap gap-2">
          {['equazioni-1grado', 'chimica', 'analisi-grammaticale'].map((id) => {
            const tool = TOOLS.find((t) => t.id === id);
            return (
              <span key={id} className="px-2.5 py-1 rounded-md bg-white/5 text-xs text-orange-300 border border-orange-500/30">
                🤖 {tool.title}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
