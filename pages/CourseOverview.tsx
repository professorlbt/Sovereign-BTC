
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BUNDLES, MODULES } from '../data/courseContent';
import { ChevronRight, Lock, Play, CheckCircle, UserCheck } from 'lucide-react';

const CourseOverview = ({ user }: { user: any }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <h1 className="text-5xl font-black uppercase tracking-tighter">The Progression <span className="text-orange-500">Path</span></h1>
          <p className="text-zinc-500 max-w-2xl leading-relaxed">This is a gated, performance-based curriculum. You do not advance until your journal proves behavioral consistency.</p>
        </div>
        
        {!user && (
          <button 
            onClick={() => navigate('/auth')}
            className="px-6 py-3 bg-orange-500/10 border border-orange-500/20 text-orange-500 font-black uppercase tracking-widest text-[10px] rounded hover:bg-orange-500 hover:text-black transition-all"
          >
            Authenticate to Begin
          </button>
        )}
      </header>

      <div className="relative space-y-16">
        <div className="absolute left-8 top-12 bottom-12 w-px bg-zinc-800 hidden lg:block" />

        {BUNDLES.map((bundle, idx) => {
          const bundleModules = MODULES.filter(m => m.level === bundle.id);
          const isLocked = !user && idx > 0;

          return (
            <div key={bundle.id} className="relative lg:pl-24 space-y-6 group">
              <div className={`absolute left-0 top-6 w-16 h-16 rounded-full border-4 border-[#0a0a0a] z-10 hidden lg:flex items-center justify-center transition-all ${isLocked ? 'bg-zinc-900 border-zinc-800 text-zinc-600' : 'bg-orange-500 border-orange-900/30 text-black shadow-lg shadow-orange-500/10'}`}>
                {isLocked ? <Lock size={20} /> : <span className="font-black text-xl">{idx + 1}</span>}
              </div>

              <div className={`p-8 border rounded-xl transition-all ${isLocked ? 'border-zinc-800 bg-zinc-900/20 grayscale' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-1">{bundle.title}</h2>
                    <p className="text-zinc-400 font-medium text-sm">{bundle.goal}</p>
                  </div>
                  <div className="px-4 py-2 bg-black/40 border border-zinc-800 rounded text-[10px] text-orange-500 font-black uppercase tracking-widest">
                    Rule: {bundle.moneyRule}
                  </div>
                </div>

                <div className="p-4 bg-orange-500/5 border-l-2 border-orange-500 mb-8 rounded-r">
                   <p className="text-zinc-500 text-xs leading-relaxed uppercase">
                     <span className="text-white font-black tracking-widest">Mindset Orientation:</span> {bundle.mindset}
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bundleModules.map(module => (
                    <Link 
                      key={module.id} 
                      to={isLocked ? '#' : `/course/module/${module.id}`}
                      className={`p-4 border border-zinc-800 bg-black/30 rounded flex items-center justify-between group/link transition-all ${isLocked ? 'opacity-40 cursor-not-allowed' : 'hover:border-orange-500/50 hover:bg-black/50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center text-[10px] font-black transition-all ${isLocked ? 'bg-zinc-800 text-zinc-600' : 'bg-zinc-800 text-zinc-400 group-hover/link:bg-orange-500 group-hover/link:text-black'}`}>
                          {module.order}
                        </div>
                        <span className="font-bold text-xs uppercase tracking-tight">{module.title}</span>
                      </div>
                      {!isLocked && <Play size={12} className="text-zinc-600 group-hover/link:text-orange-500" />}
                    </Link>
                  ))}

                  <Link 
                    to={isLocked ? '#' : `/course/checkpoint/${bundle.id}`}
                    className={`p-4 border-2 border-dashed border-zinc-800 rounded flex items-center justify-center gap-2 text-zinc-500 transition-all ${isLocked ? 'opacity-40 cursor-not-allowed' : 'hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:text-emerald-500'}`}
                  >
                    <CheckCircle size={16} />
                    <span className="font-black text-[10px] uppercase tracking-widest">Gate Verification</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-12 border border-zinc-800 bg-zinc-900/30 rounded-2xl flex flex-col items-center gap-6 text-center shadow-2xl">
         <div className="space-y-2">
            <h3 className="text-2xl font-black uppercase tracking-tight italic">Ready to Initialize Training?</h3>
            <p className="text-zinc-500 max-w-lg text-sm">Once you finish the beginner foundations, you must submit your demo logs for the manual vetting protocol.</p>
         </div>
         {user ? (
           <Link to="/register-course" className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest rounded-lg hover:bg-orange-500 transition-all flex items-center gap-2">
             <UserCheck size={18} /> Apply for Enrollment
           </Link>
         ) : (
           <Link to="/auth" className="px-10 py-4 bg-orange-500 text-black font-black uppercase tracking-widest rounded-lg hover:bg-white transition-all">
             Authenticate to Access
           </Link>
         )}
      </div>
    </div>
  );
};

export default CourseOverview;
