import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Plus, Trash2, Video, ImageIcon, FileCode, CheckCircle2, Terminal, ShieldAlert, Loader2, XCircle, Database } from 'lucide-react';

const AdminUpload = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    level: 'beginner',
    objective: '',
    explanation: '',
    btcExample: '',
    journalTask: '',
    category: 'tactics',
    estimatedTime: '30',
    difficulty: 'medium'
  });

  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const API_BASE = 'https://sovereign-btc-worker.sovereign-btc.workers.dev';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const uploadToR2 = async (file: File): Promise<string> => {
    // This would be implemented to upload to Cloudflare R2
    // For now, we'll simulate it
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`https://r2.sovereign.btc/${file.name}-${Date.now()}`);
      }, 500);
    });
  };

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // 1. Validate authentication
      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      // 2. Upload files to R2 (simulated)
      const fileUrls: string[] = [];
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const url = await uploadToR2(files[i]);
          fileUrls.push(url);
          setUploadProgress(Math.round(((i + 1) / files.length) * 100));
        }
      }

      // 3. Create module in database
      const moduleData = {
        title: formData.title,
        level: formData.level,
        objective: formData.objective,
        explanation: formData.explanation,
        btcExample: formData.btcExample,
        journalTask: formData.journalTask,
        category: formData.category,
        estimatedTime: parseInt(formData.estimatedTime),
        difficulty: formData.difficulty,
        fileUrls,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'published',
        order: Date.now() // Temporary ordering
      };

      // In a real implementation, you would have an API endpoint like:
      // const response = await fetch(`${API_BASE}/admin/modules`, {
      //   method: 'POST',
      //   headers: getAuthHeaders(),
      //   body: JSON.stringify(moduleData)
      // });

      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 4. Update localStorage for frontend (temporary until backend is built)
      const existingModules = JSON.parse(localStorage.getItem('sovereign_modules') || '[]');
      const newModule = {
        id: Date.now().toString(),
        ...moduleData,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        studentProgress: [],
        comments: []
      };
      
      const updatedModules = [...existingModules, newModule];
      localStorage.setItem('sovereign_modules', JSON.stringify(updatedModules));

      // 5. Also update courseContent.ts for static data
      const courseContent = JSON.parse(localStorage.getItem('courseContent') || '[]');
      const courseModule = {
        id: newModule.id,
        title: formData.title,
        slug: newModule.slug,
        level: formData.level,
        description: formData.objective,
        duration: `${formData.estimatedTime} min`,
        videoUrl: fileUrls.find(url => url.includes('.mp4')) || null,
        thumbnail: fileUrls.find(url => /\.(jpg|jpeg|png|gif)$/i.test(url)) || null,
        resources: fileUrls.map(url => ({ name: 'Resource', url })),
        objectives: [
          "Understand the core concept",
          "Apply in trading scenarios",
          "Complete journal assignment"
        ],
        content: [
          {
            type: "text",
            title: "Explanation",
            content: formData.explanation
          },
          {
            type: "text", 
            title: "BTC Example",
            content: formData.btcExample || "Real BTC chart example will be added"
          },
          {
            type: "task",
            title: "Journal Task",
            content: formData.journalTask
          }
        ]
      };
      
      const updatedCourseContent = [...courseContent, courseModule];
      localStorage.setItem('courseContent', JSON.stringify(updatedCourseContent));

      setSuccess(true);
      setUploadProgress(100);

      // Redirect after success
      setTimeout(() => {
        navigate('/course');
      }, 2000);

    } catch (err: any) {
      console.error('Deployment error:', err);
      setError(err.message || 'Failed to deploy module. Please try again.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('video')) return <Video size={14} className="text-orange-500" />;
    if (fileType.includes('image')) return <ImageIcon size={14} className="text-emerald-500" />;
    if (fileType.includes('pdf')) return <FileCode size={14} className="text-blue-500" />;
    return <FileCode size={14} className="text-zinc-500" />;
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

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase rounded-lg animate-pulse">
          <XCircle size={14} className="inline mr-2" /> {error}
        </div>
      )}

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-500 mb-2">
            <span>Uploading files...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase rounded-lg animate-in slide-in-from-top">
          <CheckCircle2 size={14} className="inline mr-2" /> Module successfully deployed to ledger!
        </div>
      )}

      <form onSubmit={handleDeploy} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-6 shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-800 pb-3 mb-6">Module Metadata</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Module Title *</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-sm focus:border-orange-500 transition-all"
                  placeholder="The 15m Liquidity Trap"
                  disabled={loading}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Target Tier *</label>
                <select 
                  value={formData.level}
                  onChange={e => setFormData({...formData, level: e.target.value})}
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-sm focus:border-orange-500 outline-none"
                  disabled={loading}
                >
                  <option value="beginner">Beginner: Foundations</option>
                  <option value="intermediate">Intermediate: Discipline</option>
                  <option value="advanced">Advanced: Expectancy</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Category</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-sm focus:border-orange-500 outline-none"
                  disabled={loading}
                >
                  <option value="tactics">Tactics</option>
                  <option value="psychology">Psychology</option>
                  <option value="risk">Risk Management</option>
                  <option value="analysis">Market Analysis</option>
                  <option value="execution">Trade Execution</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Estimated Time (min)</label>
                <input 
                  type="number"
                  min="5"
                  max="180"
                  value={formData.estimatedTime}
                  onChange={e => setFormData({...formData, estimatedTime: e.target.value})}
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-sm focus:border-orange-500"
                  placeholder="30"
                  disabled={loading}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Difficulty</label>
                <select 
                  value={formData.difficulty}
                  onChange={e => setFormData({...formData, difficulty: e.target.value})}
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-sm focus:border-orange-500 outline-none"
                  disabled={loading}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Operational Objective *</label>
              <input 
                type="text" 
                required
                value={formData.objective}
                onChange={e => setFormData({...formData, objective: e.target.value})}
                className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-sm focus:border-orange-500"
                placeholder="Identify stop-run behavior at London Open"
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Technical Explanation *</label>
              <textarea 
                required
                value={formData.explanation}
                onChange={e => setFormData({...formData, explanation: e.target.value})}
                className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-sm focus:border-orange-500 h-40"
                placeholder="Break down the mechanism of action..."
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">BTC Chart Example (Optional)</label>
              <textarea 
                value={formData.btcExample}
                onChange={e => setFormData({...formData, btcExample: e.target.value})}
                className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-sm focus:border-orange-500 h-32"
                placeholder="Describe a specific BTC chart example or trading scenario..."
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Journal Task Assignment *</label>
              <input 
                type="text" 
                required
                value={formData.journalTask}
                onChange={e => setFormData({...formData, journalTask: e.target.value})}
                className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white mono text-sm focus:border-orange-500"
                placeholder="Review 20 session opens and mark the range..."
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-8">
          {/* File Upload Section */}
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-6 shadow-xl">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 border-b border-zinc-800 pb-3">Supplementary Assets</h4>
            
            <div className="space-y-4">
              <label className={`block w-full cursor-pointer group ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <div className={`border-2 border-dashed border-zinc-800 rounded-xl p-8 text-center transition-all bg-black/20 ${!loading && 'group-hover:border-orange-500/50'}`}>
                  <UploadCloud size={32} className={`mx-auto mb-2 transition-colors ${loading ? 'text-zinc-800' : 'text-zinc-700 group-hover:text-orange-500'}`} />
                  <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Select Files</p>
                  <p className="text-[8px] text-zinc-700 uppercase mt-1">Video (MP4) | Image (PNG/JPG) | PDF</p>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileSelect}
                    multiple
                    accept=".mp4,.mov,.avi,.jpg,.jpeg,.png,.gif,.pdf"
                    disabled={loading}
                  />
                </div>
              </label>

              {files.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Selected Files ({files.length})</p>
                  {files.map((file, i) => (
                    <div key={i} className="p-3 bg-black/40 border border-zinc-800 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        {getFileIcon(file.type)}
                        <div className="truncate">
                          <div className="text-[10px] font-bold text-zinc-400 truncate">{file.name}</div>
                          <div className="text-[8px] text-zinc-600 uppercase">{formatFileSize(file.size)} • {file.type.split('/')[1]?.toUpperCase() || 'FILE'}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFile(i)}
                        disabled={loading}
                        className="text-zinc-600 hover:text-red-500 transition-colors disabled:opacity-50"
                      >
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
              disabled={loading || success || !formData.title || !formData.objective || !formData.explanation || !formData.journalTask}
              className="w-full py-4 bg-orange-500 text-black font-black uppercase tracking-widest text-xs rounded-lg hover:bg-white transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Deploying...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle2 size={18} />
                  <span>Deployed</span>
                </>
              ) : (
                <>
                  <Terminal size={18} />
                  <span>Deploy Module</span>
                </>
              )}
            </button>
            
            <div className="text-center space-y-1">
              <p className="text-[9px] text-zinc-600 uppercase font-bold italic">Verification required before global release.</p>
              <p className="text-[8px] text-zinc-700 uppercase">
                Module ID: {formData.title ? formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'pending'}
              </p>
            </div>
          </div>

          <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-lg flex gap-3">
            <ShieldAlert size={16} className="text-red-500 shrink-0" />
            <p className="text-[9px] text-zinc-500 leading-relaxed uppercase">
              Deployments are permanent in the local ledger until purged by Root Admin.
            </p>
          </div>

          <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg flex gap-3">
            <Database size={16} className="text-blue-500 shrink-0" />
            <div>
              <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest mb-1">Storage Status</p>
              <p className="text-[9px] text-zinc-500 leading-relaxed uppercase">
                Files are stored in Cloudflare R2. Module data persists in local storage until backend API is implemented.
              </p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
};

export default AdminUpload;
