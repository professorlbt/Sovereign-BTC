
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BUNDLES, MODULES as HARDCODED_MODULES } from '../data/courseContent';
import { fetchRemoteData } from '../data/githubIntegration';
import { Play, CheckCircle, ShieldCheck, Lock, ArrowRight, BookOpen, Clock, Loader2 } from 'lucide-react';

const Vault = ({ user }: { user: any }) => {
  const navigate = useNavigate();
  const [remoteModules, setRemoteModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const registrations = JSON.parse(localStorage.getItem('sovereign_registrations') || '[]');
  const student = registrations.find((r: any) => r.email === user?.email || r.platformEmail === user?.email);
  const isApproved = student?.status === 'Accepted' || user?.isAdmin;
  const isSimple = student?.status === 'Simple';

  useEffect(() => {
    async function loadContent() {
      const data = await fetchRemoteData('vault.json');
      if (data && Array.isArray(data)) {
        setRemoteModules(data);
      }
      setLoading(false);
    }
    if (isApproved) loadContent();
    else setLoading(false);
  }, [isApproved]);

  // Combine hardcoded, local admin uploads, and GitHub remote data
  const localModules = JSON.parse(localStorage.getItem('sovereign_deployed_modules') || '[]');
  const allModules = [...HARDCODED_MODULES, ...localModules, ...remoteModules];

  if (!user || (!isApproved && !user.isAdmin)) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-8 animate-in fade-in duration-700">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-500 mx-auto">
          <Lock size={40} />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black uppercase tracking-tighter">Access <span className="text-red-500">Restricted</span></h2>
          {isSimple ? (
             <p className="text-zinc-500 text-lg font-light leading-relaxed">
               Simple accounts do not have clearance for the Technical Vault. You must upgrade to a <span className="text-white font-bold">Professional Enrollment</span> to unlock technical training.
             </p>
          ) : (
             <p className="text-zinc-500 text-lg font-light leading-relaxed">
               The Vault is currently locked. Your Premium application is in the <span className="text-orange-500 font-bold">Vetting Queue</span>. Return to the Command Center to check your status.
             </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <button onClick={() => navigate('/course')} className="px-10 py-4 border border-zinc-800 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-zinc-800 transition-all">View Roadmap</button>
          {!isApproved && !isSimple && (
            <button onClick={() => navigate('/')} className="px-10 py-4 bg-orange-500 text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-all shadow-xl shadow-orange-500/20">Return Dashboard</button>
          )}
          {isSimple && (
            <button onClick={() => navigate('/auth')} className="px-10 py-4 bg-orange-500 text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-all shadow-xl shadow-orange-500/20">Upgrade Profile</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="space-y-4">
        <div className="flex items-center gap-3 text-emerald-500 font-black uppercase tracking-widest text-[10px]">
          <ShieldCheck size={16} /> Authorized Training Environment
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">The <span className="text-orange-500">Vault</span></h1>
            <p className="text-zinc-500">Welcome, Student. Your session is active. Focus on one module at a time.</p>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-orange-500 mono">
              <Loader2 size={14} className="animate-spin" /> Syncing GitHub Database...
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12">
        {BUNDLES.map((bundle, idx) => {
          const bundleModules = allModules.filter(m => m.level === bundle.id);
          return (
            <div key={bundle.id} className="space-y-6">
              <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
                 <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center text-orange-500 font-black">
                   0{idx + 1}
                 </div>
                 <div>
                   <h2 className="text-xl font-black uppercase tracking-tight">{bundle.title}</h2>
                   <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">{bundle.goal}</p>
                 </div>
              </div>

              {bundleModules.length === 0 ? (
                <p className="text-zinc-600 italic text-xs uppercase tracking-widest">No modules deployed for this tier yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bundleModules.map((module) => (
                    <Link 
                      key={module.id} 
                      to={`/watch/${module.id}`}
                      className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-orange-500/50 transition-all flex flex-col"
                    >
                      <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                         <Play className="text-white opacity-40 group-hover:opacity-100 transition-all scale-125" size={32} />
                         <div className="absolute bottom-3 left-3 flex items-center gap-2">
                            <span className="text-[8px] font-black uppercase bg-orange-500 text-black px-2 py-0.5 rounded">Module {module.order}</span>
                            <span className="text-[8px] font-black uppercase bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded flex items-center gap-1">
                              <Clock size={8} /> {module.duration || '12:45'}
                            </span>
                         </div>
                      </div>
                      <div className="p-5 space-y-3 flex-1">
                         <h3 className="font-black text-white uppercase tracking-tight text-sm leading-snug group-hover:text-orange-500 transition-colors">{module.title}</h3>
                         <p className="text-[10px] text-zinc-500 leading-relaxed line-clamp-2 italic">"{module.objective}"</p>
                      </div>
                      <div className="p-4 border-t border-zinc-800 flex justify-between items-center group-hover:bg-orange-500/5 transition-all">
                         <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Begin Training</span>
                         <ArrowRight size={14} className="text-zinc-700 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
             <BookOpen size={24} />
          </div>
          <div>
            <h4 className="text-lg font-black uppercase tracking-tight">Manual & Journal</h4>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Download your operational standard procedures.</p>
          </div>
        </div>
        <button className="px-8 py-3 border border-zinc-800 text-white font-black uppercase tracking-widest text-xs rounded-lg hover:bg-zinc-800 transition-all">Download Resources</button>
      </div>
    </div>
  );
};

export default Vault;
