
import React, { useState, useEffect } from 'react';
import { fetchRemoteData } from '../data/githubIntegration';
import { 
  Files, Download, Lock, FileText, ExternalLink, 
  ShieldCheck, Search, Filter, Info, Eye, AlertTriangle, Loader2
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  description: string;
  isPremiumOnly: boolean;
  fileUrl: string;
  fileSize: string;
  category: string;
  date: string;
  hash?: string;
}

const Documents = ({ user }: { user: any }) => {
  const [docs, setDocs] = useState<Document[]>([]);
  const [search, setSearch] = useState('');
  const [downloading, setDownloading] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const registrations = JSON.parse(localStorage.getItem('sovereign_registrations') || '[]');
  const isPremium = registrations.find((r: any) => (r.email === user?.email || r.platformEmail === user?.email) && r.status === 'Accepted') || user?.isAdmin;

  useEffect(() => {
    async function loadDocs() {
      // 1. Get default/local docs
      const savedDocs = JSON.parse(localStorage.getItem('sovereign_docs') || '[]');
      
      // 2. Try to fetch from GitHub
      const remoteDocs = await fetchRemoteData('intelligence.json');
      
      const combined = [...savedDocs, ...(remoteDocs || [])];
      
      // Fallback to defaults if totally empty
      if (combined.length === 0) {
        const defaults: Document[] = [
          {
            id: '1',
            title: 'BTC Execution Checklist v1.0',
            description: 'A step-by-step verification PDF for manual session analysis.',
            isPremiumOnly: false,
            fileUrl: '#',
            fileSize: '1.2 MB',
            category: 'Public Manuals',
            date: '2024-05-20',
            hash: 'SHA-256: 7f8c...9a2e'
          }
        ];
        setDocs(defaults);
      } else {
        // Remove duplicates by ID
        const unique = combined.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
        setDocs(unique);
      }
      setLoading(false);
    }
    loadDocs();
  }, []);

  const simulateDownload = (doc: Document) => {
    setDownloading(doc.id);
    setTimeout(() => {
      setDownloading(null);
      alert(`SECURE DOWNLOAD COMPLETE:\nFile: ${doc.title}\nStatus: Verified\nIntegrity: ${doc.hash || 'Verified'}`);
    }, 1500);
  };

  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) || 
                          doc.description.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="space-y-4">
        <div className="flex items-center gap-3 text-orange-500 font-black uppercase tracking-widest text-[10px]">
          <Files size={16} /> Technical Intelligence Archives
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Intelligence <span className="text-orange-500">Files</span></h1>
            <p className="text-zinc-500 max-w-2xl font-light text-lg">Access official protocol documentation and mechanical execution SOPs.</p>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-orange-500 mono">
              <Loader2 size={14} className="animate-spin" /> Fetching Archives...
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/50 p-4 border border-zinc-800 rounded-xl">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
          <input 
            type="text"
            placeholder="Filter archives by keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/50 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-xs mono text-white focus:border-orange-500 transition-all outline-none"
          />
        </div>
        {!isPremium && (
          <div className="px-4 py-2 bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest rounded flex items-center gap-2">
            <Lock size={12} /> Premium Files Restricted
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map(doc => {
          const locked = doc.isPremiumOnly && !isPremium;
          const isDownloading = downloading === doc.id;

          return (
            <div 
              key={doc.id} 
              className={`group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all flex flex-col ${locked ? 'opacity-60' : 'hover:bg-zinc-800/40 shadow-xl shadow-black/50'}`}
            >
              <div className="p-6 space-y-4 flex-1">
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-lg ${locked ? 'bg-zinc-800 text-zinc-600' : 'bg-orange-500/10 text-orange-500'}`}>
                    <FileText size={24} />
                  </div>
                  {doc.isPremiumOnly && (
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1 border ${locked ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                      {locked ? <Lock size={10} /> : <ShieldCheck size={10} />}
                      Professional Tier
                    </span>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className={`font-black text-white uppercase tracking-tight text-lg leading-tight ${locked ? 'text-zinc-500' : ''}`}>{doc.title}</h3>
                  <div className="flex items-center gap-2 text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
                    <span>{doc.category}</span>
                    <span className="opacity-30">•</span>
                    <span>{doc.date}</span>
                  </div>
                </div>
                
                <p className="text-zinc-400 text-xs leading-relaxed font-light">
                  {locked ? "Access restricted. This technical intel is gated for enrolled professional students only." : doc.description}
                </p>

                {!locked && doc.hash && (
                  <div className="pt-2">
                    <p className="text-[8px] mono text-zinc-700 font-bold uppercase tracking-tighter">Checksum: {doc.hash}</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-black/30 border-t border-zinc-800 flex justify-between items-center">
                 <span className="text-[10px] text-zinc-600 font-bold uppercase mono tracking-tighter">{doc.fileSize}</span>
                 {locked ? (
                   <button 
                     disabled
                     className="text-[9px] font-black uppercase tracking-widest text-zinc-700 flex items-center gap-2"
                   >
                     Locked <ShieldCheck size={14} className="opacity-30" />
                   </button>
                 ) : (
                   <button 
                     disabled={isDownloading}
                     onClick={() => simulateDownload(doc)}
                     className={`text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isDownloading ? 'text-zinc-500' : 'text-orange-500 hover:text-white'}`}
                   >
                     {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                     {isDownloading ? 'Decrypting...' : 'Download'}
                   </button>
                 )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredDocs.length === 0 && !loading && (
        <div className="py-20 text-center border-2 border-dashed border-zinc-800 rounded-2xl">
          <Files size={40} className="mx-auto text-zinc-800 mb-4" />
          <p className="text-zinc-600 uppercase font-black tracking-widest text-xs">No matching archives found</p>
        </div>
      )}

      <div className="p-8 bg-zinc-900 border border-red-500/20 rounded-2xl flex items-start gap-6">
        <AlertTriangle size={24} className="text-red-500 shrink-0 mt-1" />
        <div className="space-y-2">
          <h4 className="text-sm font-black uppercase tracking-tight text-red-500">Operational Security Notice</h4>
          <p className="text-xs text-zinc-500 leading-relaxed uppercase font-medium">
            Files marked as "Professional Tier" are strictly for personal training. Any redistribution of technical intel to public groups will result in immediate identity revocation and platform ban.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Documents;
