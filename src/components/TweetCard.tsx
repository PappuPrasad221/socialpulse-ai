'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tweet, TweetAnalysis } from '@/lib/types';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  AlertTriangle,
  Bot,
  MessageCircle,
  Heart,
  Repeat,
  ExternalLink,
  Languages,
  TrendingUp,
  TrendingDown,
  Minus,
  GraduationCap,
  Beaker,
  Newspaper,
  Link2,
  Target,
  Sparkles,
  Bookmark
} from 'lucide-react';

interface TweetCardProps {
  tweet: Tweet;
  analysis?: TweetAnalysis;
  displayMode?: 'students' | 'research' | 'journalist';
}

export default function TweetCard({ tweet, analysis, displayMode = 'research' }: TweetCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const router = useRouter();

  const handleBookmark = () => {
    const newItem = {
      id: `research-${tweet.id}-${Date.now()}`,
      tweet,
      tags: [],
      aiNote: '',
      manualNote: '',
      noteMode: 'ai' as const,
      isGeneratingNote: false,
      savedAt: new Date(),
    };

    const saved = localStorage.getItem('research_items');
    const items = saved ? JSON.parse(saved) : [];

    const exists = items.some((item: { tweet: { id: string } }) => item.tweet.id === tweet.id);
    if (!exists) {
      items.push(newItem);
      localStorage.setItem('research_items', JSON.stringify(items));
      setIsBookmarked(true);
    }
    // Navigate to research page so user can immediately annotate
    router.push('/research');
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCredibilityLabel = (score: number) => {
    if (score >= 70) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  const getStanceIcon = (stance: string) => {
    switch (stance) {
      case 'Support':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'Oppose':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadge = (role?: string) => {
    const roleColors: Record<string, string> = {
      Minister: 'bg-blue-100 text-blue-800',
      Leader: 'bg-purple-100 text-purple-800',
      Media: 'bg-yellow-100 text-yellow-800',
      Organization: 'bg-green-100 text-green-800',
      Citizen: 'bg-gray-100 text-gray-800',
    };
    return role ? roleColors[role] || roleColors.Citizen : roleColors.Citizen;
  };

  const getModeIcon = () => {
    switch (displayMode) {
      case 'students':
        return <GraduationCap className="w-4 h-4" />;
      case 'research':
        return <Beaker className="w-4 h-4" />;
      case 'journalist':
        return <Newspaper className="w-4 h-4" />;
    }
  };

  const renderStudentsMode = () => {
    if (!analysis) return null;
    return (
      <div className="mt-3 p-3 bg-blue-50 rounded-lg space-y-2">
        <div className="flex items-center gap-2 text-blue-700 font-medium">
          <GraduationCap className="w-4 h-4" />
          Learning Summary
        </div>
        {analysis.simple_english && analysis.simple_english !== tweet.text && (
          <div className="text-sm">
            <div className="flex items-center gap-1 text-gray-600 mb-1">
              <Languages className="w-3 h-3" />
              <span className="font-medium">Simple English:</span>
            </div>
            <p className="text-gray-700">{analysis.simple_english}</p>
          </div>
        )}
        {analysis.hindi_summary && (
          <div className="text-sm pt-2 border-t border-blue-100">
            <div className="flex items-center gap-1 text-gray-600 mb-1">
              <Languages className="w-3 h-3" />
              <span className="font-medium">हिंदी सारांश:</span>
            </div>
            <p className="text-gray-700">{analysis.hindi_summary}</p>
          </div>
        )}
      </div>
    );
  };

  const renderResearchMode = () => {
    if (!analysis) return null;
    return (
      <div className="mt-3 p-3 bg-purple-50 rounded-lg space-y-2">
        <div className="flex items-center gap-2 text-purple-700 font-medium">
          <Beaker className="w-4 h-4" />
          Research Analysis
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            {getStanceIcon(analysis.stance)}
            <span className={`text-sm font-semibold ${analysis.stance === 'Support' ? 'text-green-700' :
                analysis.stance === 'Oppose' ? 'text-red-700' : 'text-gray-600'
              }`}>
              {analysis.stance}
            </span>
            <span className="text-xs text-gray-400">({analysis.stance_confidence}%)</span>
          </div>
          {analysis.argument_type && (
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium border border-purple-200">
              {analysis.argument_type}
            </span>
          )}
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-gray-600">Credibility:</span>
            <span className={`text-sm font-semibold ${getCredibilityColor(analysis.credibility_score)}`}>
              {analysis.credibility_score}/100 ({getCredibilityLabel(analysis.credibility_score)})
            </span>
          </div>
        </div>
        {analysis.key_claims && analysis.key_claims.length > 0 && (
          <div className="text-sm pt-2 border-t border-purple-100">
            <div className="flex items-center gap-1 text-gray-600 mb-1">
              <Sparkles className="w-3 h-3" />
              <span className="font-medium">Key Claims:</span>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {analysis.key_claims.map((claim, idx) => (
                <li key={idx}>{claim}</li>
              ))}
            </ul>
          </div>
        )}
        {analysis.credibility_reasons && analysis.credibility_reasons.length > 0 && (
          <div className="text-xs text-gray-500 pt-1">
            Reasons: {analysis.credibility_reasons.join(', ')}
          </div>
        )}
      </div>
    );
  };

  const renderJournalistMode = () => {
    return (
      <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
        <div className="flex items-center gap-2 text-yellow-700 font-medium mb-2">
          <Newspaper className="w-4 h-4" />
          Source Information
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="text-gray-500">Role:</span>
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(tweet.author.role)}`}>
              {tweet.author.role || 'Citizen'}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Followers:</span>
            <span className="ml-1 font-medium">{formatNumber(tweet.author.followers_count)}</span>
          </div>
          <div>
            <span className="text-gray-500">Verified:</span>
            <span className="ml-1">{tweet.author.verified ? '✓ Yes' : 'No'}</span>
          </div>
        </div>
        {analysis && (
          <div className="mt-2 pt-2 border-t border-yellow-100 flex items-center gap-4">
            <div className="flex items-center gap-1">
              {getStanceIcon(analysis.stance)}
              <span className="text-sm">{analysis.stance}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500">Credibility:</span>
              <span className={`text-sm font-semibold ${getCredibilityColor(analysis.credibility_score)}`}>
                {analysis.credibility_score}/100
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-4 card-hover"
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          {tweet.author.profile_image_url ? (
            <img
              src={tweet.author.profile_image_url.replace('_normal', '_400x400')}
              alt={tweet.author.name}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 font-medium">
                {tweet.author.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900">{tweet.author.name}</span>
            {tweet.author.verified && (
              <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500 text-white" />
            )}
            <span className="text-gray-500">@{tweet.author.username}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(tweet.author.role)}`}>
              {tweet.author.role || 'Citizen'}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {getModeIcon()}
              {displayMode.charAt(0).toUpperCase() + displayMode.slice(1)}
            </span>
          </div>

          <p className="mt-2 text-gray-800 whitespace-pre-wrap break-words">{tweet.text}</p>

          {displayMode === 'students' && renderStudentsMode()}
          {displayMode === 'research' && renderResearchMode()}
          {displayMode === 'journalist' && renderJournalistMode()}

          <div className="mt-3 flex items-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{formatNumber(tweet.metrics.like_count)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Repeat className="w-4 h-4" />
              <span>{formatNumber(tweet.metrics.retweet_count)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{formatNumber(tweet.metrics.reply_count)}</span>
            </div>
            <span className="text-gray-400 ml-auto">
              {formatDate(tweet.created_at)}
            </span>
            <button
              onClick={handleBookmark}
              className={`p-1.5 rounded-lg transition-colors ${isBookmarked
                  ? 'text-emerald-500 bg-emerald-50'
                  : 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-50'
                }`}
              title="Save & Go to Research"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              {isBookmarked ? 'Saved ✓' : 'Save to Research'}
            </button>
            <a
              href={`https://twitter.com/${tweet.author.username}/status/${tweet.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
