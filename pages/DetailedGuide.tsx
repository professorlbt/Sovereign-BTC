
import React from 'react';
import { 
  FileSearch, UserPlus, ShieldCheck, PlayCircle, History, 
  Calculator, ChevronRight, Terminal, Info, AlertTriangle, 
  ArrowRight, Target, Shield, BookOpen, Fingerprint, Lock, 
  Mail, Settings, HelpCircle
} from 'lucide-react';

const DetailedGuide = () => {
  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-24">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em] mono">
          <FileSearch size={14} /> Official Platform SOP V2.0
        </div>
        <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">
          User <span className="text-orange-500">Manual</span>
        </h1>
        <p className="text-zinc-500 text-lg max-w-2xl font-light">
          The definitive guide to initializing your professional identity and mastering the Sovereign BTC execution environment.
        </p>
      </header>

      {/* QUICK LINKS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickLinkCard title="Initialization" step="PHASE 01" icon={UserPlus} />
        <QuickLinkCard title="Vetting" step="PHASE 02" icon={ShieldCheck} />
        <QuickLinkCard title="Deployment" step="PHASE 03" icon={Target} />
        <QuickLinkCard title="Execution" step="PHASE 04" icon={History} />
      </div>

      {/* STEP 1: REGISTRATION */}
      <section className="space-y-10 pt-10 border-t border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-orange-500 font-black text-xl">1</div>
          <h2 className="text-3xl font-black uppercase tracking-tight">Phase I: Profile Initialization</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
              <UserPlus size={14} className="text-orange-500" /> Account Creation
            </h3>
            <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
              <p>
                To begin, you must establish a base identity. Navigate to the <span className="text-white">Member Access</span> tab.
              </p>
              <ul className="space-y-3 list-none">
                <li className="flex gap-3"><ArrowRight size={14} className="text-orange-500 shrink-0 mt-1" /> Use a professional email address (Gmail, Outlook, etc.). This serves as your initial Terminal ID.</li>
                <li className="flex gap-3"><ArrowRight size={14} className="text-orange-500 shrink-0 mt-1" /> Create a <span className="text-white font-bold underline decoration-orange-500">Security Key (Password)</span>. This key is permanent and must be complex.</li>
                <li className="flex gap-3"><ArrowRight size={14} className="text-orange-500 shrink-0 mt-1" /> Once registered, your account is in <strong>Standby Mode</strong>. You have read-access to the Rules and Blogs but restricted access to the Vault.</li>
              </ul>
            </div>
          </div>
          <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Fingerprint size={120} />
            </div>
            <div className="space-y-4 relative z-10">
              <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest border-b border-zinc-800 pb-2">Security Protocol</p>
              <p className="text-xs italic text-zinc-400">
                The password you set during registration will remain your password even after your identity is transitioned to the official platform domain. Protect it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 2: COURSE APPLICATION */}
      <section className="space-y-10 pt-10 border-t border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-orange-500 font-black text-xl">2</div>
          <h2 className="text-3xl font-black uppercase tracking-tight">Phase II: Enrollment Vetting</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center justify-center">
            <div className="text-center space-y-4">
               <Shield size={48} className="text-orange-500/30 mx-auto" />
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Manual Vetting Interface</p>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" /> Applying for the Course
            </h3>
            <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
              <p>
                Sovereign BTC is a gated community. You do not gain access until the lead mentor verifies your intent.
              </p>
              <ol className="space-y-3 list-decimal pl-5">
                <li>Go to the <span className="text-white">Command Center</span> or <span className="text-white">Course Roadmap</span>.</li>
                <li>Select <span className="text-orange-500 font-bold">Apply for Enrollment</span>.</li>
                <li>Fill in your <span className="text-white">Motivation Statement</span>. Be honest about your history, losses, and goals. Generic applications are rejected.</li>
                <li>Submit your Telegram/WhatsApp handle for potential direct verification.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 3: IDENTITY DEPLOYMENT */}
      <section className="space-y-10 pt-10 border-t border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-orange-500 font-black text-xl">3</div>
          <h2 className="text-3xl font-black uppercase tracking-tight">Phase III: Platform Deployment</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
              <Mail size={14} className="text-blue-500" /> Identity Issuance
            </h3>
            <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
              <p>
                Once approved, the system generates a professional platform identity.
              </p>
              <div className="p-5 bg-blue-500/5 border border-blue-500/20 rounded-xl space-y-3">
                <p className="text-xs text-white font-black uppercase tracking-widest">New Credentials Format:</p>
                <div className="p-3 bg-black/50 border border-zinc-800 rounded font-mono text-xs text-blue-400">
                  Identity: firstname.lastname@sovereign.btc<br/>
                  Security Key: [The password you set in Phase I]
                </div>
              </div>
              <p>
                An automated notification will be sent to your original email confirming your acceptance. From this point forward, use your <strong>@sovereign.btc</strong> handle to login.
              </p>
            </div>
          </div>
          <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-6">
            <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Login Protocol</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-zinc-800/30 border border-zinc-700 rounded-lg">
                <Lock size={16} className="text-orange-500" />
                <span className="text-[10px] uppercase font-bold text-zinc-400">Security Key remains the same for continuity.</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-zinc-800/30 border border-zinc-700 rounded-lg">
                <Settings size={16} className="text-blue-500" />
                <span className="text-[10px] uppercase font-bold text-zinc-400">Admin has override authority if keys are forgotten.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 4: OPERATIONS */}
      <section className="space-y-10 pt-10 border-t border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-orange-500 font-black text-xl">4</div>
          <h2 className="text-3xl font-black uppercase tracking-tight">Phase IV: Environment Operations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <OperationModule 
            title="The Vault (Academy)" 
            icon={PlayCircle}
            rules={["Watch in HD", "Take notes in physical journal", "Mark as complete manually"]}
          />
          <OperationModule 
            title="Tactical Journal" 
            icon={History}
            rules={["One entry per session", "Attach screenshot link", "Calculate R-Multiple strictly"]}
          />
          <OperationModule 
            title="War Room" 
            icon={Calculator}
            rules={["Validate position size", "Check Session Timer", "Check ATR Stop distance"]}
          />
        </div>

        <div className="p-10 bg-zinc-900 border border-zinc-800 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <HelpCircle size={150} />
          </div>
          <div className="space-y-6 relative z-10">
            <h3 className="text-xl font-black uppercase tracking-tighter">Maintenance & Password Recovery</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm text-zinc-400 leading-relaxed">
              <div className="space-y-3">
                <p className="text-white font-bold uppercase tracking-widest text-[10px]">What if I forget my password?</p>
                <p>Because this platform handles high-level trading identities, password recovery is manual. You must contact the Admin/Mentor via the links in the <span className="text-white">About</span> page. The Admin has the authority to reset your Security Key via the Root Authority Console.</p>
              </div>
              <div className="space-y-3">
                <p className="text-white font-bold uppercase tracking-widest text-[10px]">What is my login handle?</p>
                <p>After approval, your login handle is always in the format <code>firstname.lastname@sovereign.btc</code>. You can find this on your dashboard once logged in. If you cannot login, try your original email address as a backup identifier.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center py-12 border-t border-zinc-800">
         <p className="text-zinc-700 text-[10px] uppercase tracking-[0.5em] font-black">Sovereign BTC Documentation // Protocol Version 2.0.1</p>
      </footer>
    </div>
  );
};

const QuickLinkCard = ({ title, step, icon: Icon }: any) => (
  <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3 group hover:border-orange-500/30 transition-all">
    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 group-hover:text-orange-500 transition-colors">
      <Icon size={20} />
    </div>
    <div>
      <p className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.2em]">{step}</p>
      <h4 className="text-xs font-black uppercase tracking-tight text-white">{title}</h4>
    </div>
  </div>
);

const OperationModule = ({ title, icon: Icon, rules }: { title: string, icon: any, rules: string[] }) => (
  <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-6">
    <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
      <Icon size={18} className="text-orange-500" />
      <h4 className="text-sm font-black uppercase tracking-tight">{title}</h4>
    </div>
    <ul className="space-y-3">
      {rules.map((rule, i) => (
        <li key={i} className="flex gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          <ArrowRight size={12} className="text-orange-500/50 shrink-0" /> {rule}
        </li>
      ))}
    </ul>
  </div>
);

export default DetailedGuide;
