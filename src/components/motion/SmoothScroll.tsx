"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { useReducedMotion } from "./useReducedMotion";

type LenisStore = {
  subscribe: (onChange: () => void) => () => void;
  getSnapshot: () => Lenis | null;
  set: (instance: Lenis | null) => void;
};

function createLenisStore(): LenisStore {
  let instance: Lenis | null = null;
  const listeners = new Set<() => void>();

  return {
    subscribe(onChange) {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    getSnapshot: () => instance,
    set(nextInstance) {
      instance = nextInstance;
      listeners.forEach((listener) => listener());
    },
  };
}

const LenisContext = createContext<LenisStore | null>(null);

export function useLenis() {
  const store = useContext(LenisContext);
  if (!store) {
    throw new Error("useLenis must be used within a SmoothScroll provider.");
  }
  return useSyncExternalStore(store.subscribe, store.getSnapshot, () => null);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  const [store] = useState(createLenisStore);

  useEffect(() => {
    if (reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);
    const instance = new Lenis({ autoRaf: false });
    const updateScrollTrigger = () => ScrollTrigger.update();
    const tick = (time: number) => instance.raf(time * 1000);

    instance.on("scroll", updateScrollTrigger);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    store.set(instance);

    return () => {
      instance.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(tick);
      instance.destroy();
      store.set(null);
    };
  }, [reducedMotion, store]);

  return <LenisContext.Provider value={store}>{children}</LenisContext.Provider>;
}
