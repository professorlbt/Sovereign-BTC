
import React, { useState, useEffect } from 'react';
import { ScrollText, Clock, ChevronRight, BookOpen } from 'lucide-react';
import { BlogPost } from '../types';

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: '1',
    title: "Why Missing a Trade is Professional",
    date: "Oct 12, 2024",
    category: "Psychology",
    excerpt: "The urge to be 'in the market' is the gambler's death knell. Professionals take pride in their ability to watch a move happen without touching it if it doesn't meet the criteria.",
    content: "Professionalism is defined by adherence to protocol, not by frequency of execution..."
  },
  {
    id: '2',
    title: "The BTC-Only Advantage",
    date: "Oct 05, 2024",
    category: "Philosophy",
    excerpt: "Deep familiarity with one chart beats surface-level knowledge of a hundred. Why the noise of altcoins is your biggest distraction.",
    content: "Specialization creates mastery. When you trade only BTC, you begin to see the hidden rhythms..."
  },
  {
    id: '3',
    title: "Boredom is Your Armor",
    date: "Sep 28, 2024",
    category: "Discipline",
    excerpt: "Trading should be as exciting as watching paint dry. If your heart is racing, your risk is too high or your edge is non-existent.",
    content: "Adrenaline is the enemy of consistency. A professional executioner seeks the calm of a mechanical process..."
  }
];

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sovereign_blogs');
    if (saved) {
      setPosts(JSON.parse(saved));
    } else {
      setPosts(DEFAULT_POSTS);
    }
  }, []);

  if (selectedPost) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
        <button 
          onClick={() => setSelectedPost(null)}
          className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white flex items-center gap-2 mb-8"
        >
          <ChevronRight size={14} className="rotate-180" /> Back to Archives
        </button>
        
        <header className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="px-2 py-0.5 bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-widest border border-orange-500/20 rounded">
              {selectedPost.category}
            </span>
            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
              {selectedPost.date}
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-tight">{selectedPost.title}</h1>
        </header>

        <div className="prose prose-invert prose-orange max-w-none">
          <p className="text-xl text-zinc-400 italic font-light border-l-2 border-orange-500 pl-6 my-8">
            {selectedPost.excerpt}
          </p>
          <div className="text-zinc-300 leading-relaxed space-y-6 text-lg">
            {selectedPost.content.split('\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        <div className="pt-12 border-t border-zinc-800 flex items-center gap-4">
           <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-black">
              <BookOpen size={20} />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase text-white">Editorial Team</p>
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Sovereign BTC Protocol</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mono mb-2">
          <ScrollText size={14} /> The Mindset Archives
        </div>
        <h1 className="text-5xl font-black uppercase tracking-tighter">Wisdom of the <span className="text-orange-500">Executioner</span></h1>
        <p className="text-zinc-500 text-lg font-light max-w-2xl">A collection of technical notes and psychological frameworks designed for professional survival.</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {posts.map((post) => (
          <article 
            key={post.id} 
            className="group p-8 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-orange-500/30 transition-all flex flex-col md:flex-row gap-8 items-start cursor-pointer"
            onClick={() => setSelectedPost(post)}
          >
            <div className="md:w-full space-y-4">
              <div className="flex items-center gap-4">
                <span className="px-2 py-0.5 bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-widest border border-orange-500/20 rounded">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                  <Clock size={12} /> {post.date}
                </span>
              </div>
              <h2 className="text-3xl font-black text-white group-hover:text-orange-500 transition-colors uppercase tracking-tight">{post.title}</h2>
              <p className="text-zinc-400 leading-relaxed font-light">{post.excerpt}</p>
              <div className="pt-2 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-white transition-all">
                Access Archive Entry <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="p-12 text-center border-t border-zinc-800">
        <p className="text-zinc-700 text-[10px] uppercase tracking-[0.5em] font-black">Sovereign Protocol Continuity Assured</p>
      </div>
    </div>
  );
};

export default Blog;
