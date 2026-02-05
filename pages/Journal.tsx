
import React, { useState, useEffect } from 'react';
import { 
  Plus, History, BarChart3, Target, Calendar, Clock, 
  Trash2, AlertTriangle, ChevronDown, CheckCircle2, 
  TrendingUp, TrendingDown, Info, ShieldAlert, Save
} from 'lucide-react';

interface Trade {
  id: string;
  date: string;
  entryPrice: number;
  exitPrice: number;
  rMultiple: number;
  session: 'London' | 'NY' | 'Overlap' | 'Other';
  direction: 'Long' | 'Short';
  notes: string;
}

const Journal = ({ user }: { user: any }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newTrade, setNewTrade] = useState<Partial<Trade>>({
    date: new Date().toISOString().split('T')[0],
    session: 'London',
    direction: 'Long',
    rMultiple: -1, // Default risk
    notes: ''
  });

  const storageKey = `sovereign_journal_${user?.email}`;

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(storageKey);
      if (saved) setTrades(JSON.parse(saved));
    }
  }, [user, storageKey]);

  const saveTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const trade: Trade = {
      ...newTrade as Trade,
      id: Date.now().toString(),
    };
    const updated = [trade, ...trades];
    setTrades(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setShowForm(false);
    setNewTrade({
      date: new Date().toISOString().split('T')[0],
      session: 'London',
      direction: 'Long',
      rMultiple: -1,
      notes: ''
    });
  };

  const deleteTrade = (id: string) => {
    if (window.confirm('Purge this execution record from the ledger?')) {
      const updated = trades.filter(t => t.id !== id);
      setTrades(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
  };

  const stats = {
    totalR: trades.reduce((acc, t) => acc + t.rMultiple, 0),
    winRate: trades.length ? Math.round((trades.filter(t => t.rMultiple > 0).length / trades.length) * 100) : 0,
    count: trades.length,
    avgR: trades.length ? (trades.reduce((acc, t) => acc + t.rMultiple, 0) / trades.length).toFixed(2) : 0
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-6">
        <ShieldAlert size={48} className="mx-auto text-orange-500" />
        <h2 className="text-2xl font-black uppercase">Authentication Required</h2>
        <p className="text-zinc-500">The Tactical Journal is a private environment for registered executioners.</p>
        <button onClick={() => window.location.href = '#/auth'} className="px-8 py-3 bg-orange-500 text-black font-black uppercase tracking-widest rounded-lg">Access Terminal</button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em] mono">
            <History size={12} /> Personal Execution Ledger
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Tactical <span className="text-orange-500">Journal</span></h1>
        </div>
        
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-8 py-3 bg-orange-500 text-black font-black uppercase tracking-widest text-xs rounded-lg hover:bg-white transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
        >
          {showForm ? <ChevronDown size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancel Entry' : 'Log New Execution'}
        </button>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Accumulation" value={`${stats.totalR.toFixed(1)}R`} icon={BarChart3} color={stats.totalR >= 0 ? 'emerald' : 'red'} />
        <StatCard label="Strike Rate" value={`${stats.winRate}%`} icon={Target} color="orange" />
        <StatCard label="Execution Volume" value={stats.count} icon={Calendar} color="zinc" />
        <StatCard label="Avg Expectancy" value={`${stats.avgR}R`} icon={TrendingUp} color="blue" />
      </div>

      {showForm && (
        <div className="p-8 bg-zinc-900 border border-orange-500/30 rounded-2xl shadow-2xl animate-in slide-in-from-top-4 duration-500">
          <form onSubmit={saveTrade} className="space-y-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-orange-500 border-b border-zinc-800 pb-4 flex items-center gap-2">
              <Plus size={16} /> New Trade Data
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Trade Date</label>
                <input 
                  type="date" 
                  required
                  value={newTrade.date}
                  onChange={e => setNewTrade({...newTrade, date: e.target.value})}
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg py-2.5 px-4 text-white mono text-xs focus:border-orange-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Session context</label>
                <select 
                  value={newTrade.session}
                  onChange={e => setNewTrade({...newTrade, session: e.target.value as any})}
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg py-2.5 px-4 text-white mono text-xs focus:border-orange-500 outline-none"
                >
                  <option value="London">London (5-7 PM PKT)</option>
                  <option value="NY">NY Open (7-9 PM PKT)</option>
                  <option value="Overlap">London/NY Overlap</option>
                  <option value="Other">Out-of-Hours (Protocol Violation)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Direction</label>
                <select 
                  value={newTrade.direction}
                  onChange={e => setNewTrade({...newTrade, direction: e.target.value as any})}
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg py-2.5 px-4 text-white mono text-xs focus:border-orange-500 outline-none"
                >
                  <option value="Long">Long (Demand)</option>
                  <option value="Short">Short (Supply)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Entry Price ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={newTrade.entryPrice || ''}
                  onChange={e => setNewTrade({...newTrade, entryPrice: parseFloat(e.target.value)})}
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg py-2.5 px-4 text-white mono text-xs focus:border-orange-500 outline-none"
                  placeholder="65000.00"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Exit Price ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={newTrade.exitPrice || ''}
                  onChange={e => setNewTrade({...newTrade, exitPrice: parseFloat(e.target.value)})}
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg py-2.5 px-4 text-white mono text-xs focus:border-orange-500 outline-none"
                  placeholder="66000.00"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-orange-500 tracking-widest">Resulting R-Multiple</label>
                <input 
                  type="number" 
                  step="0.1"
                  required
                  value={newTrade.rMultiple}
                  onChange={e => setNewTrade({...newTrade, rMultiple: parseFloat(e.target.value)})}
                  className="w-full bg-black/50 border border-orange-500/50 rounded-lg py-2.5 px-4 text-white mono text-xs focus:border-orange-500 outline-none"
                  placeholder="-1.0"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Execution Notes (Mistakes, Logic, Psychology)</label>
              <textarea 
                value={newTrade.notes}
                onChange={e => setNewTrade({...newTrade, notes: e.target.value})}
                className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-xs focus:border-orange-500 h-24"
                placeholder="Swept 15m liquidity, entry on rejection. Felt slight hesitation..."
              />
            </div>

            <div className="flex gap-4">
              <button 
                type="submit"
                className="flex-1 py-4 bg-orange-500 text-black font-black uppercase tracking-widest text-[10px] rounded-lg hover:bg-white transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2"
              >
                <Save size={16} /> Save to Journal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Trade List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <History size={20} className="text-zinc-500" /> Recent Execution Ledger
          </h2>
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{stats.count} Records Found</span>
        </div>

        {trades.length === 0 ? (
          <div className="p-20 text-center border-2 border-dashed border-zinc-800 rounded-2xl">
            <AlertTriangle size={40} className="mx-auto text-zinc-800 mb-4" />
            <p className="text-zinc-600 uppercase font-black tracking-widest text-xs">No Executions Recorded for Current User</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="py-4 px-4 text-[9px] font-black uppercase text-zinc-600 tracking-widest">Date / Session</th>
                  <th className="py-4 px-4 text-[9px] font-black uppercase text-zinc-600 tracking-widest">Direction</th>
                  <th className="py-4 px-4 text-[9px] font-black uppercase text-zinc-600 tracking-widest">Entry / Exit</th>
                  <th className="py-4 px-4 text-[9px] font-black uppercase text-zinc-600 tracking-widest text-right">R-Result</th>
                  <th className="py-4 px-4 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {trades.map(trade => (
                  <tr key={trade.id} className="border-b border-zinc-900 group hover:bg-zinc-900/50 transition-colors">
                    <td className="py-5 px-4">
                       <div className="text-[11px] font-black text-white uppercase">{trade.date}</div>
                       <div className="text-[9px] text-zinc-600 uppercase font-bold tracking-tight">{trade.session} Session</div>
                    </td>
                    <td className="py-5 px-4">
                       <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${trade.direction === 'Long' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'}`}>
                         {trade.direction}
                       </span>
                    </td>
                    <td className="py-5 px-4">
                       <div className="text-[10px] font-bold text-zinc-400 mono">${trade.entryPrice.toLocaleString()} → ${trade.exitPrice.toLocaleString()}</div>
                    </td>
                    <td className="py-5 px-4 text-right">
                       <div className={`text-sm font-black mono ${trade.rMultiple > 0 ? 'text-emerald-500' : trade.rMultiple < 0 ? 'text-red-500' : 'text-zinc-500'}`}>
                         {trade.rMultiple > 0 ? '+' : ''}{trade.rMultiple}R
                       </div>
                    </td>
                    <td className="py-5 px-4 text-right">
                       <button onClick={() => deleteTrade(trade.id)} className="p-2 text-zinc-800 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 size={14} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="p-8 bg-orange-500/5 border border-orange-500/10 rounded-2xl space-y-4">
        <h4 className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center gap-2">
           <Info size={16} /> Journaling Protocol
        </h4>
        <p className="text-[11px] text-zinc-500 leading-relaxed uppercase">
          Consistency is not measured by profits, but by the integrity of your data. If you skip a journal entry, you have failed the session. Review your average R-expectancy every 20 trades to adjust your risk parameters.
        </p>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }: any) => {
  const colors: any = {
    orange: "text-orange-500 bg-orange-500/5 border-orange-500/10",
    emerald: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10",
    blue: "text-blue-500 bg-blue-500/5 border-blue-500/10",
    red: "text-red-500 bg-red-500/5 border-red-500/10",
    zinc: "text-zinc-400 bg-zinc-800/50 border-zinc-800"
  };
  return (
    <div className={`p-5 border rounded-xl flex items-center gap-4 ${colors[color]}`}>
      <div className="shrink-0 p-2 bg-black/40 rounded-lg">
        <Icon size={18} />
      </div>
      <div>
        <div className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-0.5">{label}</div>
        <div className="text-xl font-black mono text-white leading-none">{value}</div>
      </div>
    </div>
  );
};

export default Journal;
