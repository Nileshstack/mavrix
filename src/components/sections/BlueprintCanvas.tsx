"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "@/src/components/motion/useReducedMotion";

export default function BlueprintCanvas({
  parentRef,
  active,
}: {
  parentRef: RefObject<HTMLElement | null>;
  active: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = parentRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !parent) return;
    if (!context) {
      console.error("Hero blueprint canvas could not acquire a 2D context.");
      return;
    }

    const coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)");
    const pointer = { x: -1000, y: -1000, active: false };
    const pendingPointer = { x: 0, y: 0 };
    const spacing = 26;
    let width = 0;
    let height = 0;
    let visible = false;
    let animationFrame = 0;
    let pointerFrame = 0;
    let staticMode = reducedMotion || coarsePointer.matches || !active;

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const columns = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      const elapsed = staticMode ? 0 : time * 0.0007;

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const baseX = column * spacing + spacing / 2;
          const baseY = row * spacing + spacing / 2;
          const dx = baseX - pointer.x;
          const dy = baseY - pointer.y;
          const distance = Math.hypot(dx, dy);
          const influence =
            pointer.active && !staticMode
              ? Math.max(0, 1 - distance / 145)
              : 0;
          const push = influence * influence * 17;
          const idleWave = staticMode
            ? 0
            : Math.sin(elapsed + column * 0.22 + row * 0.18) * 1.3;
          const x = baseX + (distance ? (dx / distance) * push : 0);
          const y = baseY + (distance ? (dy / distance) * push : 0) + idleWave;
          const radius =
            1.15 + influence * 2.7 + Math.max(0, idleWave) * 0.12;
          const alpha = 0.15 + influence * 0.48 + Math.max(0, idleWave) * 0.04;
          context.beginPath();
          context.arc(x, y, radius, 0, Math.PI * 2);
          context.fillStyle = `rgba(10, 15, 31, ${alpha})`;
          context.fill();
        }
      }

      if (visible && !staticMode) {
        animationFrame = window.requestAnimationFrame(draw);
      } else {
        animationFrame = 0;
      }
    };

    const resize = () => {
      const bounds = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (staticMode) draw(0);
    };

    const onPointerModeChange = () => {
      staticMode = reducedMotion || coarsePointer.matches || !active;
      if (staticMode && animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
      if (staticMode) {
        draw(0);
      } else if (visible && !animationFrame) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (staticMode || event.pointerType !== "mouse" || pointerFrame) return;
      pendingPointer.x = event.clientX;
      pendingPointer.y = event.clientY;
      pointerFrame = window.requestAnimationFrame(() => {
        const bounds = parent.getBoundingClientRect();
        pointer.x = pendingPointer.x - bounds.left;
        pointer.y = pendingPointer.y - bounds.top;
        pointer.active = true;
        pointerFrame = 0;
      });
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !staticMode && !animationFrame) {
        animationFrame = window.requestAnimationFrame(draw);
      } else if (!visible && animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    });

    resize();
    observer.observe(parent);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);
    parent.addEventListener("pointermove", onPointerMove, { passive: true });
    parent.addEventListener("pointerleave", onPointerLeave);
    coarsePointer.addEventListener("change", onPointerModeChange);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      parent.removeEventListener("pointermove", onPointerMove);
      parent.removeEventListener("pointerleave", onPointerLeave);
      coarsePointer.removeEventListener("change", onPointerModeChange);
      window.cancelAnimationFrame(animationFrame);
      window.cancelAnimationFrame(pointerFrame);
    };
  }, [active, parentRef, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 size-full"
    />
  );
}
