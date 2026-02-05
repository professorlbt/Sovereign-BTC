
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Plus, Trash2, Video, ImageIcon, FileCode, CheckCircle2, Terminal, ShieldAlert } from 'lucide-react';

const AdminUpload = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    level: 'beginner',
    objective: '',
    explanation: '',
    btcExample: '',
    journalTask: ''
  });

  const [files, setFiles] = useState<any[]>([]);

  const handleFile = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setFiles([...files, { name: file.name, size: (file.size / 1024).toFixed(1) + ' KB', type: file.type }]);
    }
  };

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/course');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      <header className="space-y-4">
        <div className="flex items-center gap-3 text-orange-500 font-black uppercase tracking-widest text-[10px]">
          <UploadCloud size={16} /> Content Deployment Engine
        </div>
        <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Deploy <span className="text-orange-500">New Module</span></h1>
        <p className="text-zinc-500">Append technical training modules to the Sovereign BTC Roadmap.</p>
      </header>

      <form onSubmit={handleDeploy} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-6 shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-800 pb-3 mb-6">Module Metadata</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Module Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-sm focus:border-orange-500 transition-all"
                  placeholder="The 15m Liquidity Trap"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Target Tier</label>
                <select 
                   value={formData.level}
                   onChange={e => setFormData({...formData, level: e.target.value})}
                   className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-sm focus:border-orange-500 outline-none"
                >
                  <option value="beginner">Beginner: Foundations</option>
                  <option value="intermediate">Intermediate: Discipline</option>
                  <option value="advanced">Advanced: Expectancy</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Operational Objective</label>
              <input 
                type="text" 
                required
                value={formData.objective}
                onChange={e => setFormData({...formData, objective: e.target.value})}
                className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-sm focus:border-orange-500"
                placeholder="Identify stop-run behavior at London Open"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Technical Explanation</label>
              <textarea 
                required
                value={formData.explanation}
                onChange={e => setFormData({...formData, explanation: e.target.value})}
                className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-sm focus:border-orange-500 h-40"
                placeholder="Break down the mechanism of action..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Journal Task Assignment</label>
              <input 
                type="text" 
                value={formData.journalTask}
                onChange={e => setFormData({...formData, journalTask: e.target.value})}
                className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-sm focus:border-orange-500"
                placeholder="Review 20 session opens and mark the range..."
              />
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-8">
          {/* File Upload Section */}
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-6 shadow-xl">
             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 border-b border-zinc-800 pb-3">Supplementary Assets</h4>
             
             <div className="space-y-4">
                <label className="block w-full cursor-pointer group">
                   <div className="border-2 border-dashed border-zinc-800 rounded-xl p-8 text-center group-hover:border-orange-500/50 transition-all bg-black/20">
                      <UploadCloud size={32} className="mx-auto text-zinc-700 group-hover:text-orange-500 mb-2 transition-colors" />
                      <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Select Files</p>
                      <p className="text-[8px] text-zinc-700 uppercase mt-1">Video (MP4) | Image (PNG/JPG)</p>
                      <input type="file" className="hidden" onChange={handleFile} />
                   </div>
                </label>

                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file, i) => (
                      <div key={i} className="p-3 bg-black/40 border border-zinc-800 rounded-lg flex items-center justify-between">
                         <div className="flex items-center gap-2 overflow-hidden">
                            {file.type.includes('video') ? <Video size={14} className="text-orange-500" /> : <ImageIcon size={14} className="text-emerald-500" />}
                            <div className="truncate text-[10px] font-bold text-zinc-400">
                               {file.name}
                               <span className="block text-[8px] text-zinc-600 uppercase">{file.size}</span>
                            </div>
                         </div>
                         <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-zinc-600 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                         </button>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>

          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
            <button 
              type="submit"
              disabled={loading || success}
              className="w-full py-4 bg-orange-500 text-black font-black uppercase tracking-widest text-xs rounded-lg hover:bg-white transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : success ? (
                <CheckCircle2 size={18} />
              ) : (
                <Terminal size={18} />
              )}
              {loading ? 'Transmitting...' : success ? 'Deployed' : 'Deploy Module'}
            </button>
            <p className="text-[9px] text-zinc-600 uppercase text-center font-bold italic">Verification required before global release.</p>
          </div>

          <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-lg flex gap-3">
             <ShieldAlert size={16} className="text-red-500 shrink-0" />
             <p className="text-[9px] text-zinc-500 leading-relaxed uppercase">Deployments are permanent in the local ledger until purged by Root Admin.</p>
          </div>
        </aside>
      </form>
    </div>
  );
};

export default AdminUpload;
