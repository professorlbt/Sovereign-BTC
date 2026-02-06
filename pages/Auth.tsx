import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Terminal, Lock, UserPlus, LogIn, ShieldCheck, Mail, Fingerprint, 
  ChevronRight, ArrowRight, Shield, ShieldAlert, CheckSquare, Square,
  User, Info, GraduationCap, Globe, Loader2
} from 'lucide-react';

type AuthMode = 'login' | 'register-selection' | 'register-simple' | 'register-premium';

const Auth = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Protocol Checkboxes for Premium
  const [checks, setChecks] = useState({
    btc_only: false,
    london_ny_only: false,
    r_multiple_only: false,
    no_signal_expectation: false,
    discipline_over_profit: false,
    personal_risk_acceptance: false
  });

  const navigate = useNavigate();
  const API_BASE = 'https://sovereign-btc-worker.sovereign-btc.workers.dev';

  const allChecksPassed = Object.values(checks).every(Boolean);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        // Handle admin login
        if (email === 'admin@sovereign.btc') {
          const response = await fetch(`${API_BASE}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });

          if (response.ok) {
            const data = await response.json();
            const token = data.data.token;
            
            // Store token with expiry (8 hours)
            localStorage.setItem('admin_token', token);
            localStorage.setItem('admin_token_expiry', 
              (Date.now() + 8 * 60 * 60 * 1000).toString()
            );
            
            onLogin({ 
              email, 
              id: 'admin-root', 
              isAdmin: true, 
              status: 'Root Authority',
              token 
            });
            navigate('/admin');
            return;
          }
        }

        // Handle user login
        const response = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (response.ok) {
          const data = await response.json();
          const user = data.data.user;
          
          // Store session
          localStorage.setItem('user_token', data.data.sessionId);
          localStorage.setItem('user_data', JSON.stringify(user));
          
          onLogin({ 
            email: user.email, 
            id: user.id, 
            name: `${user.first_name} ${user.last_name}`, 
            status: user.status,
            type: user.account_type,
            role: user.role,
            platformHandle: user.platform_handle,
            isAdmin: user.role === 'admin'
          });
          
          navigate('/');
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Identity not found or Security Key incorrect. Verify your credentials.");
        }
      } else {
        // Handle registration
        const accountType = mode === 'register-premium' ? 'premium' : 'simple';
        
        const payload: any = {
          email,
          password,
          firstName: mode === 'register-premium' ? firstName : '',
          lastName: mode === 'register-premium' ? lastName : '',
          accountType
        };

        if (accountType === 'premium') {
          if (!allChecksPassed) {
            setError("All protocol affirmations must be accepted for premium accounts.");
            setIsLoading(false);
            return;
          }
          
          payload.affirmations = checks;
        }

        const response = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          
          // For simple accounts, auto-login
          if (accountType === 'simple') {
            const loginResponse = await fetch(`${API_BASE}/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
            });

            if (loginResponse.ok) {
              const loginData = await loginResponse.json();
              const user = loginData.data.user;
              
              localStorage.setItem('user_token', loginData.data.sessionId);
              localStorage.setItem('user_data', JSON.stringify(user));
              
              onLogin({ 
                email: user.email, 
                id: user.id, 
                name: `${user.first_name} ${user.last_name}`, 
                status: user.status,
                type: user.account_type,
                role: user.role,
                platformHandle: user.platform_handle
              });
              
              navigate('/');
            }
          } else {
            // For premium accounts, show success message
            onLogin({ 
              email, 
              id: data.data.userId, 
              name: `${firstName} ${lastName}`, 
              status: data.data.status,
              type: 'premium',
              requiresApproval: true
            });
            
            navigate('/register-course');
          }
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Registration failed. Please try again.");
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError("Connection failed. Please check your network.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCheck = (key: keyof typeof checks) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 py-10">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center text-orange-500 mx-auto">
          {mode === 'login' ? <Lock size={32} /> : <UserPlus size={32} />}
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter">
          {mode === 'login' ? 'Terminal Session' : 'Identity Setup'}
        </h1>
        <p className="text-zinc-500 text-sm max-w-sm mx-auto font-medium">
          {mode === 'login' 
            ? 'Reconnect your terminal to the Sovereign BTC network.' 
            : 'Initialize your professional standing in the BTC mastery track.'}
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase rounded-lg animate-pulse text-center">
          <ShieldAlert size={14} className="inline mr-2" /> {error}
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex border-b border-zinc-800">
          <button 
            onClick={() => setMode('login')}
            className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'login' ? 'text-orange-500 bg-orange-500/5' : 'text-zinc-600 hover:text-white'}`}
          >
            Reconnect
          </button>
          <button 
            onClick={() => setMode('register-selection')}
            className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest transition-all ${mode !== 'login' ? 'text-orange-500 bg-orange-500/5' : 'text-zinc-600 hover:text-white'}`}
          >
            New Identity
          </button>
        </div>

        <div className="p-8">
          {mode === 'login' && (
            <form onSubmit={handleAuth} className="space-y-6">
              <InputField 
                label="Terminal Handle (Email)" 
                type="email" 
                value={email} 
                onChange={setEmail} 
                icon={Mail} 
                placeholder="id@sovereign.btc or your@email.com" 
                disabled={isLoading}
              />
              <InputField 
                label="Security Key (Password)" 
                type="password" 
                value={password} 
                onChange={setPassword} 
                icon={Lock} 
                placeholder="••••••••" 
                disabled={isLoading}
              />
              <SubmitButton 
                label={isLoading ? "Authenticating..." : "Initialize Access"} 
                icon={isLoading ? Loader2 : LogIn} 
                disabled={isLoading}
                isLoading={isLoading}
              />
            </form>
          )}

          {mode === 'register-selection' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in zoom-in-95 duration-300">
              <SelectionCard 
                title="Simple Account"
                desc="Minimal setup for archival observers. Access to public blogs and docs. No vetting required."
                icon={User}
                onClick={() => setMode('register-simple')}
                disabled={isLoading}
              />
              <SelectionCard 
                title="Premium Student"
                desc="Professional track. Full classroom access, Tactical Journal, and manual vetting for @sovereign handle."
                icon={GraduationCap}
                highlight
                onClick={() => setMode('register-premium')}
                disabled={isLoading}
              />
            </div>
          )}

          {mode === 'register-simple' && (
            <form onSubmit={handleAuth} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 text-zinc-500 mb-6">
                <button type="button" onClick={() => setMode('register-selection')} className="hover:text-white disabled:opacity-50" disabled={isLoading}>
                  <ArrowRight size={16} className="rotate-180" />
                </button>
                <span className="text-[10px] font-black uppercase tracking-widest">Observer Registration</span>
              </div>
              <InputField 
                label="Professional Email" 
                type="email" 
                value={email} 
                onChange={setEmail} 
                icon={Mail} 
                placeholder="name@email.com" 
                disabled={isLoading}
              />
              <InputField 
                label="Create Security Key" 
                type="password" 
                value={password} 
                onChange={setPassword} 
                icon={Lock} 
                placeholder="••••••••" 
                disabled={isLoading}
              />
              <SubmitButton 
                label={isLoading ? "Establishing Connection..." : "Establish Connection"} 
                icon={isLoading ? Loader2 : UserPlus} 
                disabled={isLoading || !email || !password}
                isLoading={isLoading}
              />
            </form>
          )}

          {mode === 'register-premium' && (
            <form onSubmit={handleAuth} className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 text-zinc-500">
                <button type="button" onClick={() => setMode('register-selection')} className="hover:text-white disabled:opacity-50" disabled={isLoading}>
                  <ArrowRight size={16} className="rotate-180" />
                </button>
                <span className="text-[10px] font-black uppercase tracking-widest">Premium Enrollment Phase</span>
              </div>

              <div className="p-5 bg-orange-500/10 border border-orange-500/20 rounded-xl flex gap-4 items-start shadow-inner">
                <Globe size={20} className="text-orange-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-zinc-200 leading-relaxed uppercase font-bold tracking-tight">
                  <span className="text-orange-500 font-black">Identity Allocation:</span> Enrolled students will be issued a permanent <span className="text-white font-black underline decoration-orange-500 underline-offset-4">@sovereign.btc</span> handle for lifetime use within this platform.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField 
                  label="First Name" 
                  type="text" 
                  value={firstName} 
                  onChange={setFirstName} 
                  icon={User} 
                  placeholder="Jane" 
                  disabled={isLoading}
                />
                <InputField 
                  label="Last Name" 
                  type="text" 
                  value={lastName} 
                  onChange={setLastName} 
                  icon={User} 
                  placeholder="Doe" 
                  disabled={isLoading}
                />
              </div>
              <InputField 
                label="Contact Email" 
                type="email" 
                value={email} 
                onChange={setEmail} 
                icon={Mail} 
                placeholder="jane.doe@pro.com" 
                disabled={isLoading}
              />
              <InputField 
                label="Security Key" 
                type="password" 
                value={password} 
                onChange={setPassword} 
                icon={Lock} 
                placeholder="••••••••" 
                disabled={isLoading}
              />

              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-2">Protocol Affirmation (Mandatory)</p>
                <div className="grid grid-cols-1 gap-3">
                  <RuleCheck 
                    label="BTCUSDT Perpetual only execution" 
                    active={checks.btc_only} 
                    onToggle={() => toggleCheck('btc_only')} 
                    disabled={isLoading}
                  />
                  <RuleCheck 
                    label="London → New York session only (5-9 PM PKT)" 
                    active={checks.london_ny_only} 
                    onToggle={() => toggleCheck('london_ny_only')} 
                    disabled={isLoading}
                  />
                  <RuleCheck 
                    label="Risk defined exclusively in R-multiples" 
                    active={checks.r_multiple_only} 
                    onToggle={() => toggleCheck('r_multiple_only')} 
                    disabled={isLoading}
                  />
                  <RuleCheck 
                    label="Zero expectation of signals or guaranteed profit" 
                    active={checks.no_signal_expectation} 
                    onToggle={() => toggleCheck('no_signal_expectation')} 
                    disabled={isLoading}
                  />
                  <RuleCheck 
                    label="Discipline and survival over net-profit focus" 
                    active={checks.discipline_over_profit} 
                    onToggle={() => toggleCheck('discipline_over_profit')} 
                    disabled={isLoading}
                  />
                  <RuleCheck 
                    label="Acceptance of full personal risk responsibility" 
                    active={checks.personal_risk_acceptance} 
                    onToggle={() => toggleCheck('personal_risk_acceptance')} 
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <SubmitButton 
                  label={isLoading ? "Initializing Enrollment..." : "Initialize Enrollment"} 
                  icon={isLoading ? Loader2 : ShieldCheck} 
                  disabled={!allChecksPassed || !firstName || !lastName || !email || !password || isLoading}
                  isLoading={isLoading}
                />
                {!allChecksPassed && !isLoading && (
                  <p className="text-center text-[9px] font-black uppercase text-zinc-700 tracking-widest">
                    All protocol rules must be affirmed to proceed
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
        <Fingerprint className="text-zinc-700" size={20} />
        <p className="text-[10px] text-zinc-500 uppercase leading-relaxed tracking-tight">
          Session integrity is monitored. Platform credentials strictly used for identity verification.
        </p>
      </div>
    </div>
  );
};

/** UI HELPERS **/

const InputField = ({ label, type, value, onChange, icon: Icon, placeholder, disabled }: any) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest ml-1">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
      <input 
        type={type} 
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 text-white mono text-xs transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
    </div>
  </div>
);

const SubmitButton = ({ label, icon: Icon, disabled, isLoading }: any) => {
  const IconComponent = isLoading ? Loader2 : Icon;
  return (
    <button 
      type="submit"
      disabled={disabled}
      className={`w-full py-4 bg-orange-500 text-black font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 ${disabled ? 'opacity-20 cursor-not-allowed grayscale' : 'hover:bg-white hover:scale-[1.01] active:scale-[0.99]'} ${isLoading ? 'animate-pulse' : ''}`}
    >
      {isLoading ? (
        <IconComponent size={18} className="animate-spin" />
      ) : (
        <IconComponent size={18} />
      )}
      {label}
    </button>
  );
};

const SelectionCard = ({ title, desc, icon: Icon, onClick, highlight, disabled }: any) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`p-6 border rounded-2xl text-left space-y-4 transition-all group ${highlight ? 'border-orange-500/30 bg-orange-500/5 hover:border-orange-500' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${highlight ? 'bg-orange-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}>
      <Icon size={20} />
    </div>
    <div className="space-y-1">
      <h3 className="font-black text-sm uppercase tracking-tight text-white">{title}</h3>
      <p className="text-[10px] text-zinc-500 leading-relaxed uppercase tracking-tight">{desc}</p>
    </div>
    <div className="pt-2 flex items-center gap-1 text-[9px] font-black uppercase text-zinc-700 group-hover:text-white transition-colors">
      Initiate <ChevronRight size={12} />
    </div>
  </button>
);

const RuleCheck = ({ label, active, onToggle, disabled }: any) => (
  <div 
    onClick={disabled ? undefined : onToggle}
    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${active ? 'bg-orange-500/10 border-orange-500/30' : 'bg-black/30 border-zinc-800 hover:border-zinc-700'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    {active ? <CheckSquare size={16} className="text-orange-500" /> : <Square size={16} className="text-zinc-700" />}
    <span className={`text-[10px] font-bold uppercase tracking-tight ${active ? 'text-zinc-200' : 'text-zinc-500'}`}>{label}</span>
  </div>
);

export default Auth;
