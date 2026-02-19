"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DailyCard } from "@/components/DailyCard";
import {
  RefreshCw,
  Settings,
  LogOut,
  Zap,
  Calendar,
  TrendingUp,
  User,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// Mock card data (will be replaced with real AI generation later)
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

interface UserData {
  id: string;
  email: string;
  riotName: string | null;
  riotTag: string | null;
  rank: string | null;
  role: string | null;
  subscriptionTier: string;
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [card] = useState(MOCK_CARD);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.push("/login");
        return;
      }

      // For now, use auth data + defaults until Riot is linked
      setUser({
        id: authUser.id,
        email: authUser.email || "",
        riotName: null,
        riotTag: null,
        rank: null,
        role: null,
        subscriptionTier: "free",
      });

      setPageLoading(false);
    }

    loadUser();
  }, [router]);

  const isPro = user?.subscriptionTier === "pro";
  const displayName = user?.riotName || user?.email?.split("@")[0] || "Summoner";
  const displayTag = user?.riotTag || "NA1";
  const displayRank = user?.rank || "Unranked";
  const displayRole = user?.role || "Fill";

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
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to start checkout. Please try again.");
    }
  };

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center font-black text-xl animate-pulse">
            C
          </div>
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

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
                  {displayName}
                  {user?.riotTag && (
                    <span className="text-gray-500">#{displayTag}</span>
                  )}
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <span>{displayRank}</span>
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
                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all rounded-t-xl"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all text-red-400 rounded-b-xl"
                  >
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
        {/* Riot Account Link Banner */}
        {!user?.riotName && (
          <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-orange-400" />
              <div>
                <div className="font-semibold text-sm">Link your Riot account</div>
                <div className="text-xs text-gray-400">
                  Connect your League account to get personalized recommendations
                </div>
              </div>
            </div>
            <Link
              href="/settings"
              className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg text-sm font-medium text-orange-400 transition-all"
            >
              Link Account
            </Link>
          </div>
        )}

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
              userName={displayName}
              userTag={displayTag}
              rank={displayRank}
              role={displayRole}
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
                  <span className="font-bold">{displayRank}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Main Role</span>
                  <span className="font-bold">{displayRole}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Account</span>
                  <span className="font-bold text-sm">
                    {user?.riotName
                      ? `${user.riotName}#${user.riotTag}`
                      : "Not linked"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Recent Cards
              </h3>

              <div className="text-sm text-gray-400 text-center py-4">
                {user?.riotName
                  ? "Your card history will appear here."
                  : "Link your Riot account to start generating cards."}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowUpgrade(false)}
        >
          <div
            className="bg-slate-800 border border-white/10 rounded-2xl p-8 max-w-md mx-4 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
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
                  $9
                  <span className="text-lg text-gray-400 font-normal">/mo</span>
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
