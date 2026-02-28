'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Search, 
  Shield, 
  TrendingUp, 
  BarChart3, 
  Download, 
  FileSearch,
  Globe,
  Scale,
  Bot,
  Languages
} from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Real-Time Search',
    description: 'Fetch authentic tweets via Twitter/X API v2 with full attribution',
    href: '/search',
  },
  {
    icon: Scale,
    title: 'AI Stance Analysis',
    description: 'Classify tweets as Support, Oppose, or Neutral using GPT-4o',
    href: '/analysis',
  },
  {
    icon: Shield,
    title: 'Credibility Scoring',
    description: 'Get 0-100 credibility scores with detailed reasoning',
    href: '/analysis',
  },
  {
    icon: Bot,
    title: 'Bot Detection',
    description: 'Identify automated accounts and bot-like behavior patterns',
    href: '/analysis',
  },
  {
    icon: TrendingUp,
    title: 'Timeline Evolution',
    description: 'Track discussion volume and sentiment over time',
    href: '/timeline',
  },
  {
    icon: BarChart3,
    title: 'Influence Analysis',
    description: 'Identify top influencers by engagement and reach',
    href: '/influence',
  },
  {
    icon: Languages,
    title: 'Hindi Translation',
    description: 'Get Hindi summaries (हिंदी सारांश) for broader accessibility',
    href: '/search',
  },
  {
    icon: Download,
    title: 'NLP-Ready Export',
    description: 'Export datasets in JSON/CSV for further research',
    href: '/export',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                Research-Grade Platform
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                SocialPulse AI
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Professional platform for AI-powered tweet analysis, credibility scoring, 
                and political discourse research. Real data. Real insights.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/search?q=India"
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Start Research
                </Link>
                <Link
                  href="/transparency"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <FileSearch className="w-5 h-5 mr-2" />
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Powerful Features</h2>
            <p className="mt-2 text-gray-600">Everything you need for social media research</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={feature.href}
                  className="block p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Trusted by Researchers
                </h2>
                <p className="text-blue-100 mb-6">
                  SocialPulse AI is designed for academic research, journalism, 
                  and policy analysis. All data is sourced from public Twitter/X APIs 
                  with full attribution.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-white">
                    <Shield className="w-5 h-5 text-blue-200" />
                    X Developer Policy Compliant
                  </li>
                  <li className="flex items-center gap-2 text-white">
                    <Globe className="w-5 h-5 text-blue-200" />
                    Read-Only API Access
                  </li>
                  <li className="flex items-center gap-2 text-white">
                    <FileSearch className="w-5 h-5 text-blue-200" />
                    Full Attribution Preserved
                  </li>
                </ul>
              </div>
              <div className="hidden md:block">
                <div className="bg-white rounded-xl p-6 shadow-xl">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full" />
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                        <div className="h-3 bg-gray-100 rounded w-24" />
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </div>
                    <div className="flex gap-4">
                      <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        High Credibility: 85
                      </div>
                      <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        Support
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 mb-8">
              Start analyzing tweets with AI-powered insights
            </p>
            <Link
              href="/search"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
            >
              Begin Research
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
