
import React, { useState, useEffect } from 'react';
import { 
  Users, FileText, CheckCircle2, XCircle, Clock, Activity, 
  Settings, Database, Server, Search, Filter, MessageCircle, 
  Mail, ArrowUpRight, PieChart, UserPlus, ShieldCheck, Trash2,
  ScrollText, Plus, Save, ChevronDown, PenTool, Key, Check,
  Files, Lock, Eye, Download, UploadCloud
} from 'lucide-react';
import { BlogPost } from '../types';

const AdminPanel = () => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'applications' | 'students' | 'docs' | 'analytics'>('applications');
  const [notification, setNotification] = useState<string | null>(null);

  // Doc form state
  const [newDoc, setNewDoc] = useState({
    title: '',
    description: '',
    isPremiumOnly: true,
    category: 'Manuals'
  });

  useEffect(() => {
    const regs = JSON.parse(localStorage.getItem('sovereign_registrations') || '[]');
    setRegistrations(regs);
    const savedBlogs = JSON.parse(localStorage.getItem('sovereign_blogs') || '[]');
    setBlogs(savedBlogs);
    const savedDocs = JSON.parse(localStorage.getItem('sovereign_docs') || '[]');
    setDocs(savedDocs);
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const approveRegistration = (id: number) => {
    const updated = registrations.map(r => {
      if (r.id === id) {
        const handle = r.name.toLowerCase().replace(/\s+/g, '.') + "@sovereign.btc";
        showToast(`Email Sent: Welcome to Sovereign. Identity ${handle} assigned.`);
        return { ...r, status: 'Accepted', platformEmail: handle };
      }
      return r;
    });
    setRegistrations(updated);
    localStorage.setItem('sovereign_registrations', JSON.stringify(updated));
  };

  const deleteDoc = (id: string) => {
    const updated = docs.filter(d => d.id !== id);
    setDocs(updated);
    localStorage.setItem('sovereign_docs', JSON.stringify(updated));
    showToast('Document purged from archives.');
  };

  const addDoc = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = {
      ...newDoc,
      id: Date.now().toString(),
      fileUrl: '#',
      fileSize: '1.0 MB',
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [doc, ...docs];
    setDocs(updated);
    localStorage.setItem('sovereign_docs', JSON.stringify(updated));
    setNewDoc({ title: '', description: '', isPremiumOnly: true, category: 'Manuals' });
    showToast('New intelligence file deployed.');
  };

  const filteredData = registrations.filter(reg => {
    const matchesSearch = 
      reg.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reg.platformEmail && reg.platformEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      reg.handle.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'students') return reg.status === 'Accepted' && matchesSearch;
    if (activeTab === 'applications') return reg.status !== 'Accepted' && matchesSearch;
    return true;
  });

  const stats = {
    total: registrations.length,
    pending: registrations.filter(r => r.status === 'Pending').length,
    accepted: registrations.filter(r => r.status === 'Accepted').length,
    rejected: registrations.filter(r => r.status === 'Rejected').length,
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 relative">
      {notification && (
        <div className="fixed top-20 right-8 z-[100] bg-orange-500 text-black px-6 py-4 rounded-xl font-black uppercase text-xs shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10">
          <Check size={18} /> {notification}
        </div>
      )}

      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em] mono">
            <ShieldCheck size={12} /> Root Authority Console
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Command <span className="text-orange-500">Center</span></h1>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
          <QuickStat label="Ledger Size" value={stats.total} icon={Users} color="zinc" />
          <QuickStat label="Queue" value={stats.pending} icon={Clock} color="orange" />
          <QuickStat label="Intelligence" value={docs.length} icon={Files} color="blue" />
          <QuickStat label="Enrolled" value={stats.accepted} icon={ShieldCheck} color="emerald" />
        </div>
      </header>

      <div className="flex border-b border-zinc-800 gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <button onClick={() => setActiveTab('applications')} className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] relative ${activeTab === 'applications' ? 'text-orange-500' : 'text-zinc-600 hover:text-white'}`}>
          Vetting Queue ({stats.pending})
          {activeTab === 'applications' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500" />}
        </button>
        <button onClick={() => setActiveTab('students')} className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] relative ${activeTab === 'students' ? 'text-emerald-500' : 'text-zinc-600 hover:text-white'}`}>
          Active Students ({stats.accepted})
          {activeTab === 'students' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />}
        </button>
        <button onClick={() => setActiveTab('docs')} className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] relative ${activeTab === 'docs' ? 'text-blue-500' : 'text-zinc-600 hover:text-white'}`}>
          Intelligence Management
          {activeTab === 'docs' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />}
        </button>
      </div>

      {activeTab === 'docs' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Doc List */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <Database size={20} className="text-zinc-500" /> Current Archives
            </h2>
            <div className="space-y-4">
              {docs.map(doc => (
                <div key={doc.id} className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between group hover:border-zinc-700">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded ${doc.isPremiumOnly ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase text-white tracking-tight">{doc.title}</h4>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{doc.category} // {doc.isPremiumOnly ? 'PREMIUM' : 'PUBLIC'}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteDoc(doc.id)} className="p-2 text-zinc-700 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Doc Form */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6 sticky top-24">
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-500 border-b border-zinc-800 pb-3 flex items-center gap-2">
                <UploadCloud size={16} /> Deploy New Archive
              </h3>
              <form onSubmit={addDoc} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Document Title</label>
                  <input 
                    type="text" 
                    required
                    value={newDoc.title}
                    onChange={e => setNewDoc({...newDoc, title: e.target.value})}
                    className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-xs focus:border-blue-500 outline-none"
                    placeholder="SOP: Session Checklist"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Visibility Tier</label>
                  <select 
                    value={newDoc.isPremiumOnly ? 'true' : 'false'}
                    onChange={e => setNewDoc({...newDoc, isPremiumOnly: e.target.value === 'true'})}
                    className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-xs focus:border-blue-500 outline-none"
                  >
                    <option value="true">Premium Only (Gated)</option>
                    <option value="false">Public Access</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Description</label>
                  <textarea 
                    value={newDoc.description}
                    onChange={e => setNewDoc({...newDoc, description: e.target.value})}
                    className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-xs focus:border-blue-500 h-24 outline-none"
                    placeholder="Provide context for the student..."
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-blue-500 text-black font-black uppercase tracking-widest text-[10px] rounded-lg hover:bg-white transition-all">
                  Initialize Deployment
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/50 p-4 border border-zinc-800 rounded-xl">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
              <input 
                type="text"
                placeholder="Search Identity Database..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/50 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-xs mono text-white focus:border-orange-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredData.length === 0 ? (
              <div className="p-20 text-center border-2 border-dashed border-zinc-800 rounded-2xl">
                <Database size={40} className="mx-auto text-zinc-800 mb-4" />
                <p className="text-zinc-600 uppercase font-black tracking-widest text-xs">No Records Found</p>
              </div>
            ) : (
              filteredData.map((reg) => (
                <CandidateCard 
                  key={reg.id} 
                  reg={reg} 
                  onAccept={() => approveRegistration(reg.id)}
                  onReject={() => {}}
                  onDelete={() => {}}
                  onResetKey={() => {}}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const QuickStat = ({ label, value, icon: Icon, color }: any) => {
  const colors: any = {
    orange: "text-orange-500 bg-orange-500/5 border-orange-500/10",
    emerald: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10",
    blue: "text-blue-500 bg-blue-500/5 border-blue-500/10",
    zinc: "text-zinc-400 bg-zinc-800/50 border-zinc-800"
  };
  return (
    <div className={`p-4 border rounded-xl flex items-center gap-4 ${colors[color]}`}>
      <div className="shrink-0"><Icon size={20} /></div>
      <div>
        <div className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-0.5">{label}</div>
        <div className="text-xl font-black mono text-white leading-none">{value}</div>
      </div>
    </div>
  );
};

const CandidateCard = ({ reg, onAccept }: any) => {
  return (
    <div className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all shadow-xl">
      <div className="flex flex-col lg:flex-row">
        <div className="p-6 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-zinc-800 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center text-zinc-500 font-black text-xl">
              {reg.name.charAt(0)}
            </div>
            <div className="space-y-1 overflow-hidden">
              <h3 className="font-black text-white uppercase tracking-tight truncate">{reg.name}</h3>
              <div className="flex flex-col gap-1">
                <span className={`w-fit text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                  reg.status === 'Accepted' ? 'bg-emerald-500 text-black' : 
                  reg.status === 'Rejected' ? 'bg-red-500 text-black' : 'bg-orange-500/20 text-orange-500'
                }`}>
                  {reg.status}
                </span>
                {reg.platformEmail && (
                  <span className="text-[9px] text-orange-500 font-black tracking-widest mono">{reg.platformEmail}</span>
                )}
              </div>
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 font-bold uppercase mono truncate">{reg.email}</p>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between bg-black/20">
          <div className="space-y-2">
            <p className="text-[9px] font-black text-zinc-600 uppercase">Motivation Extract</p>
            <p className="text-xs text-zinc-400 leading-relaxed italic truncate">"{reg.motivation || 'Standard simple account registration.'}"</p>
          </div>

          <div className="flex items-center justify-end mt-4">
            {reg.status !== 'Accepted' && reg.type !== 'Simple' && (
              <button onClick={onAccept} className="px-6 py-2 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest rounded hover:bg-white transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                <UserPlus size={14} /> Approve
              </button>
            )}
            {reg.type === 'Simple' && (
               <span className="text-[9px] font-black uppercase text-zinc-700">Observer Status // No Vetting Required</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
