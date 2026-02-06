import React, { useState, useEffect } from 'react';
import { 
  Users, FileText, CheckCircle2, XCircle, Clock, Activity, 
  Settings, Database, Server, Search, Filter, MessageCircle, 
  Mail, ArrowUpRight, PieChart, UserPlus, ShieldCheck, Trash2,
  ScrollText, Plus, Save, ChevronDown, PenTool, Key, Check,
  Files, Lock, Eye, Download, UploadCloud, LogOut, RefreshCw,
  Star, Crown, CreditCard, AlertCircle, Bell, UserCog, Zap,
  BarChart, TrendingUp, Globe, Shield, Award, Target, MailOpen,
  EyeOff, CheckSquare, XSquare, Edit, MoreVertical, Calendar,
  Clock3, DollarSign, UserCheck, UserX, Loader2, ExternalLink
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
    premium: number;
    simple: number;
  };
  applications: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  revenue?: {
    total: number;
    monthly: number;
    pending: number;
  };
  activity?: {
    daily_logins: number;
    active_sessions: number;
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
  requested_tier?: 'simple' | 'premium';
  notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  account_type: 'simple' | 'premium' | 'admin';
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  role: string;
  platform_handle?: string;
  created_at: string;
  last_login?: string;
  subscription_end?: string;
  payment_status?: 'active' | 'pending' | 'cancelled' | 'expired';
  total_sessions?: number;
  notes?: string;
}

interface Doc {
  id: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  fileSize: string;
  date: string;
  isPremiumOnly: boolean;
  downloads: number;
  tags: string[];
}

