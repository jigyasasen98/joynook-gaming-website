import { Zap, DownloadCloud, Smartphone, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "100% Free to Play",
    description: "Every single game is completely free. No subscription fees, paywalls, or hidden charges ever.",
    color: "text-brand-purple bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800/40",
  },
  {
    icon: DownloadCloud,
    title: "No Downloads Required",
    description: "Instant play directly in your web browser. No apps to install, setup, or phone storage wasted.",
    color: "text-brand-coral bg-coral-50 dark:bg-coral-950/60 border-coral-200 dark:border-coral-800/40",
  },
  {
    icon: Smartphone,
    title: "Works on Every Device",
    description: "Fully responsive with seamless touch and keyboard support on PC, Mac, tablets, iPhones, and Android.",
    color: "text-brand-yellow bg-yellow-50 dark:bg-yellow-950/60 border-yellow-200 dark:border-yellow-800/40",
  },
  {
    icon: Zap,
    title: "Instant Entertainment",
    description: "No mandatory login or account creation. Jump right into satisfying games whenever you need a mental reset.",
    color: "text-mint-700 bg-mint-50 dark:bg-mint-950/60 border-mint-200 dark:border-mint-800/40",
  },
];

export function ValuePropsSection() {
  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-purple dark:text-purple-300">
            Why Choose JoyNook
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-text-dark dark:text-white mt-1">
            Carefully Crafted for Pure Fun
          </h2>
          <p className="text-sm text-brand-text-muted dark:text-gray-400 mt-2">
            We believe mini-games and relaxation tools should be instant, clean, delightful, and available to everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center sm:items-start text-center sm:text-left p-6 rounded-3xl bg-white dark:bg-[#1C1B33] border border-purple-100 dark:border-purple-950/60 shadow-card hover:shadow-card-hover transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-4 ${item.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="font-extrabold text-lg text-brand-text-dark dark:text-white mb-2">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-brand-text-muted dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
