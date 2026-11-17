/**
 * Unified Haptics Bridge
 * Supports Capacitor Native (iOS / Android) and Web Vibration API fallback.
 */

export const triggerHaptic = async (
  style: "light" | "medium" | "heavy" | "success" | "warning" | "selection" = "light"
) => {
  if (typeof window === "undefined") return;

  // 1. Try Capacitor Haptics if available in native runtime
  try {
    const { Capacitor } = await import("@capacitor/core");
    if (Capacitor.isNativePlatform()) {
      const { Haptics, ImpactStyle, NotificationType } = await import("@capacitor/haptics");
      
      switch (style) {
        case "light":
          await Haptics.impact({ style: ImpactStyle.Light });
          return;
        case "medium":
          await Haptics.impact({ style: ImpactStyle.Medium });
          return;
        case "heavy":
          await Haptics.impact({ style: ImpactStyle.Heavy });
          return;
        case "success":
          await Haptics.notification({ type: NotificationType.Success });
          return;
        case "warning":
          await Haptics.notification({ type: NotificationType.Warning });
          return;
        case "selection":
          await Haptics.selectionChanged();
          return;
      }
    }
  } catch {
    // Fall back to web vibration if Capacitor is not active
  }

  // 2. Web Vibration API fallback
  try {
    if ("vibrate" in navigator && typeof navigator.vibrate === "function") {
      switch (style) {
        case "light":
        case "selection":
          navigator.vibrate(10);
          break;
        case "medium":
          navigator.vibrate(25);
          break;
        case "heavy":
          navigator.vibrate(50);
          break;
        case "success":
          navigator.vibrate([15, 30, 25]);
          break;
        case "warning":
          navigator.vibrate([30, 50, 30]);
          break;
      }
    }
  } catch {
    // Vibration not supported or user gesture required
  }
};
