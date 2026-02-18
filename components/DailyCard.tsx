"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw, Shield, AlertTriangle, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface Pick {
  champion: string;
  confidence: number;
  reason: string;
}

interface CardData {
  picks: Pick[];
  avoid: {
    champion: string;
    reason: string;
  };
  ban: {
    champion: string;
    reason: string;
  };
  build: {
    for: string;
    items: string[];
    boots: string;
    keystone: string;
  };
}

interface DailyCardProps {
  data: CardData;
  userName?: string;
  userTag?: string;
  rank?: string;
  role?: string;
  isPro?: boolean;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

// Champion color mapping for visual variety
const getChampionGradient = (name: string): string => {
  const colors: Record<string, string> = {
    Jinx: "from-pink-500 to-purple-600",
    "Kai'Sa": "from-violet-500 to-indigo-600",
    "Miss Fortune": "from-red-500 to-orange-600",
    Ezreal: "from-yellow-400 to-amber-500",
    Caitlyn: "from-cyan-400 to-blue-500",
    Nautilus: "from-teal-600 to-emerald-700",
    Jhin: "from-red-700 to-rose-900",
    Vayne: "from-slate-500 to-slate-700",
    Draven: "from-orange-500 to-red-600",
    Ashe: "from-blue-400 to-cyan-500",
  };

  return colors[name] || "from-slate-500 to-slate-600";
};

export function DailyCard({
  data,
  userName = "Summoner",
  userTag = "NA1",
  rank = "Gold",
  role = "ADC",
  isPro = false,
  onRegenerate,
  isRegenerating = false,
}: DailyCardProps) {
  const [copied, setCopied] = useState(false);

  const copyBuild = () => {
    const buildText = `${data.build.items.join(" → ")} | ${data.build.boots} | ${data.build.keystone}`;
    navigator.clipboard.writeText(buildText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400">Tonight&apos;s Picks for</div>
            <div className="text-xl font-bold">
              {userName}
              <span className="text-gray-500">#{userTag}</span>
            </div>
            <div className="text-sm text-gray-500">
              {rank} · {role} · Patch 14.3
            </div>
          </div>

          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={isRegenerating || !isPro}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all",
                isPro
                  ? "bg-white/5 hover:bg-white/10 border border-white/10"
                  : "bg-white/5 border border-white/5 opacity-50 cursor-not-allowed"
              )}
            >
              <RefreshCw
                className={cn("w-4 h-4", isRegenerating && "animate-spin")}
              />
              {isRegenerating ? "Regenerating..." : "Regenerate"}
              {!isPro && (
                <span className="text-xs text-orange-400 ml-1">PRO</span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Champion Picks */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
              Play These
            </span>
          </div>

          <div className="space-y-3">
            {data.picks.map((pick, i) => (
              <div
                key={i}
                className="group relative flex items-center gap-4 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 rounded-xl p-4 transition-all"
              >
                {i === 0 && (
                  <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-orange-500 rounded text-xs font-bold shadow-lg">
                    BEST
                  </div>
                )}

                <div
                  className={cn(
                    "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl font-black shadow-lg group-hover:scale-110 transition-transform",
                    getChampionGradient(pick.champion)
                  )}
                >
                  {pick.champion[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-bold text-lg">{pick.champion}</div>
                  <div className="text-sm text-gray-400 truncate">
                    {pick.reason}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-400">
                    {pick.confidence}%
                  </div>
                  <div className="text-xs text-gray-500">confidence</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Avoid */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-red-400 font-semibold uppercase tracking-wide">
                Avoid Tonight
              </div>
              <div className="font-bold">{data.avoid.champion}</div>
              <div className="text-sm text-gray-400">{data.avoid.reason}</div>
            </div>
          </div>
        </div>

        {/* Ban */}
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-400" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-orange-400 font-semibold uppercase tracking-wide">
                Priority Ban
              </div>
              <div className="font-bold">{data.ban.champion}</div>
              <div className="text-sm text-gray-400">{data.ban.reason}</div>
            </div>
          </div>
        </div>

        {/* Build */}
        <div className="bg-slate-700/50 border border-slate-600/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">
                Recommended Build
              </div>
              <div className="font-bold">{data.build.for}</div>
            </div>
            <button
              onClick={copyBuild}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Build</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {data.build.items.map((item, i) => (
              <span key={i} className="flex items-center">
                <span className="px-3 py-1.5 bg-slate-600/50 rounded-lg text-sm font-medium">
                  {item}
                </span>
                {i < data.build.items.length - 1 && (
                  <span className="mx-1 text-gray-600">→</span>
                )}
              </span>
            ))}
          </div>

          <div className="flex gap-4 text-sm text-gray-400">
            <span>🥾 {data.build.boots}</span>
            <span>⚡ {data.build.keystone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
