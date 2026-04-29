export function isTouchEnabled() {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  const legacyNavigator = navigator as Navigator & {
    msMaxTouchPoints?: number;
  };

  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    (legacyNavigator.msMaxTouchPoints ?? 0) > 0
  );
}
