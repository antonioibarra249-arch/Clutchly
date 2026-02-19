"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Link as LinkIcon,
  Check,
  Loader2,
  LogOut,
  Unlink,
  Shield,
  Gamepad2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface UserData {
  id: string;
  email: string;
  riotName: string | null;
  riotTag: string | null;
  rank: string | null;
  role: string | null;
  subscriptionTier: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [riotId, setRiotId] = useState("");
  const [linking, setLinking] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [linkSuccess, setLinkSuccess] = useState("");

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

      // Fetch user data from our DB
      try {
        const res = await fetch(`/api/user?id=${authUser.id}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser({
            id: authUser.id,
            email: authUser.email || "",
            riotName: null,
            riotTag: null,
            rank: null,
            role: null,
            subscriptionTier: "free",
          });
        }
      } catch {
        setUser({
          id: authUser.id,
          email: authUser.email || "",
          riotName: null,
          riotTag: null,
          rank: null,
          role: null,
          subscriptionTier: "free",
        });
      }

      setPageLoading(false);
    }

    loadUser();
  }, [router]);

  const handleLinkRiot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkError("");
    setLinkSuccess("");

    // Parse Name#TAG
    const parts = riotId.split("#");
    if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) {
      setLinkError("Enter your Riot ID in the format: Name#TAG");
      return;
    }

    const gameName = parts[0].trim();
    const tagLine = parts[1].trim();

    setLinking(true);

    try {
      const res = await fetch("/api/auth/link-riot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameName, tagLine }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLinkError(data.error || "Failed to link account");
        return;
      }

      setLinkSuccess(`Linked to ${data.riotName}#${data.riotTag}!`);
      setUser((prev) =>
        prev
          ? { ...prev, riotName: data.riotName, riotTag: data.riotTag }
          : null
      );
      setRiotId("");
    } catch {
      setLinkError("Something went wrong. Please try again.");
    } finally {
      setLinking(false);
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
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        {/* Back Link */}
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {/* Account Info */}
        <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 mb-6 backdrop-blur-xl">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Account
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">Email</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">Plan</span>
              <span
                className={`font-bold ${
                  user?.subscriptionTier === "pro"
                    ? "text-orange-400"
                    : "text-gray-500"
                }`}
              >
                {user?.subscriptionTier === "pro" ? "PRO" : "FREE"}
              </span>
            </div>
          </div>
        </div>

        {/* Riot Account Linking */}
        <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 mb-6 backdrop-blur-xl">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-red-400" />
            Riot Account
          </h2>

          {user?.riotName ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="font-bold">
                      {user.riotName}
                      <span className="text-gray-400">#{user.riotTag}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {user.rank || "Unranked"} · {user.role || "Fill"}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-400">
                Your Riot account is linked. Go to your dashboard to sync
                matches and generate your daily card.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                Link your League of Legends account to get personalized champion
                recommendations based on your match history.
              </p>

              {linkError && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {linkError}
                </div>
              )}
              {linkSuccess && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm">
                  {linkSuccess}
                </div>
              )}

              <form onSubmit={handleLinkRiot} className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Riot ID
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={riotId}
                      onChange={(e) => setRiotId(e.target.value)}
                      placeholder="Name#TAG"
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={linking || !riotId}
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {linking ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Linking...
                        </>
                      ) : (
                        <>
                          <LinkIcon className="w-4 h-4" />
                          Link
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              <p className="text-xs text-gray-500">
                We only read your match history. We never access your Riot
                password or make changes to your account.
              </p>
            </div>
          )}
        </div>

        {/* Sign Out */}
        <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
