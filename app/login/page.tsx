"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [riotId, setRiotId] = useState("");

  const handleRiotLogin = async () => {
    setLoading(true);
    // In production, redirect to Riot OAuth
    setTimeout(() => {
      window.location.href = "/home";
    }, 1500);
  };

  const handleDemoLogin = () => {
    // Skip OAuth for demo/development
    window.location.href = "/home";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Login Card */}
        <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-orange-500/25">
              C
            </div>
            <div>
              <div className="font-black text-xl">CLUTCHLY</div>
              <div className="text-sm text-gray-400">Daily Ranked Copilot</div>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2">Connect your account</h1>
          <p className="text-gray-400 mb-8">
            Link your Riot account to get personalized recommendations based on
            your match history.
          </p>

          {/* Riot Sign In Button */}
          <button
            onClick={handleRiotLogin}
            disabled={loading}
            className="w-full py-4 bg-[#D0021B] hover:bg-[#B8011A] rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5L19 8v8l-7 3.5L5 16V8l7-3.5z" />
                </svg>
                Sign in with Riot
              </>
            )}
          </button>

          {/* Demo Mode */}
          <div className="mt-4">
            <button
              onClick={handleDemoLogin}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-all"
            >
              Try Demo Mode
            </button>
          </div>

          {/* Manual Entry (for development) */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <label className="block text-sm text-gray-400 mb-2">
              Or enter Riot ID manually:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={riotId}
                onChange={(e) => setRiotId(e.target.value)}
                placeholder="Name#TAG"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-all"
              />
              <button
                disabled={!riotId}
                className="px-6 py-3 bg-white/10 hover:bg-white/15 rounded-xl font-medium transition-all disabled:opacity-50"
              >
                Go
              </button>
            </div>
          </div>

          {/* Privacy Note */}
          <p className="mt-6 text-xs text-gray-500 text-center">
            We only read your match history. We never access your password or
            make changes to your account.
          </p>
        </div>

        {/* Help Links */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-400">
          <a
            href="https://developer.riotgames.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white transition-all"
          >
            Riot Developer Portal
            <ExternalLink className="w-3 h-3" />
          </a>
          <span>·</span>
          <Link href="/" className="hover:text-white transition-all">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
