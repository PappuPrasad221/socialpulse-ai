'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TimelineData } from '@/lib/types';

function TimelinePageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || 'India';
  const days = parseInt(searchParams.get('days') || '7');
  
  const [timelineData, setTimelineData] = useState<TimelineData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/timeline?q=${encodeURIComponent(query)}&days=${days}`);
        const data = await response.json();
        setTimelineData(data.timeline || []);
      } catch (error) {
        console.error('Timeline error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [query, days]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Timeline Evolution</h1>
        <p className="mt-2 text-gray-600">Track the volume and sentiment of discussions over time</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Topic: {query}</h2>
          <select
            value={days}
            onChange={(e) => {
              const newDays = e.target.value;
              window.location.href = `/timeline?q=${encodeURIComponent(query)}&days=${newDays}`;
            }}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full" />
          </div>
        ) : timelineData.length > 0 ? (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Total Tweets"
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No timeline data available
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {timelineData.map((day) => (
          <div key={day.date} className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">{day.date}</p>
            <p className="text-2xl font-bold text-gray-900">{day.count}</p>
            <p className="text-sm text-gray-500">tweets</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TimelinePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12">Loading...</div>}>
      <TimelinePageContent />
    </Suspense>
  );
}
