"use client";

import { useEffect } from "react";

export function PwaRegistrar() {
  useEffect(() => {
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
