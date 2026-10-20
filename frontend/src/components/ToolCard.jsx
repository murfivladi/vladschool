import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function ToolCard({ tool, onSelect }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer"
      onClick={() => onSelect(tool.id)}
    >
      <div className="glass-card p-5">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-orange-500/20 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
          <tool.icon className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-200 text-sm mb-1">{tool.title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{tool.description}</p>
        <div className="mt-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-bold text-orange-300 uppercase tracking-wider">Apri</span>
          <ArrowRight className="w-3 h-3 text-orange-400" />
        </div>
      </div>
    </motion.div>
  );
}
