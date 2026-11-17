/**
 * Native Bridge for Capacitor & Web
 * Bridges native hardware features: back button, status bar, and native share.
 */

export interface ShareOptions {
  title: string;
  text: string;
  url: string;
}

export const shareContent = async (options: ShareOptions): Promise<boolean> => {
  if (typeof window === "undefined") return false;

  // 1. Capacitor native share
  try {
    const { Capacitor } = await import("@capacitor/core");
    if (Capacitor.isNativePlatform()) {
      const { Share } = await import("@capacitor/share");
      await Share.share({
        title: options.title,
        text: options.text,
        url: options.url,
        dialogTitle: "Share JoyNook",
      });
      return true;
    }
  } catch {
    // Continue to web fallback
  }

  // 2. Web Share API fallback
  try {
    if (navigator.share) {
      await navigator.share({
        title: options.title,
        text: options.text,
        url: options.url,
      });
      return true;
    }
  } catch {
    // User cancelled or unsupported
  }

  // 3. Fallback: Copy link to clipboard
  try {
    await navigator.clipboard.writeText(options.url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Initialize Capacitor native event listeners (back-button, status bar)
 */
export const initNativeBridge = async (onNavigateBack?: () => void) => {
  if (typeof window === "undefined") return;

  try {
    const { Capacitor } = await import("@capacitor/core");
    if (!Capacitor.isNativePlatform()) return;

    // 1. Status Bar Setup
    try {
      const { StatusBar, Style } = await import("@capacitor/status-bar");
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: "#FAF9FF" });
    } catch {
      // Ignore if not supported on platform
    }

    // 2. Hardware Back Button Setup (Android)
    try {
      const { App } = await import("@capacitor/app");
      App.addListener("backButton", ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
          if (onNavigateBack) onNavigateBack();
        } else {
          App.exitApp();
        }
      });
    } catch {
      // Ignore if not available
    }
  } catch {
    // Non-native runtime
  }
};
