
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Send, CheckCircle2, User, Globe, MessageSquare, AlertCircle, Lock } from 'lucide-react';

const CourseRegistration = ({ user }: { user: any }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    experience: '0-6 months',
    handle: '',
    commitment: 'Part-time (2h/day)',
    motivation: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const regs = JSON.parse(localStorage.getItem('sovereign_registrations') || '[]');
    // Store with a unique platform handle placeholder
    regs.push({ 
      ...formData, 
      email: user?.email, 
      id: Date.now(), 
      status: 'Pending',
      platformEmail: '' // Generated on approval
    });
    localStorage.setItem('sovereign_registrations', JSON.stringify(regs));
    setStep(3);
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
        <AlertCircle size={48} className="mx-auto text-orange-500" />
        <h2 className="text-3xl font-black uppercase">Authentication Required</h2>
        <p className="text-zinc-500">You must be logged in to access the candidate application.</p>
        <button onClick={() => navigate('/auth')} className="px-8 py-3 bg-orange-500 text-black font-black uppercase tracking-widest rounded-lg">Go to Login</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in duration-700">
      <header className="space-y-4">
        <div className="flex items-center gap-3 text-orange-500 font-black uppercase tracking-widest text-[10px]">
          <FileText size={16} /> Candidate Application V1.0
        </div>
        <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Enrollment <span className="text-orange-500">Protocol</span></h1>
        <p className="text-zinc-500">This is a gated environment. Provide accurate data to initiate your vetting process.</p>
      </header>

      {step === 1 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-8 shadow-2xl">
          <div className="space-y-4">
            <h3 className="text-white font-black uppercase tracking-widest text-xs border-b border-zinc-800 pb-2">Step 1: Identity & Security</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-sm focus:border-orange-500 transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Permanent Security Key (Password)</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                  <input 
                    type="password" 
                    required
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-white mono text-sm focus:border-orange-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setStep(2)}
            disabled={!formData.name || !formData.password}
            className="w-full py-4 bg-orange-500 text-black font-black uppercase tracking-widest rounded-lg hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Logistics
          </button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-8 shadow-2xl">
          <div className="space-y-4">
            <h3 className="text-white font-black uppercase tracking-widest text-xs border-b border-zinc-800 pb-2">Step 2: Operational Logistics</h3>
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">WhatsApp / Telegram Handle</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                  <input 
                    type="text" 
                    value={formData.handle}
                    onChange={e => setFormData({...formData, handle: e.target.value})}
                    className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-white mono text-sm focus:border-orange-500"
                    placeholder="@yourhandle"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Experience Level</label>
                <select 
                  value={formData.experience}
                  onChange={e => setFormData({...formData, experience: e.target.value})}
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-sm focus:border-orange-500 transition-all outline-none"
                >
                  <option>0-6 months</option>
                  <option>1-2 years</option>
                  <option>3+ years (Professional)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Motivation Statement</label>
                <textarea 
                  value={formData.motivation}
                  onChange={e => setFormData({...formData, motivation: e.target.value})}
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-sm focus:border-orange-500 h-32"
                  placeholder="Why do you want to master BTCUSDT only? What is your primary struggle?"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4">
             <button onClick={() => setStep(1)} className="flex-1 py-4 border border-zinc-800 text-zinc-400 font-black uppercase tracking-widest rounded-lg hover:text-white">Back</button>
             <button type="submit" className="flex-1 py-4 bg-orange-500 text-black font-black uppercase tracking-widest rounded-lg hover:bg-white transition-all flex items-center justify-center gap-2">
               Submit Profile <Send size={18} />
             </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="text-center space-y-8 p-12 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mx-auto">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black uppercase">Application Transmitted</h2>
            <p className="text-zinc-500">Your profile is now in the verification queue. Upon approval, a <strong>@sovereign.btc</strong> identity will be issued to your professional email.</p>
          </div>
          <button onClick={() => navigate('/course')} className="px-10 py-4 border border-zinc-800 text-white font-black uppercase tracking-widest rounded-lg hover:bg-zinc-800">Return to Academy</button>
        </div>
      )}
    </div>
  );
};

export default CourseRegistration;
