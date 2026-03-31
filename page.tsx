"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Brain, CheckCircle2, AlertCircle, Rocket } from 'lucide-react';

export default function App() {
  const [data, setData] = useState([]);
  const [idx, setIdx] = useState(0);
  const [ans, setAns] = useState("");
  const [res, setRes] = useState(null);

  useEffect(() => {
    fetch('/api/exercises').then(r => r.json()).then(setData);
  }, []);

  const handleCheck = async () => {
    const r = await fetch('/api/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: data[idx].id, answer: ans })
    });
    setRes(await r.json());
  };

  if (!data.length) return <div className="bg-black min-h-screen text-green-500 flex items-center justify-center font-mono">INITIALIZING SYSTEM...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-mono p-4 md:p-10 selection:bg-cyan-500/30">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex justify-between items-center border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 border border-cyan-500/20">
              <Brain size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">Linguist_OS</h1>
              <p className="text-[10px] text-cyan-500/60 font-bold uppercase tracking-[0.2em]">Neural Language Processing</p>
            </div>
          </div>
          <div className="text-[10px] text-gray-500 text-right">
            STATUS: <span className="text-green-500">ENCRYPTED</span><br/>
            USER: <span className="text-white">DEVELOPER_MODE</span>
          </div>
        </header>

        {/* Main Console */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
          className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Terminal size={120} /></div>
          
          <div className="relative z-10">
            <span className="text-xs font-bold text-cyan-500 bg-cyan-500/5 px-3 py-1 rounded-full border border-cyan-500/10 uppercase mb-6 inline-block">
              {data[idx].category}
            </span>
            
            <h2 className="text-2xl md:text-3xl font-medium text-white mb-8 leading-relaxed">
              {data[idx].question}
            </h2>

            <div className="grid grid-cols-1 gap-4 mb-8">
              <input 
                value={ans} onChange={e => setAns(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full bg-black border-2 border-white/5 p-5 rounded-xl outline-none focus:border-cyan-500/50 transition-all text-white placeholder:text-gray-700"
              />
            </div>

            <button onClick={handleCheck} className="w-full bg-white text-black font-black py-5 rounded-xl hover:bg-cyan-400 transition-all uppercase flex items-center justify-center gap-2 group">
              Verify Syntax <Rocket size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Feedback Section */}
        <AnimatePresence>
          {res && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-2xl border flex gap-4 ${res.status === 'success' ? 'bg-green-500/5 border-green-500/20 text-green-400' : 'bg-red-500/5 border-red-500/20 text-red-400'}`}>
              {res.status === 'success' ? <CheckCircle2 className="shrink-0" /> : <AlertCircle className="shrink-0" />}
              <div>
                <p className="font-bold text-lg mb-1">{res.status === 'success' ? 'ACCESS GRANTED' : 'SYNTAX ERROR'}</p>
                <p className="text-sm opacity-80">{res.msg} {res.hint && <span className="block mt-2 text-white italic underline underline-offset-4">{res.hint}</span>}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}