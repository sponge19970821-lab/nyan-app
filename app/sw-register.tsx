"use client";

import { useEffect } from "react";

export default function SwRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("Service worker registered"))
        .catch((err) => console.warn("SW registration failed", err));
    }
  }, []);

  return null;
}
