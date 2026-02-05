
import React from 'react';
import { Mail, MessageCircle, Shield, Target, Terminal, Award, BookOpen, Fingerprint, CheckCircle2 } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-24 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        {/* Mentor Image Profile */}
        <div className="shrink-0 relative group">
          <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-2xl overflow-hidden border-2 border-zinc-800 bg-zinc-900 shadow-2xl transition-all duration-500 group-hover:border-orange-500/50 group-hover:shadow-orange-500/10">
             <img 
               src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=800&q=80" 
               alt="Muhammad Khuhro" 
               className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
               onError={(e) => {
                 // Fallback if Unsplash fails
                 (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Muhammad";
               }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
          </div>
          {/* Active Badge */}
          <div className="absolute -bottom-2 -right-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-xl">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Session Active</span>
          </div>
        </div>

        <div className="space-y-6 flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-bold uppercase tracking-widest mono">
            <Fingerprint size={12} /> Lead Mentor ID: MK-01
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none flex items-center gap-3 flex-wrap">
              Muhammad <span className="text-orange-500">Khuhro</span>
              <div className="inline-flex items-center justify-center bg-blue-500/10 border border-blue-500/30 p-2 rounded-full shadow-lg shadow-blue-500/5 group relative">
                <CheckCircle2 size={28} className="text-blue-500 fill-blue-500/10 animate-pulse" />
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded text-[8px] font-black uppercase tracking-widest text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Verified Professional
                </div>
              </div>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500/80 ml-1">Verified Platform Architect & Mentor</p>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <a 
              href="mailto:muhammadkhuhroedu@gmail.com" 
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors border border-zinc-800 px-5 py-2.5 rounded-lg bg-zinc-900/50 hover:bg-zinc-800"
            >
              <Mail size={14} /> Send Email
            </a>
            <a 
              href="https://wa.link/38yrb4" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-white transition-all border border-emerald-500/20 px-5 py-2.5 rounded-lg bg-emerald-500/5 hover:bg-emerald-500"
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-10">
          <div className="prose prose-invert prose-zinc max-w-none">
            <div className="flex items-center gap-3 text-orange-500 font-black uppercase tracking-widest text-xs mb-8">
              <BookOpen size={16} /> The Sovereignty Narrative
            </div>
            
            <div className="space-y-6 text-zinc-400 leading-relaxed text-lg font-light">
              <p>
                My interest in trading started about four years ago. Like most people in the beginning, I was curious, confused, and searching for clarity. I wanted to understand how markets actually move, why price behaves the way it does, and what separates consistent traders from everyone else.
              </p>
              
              <p>
                Over time, that curiosity turned into deep study, screen time, mistakes, journaling, and constant questioning. One thing became clear very early: <span className="text-white font-medium italic underline decoration-orange-500/50">trading is not something you ever “finish” learning.</span>
              </p>

              <p>
                I am not presenting myself as someone who has mastered the market or reached a final level. I am still learning—and I expect that to continue for as long as I trade. Trading is not a fixed-outline skill where you study once and apply rules forever. The market does not work that way. BTC does not work that way.
              </p>

              <blockquote className="border-l-4 border-orange-500 bg-zinc-900/80 p-8 my-10 rounded-r-xl">
                <p className="text-xl font-medium text-zinc-200 italic mb-4">
                  "Sovereign BTC was built from this understanding. It exists to help traders develop market-reading skill, risk discipline, and emotional control over time."
                </p>
                <cite className="text-xs font-black uppercase tracking-[0.2em] text-orange-500 not-italic">
                  — The Founding Philosophy
                </cite>
              </blockquote>

              <p>
                I am actively involved in the same process I teach. Every trading session, I study BTC market structure, liquidity behavior, and price reactions. I journal. I review losses. I question assumptions. Some days confirm what I know; others expose gaps. That process never stops.
              </p>

              <div className="p-6 bg-orange-500/5 border border-orange-500/10 rounded-xl space-y-4">
                <h4 className="text-orange-500 font-black uppercase tracking-widest text-xs flex items-center gap-2">
                  <Award size={14} /> Why I Chose Strict Focus
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2 text-zinc-400"><span className="text-orange-500 font-bold">•</span> One market: BTCUSDT Perpetual</li>
                    <li className="flex gap-2 text-zinc-400"><span className="text-orange-500 font-bold">•</span> One session: London → NY Overlap</li>
                  </ul>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2 text-zinc-400"><span className="text-orange-500 font-bold">•</span> One strategy: Structure & Liquidity</li>
                    <li className="flex gap-2 text-zinc-400"><span className="text-orange-500 font-bold">•</span> One risk language: R-multiples</li>
                  </ul>
                </div>
                <p className="text-xs text-zinc-500 italic mt-2">
                  Simplicity makes learning possible. Complexity often hides ignorance. Focus exposes mistakes—and that is how real improvement happens.
                </p>
              </div>

              <p>
                I do not claim certainty. I do not promise profits. What I believe in is <span className="text-white font-bold uppercase tracking-tight">process mastery</span>—showing up prepared, executing consistently, accepting losses calmly, and reviewing honestly.
              </p>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-8 sticky top-24 shadow-2xl">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 border-b border-zinc-800 pb-3 mb-6">Operational Ethics</h4>
              
              <div className="space-y-6">
                <div className="flex gap-4 group">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-black transition-all">
                    <Target size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase text-white">Focus</p>
                    <p className="text-[10px] text-zinc-500 uppercase leading-relaxed">Eliminate distractions. Specialize in BTC behavior.</p>
                  </div>
                </div>

                <div className="flex gap-4 group">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                    <Shield size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase text-white">Survival</p>
                    <p className="text-[10px] text-zinc-500 uppercase leading-relaxed">Capital protection is the only primary directive.</p>
                  </div>
                </div>

                <div className="flex gap-4 group">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-black transition-all">
                    <Terminal size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase text-white">Execution</p>
                    <p className="text-[10px] text-zinc-500 uppercase leading-relaxed">Mechanical rules override emotional noise.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800">
              <div className="p-5 bg-black/40 border border-zinc-800 rounded-lg space-y-3">
                <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Protocol Stance</p>
                <p className="text-xs text-zinc-300 font-medium leading-relaxed italic">
                  "If you are willing to learn continuously, accept uncertainty, and treat trading as a professional skill—then you are in the right environment."
                </p>
              </div>
            </div>

            <div className="text-center">
               <button 
                 onClick={() => window.location.href = '#/course'}
                 className="w-full py-4 bg-orange-500 text-black font-black uppercase tracking-widest text-[10px] rounded-lg hover:bg-white transition-all shadow-lg shadow-orange-500/20"
               >
                 View The Roadmap
               </button>
            </div>
          </div>
        </aside>
      </section>

      <footer className="pt-12 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-black">Muhammad Khuhro &copy; 2024</p>
        <div className="flex gap-6">
           <span className="text-[10px] text-zinc-700 uppercase font-bold">Verified Mentor</span>
           <span className="text-[10px] text-zinc-700 uppercase font-bold">BTC Protocol V1.0</span>
        </div>
      </footer>
    </div>
  );
};

export default About;
