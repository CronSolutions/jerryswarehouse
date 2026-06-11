"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/admin/auth/callback`,
      },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#faf6ed] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-serif text-3xl font-bold text-[#c49335] block leading-none">
            Jerry&apos;s
          </span>
          <span className="font-serif text-xs tracking-[0.3em] uppercase text-[#9a6840]">
            Admin
          </span>
        </div>

        {sent ? (
          <div className="text-center bg-white border border-[#e8d8c0] rounded-xl p-8">
            <p className="font-serif text-xl text-[#4a2c0a] mb-2">Check your email</p>
            <p className="text-sm text-[#6e4218]">
              We sent a sign-in link to <strong>{email}</strong>. Click it to access
              the dashboard.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#e8d8c0] rounded-xl p-8 space-y-4"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#4a2c0a] mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent border border-[#e8d8c0] rounded-lg px-4 py-3 text-sm text-[#4a2c0a] placeholder-[#9a6840]/70 focus:border-[#c49335] focus:outline-none transition-colors"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full bg-[#c49335] hover:bg-[#d4a853] text-white font-semibold text-sm rounded-lg px-6 py-3 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Sending…" : "Send sign-in link"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
