
import React from 'react';
import { AlertCircle, ShieldOff } from 'lucide-react';

const Disclaimer = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <header className="space-y-4 text-center">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
          <ShieldOff size={32} />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter">High-Risk Disclosure</h1>
        <p className="text-zinc-500">Read this before you proceed with any live capital.</p>
      </header>

      <div className="space-y-8 p-8 bg-zinc-900 border border-zinc-800 rounded-xl">
        <section className="space-y-3">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" /> Educational Purposes Only
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            The content provided on this website, within the courses, and via any communication channels associated with Sovereign BTC is strictly for educational and informational purposes. Nothing here constitutes financial, investment, or legal advice.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm">Trading Risk</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Trading cryptocurrencies, particularly with leverage (perpetual contracts), carries a high level of risk and may not be suitable for all investors. The possibility exists that you could sustain a loss of some or all of your initial investment. Therefore, you should not invest money that you cannot afford to lose.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm">Performance Disclaimer</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Past performance is not indicative of future results. Any trade examples or "R-multiple" scenarios are hypothetical and for illustrative purposes. No representation is being made that any account will or is likely to achieve profits or losses similar to those discussed.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm">User Responsibility</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            You are solely responsible for your own trading decisions. Sovereign BTC and its authors are not responsible for any losses incurred. We do not provide "signals" or trade management.
          </p>
        </section>
      </div>

      <div className="text-center">
         <p className="text-zinc-600 italic text-sm">By using this site, you acknowledge and agree to the terms above.</p>
      </div>
    </div>
  );
};

export default Disclaimer;
