
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LogOut, Terminal, Zap, ShieldCheck, UserCheck, GraduationCap, PlayCircle, Clock } from 'lucide-react';
import { MODULES } from '../data/courseContent';

const Home = ({ user }: { user: any }) => {
  // Logic to determine if course advertisement should be shown
  // We check hardcoded modules and local storage deployed ones
  const localModules = JSON.parse(localStorage.getItem('sovereign_deployed_modules') || '[]');
  const hasCourse = MODULES.length > 0 || localModules.length > 0;
  const totalModules = MODULES.length + localModules.length;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em] mono">
          Terminal Status: {user ? 'Active Session' : 'Standby'}
        </div>
        <h1 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase leading-tight">
          THIS IS NOT A <span className="text-orange-500">MARKETING FUNNEL.</span>
        </h1>
        <p className="text-zinc-400 text-lg lg:text-xl max-w-2xl font-light leading-relaxed">
          Sovereign BTC is a high-discipline training environment for professional BTCUSDT execution. No noise. No alts. No gambling.
        </p>
      </header>

      {/* DYNAMIC COURSE ADVERTISEMENT */}
      {hasCourse && (
        <section className="relative group animate-in slide-in-from-right duration-1000">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="relative bg-zinc-900 border border-orange-500/30 rounded-2xl p-8 lg:p-12 overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                <GraduationCap size={240} />
             </div>
             
             <div className="flex flex-col lg:flex-row gap-8 items-start justify-between relative z-10">
                <div className="space-y-6 max-w-xl">
                   <div className="flex items-center gap-3">
                      <div className="px-3 py-1 bg-orange-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full">
                        Enrollment Active
                      </div>
                      <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        <PlayCircle size={14} /> {totalModules} Modules Uploaded
                      </span>
                   </div>
                   
                   <h2 className="text-4xl font-black uppercase tracking-tighter leading-none text-white">
                      The BTC <span className="text-orange-500">Mastery</span> Track
                   </h2>
                   
                   <p className="text-zinc-400 text-sm font-medium leading-relaxed uppercase tracking-tight">
                      Master the London-NY overlap session with a strictly mechanical approach. 
                      Registration for the professional track includes your permanent <span className="text-white underline decoration-orange-500 underline-offset-4">@sovereign.btc</span> identity handle.
                   </p>

                   <div className="flex flex-wrap gap-6 pt-2">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500">
                         <Clock size={14} className="text-orange-500" /> Session: 5-9 PM PKT
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500">
                         <Zap size={14} className="text-orange-500" /> Instrument: BTCUSDT
                      </div>
                   </div>
                </div>

                <div className="flex flex-col gap-4 w-full lg:w-64">
                   <Link 
                     to={user ? "/register-course" : "/auth"} 
                     className="w-full py-4 bg-orange-500 text-black font-black uppercase tracking-widest text-[11px] rounded-xl hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20"
                   >
                     Initialize Enrollment <ArrowRight size={16} />
                   </Link>
                   <Link 
                     to="/course" 
                     className="w-full py-4 border border-zinc-800 text-white font-black uppercase tracking-widest text-[11px] rounded-xl hover:bg-zinc-800 transition-all text-center"
                   >
                     View Roadmap
                   </Link>
                </div>
             </div>
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 border border-red-500/30 bg-red-500/5 rounded-lg space-y-4">
          <div className="flex items-center gap-3 text-red-500 font-bold uppercase tracking-widest text-xs">
            <LogOut size={16} /> Leave Now If:
          </div>
          <ul className="space-y-3 text-zinc-300 text-sm font-medium">
            <li className="flex gap-2"><span>-</span> You want to "get rich quick."</li>
            <li className="flex gap-2"><span>-</span> You trade more than one pair.</li>
            <li className="flex gap-2"><span>-</span> You prioritize profit over precision.</li>
          </ul>
        </div>

        <div className="p-8 border border-emerald-500/30 bg-emerald-500/5 rounded-lg space-y-4">
          <div className="flex items-center gap-3 text-emerald-500 font-bold uppercase tracking-widest text-xs">
            <ShieldCheck size={16} /> Stay If:
          </div>
          <ul className="space-y-3 text-zinc-300 text-sm font-medium">
            <li className="flex gap-2"><span>-</span> You accept the 100-trade demo rule.</li>
            <li className="flex gap-2"><span>-</span> You commit to the 5-9 PM PKT window.</li>
            <li className="flex gap-2"><span>-</span> You treat trading as a professional craft.</li>
          </ul>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-xl space-y-8 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
          <div className="space-y-2">
            <h3 className="text-2xl font-black uppercase tracking-tight">Active Protocol</h3>
            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Foundation of the Sovereign Program.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto">
            <Stat label="Market" val="BTCUSDT" />
            <Stat label="Session" val="5-9 PM PKT" />
            <Stat label="Risk" val="R-Multiple" />
            <Stat label="Setup" val="High Prob" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 border-t border-zinc-800">
          {!user ? (
            <>
              <Link to="/auth" className="px-10 py-4 border border-zinc-800 text-white font-black uppercase tracking-widest rounded-lg hover:bg-zinc-800 text-center transition-all">
                Member Access
              </Link>
              <Link to="/rules" className="group px-10 py-4 bg-orange-500 text-black font-black uppercase tracking-widest rounded-lg transition-all hover:bg-white flex items-center justify-center gap-2">
                Protocol Rules
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </>
          ) : (
            <Link to="/register-course" className="group px-10 py-4 bg-orange-500 text-black font-black uppercase tracking-widest rounded-lg transition-all hover:bg-white flex items-center justify-center gap-2">
              Continue Enrollment
              <UserCheck size={20} />
            </Link>
          )}
        </div>
      </section>

      <footer className="text-center py-6">
        <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.4em] italic opacity-60">"The market exists to transfer capital from the undisciplined to the precise."</p>
      </footer>
    </div>
  );
};

const Stat = ({ label, val }: any) => (
  <div className="text-center p-4 border border-zinc-800 rounded bg-[#0d0d0d] hover:border-zinc-700 transition-colors">
    <div className="text-zinc-600 text-[9px] uppercase font-black mb-1 tracking-widest">{label}</div>
    <div className="font-black text-orange-500 mono text-xs">{val}</div>
  </div>
);

export default Home;
