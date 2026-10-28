"use client";

import { useCallback, useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

type PointerCoordinates = Pick<PointerEvent, "clientX" | "clientY" | "pointerType">;

export function useRafPointer(
  callback: (coordinates: PointerCoordinates) => void,
) {
  const callbackRef = useRef(callback);
  const latest = useRef<PointerCoordinates>({
    clientX: 0,
    clientY: 0,
    pointerType: "mouse",
  });
  const frame = useRef(0);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    window.cancelAnimationFrame(frame.current);
    frame.current = 0;
  }, []);

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    latest.current = {
      clientX: event.clientX,
      clientY: event.clientY,
      pointerType: event.pointerType,
    };
    if (frame.current) return;

    frame.current = window.requestAnimationFrame(() => {
      frame.current = 0;
      callbackRef.current(latest.current);
    });
  }, []);

  useEffect(
    () => cancel,
    [cancel],
  );

  return { onPointerMove, cancel };
}
