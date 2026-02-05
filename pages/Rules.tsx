
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert as AlertIcon, Check as CheckIcon, ChevronRight } from 'lucide-react';

const Rules = () => {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState({
    market: false,
    session: false,
    risk: false,
    setup: false,
    discipline: false
  });

  const allAccepted = Object.values(accepted).every(v => v);

  const toggle = (key: keyof typeof accepted) => {
    setAccepted(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-4 text-center">
        <h1 className="text-5xl font-black uppercase tracking-tighter">Non-Negotiable Rules</h1>
        <p className="text-zinc-500 text-lg">Accept the protocol to proceed into the training environment.</p>
      </header>

      <div className="space-y-6">
        <RuleItem 
          id="market" 
          title="1. BTCUSDT PERPETUAL ONLY" 
          desc="You will not trade ETH, Sol, or Forex. You will focus exclusively on Bitcoin's liquidity flow."
          checked={accepted.market}
          onToggle={() => toggle('market')}
        />
        <RuleItem 
          id="session" 
          title="2. LONDON-NY OVERLAP (5-9 PM PKT)" 
          desc="Trading outside these hours is strictly forbidden. Boredom outside the session is your protection."
          checked={accepted.session}
          onToggle={() => toggle('session')}
        />
        <RuleItem 
          id="risk" 
          title="3. RISK EXPRESSED IN R ONLY" 
          desc="Money is an outcome, not a decision metric. You will never discuss trades in dollars, only R-multiples."
          checked={accepted.risk}
          onToggle={() => toggle('risk')}
        />
        <RuleItem 
          id="setup" 
          title="4. ONE SINGLE SETUP" 
          desc="Mastery requires repetition. You will use one strategy until it becomes mechanical."
          checked={accepted.setup}
          onToggle={() => toggle('setup')}
        />
        <RuleItem 
          id="discipline" 
          title="5. SURVIVAL OVER PROFITS" 
          desc="Your first goal is not to win, but to be able to trade tomorrow. Protecting capital is the primary directive."
          checked={accepted.discipline}
          onToggle={() => toggle('discipline')}
        />
      </div>

      <div className={`p-8 border-2 transition-all duration-500 rounded-lg text-center ${allAccepted ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900/30 opacity-50'}`}>
        {allAccepted ? (
          <div className="space-y-6">
            <p className="text-xl font-bold text-emerald-500 italic">"I acknowledge that my success depends solely on my adherence to these rules."</p>
            <button 
              onClick={() => navigate('/course')}
              className="px-12 py-4 bg-emerald-500 text-black font-black uppercase tracking-widest hover:bg-white transition-all rounded inline-flex items-center gap-2"
            >
              Enter Academy <ChevronRight size={20} />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <AlertIcon className="mx-auto text-zinc-500" size={32} />
            <p className="text-zinc-500 font-medium uppercase tracking-widest text-sm">Accept all rules to unlock training</p>
          </div>
        )}
      </div>
    </div>
  );
};

const RuleItem = ({ id, title, desc, checked, onToggle }: { id: string, title: string, desc: string, checked: boolean, onToggle: () => void }) => (
  <div 
    onClick={onToggle}
    className={`p-6 border rounded-lg cursor-pointer transition-all flex items-start gap-6 group ${checked ? 'border-orange-500/50 bg-orange-500/5' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'}`}
  >
    <div className={`mt-1 shrink-0 w-6 h-6 rounded border flex items-center justify-center transition-all ${checked ? 'bg-orange-500 border-orange-500' : 'border-zinc-600 group-hover:border-zinc-400'}`}>
      {checked && <CheckIcon size={14} className="text-black font-bold" />}
    </div>
    <div className="space-y-1">
      <h3 className={`font-bold uppercase tracking-tight text-lg ${checked ? 'text-white' : 'text-zinc-400'}`}>{title}</h3>
      <p className="text-zinc-500 leading-relaxed text-sm">{desc}</p>
    </div>
  </div>
);

export default Rules;
