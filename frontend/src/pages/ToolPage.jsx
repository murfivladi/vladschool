import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import { TOOLS, AI_MODELS } from '../data/tools';

export default function ToolPage({ toolId, onBack, user }) {
  const tool = TOOLS.find((t) => t.id === toolId);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const outputRef = useRef(null);

  const hasAI = !!AI_MODELS[toolId];

  const runAI = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: toolId, message: input }),
      });
      const data = await res.json();
      if (data.ok) {
        setResult({ model: data.model, text: data.text });
      } else {
        setResult({ error: data.error || 'Errore AI' });
      }
    } catch (e) {
      setResult({ error: 'Impossibile contattare il server AI' });
    } finally {
      setLoading(false);
    }
  };

  if (!tool) return <div className="p-8 text-center">Strumento non trovato</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => onBack()} className="p-2 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-bold text-lg text-slate-100">{tool.title}</h2>
          <p className="text-xs text-slate-400">{tool.description}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Input */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-panel p-5">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Inserisci qui</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={tool.description}
              className="input-glass h-48 resize-none"
              rows={6}
            />
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-slate-500">{input.length} caratteri</span>
              <button
                onClick={runAI}
                disabled={loading || !input.trim() || !hasAI}
                className="ml-auto btn-orange disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Elaborazione…' : hasAI ? 'Chiedi all\'AI' : 'Strumento in arrivo'}
              </button>
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-4 space-y-4">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-panel p-5 ${result.error ? 'border-rose-500/30' : 'border-emerald-500/30'}`}
            >
              {result.error ? (
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-400 mt-0.5" />
                  <span className="text-sm text-rose-200">{result.error}</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-emerald-400 uppercase">Risposta</span>
                    <span className="text-[10px] text-emerald-500/70">{result.model}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(result.text);
                        window.showVladToast?.('Copiato negli appunti', 'success');
                      }}
                      className="p-1.5 hover:bg-white/10 rounded"
                    >
                      <Copy className="w-4 h-4 text-emerald-400" />
                    </button>
                  </div>
                  <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap" ref={outputRef}>
                    {result.text}
                  </div>
                </>
              )}
            </motion.div>
          )}
          <div className="glass-panel p-4 text-xs text-slate-400">
            💡 Questo strumento è{" "}
            <span className={hasAI ? 'text-orange-300 font-medium' : 'text-slate-500'}>
              {hasAI ? 'dotato di AI (polza.ai)' : 'in arrivo nella v1'}
            </span>.
          </div>
        </div>
      </div>
    </div>
  );
}
