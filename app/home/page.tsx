"use client";

import { useState } from "react";
import Link from "next/link";
import { DailyCard } from "@/components/DailyCard";
import {
  RefreshCw,
  Settings,
  LogOut,
  Zap,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

// Mock data for demo (replace with real data fetch)
const MOCK_USER = {
  id: "demo-user",
  riotName: "Jinxed4Life",
  riotTag: "NA1",
  rank: "Gold II",
  role: "ADC",
  subscriptionTier: "free",
};

const MOCK_CARD = {
  picks: [
    {
      champion: "Jinx",
      confidence: 88,
      reason: "Patch 14.3 buffs + your 62% WR. She's cracked tonight.",
    },
    {
      champion: "Kai'Sa",
      confidence: 78,
      reason: "Solid into current meta tanks. Your mechanics are clean.",
    },
    {
      champion: "Miss Fortune",
      confidence: 72,
      reason: "Great with engage supports. Easy wins if team follows up.",
    },
  ],
  avoid: {
    champion: "Ezreal",
    reason: "42% WR on him. Q nerfs hit hard. Your spacing needs work.",
  },
  ban: {
    champion: "Nautilus",
    reason: "73% ban-worthy. Counters your entire pool with point-click CC.",
  },
  build: {
    for: "Jinx",
    items: [
      "Kraken Slayer",
      "Phantom Dancer",
      "Infinity Edge",
      "Lord Dominik's",
      "Bloodthirster",
      "Guardian Angel",
    ],
    boots: "Berserker's Greaves",
    keystone: "Lethal Tempo",
  },
};

export default function HomePage() {
  const [user] = useState(MOCK_USER);
  const [card] = useState(MOCK_CARD);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const isPro = user.subscriptionTier === "pro";

  const handleRegenerate = async () => {
    if (!isPro) {
      setShowUpgrade(true);
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } finally {
      setSyncing(false);
    }
  };

  const handleUpgrade = async () => {
    alert("In production, this would redirect to Stripe checkout!");
  };

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center font-black text-lg">
              C
            </div>
            <span className="font-black text-xl tracking-tight">CLUTCHLY</span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Sync Matches"}
            </button>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-semibold">
                  {user.riotName}
                  <span className="text-gray-500">#{user.riotTag}</span>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <span>{user.rank}</span>
                  <span>·</span>
                  <span className={isPro ? "text-orange-400" : "text-gray-500"}>
                    {isPro ? "PRO" : "FREE"}
                  </span>
                </div>
              </div>

              <div className="relative group">
                <button className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all">
                  <Settings className="w-5 h-5" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all text-red-400">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Card Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{formatDate(new Date())}</h1>
                <p className="text-gray-400">Your daily ranked recommendations</p>
              </div>
            </div>

            <DailyCard
              data={card}
              userName={user.riotName}
              userTag={user.riotTag}
              rank={user.rank}
              role={user.role}
              isPro={isPro}
              onRegenerate={handleRegenerate}
              isRegenerating={loading}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {!isPro && (
              <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="font-bold">Upgrade to Pro</div>
                    <div className="text-sm text-gray-400">$9/month</div>
                  </div>
                </div>

                <ul className="space-y-2 mb-4 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    Unlimited card regenerations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    90-day history
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    Deep performance stats
                  </li>
                </ul>

                <button
                  onClick={handleUpgrade}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/25 transition-all"
                >
                  Upgrade Now
                </button>
              </div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Quick Stats
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Current Rank</span>
                  <span className="font-bold">{user.rank}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Main Role</span>
                  <span className="font-bold">{user.role}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Games Analyzed</span>
                  <span className="font-bold">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Overall WR</span>
                  <span className="font-bold text-emerald-400">54%</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Recent Cards
              </h3>

              <div className="space-y-3">
                {[
                  { date: "Yesterday", pick: "Jinx", result: "W", lp: "+18" },
                  { date: "2 days ago", pick: "Kai'Sa", result: "W", lp: "+16" },
                  { date: "3 days ago", pick: "MF", result: "L", lp: "-14" },
                ].map((entry, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                  >
                    <div>
                      <div className="text-sm font-medium">{entry.date}</div>
                      <div className="text-xs text-gray-400">Played {entry.pick}</div>
                    </div>
                    <div
                      className={`text-sm font-bold ${
                        entry.result === "W" ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {entry.result} ({entry.lp})
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-2 text-sm text-gray-400 hover:text-white transition-all">
                View Full History →
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-800 border border-white/10 rounded-2xl p-8 max-w-md mx-4 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-orange-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Upgrade to Pro</h2>
              <p className="text-gray-400 mb-6">
                Regenerate your card anytime. Get the freshest recommendations.
              </p>

              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <div className="text-3xl font-black">
                  $9<span className="text-lg text-gray-400 font-normal">/mo</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowUpgrade(false)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-all"
                >
                  Maybe Later
                </button>
                <button
                  onClick={handleUpgrade}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/25 transition-all"
                >
                  Upgrade
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
