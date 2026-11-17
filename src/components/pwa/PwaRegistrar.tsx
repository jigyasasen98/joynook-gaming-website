"use client";

import { useEffect } from "react";
import { initNativeBridge } from "@/lib/nativeBridge";

export function PwaRegistrar() {
  useEffect(() => {
    // 1. Initialize Native Hardware Bridge (Capacitor Android & iOS)
    initNativeBridge();

    // 2. Register PWA Service Worker for web & offline caching
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("JoyNook PWA Service Worker registered:", registration.scope);
          })
          .catch((error) => {
            console.warn("Service Worker registration failed:", error);
          });
      });
    }
  }, []);

  return null;
}
