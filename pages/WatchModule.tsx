
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MODULES } from '../data/courseContent';
import { 
  ArrowLeft, Play, Pause, Maximize, Settings, 
  Volume2, CheckCircle2, FileText, Download, 
  Target, AlertTriangle, Terminal, ChevronRight,
  Info, MessageSquare, List
} from 'lucide-react';

const WatchModule = ({ user }: { user: any }) => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const module = MODULES.find(m => m.id === moduleId);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const registrations = JSON.parse(localStorage.getItem('sovereign_registrations') || '[]');
  const isApproved = registrations.find((r: any) => r.email === user?.email && r.status === 'Accepted');

  if (!user || !isApproved) {
    return <div className="p-20 text-center uppercase font-black text-zinc-700">Unauthorized Stream Access</div>;
  }

  if (!module) return <div className="p-20 text-center">Module Not Found</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Top Nav */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link to="/vault" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest">
          <ArrowLeft size={16} /> Back to Vault
        </Link>
        <div className="flex items-center gap-4">
           <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Progress Saved</span>
           <button 
             onClick={() => setIsCompleted(!isCompleted)}
             className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${isCompleted ? 'bg-emerald-500 text-black border-emerald-600' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'}`}
           >
             {isCompleted ? <CheckCircle2 size={14} /> : null}
             {isCompleted ? 'Completed' : 'Mark as Complete'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Player Area */}
        <div className="lg:col-span-8 space-y-8">
           <div className="group relative aspect-video bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
              {/* Simulated Video UI */}
              <div className="absolute inset-0 flex items-center justify-center">
                 {!isPlaying ? (
                   <button 
                     onClick={() => setIsPlaying(true)}
                     className="w-20 h-20 bg-orange-500 text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                   >
                     <Play size={32} className="ml-1" />
                   </button>
                 ) : (
                   <div className="text-zinc-800 font-black uppercase text-4xl tracking-tighter select-none opacity-20 rotate-[-20deg]">
                     PROTECTED STREAM: {user.email}
                   </div>
                 )}
              </div>

              {/* Player Overlay Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-6">
                   <button onClick={() => setIsPlaying(!isPlaying)} className="text-white">
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                   </button>
                   <div className="text-[10px] font-bold text-zinc-400 mono">04:22 / 12:45</div>
                   <div className="w-48 h-1 bg-zinc-800 rounded-full relative overflow-hidden">
                      <div className="absolute inset-y-0 left-0 w-1/3 bg-orange-500" />
                   </div>
                </div>
                <div className="flex items-center gap-4 text-zinc-400">
                   <Settings size={18} className="hover:text-white cursor-pointer" />
                   <Volume2 size={18} className="hover:text-white cursor-pointer" />
                   <Maximize size={18} className="hover:text-white cursor-pointer" />
                </div>
              </div>
           </div>

           <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-black uppercase bg-zinc-900 border border-zinc-800 text-zinc-500 px-3 py-1 rounded">Module {module.order}</span>
                 <h1 className="text-3xl font-black uppercase tracking-tight text-white">{module.title}</h1>
              </div>
              <p className="text-zinc-400 leading-relaxed text-lg font-light">
                 {module.explanation}
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
                 <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 border-b border-zinc-800 pb-3 flex items-center gap-2">
                   <Target size={14} className="text-orange-500" /> Operational Goal
                 </h4>
                 <p className="text-sm text-zinc-300 italic">"{module.objective}"</p>
              </div>
              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
                 <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 border-b border-zinc-800 pb-3 flex items-center gap-2">
                   <AlertTriangle size={14} className="text-red-500" /> Avoid This
                 </h4>
                 <ul className="space-y-2">
                   {module.commonMistakes.slice(0, 2).map((m, i) => (
                     <li key={i} className="text-[10px] text-zinc-400 uppercase font-black flex gap-2">
                        <span className="text-red-500">•</span> {m}
                     </li>
                   ))}
                 </ul>
              </div>
           </div>
        </div>

        {/* Sidebar Context */}
        <aside className="lg:col-span-4 space-y-8">
           <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-6 shadow-xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 border-b border-zinc-800 pb-3">Mission Files</h3>
              <div className="space-y-3">
                 <button className="w-full p-4 bg-black/40 border border-zinc-800 rounded-lg flex items-center justify-between group hover:border-orange-500/50 transition-all">
                    <div className="flex items-center gap-3">
                       <FileText size={18} className="text-zinc-500 group-hover:text-orange-500" />
                       <div className="text-left">
                          <p className="text-[10px] font-black uppercase text-zinc-300">Strategy PDF</p>
                          <p className="text-[8px] text-zinc-600 uppercase">Technical Guide v1</p>
                       </div>
                    </div>
                    <Download size={16} className="text-zinc-700" />
                 </button>
                 <button className="w-full p-4 bg-black/40 border border-zinc-800 rounded-lg flex items-center justify-between group hover:border-emerald-500/50 transition-all">
                    <div className="flex items-center gap-3">
                       <FileText size={18} className="text-zinc-500 group-hover:text-emerald-500" />
                       <div className="text-left">
                          <p className="text-[10px] font-black uppercase text-zinc-300">Journal Cheat Sheet</p>
                          <p className="text-[8px] text-zinc-600 uppercase">Excel Template</p>
                       </div>
                    </div>
                    <Download size={16} className="text-zinc-700" />
                 </button>
              </div>
           </div>

           <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 border-b border-zinc-800 pb-3">Journal Assignment</h3>
              <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-lg space-y-3">
                 <p className="text-xs text-zinc-400 italic leading-relaxed">
                   "{module.journalTask}"
                 </p>
                 <button className="w-full py-2 bg-orange-500 text-black font-black uppercase tracking-widest text-[9px] rounded hover:bg-white transition-all">
                   Submit Evidence
                 </button>
              </div>
           </div>

           <div className="p-6 border border-zinc-800 rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                 <Terminal size={14} /> System Note
              </div>
              <p className="text-[10px] text-zinc-600 leading-relaxed italic uppercase">
                Content is strictly for personal use. Distributing these technical notes will result in permanent session termination.
              </p>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default WatchModule;
