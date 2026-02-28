'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Tag, MessageSquare, Bookmark, Download, Trash2,
  Sparkles, Copy, Check, ArrowRight, Beaker, Cpu
} from 'lucide-react';
import Link from 'next/link';
import { Tweet } from '@/lib/types';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ResearchItem {
  id: string;
  tweet: Tweet;
  tags: string[];
  aiNote: string;
  manualNote: string;
  noteMode: 'ai' | 'manual';
  isGeneratingNote: boolean;
  savedAt: Date;
}

export default function ResearchPage() {
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTag, setNewTag] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('research_items');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const itemsWithDates = parsed.map((item: ResearchItem) => ({
          ...item,
          savedAt: new Date(item.savedAt),
          isGeneratingNote: false,
        }));
        setItems(itemsWithDates);
      } catch (e) {
        console.error('Failed to load research items:', e);
      }
    }
    setLoaded(true);
  }, []);

  // Only write back to localStorage AFTER initial load is complete
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem('research_items', JSON.stringify(items));
  }, [items, loaded]);


  const filteredItems = items.filter((item) =>
    item.tweet.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const stats = {
    total: items.length,
    aiNotes: items.filter(i => i.aiNote && i.aiNote.length > 0).length,
    manualNotes: items.filter(i => i.manualNote && i.manualNote.length > 0).length,
  };

  const addTag = (itemId: string) => {
    if (!newTag.trim()) return;
    setItems(
      items.map((item) =>
        item.id === itemId
          ? { ...item, tags: [...item.tags, newTag.trim()] }
          : item
      )
    );
    setNewTag('');
  };

  const updateAiNote = (itemId: string, note: string) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, aiNote: note } : item
      )
    );
  };

  const updateManualNote = (itemId: string, note: string) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, manualNote: note } : item
      )
    );
  };

  const setNoteMode = (itemId: string, mode: 'ai' | 'manual') => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, noteMode: mode } : item
      )
    );
  };

  const generateAiNote = async (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    setItems(items.map(i =>
      i.id === itemId ? { ...i, isGeneratingNote: true } : i
    ));

    try {
      const res = await fetch('/api/generate-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tweet_text: item.tweet.text,
          author_name: item.tweet.author.name,
          author_role: item.tweet.author.role,
          topic: item.tags[0] || undefined,
        }),
      });

      const data = await res.json();

      if (data.note) {
        setItems(items.map(i =>
          i.id === itemId ? {
            ...i,
            aiNote: data.note,
            noteMode: 'ai',
            isGeneratingNote: false
          } : i
        ));
      }
    } catch (error) {
      console.error('Failed to generate AI note:', error);
    }

    setItems(items.map(i =>
      i.id === itemId ? { ...i, isGeneratingNote: false } : i
    ));
  };

  const deleteItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const exportResearch = () => {
    const exportData = items.map(item => ({
      id: item.id,
      tweet: {
        id: item.tweet.id,
        text: item.tweet.text,
        author: item.tweet.author,
        created_at: item.tweet.created_at,
      },
      tags: item.tags,
      aiNote: item.aiNote,
      manualNote: item.manualNote,
      noteMode: item.noteMode,
      savedAt: item.savedAt.toISOString(),
    }));

    const data = JSON.stringify(exportData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'research-data.json';
    a.click();
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTagGradient = (index: number) => {
    const gradients = [
      'from-cyan-500 to-blue-500',
      'from-purple-500 to-pink-500',
      'from-orange-500 to-red-500',
      'from-green-500 to-emerald-500',
      'from-indigo-500 to-violet-500',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Research Annotation
            </h1>
            <span className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium flex items-center gap-1">
              <Beaker className="w-3 h-3" />
              Professional
            </span>
          </div>
          <p className="text-slate-400">Tag, annotate, and generate AI-powered research notes from tweets</p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-lg border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Bookmark className="w-4 h-4" />
              Total Saved
            </div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-lg border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Cpu className="w-4 h-4" />
              AI Notes Generated
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {stats.aiNotes}
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-lg border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <MessageSquare className="w-4 h-4" />
              Manual Annotations
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {stats.manualNotes}
            </div>
          </div>
        </motion.div>

        {/* Search and Export */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved tweets, tags..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
            />
          </div>
          <button
            onClick={exportResearch}
            disabled={items.length === 0}
            className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20"
          >
            <Download className="w-5 h-5" />
            Export
            <span className="px-2 py-0.5 bg-white/20 rounded text-xs font-medium">JSON</span>
          </button>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
              <Bookmark className="w-12 h-12 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No saved research yet</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Search for tweets, analyze them, and save them here for your research. Add tags, generate AI notes, or write your own annotations.
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/25"
            >
              Go to Search
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg border border-slate-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all group"
                >
                  {/* Tweet Section */}
                  <div className="p-5 border-b border-slate-700/50">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        {item.tweet.author.profile_image_url ? (
                          <img
                            src={item.tweet.author.profile_image_url.replace('_normal', '_400x400')}
                            alt={item.tweet.author.name}
                            className="w-12 h-12 rounded-full ring-2 ring-slate-600"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center ring-2 ring-slate-600">
                            <span className="text-slate-300 font-medium">
                              {item.tweet.author.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-white">{item.tweet.author.name}</span>
                          {item.tweet.author.verified && (
                            <span className="text-blue-400">✓</span>
                          )}
                          <span className="text-slate-400">@{item.tweet.author.username}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.tweet.author.role === 'Minister' ? 'bg-blue-500/20 text-blue-400' :
                              item.tweet.author.role === 'Leader' ? 'bg-purple-500/20 text-purple-400' :
                                item.tweet.author.role === 'Media' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-slate-700 text-slate-300'
                            }`}>
                            {item.tweet.author.role || 'Citizen'}
                          </span>
                        </div>

                        <p className="mt-2 text-slate-200 whitespace-pre-wrap break-words">{item.tweet.text}</p>

                        <div className="mt-3 flex items-center gap-4 text-slate-500 text-sm">
                          <span>❤️ {item.tweet.metrics.like_count.toLocaleString()}</span>
                          <span>🔁 {item.tweet.metrics.retweet_count.toLocaleString()}</span>
                          <span>💬 {item.tweet.metrics.reply_count.toLocaleString()}</span>
                          <span className="ml-auto">
                            {new Date(item.tweet.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="p-5">
                    {/* Tags */}
                    <div className="flex items-center gap-2 flex-wrap mb-4">
                      <Tag className="w-4 h-4 text-slate-500" />
                      {item.tags.map((tag, tagIdx) => (
                        <span
                          key={tag}
                          className={`px-3 py-1 bg-gradient-to-r ${getTagGradient(tagIdx)} text-white text-sm rounded-full font-medium shadow-lg`}
                        >
                          #{tag}
                        </span>
                      ))}
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={selectedItem === item.id ? newTag : ''}
                          onChange={(e) => {
                            setNewTag(e.target.value);
                            setSelectedItem(item.id);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') addTag(item.id);
                          }}
                          placeholder="Add tag + Enter"
                          className="w-28 px-3 py-1 text-sm bg-slate-800 border border-slate-600 rounded-full text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                      </div>
                    </div>

                    {/* Note Tabs */}
                    <div className="bg-slate-900/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
                          <button
                            onClick={() => setNoteMode(item.id, 'ai')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${item.noteMode === 'ai'
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                                : 'text-slate-400 hover:text-white'
                              }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            AI Note
                          </button>
                          <button
                            onClick={() => setNoteMode(item.id, 'manual')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${item.noteMode === 'manual'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                : 'text-slate-400 hover:text-white'
                              }`}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            Manual Note
                          </button>
                        </div>

                        {item.noteMode === 'ai' && (
                          <button
                            onClick={() => generateAiNote(item.id)}
                            disabled={item.isGeneratingNote}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 transition-all"
                          >
                            {item.isGeneratingNote ? (
                              <>
                                <LoadingSpinner />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5" />
                                Generate with AI
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Note Content */}
                      <div className="relative">
                        {item.noteMode === 'ai' ? (
                          <div className="min-h-[100px]">
                            {item.aiNote ? (
                              <div className="relative">
                                <div className="absolute top-0 right-0 flex items-center gap-2">
                                  <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full flex items-center gap-1">
                                    <Sparkles className="w-2.5 h-2.5" />
                                    AI Generated
                                  </span>
                                  <button
                                    onClick={() => copyToClipboard(item.aiNote, `ai-${item.id}`)}
                                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                                  >
                                    {copiedId === `ai-${item.id}` ? (
                                      <Check className="w-4 h-4 text-green-400" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                                <p className="text-slate-200 pr-20 whitespace-pre-wrap">{item.aiNote}</p>
                              </div>
                            ) : (
                              <div className="text-slate-500 text-center py-6">
                                <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                                <p>No AI note generated yet</p>
                                <p className="text-sm mt-1">Click "Generate with AI" to create a research note</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="relative">
                            <textarea
                              value={item.manualNote}
                              onChange={(e) => updateManualNote(item.id, e.target.value)}
                              placeholder="Write your research notes here..."
                              className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                              rows={4}
                            />
                            <div className="absolute top-2 right-2 flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full flex items-center gap-1">
                                <MessageSquare className="w-2.5 h-2.5" />
                                Manual
                              </span>
                              <button
                                onClick={() => copyToClipboard(item.manualNote, `manual-${item.id}`)}
                                className="p-1.5 text-slate-400 hover:text-white transition-colors"
                                disabled={!item.manualNote}
                              >
                                {copiedId === `manual-${item.id}` ? (
                                  <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-700/50">
                        <span className="text-xs text-slate-500">
                          Saved: {formatDate(item.savedAt)}
                        </span>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* No results for search */}
        {items.length > 0 && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No tweets match your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
