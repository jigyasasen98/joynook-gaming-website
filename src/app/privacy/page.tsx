import { Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - JoyNook",
  description: "Learn how JoyNook respects and protects your privacy.",
};

export default function PrivacyPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-brand-purple dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5" /> Privacy First
          </div>
          <h1 className="text-3xl font-extrabold text-brand-text-dark dark:text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-brand-text-muted dark:text-gray-400 mt-2">
            Last Updated: November 2026
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-[#1C1B33] border border-purple-100 dark:border-purple-950/60 shadow-card space-y-6 text-sm text-brand-text-muted dark:text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-base font-extrabold text-brand-text-dark dark:text-white mb-2">
              1. Overview
            </h2>
            <p>
              JoyNook is committed to safeguarding visitor privacy. We operate on a strict privacy-first model: we do not require user accounts, emails, passwords, or personal credentials to access our games and tools.
            </p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-brand-text-dark dark:text-white mb-2">
              2. Local Storage Usage
            </h2>
            <p>
              To provide convenience features such as saving your favorite games list, tracking high scores in 2048 or Balloon Pop, and remembering your sound mute preference, JoyNook utilizes your browser&apos;s local storage (LocalStorage). This data remains exclusively on your device and is never transmitted to external servers.
            </p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-brand-text-dark dark:text-white mb-2">
              3. Analytics & Cookies
            </h2>
            <p>
              We do not use intrusive third-party cross-site tracking cookies. Any basic website metrics gathered are aggregated and anonymous, strictly intended to optimize site performance and loading speeds.
            </p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-brand-text-dark dark:text-white mb-2">
              4. Contact Us
            </h2>
            <p>
              If you have any questions regarding this Privacy Policy, please reach out via our contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
