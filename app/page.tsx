"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Zap, Target, TrendingUp, Shield } from "lucide-react";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubmitted(true);
        setEmail("");
      }
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white overflow-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-orange-500/5 to-transparent rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-orange-500/25">
            C
          </div>
          <span className="font-black text-2xl tracking-tight">CLUTCHLY</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-4 py-2 bg-white/5 backdrop-blur border border-white/10 rounded-full text-sm font-medium text-gray-300">
            <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
            Coming Soon
          </span>
          <Link
            href="/login"
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-orange-500/25 transition-all hover:-translate-y-0.5"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 mb-8 backdrop-blur">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Launching February 2026
        </div>

        <h1 className="text-5xl md:text-7xl font-black leading-none mb-6 tracking-tight">
          Before you queue,
          <br />
          <span className="gradient-text">know what to play.</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          <span className="text-white font-semibold">
            3 picks. 1 ban. Your build.
          </span>
          <br />
          Personalized to YOUR match history. Every day.
        </p>

        {/* Email Form */}
        {submitted ? (
          <div className="max-w-md mx-auto mb-4 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl">
            <p className="text-emerald-400 font-semibold">
              ✓ You&apos;re on the list! We&apos;ll email you when we launch.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all backdrop-blur"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-bold hover:shadow-xl hover:shadow-orange-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap disabled:opacity-50"
            >
              {loading ? "Joining..." : "Join Waitlist"}
            </button>
          </form>
        )}
        <p className="text-sm text-gray-500">
          No spam. We&apos;ll email when it&apos;s ready.
        </p>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-5 mt-20 stagger-children">
          {[
            {
              icon: <Zap className="w-8 h-8 text-orange-400" />,
              title: "1. Connect",
              desc: "Link your Riot account in 30 seconds",
            },
            {
              icon: <Target className="w-8 h-8 text-cyan-400" />,
              title: "2. Get Your Card",
              desc: "AI analyzes your champs + today's meta",
            },
            {
              icon: <TrendingUp className="w-8 h-8 text-emerald-400" />,
              title: "3. Climb",
              desc: "Play your best picks. Ban the threats. Win.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="group p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-left hover:bg-white/[0.05] hover:border-orange-500/20 transition-all duration-300"
            >
              <div className="mb-4">{f.icon}</div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Why Section */}
        <div className="mt-24 text-left max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Stop guessing. Start climbing.
          </h2>

          <div className="space-y-4">
            {[
              {
                icon: "❌",
                text: "No more reading patch notes",
                color: "text-red-400",
              },
              {
                icon: "❌",
                text: "No more guessing what's meta",
                color: "text-red-400",
              },
              {
                icon: "❌",
                text: "No more losing to champs you should've banned",
                color: "text-red-400",
              },
              {
                icon: "✓",
                text: "Just open the app, see your picks, queue",
                color: "text-emerald-400",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 p-4 rounded-xl ${
                  item.icon === "✓" ? "bg-emerald-500/10" : "bg-white/5"
                }`}
              >
                <span className={`text-xl ${item.color}`}>{item.icon}</span>
                <span className="text-lg">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mock Card Preview */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold mb-8">
            Your daily card looks like this
          </h2>

          <div className="max-w-md mx-auto bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 border border-white/10 backdrop-blur-xl shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-sm text-gray-400">Tonight&apos;s Picks</div>
              <div className="text-lg font-bold">
                YourName<span className="text-gray-500">#NA1</span>
              </div>
              <div className="text-xs text-gray-500">Gold II · ADC</div>
            </div>

            <div className="space-y-3">
              {/* Picks */}
              {[
                { champ: "Jinx", pct: 88, reason: "Patch buffs + your 62% WR" },
                { champ: "Kai'Sa", pct: 78, reason: "Strong into tank meta" },
              ].map((pick, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3"
                >
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center font-bold text-emerald-400">
                    {pick.champ[0]}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{pick.champ}</div>
                    <div className="text-xs text-gray-400">{pick.reason}</div>
                  </div>
                  <div className="text-emerald-400 font-bold">{pick.pct}%</div>
                </div>
              ))}

              {/* Ban */}
              <div className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-orange-400 font-semibold">
                    BAN
                  </div>
                  <div className="font-semibold">Nautilus</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 text-center text-sm text-gray-400">
              + Build, avoid picks, and more →
            </div>
          </div>
        </div>

        {/* Pricing Preview */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold mb-8">Simple pricing</h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
              <div className="text-lg font-bold mb-2">Free</div>
              <div className="text-3xl font-black mb-4">
                $0<span className="text-lg text-gray-400 font-normal">/mo</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>✓ Daily card (1 per day)</li>
                <li>✓ 7-day history</li>
                <li className="text-gray-600">✗ No regeneration</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-6 text-left relative overflow-hidden">
              <div className="absolute top-3 right-3 px-2 py-1 bg-orange-500 rounded text-xs font-bold">
                POPULAR
              </div>
              <div className="text-lg font-bold mb-2 text-orange-400">Pro</div>
              <div className="text-3xl font-black mb-4">
                $9<span className="text-lg text-gray-400 font-normal">/mo</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li>✓ Unlimited regenerations</li>
                <li>✓ 90-day history</li>
                <li>✓ Deep performance stats</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-24 p-8 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-3xl">
          <h2 className="text-2xl font-bold mb-3">Ready to climb?</h2>
          <p className="text-gray-400 mb-6">
            Join the waitlist and be first to know when we launch.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/30 transition-all hover:-translate-y-1 inline-flex items-center gap-2"
          >
            Join Waitlist <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-10 border-t border-white/5">
        <p className="text-gray-500 text-sm">
          Clutchly is not endorsed by Riot Games and does not reflect the views
          or opinions of Riot Games or anyone officially involved in producing
          or managing League of Legends.
        </p>
        <p className="text-gray-600 text-xs mt-2">© 2026 Clutchly</p>
      </footer>
    </div>
  );
}
