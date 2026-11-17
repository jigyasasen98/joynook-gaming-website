"use client";

import { useState, useEffect } from "react";
import { Download, Sparkles, X, Share, Smartphone, Monitor } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if already in standalone app mode
    const standaloneMatch =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standaloneMatch);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Listen for Chrome/Edge/Android install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } else if (isIos) {
      setShowIosGuide(true);
    } else {
      // General prompt or already installable via browser menu
      alert("To install JoyNook: Click your browser menu (⋮ or ⋯) and select 'Install JoyNook' or 'Add to Desktop'.");
    }
  };

  // Do not show if already installed in standalone mode or dismissed by user
  if (isStandalone || dismissed) {
    return null;
  }

  // Show if deferredPrompt exists OR on mobile iOS
  const canInstall = !!deferredPrompt || isIos;

  return (
    <>
      {/* Sleek Floating / Fixed PWA Banner on Mobile & Desktop */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 max-w-sm w-[calc(100vw-2rem)] sm:w-auto animate-in slide-in-from-bottom-5 duration-300">
        <div className="flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white/95 dark:bg-[#1C1B33]/95 backdrop-blur-xl border border-purple-200/80 dark:border-purple-800/60 shadow-card-hover text-brand-text-dark dark:text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-coral flex items-center justify-center text-white shrink-0 shadow-sm">
              <Download className="w-5 h-5 animate-bounceGentle" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xs sm:text-sm tracking-tight flex items-center gap-1.5">
                Install JoyNook App
                <span className="w-2 h-2 rounded-full bg-mint-400"></span>
              </span>
              <span className="text-[11px] text-brand-text-muted dark:text-gray-400">
                Play offline with fullscreen mode
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple/90 text-white font-extrabold text-xs shadow-md shadow-brand-purple/25 active:scale-95 transition-all"
            >
              Install
            </button>
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss install banner"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Safari Install Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1C1B33] rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-purple-100 dark:border-purple-800/50 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-brand-purple flex items-center justify-center mb-3">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="font-extrabold text-lg text-brand-text-dark dark:text-white">
              Install JoyNook on iPhone / iPad
            </h3>
            <p className="text-xs text-brand-text-muted dark:text-gray-400 mt-1">
              Add JoyNook to your home screen for instant fullscreen access:
            </p>

            <div className="my-4 p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/30 text-left space-y-2.5 text-xs text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-brand-purple text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                  1
                </span>
                <span>
                  Tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline mx-1" /> in Safari
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-brand-purple text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                  2
                </span>
                <span>
                  Scroll down and select <strong>&quot;Add to Home Screen&quot;</strong>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-brand-purple text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                  3
                </span>
                <span>
                  Tap <strong>Add</strong> in the top-right corner. Enjoy!
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2.5 rounded-2xl bg-brand-purple text-white font-bold text-xs shadow-md"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
