"use client";

import { useState } from "react";
import { submitMessage } from "@/app/contact/actions";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid =
    name.trim() !== "" && EMAIL_RE.test(email.trim()) && message.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setSending(true);
    setError(null);
    const res = await submitMessage({ name, email, message });
    setSending(false);
    if (res.ok) setSubmitted(true);
    else setError(res.error);
  };

  const inputClass =
    "w-full bg-transparent border border-[#e8d8c0] rounded-lg px-4 py-3 text-sm text-[#4a2c0a] placeholder-[#9a6840]/70 focus:border-[#c49335] focus:outline-none transition-colors duration-200";

  if (submitted) {
    return (
      <div
        className="flex flex-col items-center justify-center text-center min-h-[280px] gap-4"
        role="status"
        aria-live="polite"
      >
        <svg
          className="w-16 h-16"
          viewBox="0 0 52 52"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="26"
            cy="26"
            r="24"
            stroke="#c49335"
            strokeWidth="2"
            className="check-circle"
          />
          <path
            d="M15 27 L23 35 L38 18"
            stroke="#c49335"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="check-mark"
          />
        </svg>
        <div>
          <p className="font-serif text-xl text-[#4a2c0a] mb-1">Thank you!</p>
          <p className="text-sm text-[#6e4218]">
            We&apos;ll get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="cf-name" className="sr-only">
          Your name
        </label>
        <input
          id="cf-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="cf-email" className="sr-only">
          Email
        </label>
        <input
          id="cf-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="cf-message" className="sr-only">
          Message
        </label>
        <textarea
          id="cf-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          required
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={!isValid || sending}
        className="w-full bg-transparent border border-[#c49335] rounded-lg px-6 py-3 text-sm font-semibold text-[#c49335] transition-all duration-200 hover:bg-[#c49335] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#c49335]"
      >
        {sending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
