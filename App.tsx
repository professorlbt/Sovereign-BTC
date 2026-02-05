
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, BookOpen, Calculator, Terminal, AlertTriangle, ScrollText, 
  Menu, X, Info, LayoutDashboard, ExternalLink, LineChart, 
  User, Lock, UserPlus, LogIn, LogOut, Settings, UploadCloud, Users, PlayCircle, Folder, History,
  FileSearch, Files
} from 'lucide-react';

import Home from './pages/Home';
import Rules from './pages/Rules';
import CourseOverview from './pages/CourseOverview';
import ModuleDetail from './pages/ModuleDetail';
import CheckpointPage from './pages/CheckpointPage';
import Resources from './pages/Resources';
import Blog from './pages/Blog';
import Disclaimer from './pages/Disclaimer';
import About from './pages/About';
import Auth from './pages/Auth';
import AdminPanel from './pages/AdminPanel';
import AdminUpload from './pages/AdminUpload';
import CourseRegistration from './pages/CourseRegistration';
import Vault from './pages/Vault';
import WatchModule from './pages/WatchModule';
import Journal from './pages/Journal';
import DetailedGuide from './pages/DetailedGuide';
import Documents from './pages/Documents';

const SidebarLink = ({ to, icon: Icon, children, onClick }: { to: string, icon: any, children?: React.ReactNode, onClick?: () => void }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded transition-all ${
        isActive ? 'bg-orange-500/10 text-orange-500 border-l-2 border-orange-500' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
      }`}
    >
      <Icon size={18} />
      <span className="text-sm font-medium tracking-wide">{children}</span>
    </Link>
  );
};

const Navigation = ({ isOpen, toggle, user, onLogout }: { isOpen: boolean, toggle: () => void, user: any, onLogout: () => void }) => {
  const isAdmin = user?.email === 'admin@sovereign.btc';
  const registrations = JSON.parse(localStorage.getItem('sovereign_registrations') || '[]');
  const isApproved = registrations.find((r: any) => (r.email === user?.email || r.platformEmail === user?.email) && r.status === 'Accepted');

  return (
    <nav className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0d0d0d] border-r border-zinc-800 transform transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-black">
          <Terminal size={20} />
        </div>
        <span className="font-bold tracking-tighter text-lg uppercase mono">Sovereign BTC</span>
      </div>
      
      <div className="p-4 flex flex-col gap-1 overflow-y-auto h-[calc(100vh-80px)]">
        <div className="text-[10px] uppercase tracking-widest text-zinc-600 mb-2 px-4">Core</div>
        <SidebarLink to="/" icon={LayoutDashboard} onClick={toggle}>Command Center</SidebarLink>
        <SidebarLink to="/guide" icon={FileSearch} onClick={toggle}>Detailed Guide</SidebarLink>
        <SidebarLink to="/rules" icon={Shield} onClick={toggle}>Protocol Rules</SidebarLink>
        <SidebarLink to="/about" icon={User} onClick={toggle}>The Mentor</SidebarLink>
        
        {isAdmin && (
          <>
            <div className="text-[10px] uppercase tracking-widest text-orange-500 mt-6 mb-2 px-4">Admin Console</div>
            <SidebarLink to="/admin" icon={Settings} onClick={toggle}>Operations</SidebarLink>
            <SidebarLink to="/admin/content" icon={UploadCloud} onClick={toggle}>Deploy Module</SidebarLink>
          </>
        )}

        <div className="text-[10px] uppercase tracking-widest text-zinc-600 mt-6 mb-2 px-4">Academy</div>
        {user && (
           <SidebarLink to="/journal" icon={History} onClick={toggle}>Tactical Journal</SidebarLink>
        )}
        {isApproved && (
           <SidebarLink to="/vault" icon={PlayCircle} onClick={toggle}>The Vault (Classroom)</SidebarLink>
        )}
        <SidebarLink to="/course" icon={BookOpen} onClick={toggle}>Course Roadmap</SidebarLink>
        <SidebarLink to="/documents" icon={Files} onClick={toggle}>Intelligence Files</SidebarLink>
        <SidebarLink to="/resources" icon={Calculator} onClick={toggle}>War Room Tools</SidebarLink>
        <SidebarLink to="/blog" icon={ScrollText} onClick={toggle}>Blogs</SidebarLink>

        <div className="mt-auto pt-6 border-t border-zinc-800/50 space-y-2">
          {!user ? (
            <SidebarLink to="/auth" icon={LogIn} onClick={toggle}>Member Access</SidebarLink>
          ) : (
            <div className="px-4 py-2 mb-2 bg-zinc-900 border border-zinc-800 rounded">
               <p className="text-[8px] font-black uppercase text-zinc-500 mb-1">Authenticated As:</p>
               <p className="text-[10px] font-bold text-orange-500 truncate">{user.email}</p>
               <p className="text-[9px] text-zinc-600 uppercase font-black tracking-tight">{user.status || 'Observer'}</p>
            </div>
          )}
          {user && (
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded text-red-500 hover:bg-red-500/10 transition-all"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium tracking-wide uppercase font-black text-[10px] tracking-widest">Disconnect Session</span>
            </button>
          )}
          <SidebarLink to="/disclaimer" icon={Info} onClick={toggle}>Disclaimer</SidebarLink>
        </div>
      </div>
    </nav>
  );
};

const Layout = ({ user, onLogout, children }: { user: any, onLogout: () => void, children?: React.ReactNode }) => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();
  const isRulesPage = location.pathname === '/rules';

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-zinc-200">
      <Navigation isOpen={isSidebarOpen} toggle={() => setSidebarOpen(false)} user={user} onLogout={onLogout} />
      
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0d0d0d]/80 backdrop-blur-md border-b border-zinc-800 z-40 flex items-center justify-between px-6">
        <span className="font-bold uppercase tracking-tighter mono">Sovereign BTC</span>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-zinc-400">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {!isRulesPage && (
        <div className="hidden lg:flex fixed top-0 left-64 right-0 h-12 bg-orange-500 text-black z-30 px-6 items-center justify-between font-bold text-xs uppercase tracking-widest overflow-hidden whitespace-nowrap">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><AlertTriangle size={14} /> ACTIVE PROTOCOL:</span>
            <span>BTCUSDT ONLY</span>
            <span className="text-black/50">|</span>
            <span>R-MULTIPLE RISK</span>
            <span className="text-black/50">|</span>
            <span>5-9 PM PKT</span>
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-[10px] opacity-70">SESSION: {user.email}</span>
              <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
            </div>
          ) : (
            <Link to="/auth" className="underline hover:text-white transition-colors">Authenticate to Enroll</Link>
          )}
        </div>
      )}

      <main className={`flex-1 pt-16 lg:pt-0 ${!isRulesPage ? 'lg:pt-12' : ''} lg:ml-64 p-6 lg:p-12 max-w-6xl mx-auto w-full`}>
        {children}
      </main>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('sovereign_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (u: any) => {
    setUser(u);
    localStorage.setItem('sovereign_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sovereign_user');
  };

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/about" element={<About />} />
          <Route path="/guide" element={<DetailedGuide />} />
          <Route path="/course" element={<CourseOverview user={user} />} />
          <Route path="/course/module/:moduleId" element={<ModuleDetail />} />
          <Route path="/course/checkpoint/:level" element={<CheckpointPage />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/documents" element={<Documents user={user} />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
          <Route path="/register-course" element={<CourseRegistration user={user} />} />
          <Route path="/vault" element={<Vault user={user} />} />
          <Route path="/watch/:moduleId" element={<WatchModule user={user} />} />
          <Route path="/journal" element={<Journal user={user} />} />
          {user?.email === 'admin@sovereign.btc' && (
            <>
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/content" element={<AdminUpload />} />
            </>
          )}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
