
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MODULES } from '../data/courseContent';
import { ArrowLeft, ChevronRight, Target, AlertCircle, BookOpen, PenTool, CheckCircle2 } from 'lucide-react';

const ModuleDetail = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const module = MODULES.find(m => m.id === moduleId);

  if (!module) return <div className="p-12 text-center text-zinc-500">Module not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-in slide-in-from-right-4 duration-500">
      <Link to="/course" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-bold tracking-widest">
        <ArrowLeft size={16} /> Back to Roadmap
      </Link>

      <header className="space-y-6">
        <div className="inline-block px-3 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded">
          Level: {module.level} | Module {module.order}
        </div>
        <h1 className="text-5xl font-black tracking-tighter uppercase">{module.title}</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-12">
          {/* Objective */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-orange-500 font-bold uppercase tracking-widest text-xs">
              <Target size={16} /> Objective
            </div>
            <p className="text-xl text-zinc-300 font-light leading-relaxed">
              {module.objective}
            </p>
          </section>

          {/* Explanation */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-zinc-400 font-bold uppercase tracking-widest text-xs">
              <BookOpen size={16} /> Concept Explanation
            </div>
            <div className="prose prose-invert prose-zinc max-w-none">
              <p className="text-zinc-400 leading-7 text-lg">{module.explanation}</p>
              <div className="bg-zinc-900/50 p-6 border-l-4 border-orange-500 rounded shadow-inner my-8">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <span className="text-orange-500">BTC-Specific Note:</span>
                </h4>
                <p className="text-zinc-400 italic font-medium">{module.btcExample}</p>
              </div>
            </div>
          </section>

          {/* Common Mistakes */}
          <section className="p-8 bg-red-500/5 border border-red-500/20 rounded-lg space-y-4">
            <div className="flex items-center gap-3 text-red-500 font-bold uppercase tracking-widest text-xs">
              <AlertCircle size={16} /> Common Mistakes to Avoid
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {module.commonMistakes.map((mistake, i) => (
                <li key={i} className="flex gap-3 text-zinc-400 text-sm">
                  <span className="text-red-500 font-bold">X</span>
                  {mistake}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-8">
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg sticky top-24 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 border-b border-zinc-800 pb-2">Rules Summary</h3>
              <ul className="space-y-3">
                {module.rulesSummary.map((rule, i) => (
                  <li key={i} className="flex gap-2 text-sm text-zinc-300">
                    <CheckCircle2 size={14} className="text-emerald-500 mt-1 shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded space-y-3">
              <div className="flex items-center gap-2 text-orange-500 font-bold text-[10px] uppercase tracking-widest">
                <PenTool size={14} /> Journaling Task
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed italic">
                {module.journalTask}
              </p>
            </div>

            <button 
              onClick={() => navigate('/course')}
              className="w-full py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-orange-500 transition-all rounded text-sm flex items-center justify-center gap-2"
            >
              Finish Module <ChevronRight size={18} />
            </button>
          </div>
        </aside>
      </div>

      <section className="p-8 border border-zinc-800 rounded-lg space-y-4 text-center">
         <h4 className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Why This Matters (Psychology)</h4>
         <p className="text-zinc-400 max-w-2xl mx-auto italic">{module.whyItMatters}</p>
      </section>
    </div>
  );
};

export default ModuleDetail;
