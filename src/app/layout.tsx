import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SocialPulse AI - Research-Grade Social Media Analysis',
  description: 'Professional platform for AI-powered tweet analysis, credibility scoring, and political discourse research',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center gap-3">
                  <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">SocialPulse AI</span>
                  </Link>
                </div>
                <nav className="hidden md:flex items-center gap-6">
                  <Link href="/search" className="text-gray-600 hover:text-gray-900 font-medium">
                    Search
                  </Link>
                  <Link href="/analysis" className="text-gray-600 hover:text-gray-900 font-medium">
                    Analysis
                  </Link>
                  <Link href="/timeline" className="text-gray-600 hover:text-gray-900 font-medium">
                    Timeline
                  </Link>
                  <Link href="/influence" className="text-gray-600 hover:text-gray-900 font-medium">
                    Influence
                  </Link>
                  <Link href="/transparency" className="text-gray-600 hover:text-gray-900 font-medium">
                    Transparency
                  </Link>
                  <Link href="/research" className="text-gray-600 hover:text-gray-900 font-medium">
                    Research
                  </Link>
                  <Link href="/export" className="text-gray-600 hover:text-gray-900 font-medium">
                    Export
                  </Link>
                </nav>
              </div>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-gray-900 text-gray-400 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium text-white">SocialPulse AI</span>
                </div>
                <p className="text-sm text-center md:text-right">
                  All data sourced from public X/Twitter API. Read-only, attribution preserved.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800 text-sm text-center">
                <p>Compliance: X Developer Policy • OpenAI Terms • No data storage beyond session</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
