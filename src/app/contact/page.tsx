"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle2, MessageSquare, Sparkles } from "lucide-react";
import { sounds } from "@/lib/soundEffects";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    sounds.matchSuccess();
    setSubmitted(true);
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-brand-purple dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <MessageSquare className="w-3.5 h-3.5" /> Get in Touch
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-text-dark dark:text-white tracking-tight">
            Contact & Game Suggestions
          </h1>
          <p className="text-sm text-brand-text-muted dark:text-gray-300 mt-2 max-w-lg mx-auto leading-relaxed">
            Have an idea for a new relaxing fidget or puzzle? Found a bug? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Contact Form */}
          <div className="md:col-span-7">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#1C1B33] border border-purple-100 dark:border-purple-950/60 shadow-card">
              {submitted ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-mint-50 dark:bg-mint-950/60 text-mint-600 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-brand-text-dark dark:text-white">
                    Message Received!
                  </h3>
                  <p className="text-xs text-brand-text-muted dark:text-gray-400 max-w-xs mx-auto">
                    Thank you for reaching out. We carefully read every suggestion to make JoyNook even more delightful.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", message: "" });
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-purple-50 text-brand-purple font-bold text-xs"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Alex"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 text-brand-text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 text-brand-text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Message / Game Idea
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="I'd love to see a digital kinetic sand toy or more levels in Color Sort..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 text-brand-text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-brand-purple hover:bg-brand-purple/90 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-purple/20 transition-all active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Info & FAQ */}
          <div className="md:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1B33] border border-purple-100 dark:border-purple-950/60 shadow-card space-y-3">
              <h3 className="font-extrabold text-base text-brand-text-dark dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-coral" />
                <span>Frequently Asked Questions</span>
              </h3>

              <div className="space-y-3 text-xs leading-relaxed text-brand-text-muted dark:text-gray-300">
                <div>
                  <h4 className="font-bold text-brand-text-dark dark:text-white">
                    Are all games really free?
                  </h4>
                  <p className="mt-0.5">
                    Yes! Every single game and relaxation tool is 100% free with no login or subscriptions required.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-brand-text-dark dark:text-white">
                    Can I play on my iPhone or Android?
                  </h4>
                  <p className="mt-0.5">
                    Absolutely. Every game features responsive touch controls and runs seamlessly in Safari, Chrome, and all mobile browsers.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-brand-text-dark dark:text-white">
                    Do I need to install anything?
                  </h4>
                  <p className="mt-0.5">
                    Never. Everything loads directly in the browser using HTML5 Canvas and modern Web APIs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
