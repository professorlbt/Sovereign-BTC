import React, { useState, useEffect } from 'react';
import { 
  Users, FileText, CheckCircle2, XCircle, Clock, Activity, 
  Settings, Database, Server, Search, Filter, MessageCircle, 
  Mail, ArrowUpRight, PieChart, UserPlus, ShieldCheck, Trash2,
  ScrollText, Plus, Save, ChevronDown, PenTool, Key, Check,
  Files, Lock, Eye, Download, UploadCloud, LogOut
} from 'lucide-react';
import { BlogPost } from '../types';

// API base URL
const API_BASE = 'https://sovereign-btc-worker.sovereign-btc.workers.dev';

// Types for API responses
interface AdminStats {
  users: {
    total: number;
    pending: number;
    active: number;
  };
  applications: {
    total: number;
    pending: number;
  };
}

interface Application {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  application_id: number;
  motivation: string;
  experience: string;
  handle: string;
  created_at: string;
  status: string;
  account_type?: string;
  user_id?: number;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  account_type: string;
  status: string;
  role: string;
  platform_handle?: string;
  created_at: string;
}

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminEmail] = useState('admin@sovereign.btc');
  
  const [stats, setStats] = useState<AdminStats>({
    users: { total: 0, pending: 0, active: 0 },
    applications: { total: 0, pending: 0 }
  });
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'applications' | 'students' | 'docs' | 'analytics'>('applications');
  const [notification, setNotification] = useState<string | null>(null);
  
  // Doc form state (keeping this as localStorage for now)
  const [docs, setDocs] = useState<any[]>([]);
  const [newDoc, setNewDoc] = useState({
    title: '',
    description: '',
    isPremiumOnly: true,
    category: 'Manuals'
  });

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
    // Load local docs
    const savedDocs = JSON.parse(localStorage.getItem('sovereign_docs') || '[]');
    setDocs(savedDocs);
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    const expiry = localStorage.getItem('admin_token_expiry');
    
    if (!token || !expiry) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }
    
    if (Date.now() > parseInt(expiry)) {
      // Token expired
      logout();
      return;
    }
    
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: adminEmail, 
          password: adminPassword 
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const token = data.data.token;
        
        // Store token with expiry (8 hours)
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_token_expiry', 
          (Date.now() + 8 * 60 * 60 * 1000).toString()
        );
        
        setIsAuthenticated(true);
        setAdminPassword('');
        showToast('Authentication successful');
      } else {
        const error = await response.json();
        showToast(error.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast('Connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_token_expiry');
    setIsAuthenticated(false);
    setStats({
      users: { total: 0, pending: 0, active: 0 },
      applications: { total: 0, pending: 0 }
    });
    setApplications([]);
    setUsers([]);
    showToast('Logged out');
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const loadData = async () => {
    try {
      // Load stats
      const statsRes = await fetch(`${API_BASE}/admin/stats`, {
        headers: getAuthHeaders()
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data);
      }

      // Load applications
      const appsRes = await fetch(`${API_BASE}/admin/applications`, {
        headers: getAuthHeaders()
      });
      if (appsRes.ok) {
        const appsData = await appsRes.json();
        setApplications(appsData.data.pendingApplications || []);
      }

      // Load users
      const usersRes = await fetch(`${API_BASE}/admin/users`, {
        headers: getAuthHeaders()
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.data.users || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Failed to load data');
    }
  };

  const approveApplication = async (userId: number, platformHandle: string) => {
    try {
      const response = await fetch(`${API_BASE}/admin/approve`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId, platformHandle })
      });
      
      if (response.ok) {
        showToast(`User ${userId} approved with handle ${platformHandle}`);
        loadData(); // Refresh data
      } else {
        const error = await response.json();
        showToast(error.message || 'Failed to approve');
      }
    } catch (error) {
      console.error('Approval error:', error);
      showToast('Failed to approve user');
    }
  };

  const rejectApplication = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE}/admin/reject`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId })
      });
      
      if (response.ok) {
        showToast(`User ${userId} rejected`);
        loadData(); // Refresh data
      } else {
        const error = await response.json();
        showToast(error.message || 'Failed to reject');
      }
    } catch (error) {
      console.error('Rejection error:', error);
      showToast('Failed to reject user');
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
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

  // Filter data based on active tab
  const filteredData = activeTab === 'applications' 
    ? applications.filter(app => 
        searchQuery ? 
          app.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.handle.toLowerCase().includes(searchQuery.toLowerCase())
        : true
      )
    : activeTab === 'students'
    ? users.filter(user => 
        searchQuery ?
          user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.platform_handle && user.platform_handle.toLowerCase().includes(searchQuery.toLowerCase()))
        : true
      )
    : [];

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em] mono mb-4">
            <ShieldCheck size={12} /> Loading
          </div>
          <p className="text-zinc-500 text-sm">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em] mono">
              <Lock size={12} /> Secure Access
            </div>
            <h2 className="text-2xl font-black uppercase">Admin Authentication</h2>
            <p className="text-zinc-500 text-sm">Enter master password to continue</p>
          </div>
          
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-2">
                Master Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-sm focus:border-orange-500 outline-none"
                placeholder="Enter admin password"
                autoComplete="current-password"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-orange-500 text-black font-black uppercase tracking-widest text-sm rounded-lg hover:bg-white transition-all disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Authenticate'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main admin panel
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
          <div className="flex items-center gap-4">
            <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Command <span className="text-orange-500">Center</span></h1>
            <button 
              onClick={logout}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
          <QuickStat label="Ledger Size" value={stats.users.total} icon={Users} color="zinc" />
          <QuickStat label="Queue" value={stats.applications.pending} icon={Clock} color="orange" />
          <QuickStat label="Intelligence" value={docs.length} icon={Files} color="blue" />
          <QuickStat label="Enrolled" value={stats.users.active} icon={ShieldCheck} color="emerald" />
        </div>
      </header>

      <div className="flex border-b border-zinc-800 gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <button onClick={() => setActiveTab('applications')} className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] relative ${activeTab === 'applications' ? 'text-orange-500' : 'text-zinc-600 hover:text-white'}`}>
          Vetting Queue ({stats.applications.pending})
          {activeTab === 'applications' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500" />}
        </button>
        <button onClick={() => setActiveTab('students')} className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] relative ${activeTab === 'students' ? 'text-emerald-500' : 'text-zinc-600 hover:text-white'}`}>
          Active Students ({stats.users.active})
          {activeTab === 'students' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />}
        </button>
        <button onClick={() => setActiveTab('docs')} className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] relative ${activeTab === 'docs' ? 'text-blue-500' : 'text-zinc-600 hover:text-white'}`}>
          Intelligence Management
          {activeTab === 'docs' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />}
        </button>
        <button onClick={() => setActiveTab('analytics')} className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] relative ${activeTab === 'analytics' ? 'text-purple-500' : 'text-zinc-600 hover:text-white'}`}>
          Analytics
          {activeTab === 'analytics' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500" />}
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
      ) : activeTab === 'analytics' ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-2">
            <PieChart size={20} className="text-purple-500" /> Analytics Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-sm font-black uppercase text-zinc-400 mb-4">User Distribution</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 text-xs">Total Users</span>
                  <span className="text-white font-bold">{stats.users.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-500 text-xs">Pending Approval</span>
                  <span className="text-orange-500 font-bold">{stats.users.pending}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-500 text-xs">Active Users</span>
                  <span className="text-emerald-500 font-bold">{stats.users.active}</span>
                </div>
              </div>
            </div>
            <div className="bg-black/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-sm font-black uppercase text-zinc-400 mb-4">Application Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 text-xs">Total Applications</span>
                  <span className="text-white font-bold">{stats.applications.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-500 text-xs">Pending Review</span>
                  <span className="text-orange-500 font-bold">{stats.applications.pending}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 text-xs">Approval Rate</span>
                  <span className="text-white font-bold">
                    {stats.applications.total > 0 
                      ? `${Math.round((stats.users.active / stats.applications.total) * 100)}%`
                      : '0%'}
                  </span>
                </div>
              </div>
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
                placeholder={`Search ${activeTab === 'applications' ? 'Applications' : 'Students'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/50 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-xs mono text-white focus:border-orange-500 transition-all outline-none"
              />
            </div>
            <button 
              onClick={loadData}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all"
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredData.length === 0 ? (
              <div className="p-20 text-center border-2 border-dashed border-zinc-800 rounded-2xl">
                <Database size={40} className="mx-auto text-zinc-800 mb-4" />
                <p className="text-zinc-600 uppercase font-black tracking-widest text-xs">
                  {activeTab === 'applications' ? 'No Pending Applications' : 'No Active Students'}
                </p>
              </div>
            ) : (
              filteredData.map((item) => (
                <CandidateCard 
                  key={item.id} 
                  data={item} 
                  type={activeTab}
                  onApprove={activeTab === 'applications' ? () => {
                    const handle = prompt('Enter platform handle for approval:');
                    if (handle && item.user_id) {
                      approveApplication(item.user_id, handle);
                    }
                  } : undefined}
                  onReject={activeTab === 'applications' && item.user_id ? 
                    () => rejectApplication(item.user_id!) : undefined}
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
    zinc: "text-zinc-400 bg-zinc-800/50 border-zinc-800",
    purple: "text-purple-500 bg-purple-500/5 border-purple-500/10"
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

const CandidateCard = ({ data, type, onApprove, onReject }: any) => {
  const isApplication = type === 'applications';
  const name = isApplication ? `${data.first_name} ${data.last_name}` : `${data.first_name} ${data.last_name}`;
  const email = data.email;
  const status = isApplication ? data.status : data.status;
  const platformHandle = isApplication ? data.handle : data.platform_handle;
  const motivation = isApplication ? data.motivation : 'Active student account';
  const createdAt = new Date(data.created_at).toLocaleDateString();

  return (
    <div className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all shadow-xl">
      <div className="flex flex-col lg:flex-row">
        <div className="p-6 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-zinc-800 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center text-zinc-500 font-black text-xl">
              {name.charAt(0)}
            </div>
            <div className="space-y-1 overflow-hidden">
              <h3 className="font-black text-white uppercase tracking-tight truncate">{name}</h3>
              <div className="flex flex-col gap-1">
                <span className={`w-fit text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                  status === 'active' || status === 'Accepted' ? 'bg-emerald-500 text-black' : 
                  status === 'rejected' || status === 'Rejected' ? 'bg-red-500 text-black' : 
                  'bg-orange-500/20 text-orange-500'
                }`}>
                  {status}
                </span>
                {platformHandle && (
                  <span className="text-[9px] text-orange-500 font-black tracking-widest mono">@{platformHandle}</span>
                )}
              </div>
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 font-bold uppercase mono truncate">{email}</p>
          <p className="text-[9px] text-zinc-600 font-bold uppercase">Joined: {createdAt}</p>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between bg-black/20">
          <div className="space-y-2">
            <p className="text-[9px] font-black text-zinc-600 uppercase">
              {isApplication ? 'Motivation Extract' : 'Account Type'}
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed italic">
              {isApplication ? `"${motivation || 'No motivation provided.'}"` : data.account_type.toUpperCase()}
            </p>
            {isApplication && data.experience && (
              <div className="mt-2">
                <p className="text-[9px] font-black text-zinc-600 uppercase">Experience</p>
                <p className="text-xs text-zinc-400 leading-relaxed">{data.experience}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end mt-4 gap-2">
            {isApplication && onApprove && (
              <button onClick={onApprove} className="px-4 py-2 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest rounded hover:bg-white transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                <UserPlus size={14} /> Approve
              </button>
            )}
            {isApplication && onReject && (
              <button onClick={onReject} className="px-4 py-2 bg-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded hover:bg-red-500 hover:text-white transition-all flex items-center gap-2">
                <XCircle size={14} /> Reject
              </button>
            )}
            {!isApplication && data.account_type === 'premium' && (
              <span className="text-[9px] font-black uppercase text-orange-500">Premium Student</span>
            )}
            {!isApplication && data.account_type === 'simple' && (
              <span className="text-[9px] font-black uppercase text-zinc-700">Observer Status</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add RefreshCw icon import
const RefreshCw = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
);

export default AdminPanel;
