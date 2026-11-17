import { FileText } from "lucide-react";
import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Terms and Conditions - JoyNook",
  description: "Terms and conditions governing the use of the JoyNook website and games.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/terms`,
  },
  openGraph: {
    title: "Terms of Service | JoyNook",
    description: "Terms and conditions governing JoyNook gaming platform usage.",
    url: `${SITE_CONFIG.url}/terms`,
  },
};

export default function TermsPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-brand-purple dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <FileText className="w-3.5 h-3.5" /> Terms of Service
          </div>
          <h1 className="text-3xl font-extrabold text-brand-text-dark dark:text-white tracking-tight">
            Terms and Conditions
          </h1>
          <p className="text-xs text-brand-text-muted dark:text-gray-400 mt-2">
            Last Updated: November 2026
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-[#1C1B33] border border-purple-100 dark:border-purple-950/60 shadow-card space-y-6 text-sm text-brand-text-muted dark:text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-base font-extrabold text-brand-text-dark dark:text-white mb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using JoyNook, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree, please discontinue using the site.
            </p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-brand-text-dark dark:text-white mb-2">
              2. Intellectual Property
            </h2>
            <p>
              All interactive experiences, game mechanics, visual assets, code, brand marks, and designs on JoyNook are original works or licensed under applicable open web standards. You may not scrape, clone, or redistribute the proprietary game assets for commercial purposes without prior permission.
            </p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-brand-text-dark dark:text-white mb-2">
              3. Disclaimer of Warranty
            </h2>
            <p>
              JoyNook is provided on an &quot;as is&quot; and &quot;as available&quot; basis for personal amusement, relaxation, and entertainment without warranties of any kind.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
