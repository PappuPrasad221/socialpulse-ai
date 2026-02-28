'use client';

import { Shield, CheckCircle, AlertTriangle, Bot, FileText, Scale } from 'lucide-react';

export default function TransparencyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transparency Dashboard</h1>
        <p className="mt-2 text-gray-600">Understanding how AI analysis works and decision explanations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">AI Decision Explanations</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Credibility Score</h3>
              <p className="text-sm text-gray-600">
                Based on: source reputation, claim verification, language patterns, account metrics, 
                and historical accuracy. Score 0-100.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Stance Detection</h3>
              <p className="text-sm text-gray-600">
                Analyzes sentiment and position toward the topic: Support, Oppose, or Neutral. 
                Based on keyword analysis, emotional tone, and contextual understanding.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Bot Detection</h3>
              <p className="text-sm text-gray-600">
                Identifies automated accounts through: posting frequency, engagement ratios, 
                account age, and behavioral patterns.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Rumor Detection</h3>
              <p className="text-sm text-gray-600">
                Flags potential misinformation using: claim verification, source credibility, 
                language patterns, and cross-reference with known fact-checks.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold">Data Sources</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Twitter/X API v2 (Official, Read-only)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>OpenAI GPT-4o (AI Analysis)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Public tweets only (no private data)</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <h2 className="text-xl font-semibold">Compliance</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>X Developer Policy compliant</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>OpenAI Terms of Service compliant</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>No data storage beyond session</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Full attribution preserved</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bot className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold">Model Information</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Analysis Model</span>
                <span className="font-medium">OpenAI GPT-4o</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Temperature</span>
                <span className="font-medium">0.3 (low randomness)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Response Format</span>
                <span className="font-medium">JSON Structured</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">Important Disclaimer</h2>
        <p className="text-sm text-blue-800">
          This platform is for research and informational purposes only. AI analysis does not constitute 
          fact-checking or official verification. Always verify information from primary sources. 
          All tweets are attributed to their original authors with links to the source.
        </p>
      </div>
    </div>
  );
}
