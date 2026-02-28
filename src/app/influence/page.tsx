'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Speaker } from '@/lib/types';

interface Influencer extends Speaker {
  totalEngagement: number;
}

function InfluencePageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || 'India';
  
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfluencers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&max_results=50`);
        const data = await response.json();

        if (data.tweets) {
          const speakerMap = new Map<string, Influencer>();

          data.tweets.forEach((tweet: { author: Speaker; metrics: { retweet_count: number; like_count: number; reply_count: number } }) => {
            const author = tweet.author;
            const engagement = tweet.metrics.retweet_count + tweet.metrics.like_count + tweet.metrics.reply_count;

            if (speakerMap.has(author.id)) {
              const existing = speakerMap.get(author.id)!;
              existing.totalEngagement += engagement;
            } else {
              speakerMap.set(author.id, { ...author, totalEngagement: engagement });
            }
          });

          const sortedInfluencers = Array.from(speakerMap.values())
            .sort((a, b) => b.totalEngagement - a.totalEngagement)
            .slice(0, 10);

          setInfluencers(sortedInfluencers);
        }
      } catch (error) {
        console.error('Influence error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencers();
  }, [query]);

  const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Influence & Reach</h1>
        <p className="mt-2 text-gray-600">Top influencers for: {query}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Top Influencers by Engagement</h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={influencers} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis
                    dataKey="username"
                    type="category"
                    stroke="#6b7280"
                    width={100}
                    tickFormatter={(value) => `@${value}`}
                  />
                  <Tooltip />
                  <Bar dataKey="totalEngagement" name="Total Engagement" radius={[0, 4, 4, 0]}>
                    {influencers.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <h2 className="text-xl font-semibold p-6 border-b">Influencer Details</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Followers</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Engagement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {influencers.map((influencer, index) => (
                    <tr key={influencer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {influencer.profile_image_url ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={influencer.profile_image_url}
                                alt={influencer.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">{influencer.name.charAt(0)}</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{influencer.name}</div>
                            <div className="text-gray-500">@{influencer.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {influencer.role || 'Citizen'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {influencer.followers_count.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                        {influencer.totalEngagement.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {influencer.verified ? (
                          <span className="text-blue-500">✓</span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InfluencePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12">Loading...</div>}>
      <InfluencePageContent />
    </Suspense>
  );
}
