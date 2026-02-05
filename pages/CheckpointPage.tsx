
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CHECKPOINTS, BUNDLES } from '../data/courseContent';
import { ArrowLeft, CheckCircle2, ShieldAlert, Lock, AlertTriangle } from 'lucide-react';

const CheckpointPage = () => {
  const { level } = useParams();
  const navigate = useNavigate();
  const bundle = BUNDLES.find(b => b.id === level);
  const requirements = CHECKPOINTS[level as keyof typeof CHECKPOINTS] || [];
  
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const allDone = requirements.every((_, i) => checked[i]);

  const toggle = (idx: number) => {
    setChecked(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (!bundle) return <div className="p-12 text-center text-zinc-500">Checkpoint not found.</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700">
      <Link to="/course" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-bold tracking-widest">
        <ArrowLeft size={16} /> Return to Roadmap
      </Link>

      <header className="space-y-4 text-center">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mx-auto">
          <ShieldAlert size={32} />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter">Verification Gate: {bundle.title}</h1>
        <p className="text-zinc-500">You are the only person you can lie to. Be honest. If you skip requirements, the market will eventually tax you for it.</p>
      </header>

      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-4 items-start">
        <AlertTriangle className="text-red-500 shrink-0 mt-1" size={20} />
        <div>
          <h4 className="text-red-500 font-bold uppercase text-xs mb-1">Warning: Hard Stop</h4>
          <p className="text-zinc-400 text-sm">If you cannot explain why a trade lost in R terms, or if you skipped journaling, DO NOT PROCEED. Close the chart and return to the modules.</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 border-b border-zinc-800 pb-2">Competency Requirements</h3>
        <div className="space-y-2">
          {requirements.map((req, i) => (
            <div 
              key={i} 
              onClick={() => toggle(i)}
              className={`p-4 border rounded cursor-pointer transition-all flex items-center gap-4 ${checked[i] ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-zinc-800 bg-zinc-900/50'}`}
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${checked[i] ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-700'}`}>
                {checked[i] && <CheckCircle2 size={12} className="text-black" />}
              </div>
              <span className={`text-sm font-medium ${checked[i] ? 'text-zinc-200' : 'text-zinc-500'}`}>{req}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pt-8">
        {allDone ? (
          <div className="space-y-4">
            <p className="text-emerald-500 font-bold italic tracking-wide">"Competency Confirmed. I am ready to advance."</p>
            <button 
              onClick={() => navigate('/course')}
              className="px-12 py-4 bg-emerald-500 text-black font-black uppercase tracking-widest hover:bg-white transition-all rounded inline-flex items-center gap-2"
            >
              Unlock Next Stage <Lock size={18} className="ml-2" />
            </button>
          </div>
        ) : (
          <p className="text-zinc-600 uppercase tracking-widest text-[10px] font-bold">Incomplete Verification</p>
        )}
      </div>
    </div>
  );
};

export default CheckpointPage;