interface AnalyticsData {
  dailySignups: { date: string; count: number }[];
  userGrowth: { month: string; count: number }[];
  topDocuments: { title: string; downloads: number }[];
  activityHeatmap: { hour: number; day: number; count: number }[];
}

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminEmail] = useState('admin@sovereign.btc');
  
  const [stats, setStats] = useState<AdminStats>({
    users: { total: 0, pending: 0, active: 0, premium: 0, simple: 0 },
    applications: { total: 0, pending: 0, approved: 0, rejected: 0 }
  });
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'applications' | 'students' | 'premium' | 'docs' | 'analytics' | 'settings'>('applications');
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [userEditForm, setUserEditForm] = useState({
    account_type: 'simple' as 'simple' | 'premium',
    status: 'active' as 'pending' | 'active' | 'suspended' | 'inactive',
    notes: ''
  });
  
  // Advanced filtering
  const [filters, setFilters] = useState({
    status: 'all',
    accountType: 'all',
    dateRange: 'all',
    searchType: 'name'
  });
  
  // Analytics data
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    dailySignups: [],
    userGrowth: [],
    topDocuments: [],
    activityHeatmap: []
  });
  
  // Doc form state
  const [docs, setDocs] = useState<Doc[]>([]);
  const [newDoc, setNewDoc] = useState({
    title: '',
    description: '',
    isPremiumOnly: true,
    category: 'Manuals',
    tags: [] as string[]
  });

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
    loadLocalDocs();
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      if (activeTab === 'analytics') {
        loadAnalytics();
      }
    }
  }, [isAuthenticated, activeTab]);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    const expiry = localStorage.getItem('admin_token_expiry');
    
    if (!token || !expiry) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }
    
    if (Date.now() > parseInt(expiry)) {
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
        
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_token_expiry', 
          (Date.now() + 8 * 60 * 60 * 1000).toString()
        );
        
        setIsAuthenticated(true);
        setAdminPassword('');
        showToast('success', 'Authentication successful');
      } else {
        const error = await response.json();
        showToast('error', error.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast('error', 'Connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_token_expiry');
    setIsAuthenticated(false);
    setStats({
      users: { total: 0, pending: 0, active: 0, premium: 0, simple: 0 },
      applications: { total: 0, pending: 0, approved: 0, rejected: 0 }
    });
    setApplications([]);
    setUsers([]);
    showToast('info', 'Logged out');
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
      showToast('error', 'Failed to load data');
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/analytics`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
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
        showToast('success', `User ${userId} approved with handle ${platformHandle}`);
        loadData();
      } else {
        const error = await response.json();
        showToast('error', error.message || 'Failed to approve');
      }
    } catch (error) {
      console.error('Approval error:', error);
      showToast('error', 'Failed to approve user');
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
        showToast('success', `User ${userId} rejected`);
        loadData();
      } else {
        const error = await response.json();
        showToast('error', error.message || 'Failed to reject');
      }
    } catch (error) {
      console.error('Rejection error:', error);
      showToast('error', 'Failed to reject user');
    }
  };

  // NEW: Approve premium user
  const approvePremiumUser = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE}/admin/upgrade-to-premium`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId })
      });
      
      if (response.ok) {
        showToast('success', `User ${userId} upgraded to premium`);
        loadData();
      } else {
        const error = await response.json();
        showToast('error', error.message || 'Failed to upgrade user');
      }
    } catch (error) {
      console.error('Premium upgrade error:', error);
      showToast('error', 'Failed to upgrade user');
    }
  };

  // NEW: Downgrade premium user
  const downgradeToSimple = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE}/admin/downgrade-to-simple`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId })
      });
      
      if (response.ok) {
        showToast('success', `User ${userId} downgraded to simple`);
        loadData();
      } else {
        const error = await response.json();
        showToast('error', error.message || 'Failed to downgrade user');
      }
    } catch (error) {
      console.error('Downgrade error:', error);
      showToast('error', 'Failed to downgrade user');
    }
  };

  // NEW: Update user details
  const updateUser = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE}/admin/update-user`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          userId, 
          ...userEditForm 
        })
      });
      
      if (response.ok) {
        showToast('success', `User ${userId} updated successfully`);
        loadData();
        setIsEditingUser(false);
        setSelectedUser(null);
      } else {
        const error = await response.json();
        showToast('error', error.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Update error:', error);
      showToast('error', 'Failed to update user');
    }
  };

  // NEW: Suspend user
  const suspendUser = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE}/admin/suspend-user`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId })
      });
      
      if (response.ok) {
        showToast('success', `User ${userId} suspended`);
        loadData();
      } else {
        const error = await response.json();
        showToast('error', error.message || 'Failed to suspend user');
      }
    } catch (error) {
      console.error('Suspend error:', error);
      showToast('error', 'Failed to suspend user');
    }
  };

  // NEW: Activate user
  const activateUser = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE}/admin/activate-user`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId })
      });
      
      if (response.ok) {
        showToast('success', `User ${userId} activated`);
        loadData();
      } else {
        const error = await response.json();
        showToast('error', error.message || 'Failed to activate user');
      }
    } catch (error) {
      console.error('Activate error:', error);
      showToast('error', 'Failed to activate user');
    }
  };

  // NEW: Send email to user
  const sendEmailToUser = async (userId: number, subject: string, message: string) => {
    try {
      const response = await fetch(`${API_BASE}/admin/send-email`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId, subject, message })
      });
      
      if (response.ok) {
        showToast('success', 'Email sent successfully');
      } else {
        const error = await response.json();
        showToast('error', error.message || 'Failed to send email');
      }
    } catch (error) {
      console.error('Email error:', error);
      showToast('error', 'Failed to send email');
    }
  };

  const showToast = (type: 'success' | 'error' | 'info', msg: string) => {
    setNotification({ type, message: msg });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadLocalDocs = () => {
    const savedDocs = JSON.parse(localStorage.getItem('sovereign_docs') || '[]');
    setDocs(savedDocs);
  };

  const deleteDoc = (id: string) => {
    const updated = docs.filter(d => d.id !== id);
    setDocs(updated);
    localStorage.setItem('sovereign_docs', JSON.stringify(updated));
    showToast('success', 'Document purged from archives.');
  };

  const addDoc = (e: React.FormEvent) => {
    e.preventDefault();
    const doc: Doc = {
      ...newDoc,
      id: Date.now().toString(),
      fileUrl: '#',
      fileSize: '1.0 MB',
      date: new Date().toISOString().split('T')[0],
      downloads: 0,
      tags: newDoc.tags
    };
    const updated = [doc, ...docs];
    setDocs(updated);
    localStorage.setItem('sovereign_docs', JSON.stringify(updated));
    setNewDoc({ title: '', description: '', isPremiumOnly: true, category: 'Manuals', tags: [] });
    showToast('success', 'New intelligence file deployed.');
  };

  // Filter data based on active tab and filters
  const filteredData = () => {
    let data: any[] = [];
    
    if (activeTab === 'applications') {
      data = applications;
    } else if (activeTab === 'students') {
      data = users.filter(user => user.account_type !== 'premium');
    } else if (activeTab === 'premium') {
      data = users.filter(user => user.account_type === 'premium');
    }

    // Apply search filter
    if (searchQuery) {
      data = data.filter(item => {
        const query = searchQuery.toLowerCase();
        return (
          item.first_name?.toLowerCase().includes(query) ||
          item.last_name?.toLowerCase().includes(query) ||
          item.email?.toLowerCase().includes(query) ||
          item.platform_handle?.toLowerCase().includes(query) ||
          item.handle?.toLowerCase().includes(query)
        );
      });
    }

    // Apply status filter
    if (filters.status !== 'all') {
      data = data.filter(item => item.status === filters.status);
    }

    // Apply account type filter
    if (filters.accountType !== 'all' && activeTab !== 'applications') {
      data = data.filter(item => item.account_type === filters.accountType);
    }

    return data;
  };

  // NEW: Export data to CSV
  const exportToCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showToast('success', `Exported ${data.length} records`);
  };

  // NEW: Bulk actions
  const handleBulkAction = async (action: string, selectedIds: number[]) => {
    switch (action) {
      case 'approve':
        for (const id of selectedIds) {
          await approvePremiumUser(id);
        }
        break;
      case 'downgrade':
        for (const id of selectedIds) {
          await downgradeToSimple(id);
        }
        break;
      case 'suspend':
        for (const id of selectedIds) {
          await suspendUser(id);
        }
        break;
      case 'activate':
        for (const id of selectedIds) {
          await activateUser(id);
        }
        break;
    }
  };

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
              className="w-full py-3 bg-orange-500 text-black font-black uppercase tracking-widest text-sm rounded-lg hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
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
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-20 right-8 z-[100] px-6 py-4 rounded-xl font-black uppercase text-xs shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 ${
          notification.type === 'success' ? 'bg-emerald-500 text-black' :
          notification.type === 'error' ? 'bg-red-500 text-black' :
          'bg-blue-500 text-black'
        }`}>
          <Check size={18} /> {notification.message}
        </div>
      )}

      {/* User Edit Modal */}
      {isEditingUser && selectedUser && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-lg w-full space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black uppercase">Edit User: {selectedUser.first_name} {selectedUser.last_name}</h3>
              <button onClick={() => setIsEditingUser(false)} className="text-zinc-500 hover:text-white">
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Account Type</label>
                <select 
                  value={userEditForm.account_type}
                  onChange={(e) => setUserEditForm({...userEditForm, account_type: e.target.value as any})}
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-sm"
                >
                  <option value="simple">Simple User</option>
                  <option value="premium">Premium User</option>
                </select>
              </div>
              
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Status</label>
                <select 
                  value={userEditForm.status}
                  onChange={(e) => setUserEditForm({...userEditForm, status: e.target.value as any})}
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-sm"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Admin Notes</label>
                <textarea 
                  value={userEditForm.notes}
                  onChange={(e) => setUserEditForm({...userEditForm, notes: e.target.value})}
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-sm h-32"
                  placeholder="Add notes about this user..."
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => updateUser(selectedUser.id)}
                className="flex-1 py-3 bg-emerald-500 text-black font-black uppercase tracking-widest text-sm rounded-lg hover:bg-white transition-all"
              >
                Save Changes
              </button>
              <button 
                onClick={() => setIsEditingUser(false)}
                className="flex-1 py-3 bg-zinc-800 text-white font-black uppercase tracking-widest text-sm rounded-lg hover:bg-zinc-700 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
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
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full lg:w-auto">
          <QuickStat label="Ledger Size" value={stats.users.total} icon={Users} color="zinc" />
          <QuickStat label="Queue" value={stats.applications.pending} icon={Clock} color="orange" />
          <QuickStat label="Intelligence" value={docs.length} icon={Files} color="blue" />
          <QuickStat label="Premium" value={stats.users.premium} icon={Crown} color="purple" />
          <QuickStat label="Enrolled" value={stats.users.active} icon={ShieldCheck} color="emerald" />
        </div>
      </header>

      <div className="flex border-b border-zinc-800 gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <TabButton active={activeTab === 'applications'} onClick={() => setActiveTab('applications')} icon={Clock}>
          Vetting Queue ({stats.applications.pending})
        </TabButton>
        <TabButton active={activeTab === 'students'} onClick={() => setActiveTab('students')} icon={Users}>
          Active Students ({stats.users.simple})
        </TabButton>
        <TabButton active={activeTab === 'premium'} onClick={() => setActiveTab('premium')} icon={Crown}>
          Premium Users ({stats.users.premium})
        </TabButton>
        <TabButton active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} icon={Files}>
          Intelligence Management
        </TabButton>
        <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={BarChart}>
          Analytics
        </TabButton>
        <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={Settings}>
          Settings
        </TabButton>
      </div>

      {/* Advanced Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/50 p-4 border border-zinc-800 rounded-xl">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
          <input 
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/50 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-xs mono text-white focus:border-orange-500 transition-all outline-none"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select 
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="bg-black/50 border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
          
          <select 
            value={filters.accountType}
            onChange={(e) => setFilters({...filters, accountType: e.target.value})}
            className="bg-black/50 border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white"
          >
            <option value="all">All Types</option>
            <option value="simple">Simple</option>
            <option value="premium">Premium</option>
          </select>
          
          <button 
            onClick={loadData}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          
          <button 
            onClick={() => exportToCSV(filteredData(), activeTab)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all"
          >
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'docs' ? (
        <DocManagement 
          docs={docs} 
          newDoc={newDoc} 
          setNewDoc={setNewDoc}
          addDoc={addDoc}
          deleteDoc={deleteDoc}
        />
      ) : activeTab === 'analytics' ? (
        <AnalyticsDashboard 
          stats={stats}
          analytics={analytics}
          users={users}
        />
      ) : activeTab === 'settings' ? (
        <SettingsPanel />
      ) : (
        <div className="space-y-6">
          {activeTab === 'premium' && (
            <div className="bg-gradient-to-r from-purple-500/10 to-orange-500/10 border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Crown className="text-purple-500" size={24} />
                  <div>
                    <h3 className="text-lg font-black uppercase">Premium User Management</h3>
                    <p className="text-xs text-zinc-500">Manage premium subscriptions and access levels</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-purple-500">Total Revenue</p>
                  <p className="text-2xl font-black mono">${stats.revenue?.total || 0}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            {filteredData().length === 0 ? (
              <EmptyState activeTab={activeTab} />
            ) : (
              filteredData().map((item) => (
                <EnhancedCandidateCard 
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
                  onUpgrade={activeTab === 'students' || activeTab === 'premium' ? () => {
                    if (item.account_type === 'simple') {
                      approvePremiumUser(item.id);
                    } else {
                      downgradeToSimple(item.id);
                    }
                  } : undefined}
                  onEdit={() => {
                    setSelectedUser(item);
                    setUserEditForm({
                      account_type: item.account_type,
                      status: item.status,
                      notes: item.notes || ''
                    });
                    setIsEditingUser(true);
                  }}
                  onSuspend={() => suspendUser(item.id)}
                  onActivate={() => activateUser(item.id)}
                  onEmail={() => {
                    const subject = prompt('Email subject:');
                    const message = prompt('Email message:');
                    if (subject && message) {
                      sendEmailToUser(item.id, subject, message);
                    }
                  }}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced QuickStat Component
const QuickStat = ({ label, value, icon: Icon, color }: any) => {
  const colors: any = {
    orange: "text-orange-500 bg-orange-500/5 border-orange-500/10",
    emerald: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10",
    blue: "text-blue-500 bg-blue-500/5 border-blue-500/10",
    zinc: "text-zinc-400 bg-zinc-800/50 border-zinc-800",
    purple: "text-purple-500 bg-purple-500/5 border-purple-500/10",
    red: "text-red-500 bg-red-500/5 border-red-500/10"
  };
  return (
    <div className={`p-4 border rounded-xl flex items-center gap-4 ${colors[color]} hover:scale-[1.02] transition-transform`}>
      <div className="shrink-0"><Icon size={20} /></div>
      <div>
        <div className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-0.5">{label}</div>
        <div className="text-xl font-black mono text-white leading-none">{value}</div>
      </div>
    </div>
  );
};

// Enhanced Candidate Card with More Actions
const EnhancedCandidateCard = ({ data, type, onApprove, onReject, onUpgrade, onEdit, onSuspend, onActivate, onEmail }: any) => {
  const isApplication = type === 'applications';
  const isPremium = data.account_type === 'premium';
  const name = `${data.first_name} ${data.last_name}`;
  const email = data.email;
  const status = data.status;
  const platformHandle = data.platform_handle || data.handle;
  const motivation = data.motivation;
  const createdAt = new Date(data.created_at).toLocaleDateString();
  const lastLogin = data.last_login ? new Date(data.last_login).toLocaleDateString() : 'Never';

  const [showActions, setShowActions] = useState(false);

  return (
    <div className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all shadow-xl">
      <div className="flex flex-col lg:flex-row">
        {/* Left Column - User Info */}
        <div className="p-6 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-zinc-800 space-y-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 border rounded-lg flex items-center justify-center text-lg font-black ${
              isPremium ? 'bg-purple-500/10 border-purple-500/20 text-purple-500' :
              'bg-zinc-800 border-zinc-700 text-zinc-500'
            }`}>
              {name.charAt(0)}
            </div>
            <div className="space-y-1 overflow-hidden">
              <h3 className="font-black text-white uppercase tracking-tight truncate">{name}</h3>
              <div className="flex flex-wrap gap-1">
                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                  status === 'active' ? 'bg-emerald-500 text-black' : 
                  status === 'suspended' ? 'bg-red-500 text-black' : 
                  status === 'pending' ? 'bg-orange-500 text-black' :
                  'bg-zinc-800 text-zinc-400'
                }`}>
                  {status}
                </span>
                {isPremium && (
                  <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-purple-500 text-black">
                    <Crown size={8} className="inline mr-1" /> PREMIUM
                  </span>
                )}
                {platformHandle && (
                  <span className="text-[8px] text-orange-500 font-black mono">@{platformHandle}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-[10px] text-zinc-500 font-bold uppercase mono truncate">{email}</p>
            <div className="flex justify-between text-[9px] text-zinc-600 font-bold uppercase">
              <span>Joined: {createdAt}</span>
              {!isApplication && <span>Last: {lastLogin}</span>}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2">
            <button 
              onClick={onEdit}
              className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] font-black uppercase rounded flex items-center justify-center gap-1"
            >
              <Edit size={12} /> Edit
            </button>
            <button 
              onClick={() => setShowActions(!showActions)}
              className="py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] font-black uppercase rounded"
            >
              <MoreVertical size={12} />
            </button>
          </div>
        </div>

        {/* Right Column - Details and Actions */}
        <div className="p-6 flex-1 flex flex-col justify-between bg-black/20">
          <div className="space-y-3">
            {isApplication ? (
              <>
                <div>
                  <p className="text-[9px] font-black text-zinc-600 uppercase">Motivation</p>
                  <p className="text-xs text-zinc-400 leading-relaxed italic line-clamp-2">
                    "{motivation || 'No motivation provided.'}"
                  </p>
                </div>
                {data.experience && (
                  <div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase">Experience</p>
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{data.experience}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-black text-zinc-600 uppercase">Account Type</p>
                  <p className="text-sm font-black text-white">{data.account_type.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-600 uppercase">Sessions</p>
                  <p className="text-sm font-black text-white">{data.total_sessions || 0}</p>
                </div>
                {data.subscription_end && (
                  <div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase">Renews</p>
                    <p className="text-sm font-black text-white">{new Date(data.subscription_end).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-6">
            {isApplication ? (
              <>
                <button onClick={onApprove} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black text-[10px] font-black uppercase tracking-widest rounded flex items-center gap-2">
                  <UserPlus size={14} /> Approve
                </button>
                <button onClick={onReject} className="px-4 py-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white text-[10px] font-black uppercase tracking-widest rounded flex items-center gap-2">
                  <XCircle size={14} /> Reject
                </button>
              </>
            ) : (
              <>
                <button onClick={onUpgrade} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded flex items-center gap-2 ${
                  isPremium 
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white'
                    : 'bg-purple-500 hover:bg-purple-600 text-black'
                }`}>
                  {isPremium ? <UserCheck size={14} /> : <Crown size={14} />}
                  {isPremium ? 'Downgrade' : 'Upgrade'}
                </button>
                {status === 'active' ? (
                  <button onClick={onSuspend} className="px-4 py-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white text-[10px] font-black uppercase tracking-widest rounded flex items-center gap-2">
                    <UserX size={14} /> Suspend
                  </button>
                ) : (
                  <button onClick={onActivate} className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-500 hover:text-black text-[10px] font-black uppercase tracking-widest rounded flex items-center gap-2">
                    <UserCheck size={14} /> Activate
                  </button>
                )}
                <button onClick={onEmail} className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500 text-blue-500 hover:text-white text-[10px] font-black uppercase tracking-widest rounded flex items-center gap-2">
                  <Mail size={14} /> Email
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown Actions Menu */}
      {showActions && (
        <div className="absolute right-2 top-14 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-10 min-w-[200px]">
          <div className="p-2 space-y-1">
            <button className="w-full text-left px-3 py-2 text-xs hover:bg-zinc-800 rounded flex items-center gap-2">
              <Eye size={14} /> View Profile
            </button>
            <button className="w-full text-left px-3 py-2 text-xs hover:bg-zinc-800 rounded flex items-center gap-2">
              <MessageCircle size={14} /> Send Message
            </button>
            <button className="w-full text-left px-3 py-2 text-xs hover:bg-zinc-800 rounded flex items-center gap-2">
              <CreditCard size={14} /> View Payments
            </button>
            <button className="w-full text-left px-3 py-2 text-xs hover:bg-zinc-800 rounded flex items-center gap-2">
              <Activity size={14} /> View Activity
            </button>
            <hr className="border-zinc-800 my-1" />
            <button className="w-full text-left px-3 py-2 text-xs hover:bg-red-500/10 text-red-500 rounded flex items-center gap-2">
              <Trash2 size={14} /> Delete User
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Tab Button Component
const TabButton = ({ active, onClick, icon: Icon, children }: any) => (
  <button 
    onClick={onClick} 
    className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] relative whitespace-nowrap flex items-center gap-2 ${
      active ? 'text-white' : 'text-zinc-600 hover:text-white'
    }`}
  >
    <Icon size={14} />
    {children}
    {active && <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500" />}
  </button>
);

// Doc Management Component
const DocManagement = ({ docs, newDoc, setNewDoc, addDoc, deleteDoc }: any) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
    <div className="lg:col-span-7 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <Database size={20} className="text-zinc-500" /> Current Archives
        </h2>
        <span className="text-xs text-zinc-500 font-black uppercase">
          {docs.length} documents
        </span>
      </div>
      <div className="space-y-4">
        {docs.map((doc: any) => (
          <div key={doc.id} className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between group hover:border-zinc-700">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded ${doc.isPremiumOnly ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                <FileText size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-black uppercase text-white tracking-tight">{doc.title}</h4>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                  {doc.category} // {doc.isPremiumOnly ? 'PREMIUM' : 'PUBLIC'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[8px] text-zinc-600">{doc.downloads || 0} downloads</span>
                  {doc.tags?.map((tag: string) => (
                    <span key={tag} className="text-[8px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-zinc-700 hover:text-blue-500 transition-colors">
                <Edit size={14} />
              </button>
              <button onClick={() => deleteDoc(doc.id)} className="p-2 text-zinc-700 hover:text-red-500 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

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
            <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Category</label>
            <select 
              value={newDoc.category}
              onChange={e => setNewDoc({...newDoc, category: e.target.value})}
              className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-xs focus:border-blue-500 outline-none"
            >
              <option value="Manuals">Manuals</option>
              <option value="Protocols">Protocols</option>
              <option value="Templates">Templates</option>
              <option value="Guides">Guides</option>
              <option value="Reports">Reports</option>
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
);

// Analytics Dashboard Component
const AnalyticsDashboard = ({ stats, analytics, users }: any) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-sm font-black uppercase text-zinc-400 mb-4">User Growth</h3>
        <div className="text-3xl font-black mono text-white">{stats.users.total}</div>
        <p className="text-xs text-zinc-500 mt-2">Total registered users</p>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-sm font-black uppercase text-zinc-400 mb-4">Premium Conversion</h3>
        <div className="text-3xl font-black mono text-purple-500">
          {stats.users.total > 0 ? `${Math.round((stats.users.premium / stats.users.total) * 100)}%` : '0%'}
        </div>
        <p className="text-xs text-zinc-500 mt-2">Premium user rate</p>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-sm font-black uppercase text-zinc-400 mb-4">Active Sessions</h3>
        <div className="text-3xl font-black mono text-emerald-500">
          {stats.activity?.active_sessions || 0}
        </div>
        <p className="text-xs text-zinc-500 mt-2">Currently active</p>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-sm font-black uppercase text-zinc-400 mb-4">Approval Rate</h3>
        <div className="text-3xl font-black mono text-orange-500">
          {stats.applications.total > 0 ? `${Math.round((stats.applications.approved / stats.applications.total) * 100)}%` : '0%'}
        </div>
        <p className="text-xs text-zinc-500 mt-2">Application success</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-sm font-black uppercase text-zinc-400 mb-6 flex items-center gap-2">
          <TrendingUp size={16} /> User Distribution
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-sm">Premium Users</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">{stats.users.premium}</span>
              <span className="text-xs text-purple-500 font-black">{Math.round((stats.users.premium / stats.users.total) * 100)}%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-sm">Simple Users</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">{stats.users.simple}</span>
              <span className="text-xs text-blue-500 font-black">{Math.round((stats.users.simple / stats.users.total) * 100)}%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-sm">Pending Approval</span>
            <div className="flex items-center gap-2">
              <span className="text-orange-500 font-bold">{stats.users.pending}</span>
              <span className="text-xs text-orange-500 font-black">Awaiting</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-sm font-black uppercase text-zinc-400 mb-6 flex items-center gap-2">
          <Activity size={16} /> Recent Activity
        </h3>
        <div className="space-y-3">
          {users.slice(0, 5).map((user: any) => (
            <div key={user.id} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-xs">
                  {user.first_name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold">{user.first_name} {user.last_name}</p>
                  <p className="text-xs text-zinc-500">{user.email}</p>
                </div>
              </div>
              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                user.status === 'active' ? 'bg-emerald-500/20 text-emerald-500' :
                user.status === 'pending' ? 'bg-orange-500/20 text-orange-500' :
                'bg-red-500/20 text-red-500'
              }`}>
                {user.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Settings Panel Component
const SettingsPanel = () => (
  <div className="space-y-8">
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
      <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-2">
        <Settings size={20} className="text-zinc-500" /> System Configuration
      </h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Email Notifications</label>
            <select className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-sm mt-2">
              <option>Enabled</option>
              <option>Disabled</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Auto-approval</label>
            <select className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-sm mt-2">
              <option>Manual Only</option>
              <option>Auto (Verified Emails)</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Admin Email</label>
          <input 
            type="email"
            className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-sm mt-2"
            placeholder="admin@sovereign.btc"
          />
        </div>
        
        <button className="px-6 py-3 bg-orange-500 text-black font-black uppercase tracking-widest text-sm rounded-lg hover:bg-white transition-all">
          Save Configuration
        </button>
      </div>
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ activeTab }: any) => {
  const messages: any = {
    applications: 'No pending applications in the queue',
    students: 'No active students found',
    premium: 'No premium users found',
    analytics: 'No analytics data available'
  };
  
  return (
    <div className="p-20 text-center border-2 border-dashed border-zinc-800 rounded-2xl">
      <Database size={40} className="mx-auto text-zinc-800 mb-4" />
      <p className="text-zinc-600 uppercase font-black tracking-widest text-xs">
        {messages[activeTab] || 'No data available'}
      </p>
    </div>
  );
};

export default AdminPanel;
