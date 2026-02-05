
import React, { useState, useEffect } from 'react';
import { 
  Calculator, FileText, CheckSquare, Image as ImageIcon, ExternalLink, 
  RefreshCcw, TrendingUp, ShieldAlert, Clock, BarChart3, Target, 
  Search, AlertTriangle, Layers, Zap, Info, ShieldCheck, Timer, Gauge, LineChart, Activity, ShieldX
} from 'lucide-react';

/** 
 * UI COMPONENTS 
 */

const ToolCard = ({ title, icon: Icon, children, color = "orange" }: { title: string, icon: any, children?: React.ReactNode, color?: string }) => {
  const colorMap: any = {
    orange: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    red: "text-red-500 bg-red-500/10 border-red-500/20",
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    zinc: "text-zinc-500 bg-zinc-800/50 border-zinc-700"
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex flex-col h-full">
      <div className={`p-4 border-b border-zinc-800 flex items-center justify-between ${colorMap[color]}`}>
        <h3 className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
          <Icon size={14} /> {title}
        </h3>
      </div>
      <div className="p-6 space-y-4 flex-1">
        {children}
      </div>
    </div>
  );
};

const InputGroup = ({ label, value, onChange, step = "1", type = "number", suffix = "" }: any) => (
  <div className="space-y-1">
    <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest">{label} {suffix && `(${suffix})`}</label>
    <input 
      type={type} 
      step={step}
      value={value} 
      onChange={e => onChange(e.target.value)}
      className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 focus:border-orange-500 outline-none mono text-xs text-white" 
    />
  </div>
);

/**
 * LIVE MARKET DATA FEED
 */

