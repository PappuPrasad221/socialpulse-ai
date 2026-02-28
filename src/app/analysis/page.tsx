'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TweetAnalysis } from '@/lib/types';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Bot } from 'lucide-react';

const COLORS = ['#22c55e', '#ef4444', '#9ca3af'];

function AnalysisPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || 'India';
  
  const [stanceData, setStanceData] = useState([
    { name: 'Support', value: 0 },
    { name: 'Oppose', value: 0 },
    { name: 'Neutral', value: 0 },
  ]);
  const [credibilityData, setCredibilityData] = useState<{ high: number; medium: number; low: number }>({
    high: 0,
    medium: 0,
    low: 0,
  });
  const [botCount, setBotCount] = useState(0);
  const [rumorCount, setRumorCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&max_results=30`);
        const data = await response.json();

        if (data.tweets) {
          const analyses: Record<string, TweetAnalysis> = {};
          
          for (const tweet of data.tweets) {
            const analysisRes = await fetch('/api/analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                tweet_text: tweet.text,
                speaker_info: tweet.author,
                topic: query,
              }),
            });
            analyses[tweet.id] = await analysisRes.json();
          }

          const stanceCounts = { Support: 0, Oppose: 0, Neutral: 0 };
          const credibility = { high: 0, medium: 0, low: 0 };
          let bots = 0;
          let rumors = 0;

          Object.values(analyses).forEach((analysis) => {
            stanceCounts[analysis.stance]++;
            if (analysis.credibility_score >= 70) credibility.high++;
            else if (analysis.credibility_score >= 40) credibility.medium++;
            else credibility.low++;
            
            if (analysis.is_bot) bots++;
            if (analysis.is_rumor) rumors++;
          });

          setStanceData([
            { name: 'Support', value: stanceCounts.Support },
            { name: 'Oppose', value: stanceCounts.Oppose },
            { name: 'Neutral', value: stanceCounts.Neutral },
          ]);
          setCredibilityData(credibility);
          setBotCount(bots);
          setRumorCount(rumors);
        }
      } catch (error) {
        console.error('Analysis error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  const getStanceIcon = (name: string) => {
    switch (name) {
      case 'Support':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'Oppose':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Stance & Argument Analysis</h1>
        <p className="mt-2 text-gray-600">Topic: {query}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Stance Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Credibility Overview</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">High Credibility (70+)</span>
                    <span className="font-semibold text-green-600">{credibilityData.high}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(credibilityData.high / 30) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Medium Credibility (40-69)</span>
                    <span className="font-semibold text-yellow-600">{credibilityData.medium}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${(credibilityData.medium / 30) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Low Credibility (&lt;40)</span>
                    <span className="font-semibold text-red-600">{credibilityData.low}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${(credibilityData.low / 30) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Risk Indicators</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                  <Bot className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-700">{botCount}</p>
                    <p className="text-sm text-orange-600">Bot Accounts</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-700">{rumorCount}</p>
                    <p className="text-sm text-red-600">Potential Rumors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12">Loading...</div>}>
      <AnalysisPageContent />
    </Suspense>
  );
}
