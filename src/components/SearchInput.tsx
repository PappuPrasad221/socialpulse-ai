'use client';

import { useState } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

interface SearchInputProps {
  onSearch: (query: string, filters?: SearchFilters) => void;
  initialQuery?: string;
}

interface SearchFilters {
  lang?: string;
  verified_only?: boolean;
  days?: number;
}

export default function SearchInput({ onSearch, initialQuery = '' }: SearchInputProps) {
  const [query, setQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    lang: '',
    verified_only: false,
    days: 7,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, filters);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tweets about a topic..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 border rounded-lg flex items-center gap-2 ${
            showFilters ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300 text-gray-600'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="hidden sm:inline">Filters</span>
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </form>

      {showFilters && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              value={filters.lang}
              onChange={(e) => setFilters({ ...filters, lang: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">All</option>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
            <select
              value={filters.days}
              onChange={(e) => setFilters({ ...filters, days: parseInt(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value={1}>Last 24 hours</option>
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
            </select>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="verified_only"
              checked={filters.verified_only}
              onChange={(e) => setFilters({ ...filters, verified_only: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="verified_only" className="text-sm text-gray-700">
              Verified accounts only
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