const MarketReference = () => {
  const [data, setData] = useState({
    futuresPrice: '0.00',
    markPrice: '0.00',
    spotPrice: '0.00',
    fundingRate: 0,
    loading: true,
    error: false
  });

  const fetchData = async () => {
    try {
      // Use official Binance public endpoints
      const [futuresRes, premiumRes, spotRes] = await Promise.all([
        fetch('https://fapi.binance.com/fapi/v1/ticker/price?symbol=BTCUSDT'),
        fetch('https://fapi.binance.com/fapi/v1/premiumIndex?symbol=BTCUSDT'),
        fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
      ]);

      const futures = await futuresRes.json();
      const premium = await premiumRes.json();
      const spot = await spotRes.json();

      setData({
        futuresPrice: parseFloat(futures.price).toFixed(2),
        markPrice: parseFloat(premium.markPrice).toFixed(2),
        spotPrice: parseFloat(spot.price).toFixed(2),
        fundingRate: parseFloat(premium.lastFundingRate),
        loading: false,
        error: false
      });
    } catch (err) {
      console.error('Market data fetch error:', err);
      setData(prev => ({ ...prev, error: true, loading: false }));
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // 10s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const fundingPct = (data.fundingRate * 100);
  // Logic: Funding extremes trigger NO-TRADE (> 0.05% or < -0.05%)
  const isFundingExtreme = Math.abs(fundingPct) > 0.05;
  const tradeStatus = isFundingExtreme ? '⚠ NO-TRADE (EXTREME SENTIMENT)' : 'NORMAL (PROTOCOL PERMITTED)';

  return (
    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <Activity size={14} className="text-orange-500" /> Market Reference Node
          </h3>
          <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-tight">Instrument: BTCUSDT Perpetual | Source: Binance API</p>
        </div>
        <div className={`px-4 py-2 border rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isFundingExtreme ? 'bg-red-500 text-black border-red-600' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'}`}>
          {isFundingExtreme ? <ShieldX size={14} /> : <ShieldCheck size={14} />}
          Protocol Status: {tradeStatus}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Perpetual Mark Price (PRIMARY) */}
        <div className="p-5 bg-black/40 border border-orange-500/30 rounded-lg space-y-1 group hover:border-orange-500 transition-all">
          <div className="text-[9px] font-black uppercase text-orange-500 tracking-widest flex items-center justify-between">
            Perpetual (Primary) <span>Mark Price</span>
          </div>
          <div className="text-3xl font-black text-white mono tracking-tighter">
            {data.loading ? '---.--' : `$${data.markPrice}`}
          </div>
          <div className="text-[8px] text-zinc-600 uppercase font-bold">Protocol Validation Reference</div>
        </div>

        {/* 2. Perpetual Last Price */}
        <div className="p-5 bg-zinc-800/30 border border-zinc-800 rounded-lg space-y-1">
          <div className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Perpetual Last</div>
          <div className="text-2xl font-black text-white mono tracking-tighter">
            {data.loading ? '---.--' : `$${data.futuresPrice}`}
          </div>
          <div className="text-[8px] text-zinc-600 uppercase font-bold">Execution Context</div>
        </div>

        {/* 3. Spot Price (Context Only) */}
        <div className="p-5 bg-zinc-800/20 border border-zinc-800 rounded-lg space-y-1">
          <div className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Spot (Context Only)</div>
          <div className="text-xl font-black text-zinc-500 mono tracking-tighter">
            {data.loading ? '---.--' : `$${data.spotPrice}`}
          </div>
          <div className="text-[8px] text-zinc-700 uppercase font-bold">Reference Only</div>
        </div>

        {/* 4. Funding Rate (Context Warning) */}
        <div className={`p-5 border rounded-lg space-y-1 ${isFundingExtreme ? 'bg-red-500/10 border-red-500/30' : 'bg-zinc-800/20 border-zinc-800'}`}>
          <div className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Funding Rate</div>
          <div className={`text-xl font-black mono tracking-tighter ${isFundingExtreme ? 'text-red-500' : 'text-zinc-400'}`}>
            {data.loading ? '--.----' : `${fundingPct.toFixed(4)}%`}
          </div>
          <div className="text-[8px] text-zinc-600 uppercase font-bold">Sentiment Marker</div>
        </div>
      </div>

      {data.error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded text-[10px] text-red-500 font-bold uppercase tracking-widest">
          <AlertTriangle size={14} /> Data Feed Interrupted. Protocol requires secondary chart verification.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a 
          href="https://www.binance.com/en/futures/BTCUSDT" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center justify-between p-4 bg-zinc-800/50 border border-zinc-700 rounded hover:border-orange-500 transition-all group"
        >
          <div className="space-y-1">
            <div className="text-[10px] font-black text-zinc-300 uppercase tracking-widest group-hover:text-orange-500 transition-colors">USDT-M Futures Terminal</div>
            <div className="text-[8px] text-zinc-600 uppercase">Primary Execution Engine</div>
          </div>
          <ExternalLink size={14} className="text-zinc-700 group-hover:text-orange-500 transition-colors" />
        </a>
        <a 
          href="https://www.binance.com/en/trade/BTC_USDT" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center justify-between p-4 bg-zinc-800/50 border border-zinc-700 rounded hover:border-zinc-500 transition-all group"
        >
          <div className="space-y-1">
            <div className="text-[10px] font-black text-zinc-300 uppercase tracking-widest group-hover:text-white transition-colors">Exchange Spot Market</div>
            <div className="text-[8px] text-zinc-600 uppercase">Liquidity Profile Context</div>
          </div>
          <ExternalLink size={14} className="text-zinc-700 group-hover:text-white transition-colors" />
        </a>
      </div>

      <div className="pt-6 border-t border-zinc-800 flex flex-wrap gap-x-8 gap-y-3">
        {[
          "FUTURES EXECUTION > SPOT",
          "PRICE ≠ SIGNALS",
          "BTC ONLY PROTOCOL",
          "NO TRADING ON EXTREME FUNDING",
          "INDICATORS ARE CONTEXT ONLY"
        ].map(rule => (
          <div key={rule} className="flex items-center gap-2 text-[9px] font-black text-zinc-700 uppercase tracking-tighter">
            <div className="w-1 h-1 bg-orange-500/30 rounded-full" /> {rule}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * TACTICAL TOOLS
 */

const RMultipleCalculator = () => {
  const [balance, setBalance] = useState(10000);
  const [riskPct, setRiskPct] = useState(1);
  const [entry, setEntry] = useState(65000);
  const [stop, setStop] = useState(64500);

  const riskAmount = (balance * riskPct) / 100;
  const stopDist = Math.abs(entry - stop);
  const posSize = stopDist > 0 ? riskAmount / stopDist : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <InputGroup label="Account size" value={balance} onChange={setBalance} suffix="USDT" />
        <InputGroup label="Risk per trade" value={riskPct} onChange={setRiskPct} step="0.1" suffix="%" />
        <InputGroup label="Entry price" value={entry} onChange={setEntry} />
        <InputGroup label="Stop-loss price" value={stop} onChange={setStop} />
      </div>
      <div className="pt-4 border-t border-zinc-800 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] uppercase text-zinc-500 font-bold">Risk per trade (1R)</span>
          <span className="text-xl font-black text-white mono">${riskAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] uppercase text-zinc-500 font-bold">Position size</span>
          <span className="text-xl font-black text-orange-500 mono">{posSize.toFixed(4)} BTC</span>
        </div>
        <div className="p-2 bg-red-500/10 border border-red-500/20 rounded text-center">
          <span className="text-[9px] text-red-500 font-bold uppercase">MAX LOSS = -1.00R ONLY</span>
        </div>
      </div>
    </div>
  );
};

const RRValidator = () => {
  const [entry, setEntry] = useState(65000);
  const [stop, setStop] = useState(64500);
  const [target, setTarget] = useState(66000);

  const stopDist = Math.abs(entry - stop);
  const targetDist = Math.abs(target - entry);
  const rr = stopDist > 0 ? targetDist / stopDist : 0;
  const isPass = rr >= 1.5;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        <InputGroup label="Entry" value={entry} onChange={setEntry} />
        <InputGroup label="Stop" value={stop} onChange={setStop} />
        <InputGroup label="Target" value={target} onChange={setTarget} />
      </div>
      <div className={`p-4 rounded border text-center transition-all ${isPass ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
        <div className="text-[9px] uppercase text-zinc-500 mb-1">Risk:Reward Ratio</div>
        <div className={`text-2xl font-black mono ${isPass ? 'text-emerald-500' : 'text-red-500'}`}>{rr.toFixed(2)}R</div>
        <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isPass ? 'text-emerald-500' : 'text-red-500'}`}>
          {isPass ? 'VALID: ASYMMETRIC' : 'FAIL: POOR QUALITY'}
        </div>
      </div>
    </div>
  );
};

const ATRStopValidation = () => {
  const [stopDist, setStopDist] = useState(300);
  const [atr, setAtr] = useState(200);
  
  const ratio = stopDist / atr;
  const isSafe = ratio >= 1.5;

  return (
    <div className="space-y-4">
      <InputGroup label="Stop Distance ($)" value={stopDist} onChange={setStopDist} />
      <InputGroup label="Current ATR (1H)" value={atr} onChange={setAtr} />
      <div className={`p-4 border rounded text-center ${isSafe ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
         <div className="text-[9px] uppercase text-zinc-500 mb-1">Stop vs Volatility</div>
         <div className={`font-bold mono ${isSafe ? 'text-emerald-500' : 'text-red-500'}`}>
           {isSafe ? 'REALISTIC STOP' : 'NOISE RISK'} ({ratio.toFixed(1)}x ATR)
         </div>
      </div>
    </div>
  );
};

/**
 * STRATEGIC TOOLS
 */

const SessionFilter = () => {
  const [pktTime, setPktTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setPktTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hour = parseInt(pktTime.toLocaleTimeString('en-GB', { timeZone: 'Asia/Karachi', hour: '2-digit', hour12: false }));
  const isActive = hour >= 17 && hour < 21;
  
  return (
    <div className="space-y-4">
      <div className={`p-6 border rounded flex flex-col items-center justify-center space-y-2 ${isActive ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-800/30 border-zinc-800'}`}>
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">PKT Session Time</div>
        <div className="text-3xl font-black mono text-white">
          {pktTime.toLocaleTimeString('en-GB', { timeZone: 'Asia/Karachi', hour12: false })}
        </div>
        <div className={`px-4 py-1 rounded text-[10px] font-black uppercase tracking-widest ${isActive ? 'bg-emerald-500 text-black' : 'bg-zinc-700 text-zinc-400'}`}>
          Trade Allowed: {isActive ? 'YES' : 'NO'}
        </div>
      </div>
    </div>
  );
};

const MarketClassifier = () => {
  const [high, setHigh] = useState('HH');
  const [low, setLow] = useState('HL');
  
  const getBias = () => {
    if (high === 'HH' && low === 'HL') return { t: 'BULLISH TREND', c: 'text-emerald-500' };
    if (high === 'LH' && low === 'LL') return { t: 'BEARISH TREND', c: 'text-red-500' };
    return { t: 'RANGING', c: 'text-orange-500' };
  };
  const bias = getBias();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <select value={high} onChange={e => setHigh(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded p-2 text-xs mono text-white outline-none">
          <option value="HH">HH</option>
          <option value="LH">LH</option>
        </select>
        <select value={low} onChange={e => setLow(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded p-2 text-xs mono text-white outline-none">
          <option value="HL">HL</option>
          <option value="LL">LL</option>
        </select>
      </div>
      <div className="p-4 bg-black/40 border border-zinc-800 rounded text-center">
        <div className="text-[9px] uppercase text-zinc-600 mb-1">State Classification</div>
        <div className={`font-black uppercase tracking-tighter ${bias.c}`}>{bias.t}</div>
      </div>
    </div>
  );
};

/**
 * AUDIT TOOLS
 */

const DisciplineTracker = () => {
  const [checks, setChecks] = useState({ session: false, stop: false, size: false, journal: false });
  const score = (Object.values(checks).filter(Boolean).length / 4) * 100;

  return (
    <div className="space-y-3">
      {Object.keys(checks).map((k) => (
        <label key={k} className="flex items-center gap-3 p-2 bg-zinc-800/30 rounded cursor-pointer">
          <input type="checkbox" checked={(checks as any)[k]} onChange={() => setChecks({...checks, [k]: !(checks as any)[k]})} className="accent-orange-500" />
          <span className="text-[10px] uppercase font-bold text-zinc-400">{k}</span>
        </label>
      ))}
      <div className="pt-4 text-center border-t border-zinc-800">
        <div className="text-[10px] text-zinc-500 uppercase">Score</div>
        <div className="text-3xl font-black text-orange-500 mono">{score}%</div>
      </div>
    </div>
  );
};

const PerformanceAudit = () => {
  const [winRate, setWinRate] = useState(40);
  const [avgWin, setAvgWin] = useState(2.5);
  const expectancy = (winRate/100 * avgWin) - ((1 - winRate/100) * 1);

  return (
    <div className="space-y-4">
      <InputGroup label="Win Rate (%)" value={winRate} onChange={setWinRate} />
      <InputGroup label="Avg Win (R)" value={avgWin} onChange={setAvgWin} step="0.1" />
      <div className={`p-4 rounded border text-center ${expectancy >= 0.2 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
        <div className="text-[9px] uppercase text-zinc-500">Expectancy</div>
        <div className={`text-2xl font-black mono ${expectancy >= 0.2 ? 'text-emerald-500' : 'text-orange-500'}`}>{expectancy.toFixed(2)}R</div>
        <div className="text-[8px] uppercase font-bold text-zinc-600 mt-1">
          {expectancy >= 0.2 ? 'SCALING READY' : 'ACCUMULATE DATA'}
        </div>
      </div>
    </div>
  );
};

const Resources = () => {
  const [activeTab, setActiveTab] = useState('strategic'); // Default to strategic to show live feed

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <header className="space-y-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter">War Room Tools</h1>
        <p className="text-zinc-500">Protocol enforcement suite for high-precision BTCUSDT execution.</p>
      </header>

      {/* Navigation */}
      <div className="flex border-b border-zinc-800 gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {['tactical', 'strategic', 'audit'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-orange-500' : 'text-zinc-600 hover:text-white'}`}
          >
            {tab} Tools
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500" />}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'tactical' && (
          <>
            <ToolCard title="R-Multiple Risk Calculator" icon={Calculator} color="orange">
              <RMultipleCalculator />
            </ToolCard>
            <ToolCard title="R:R Validation Tool" icon={Target} color="emerald">
              <RRValidator />
            </ToolCard>
            <ToolCard title="ATR Stop Validation" icon={Zap} color="zinc">
              <ATRStopValidation />
            </ToolCard>
            <ToolCard title="Liquidity Sweep Validator" icon={Search} color="blue">
               <div className="space-y-3">
                  {["High/Low Swept?", "Rejection Wick?", "Volume Spike?"].map(q => (
                    <label key={q} className="flex gap-2 items-center text-[10px] text-zinc-400 uppercase font-bold">
                      <input type="checkbox" className="accent-blue-500" /> {q}
                    </label>
                  ))}
                  <div className="p-3 bg-blue-500/10 text-blue-500 text-center font-bold text-[10px] uppercase">Quality: UNKNOWN</div>
               </div>
            </ToolCard>
          </>
        )}

        {activeTab === 'strategic' && (
          <>
            <div className="lg:col-span-3">
              <MarketReference />
            </div>
            <ToolCard title="Session Filter" icon={Timer} color="emerald">
              <SessionFilter />
            </ToolCard>
            <ToolCard title="Market Classifier" icon={Layers} color="zinc">
              <MarketClassifier />
            </ToolCard>
            <ToolCard title="News & Event Filter" icon={AlertTriangle} color="red">
               <div className="space-y-3">
                  {["High Impact News?", "CPI / FOMC?", "Post-Halving?"].map(q => (
                    <label key={q} className="flex gap-2 items-center text-[10px] text-zinc-400 uppercase font-bold">
                      <input type="checkbox" className="accent-red-500" /> {q}
                    </label>
                  ))}
                  <div className="p-3 bg-red-500 text-black text-center font-black text-[10px] uppercase">STATUS: MONITORING</div>
               </div>
            </ToolCard>
          </>
        )}

        {activeTab === 'audit' && (
          <>
            <ToolCard title="Discipline Score Tracker" icon={ShieldCheck} color="emerald">
              <DisciplineTracker />
            </ToolCard>
            <ToolCard title="Expectancy Calculator" icon={TrendingUp} color="zinc">
              <PerformanceAudit />
            </ToolCard>
            <ToolCard title="Drawdown Severity" icon={BarChart3} color="red">
               <div className="space-y-4">
                  <InputGroup label="Peak Equity (R)" value={50} onChange={() => {}} />
                  <InputGroup label="Current Equity (R)" value={45} onChange={() => {}} />
                  <div className="p-3 bg-red-500/10 text-red-500 text-center font-bold text-[10px] uppercase">
                    Drawdown: 5.0R (NORMAL)
                  </div>
               </div>
            </ToolCard>
          </>
        )}
      </div>

      <section className="pt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
            <FileText size={20} className="text-orange-500" /> Documentation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ResourceLink title="Journal Template" icon={FileText} />
            <ResourceLink title="Pre-Session Checklist" icon={CheckSquare} />
            <ResourceLink title="Screenshot Standards" icon={ImageIcon} />
            <ResourceLink title="Liquidity Wick Guide" icon={RefreshCcw} />
          </div>
        </div>
        <div className="p-8 border border-zinc-800 bg-zinc-900/30 rounded-xl space-y-4">
          <h3 className="font-bold uppercase tracking-widest text-xs text-orange-500 flex items-center gap-2">
            <Info size={14} /> The "No-Cheat" Protocol
          </h3>
          <p className="text-zinc-500 text-xs leading-relaxed">
            Using these tools is not a suggestion. Professionalism is measured by consistency in preparation. 
            If you take a trade without running the appropriate filters, you are gambling.
          </p>
        </div>
      </section>
    </div>
  );
};

const ResourceLink = ({ title, icon: Icon }: { title: string, icon: any }) => (
  <button className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded hover:border-zinc-500 hover:bg-zinc-800 transition-all group text-left">
    <div className="flex items-center gap-3">
      <Icon size={16} className="text-zinc-500 group-hover:text-orange-500 transition-colors" />
      <span className="text-[10px] uppercase font-bold text-zinc-400 group-hover:text-white transition-colors">{title}</span>
    </div>
    <ExternalLink size={12} className="text-zinc-700" />
  </button>
);

export default Resources;
