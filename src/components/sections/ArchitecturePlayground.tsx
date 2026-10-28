"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowUpRight, Check } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { usePreloaderComplete } from "@/src/components/layout/Preloader";
import { useReducedMotion } from "@/src/components/motion/useReducedMotion";
import { siteContent } from "@/src/content/site";

const EASE = [0.16, 1, 0.3, 1] as const;
const NODE_X = [54, 172, 288, 406] as const;
const NODE_Y = 95;
const LAYER_COLORS = ["#3DB5FF", "#8FE7B8", "#B6A1FF", "#F5C96B"] as const;

function getCurvePoints(startX: number, endX: number) {
  const controlY = 25;
  const middleX = (startX + endX) / 2;

  return [0, 0.25, 0.5, 0.75, 1].map((t) => {
    const inverse = 1 - t;
    const x =
      inverse ** 3 * startX +
      3 * inverse ** 2 * t * middleX +
      3 * inverse * t ** 2 * middleX +
      t ** 3 * endX;
    const y =
      inverse ** 3 * NODE_Y +
      3 * inverse ** 2 * t * controlY +
      3 * inverse * t ** 2 * controlY +
      t ** 3 * NODE_Y;

    return { x, y };
  });
}

function getMetrics(enabled: readonly boolean[]) {
  const missing = enabled.filter((isEnabled) => !isEnabled).length;
  const aiDisabled = !enabled[1];

  return {
    latency: 18 + missing * 19 + (aiDisabled ? 28 : 0),
    uptime: 99.99 - missing * 0.21,
    requests: 2400 - missing * 365,
  };
}

export function ArchitecturePlayground() {
  const sectionRef = useRef<HTMLElement>(null);
  const [enabledLayers, setEnabledLayers] = useState<boolean[]>(
    () => siteContent.playground.layers.map(() => true),
  );
  const reducedMotion = useReducedMotion();
  const preloaderComplete = usePreloaderComplete();
  const isInView = useInView(sectionRef, { once: true, margin: "0px 0px -12% 0px" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const panelScale = useTransform(
    scrollYProgress,
    [0, 0.3],
    [reducedMotion ? 1 : 0.94, 1],
  );

  const currentMetrics = getMetrics(enabledLayers);
  const latency = useMotionValue(18);
  const uptime = useMotionValue(99.99);
  const requests = useMotionValue(2400);
  const latencyText = useTransform(latency, (value) => Math.round(value).toString());
  const uptimeText = useTransform(uptime, (value) => value.toFixed(2));
  const requestsText = useTransform(requests, (value) =>
    Math.round(value).toLocaleString(),
  );

  useEffect(() => {
    if (!isInView || !preloaderComplete) return;

    const targets = [
      [latency, currentMetrics.latency],
      [uptime, currentMetrics.uptime],
      [requests, currentMetrics.requests],
    ] as const;

    if (reducedMotion) {
      targets.forEach(([value, target]) => value.set(target));
      return;
    }

    const controls = targets.map(([value, target]) =>
      animate(value, target, { duration: 0.7, ease: EASE }),
    );

    return () => controls.forEach((control) => control.stop());
  }, [
    currentMetrics.latency,
    currentMetrics.requests,
    currentMetrics.uptime,
    isInView,
    latency,
    preloaderComplete,
    reducedMotion,
    requests,
    uptime,
  ]);

  function toggleLayer(index: number) {
    setEnabledLayers((current) =>
      current.map((isEnabled, layerIndex) =>
        layerIndex === index ? !isEnabled : isEnabled,
      ),
    );
  }

  const activeLayers = siteContent.playground.layers
    .map((layer, index) => ({ layer, index }))
    .filter(({ index }) => enabledLayers[index]);
  const activeEdges = activeLayers.slice(1).map((entry, index) => ({
    from: activeLayers[index],
    to: entry,
  }));

  return (
    <section
      ref={sectionRef}
      aria-labelledby="architecture-playground-title"
      className="scroll-target bg-white px-4 py-20 sm:px-8 sm:py-28 lg:px-12"
    >
      <motion.article
        style={{ scale: panelScale }}
        className="architecture-panel relative mx-auto grid w-full max-w-[90rem] overflow-hidden rounded-[2rem] border border-accent/30 bg-navy px-6 py-10 text-white shadow-[0_30px_100px_rgba(10,15,31,0.24)] sm:rounded-[2.5rem] sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-center lg:gap-12 lg:px-14 lg:py-16"
      >
        <div
          aria-hidden="true"
          className="architecture-glow pointer-events-none absolute -right-36 -top-44 size-[30rem] rounded-full"
        />
        <div className="relative z-[1]">
          <p className="font-technical text-[10px] uppercase tracking-[0.17em] text-accent sm:text-xs">
            {siteContent.playground.eyebrow}
          </p>
          <h2
            id="architecture-playground-title"
            className="mt-6 max-w-xl text-[clamp(3rem,6.6vw,6.6rem)] font-medium leading-[0.96] tracking-[-0.065em] text-white"
          >
            {siteContent.playground.headline[0]}
            <br />
            <span className="font-editorial font-normal text-accent">
              {siteContent.playground.headline[1]}
            </span>
          </h2>
          <p className="mt-7 max-w-md text-base leading-relaxed text-white/65 sm:text-lg">
            {siteContent.playground.sub}
          </p>
          <a
            href="#contact"
            className="playground-cta group mt-8 inline-flex items-center gap-2 text-sm font-medium text-white sm:text-base"
          >
            {siteContent.playground.cta}
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
            <span aria-hidden="true" className="playground-cta-line" />
          </a>
        </div>

        <div className="playground-terminal relative z-[1] mt-12 min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0e1527] p-4 shadow-[0_18px_70px_rgba(0,0,0,0.25)] sm:p-6 lg:mt-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <p className="font-technical text-[10px] tracking-[0.12em] text-white/70 sm:text-xs">
              {siteContent.playground.header}
            </p>
            <div className="flex items-center gap-2 font-technical text-[9px] tracking-[0.14em] text-white/70 sm:text-[10px]">
              <span aria-hidden="true" className="playground-status-dot size-2 rounded-full bg-[#72E6A6]" />
              {siteContent.playground.status}
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {siteContent.playground.layers.map((layer, index) => {
              const isEnabled = enabledLayers[index];

              return (
                <button
                  key={layer.name}
                  type="button"
                  aria-pressed={isEnabled}
                  onClick={() => toggleLayer(index)}
                  style={{ "--layer-color": LAYER_COLORS[index] } as CSSProperties}
                  className={`playground-layer flex min-w-0 items-center gap-3 rounded-xl border p-3 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:p-3.5 ${
                    isEnabled
                      ? "playground-layer--active border-[color:var(--layer-color)] bg-white/[0.04]"
                      : "border-white/10 bg-transparent text-white/45 hover:border-white/25"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex size-5 shrink-0 items-center justify-center rounded-md border ${
                      isEnabled
                        ? "border-[color:var(--layer-color)] bg-[color:var(--layer-color)] text-navy"
                        : "border-white/25 text-transparent"
                    }`}
                  >
                    {isEnabled && <Check className="size-3" strokeWidth={3} />}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="truncate text-sm font-medium text-white sm:text-[15px]">
                      {layer.name}
                    </span>
                    <span
                      className={`truncate font-technical text-[9px] tracking-wide sm:text-[10px] ${
                        isEnabled ? "text-[color:var(--layer-color)]" : "text-white/40"
                      }`}
                    >
                      {layer.value}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="playground-diagram mt-5 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a1020] px-2 py-4 sm:px-4 sm:py-5">
            <svg
              aria-hidden="true"
              className="block h-auto w-full"
              viewBox="0 0 460 190"
              fill="none"
            >
              <defs>
                <linearGradient id="playground-edge-gradient" x1="0" x2="1">
                  <stop stopColor="#3DB5FF" stopOpacity=".25" />
                  <stop offset="1" stopColor="#8FE7B8" stopOpacity=".9" />
                </linearGradient>
              </defs>
              {activeEdges.map(({ from, to }) => {
                const startX = NODE_X[from.index];
                const endX = NODE_X[to.index];
                const middleX = (startX + endX) / 2;
                const path = `M ${startX} ${NODE_Y} C ${middleX} 25 ${middleX} 165 ${endX} ${NODE_Y}`;
                const points = getCurvePoints(startX, endX);

                return (
                  <g key={`${from.index}-${to.index}`}>
                    <motion.path
                      d={path}
                      stroke="url(#playground-edge-gradient)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: reducedMotion ? 1 : 0, opacity: 0.8 }}
                      animate={{ pathLength: 1, opacity: 0.8 }}
                      transition={{ duration: reducedMotion ? 0 : 0.8, ease: EASE }}
                    />
                    {!reducedMotion && isInView && (
                      <motion.circle
                        r="3"
                        fill="#8FE7B8"
                        initial={{ cx: points[0].x, cy: points[0].y }}
                        animate={{
                          cx: points.map((point) => point.x),
                          cy: points.map((point) => point.y),
                        }}
                        transition={{
                          duration: 2,
                          ease: "linear",
                          repeat: Infinity,
                        }}
                      />
                    )}
                  </g>
                );
              })}

              {activeLayers.map(({ layer, index }) => {
                const x = NODE_X[index];

                return (
                  <motion.g
                    key={layer.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reducedMotion ? 0 : 0.35, ease: EASE }}
                  >
                    <rect
                      x={x - 46}
                      y="73"
                      width="92"
                      height="44"
                      rx="12"
                      fill="#10192c"
                      stroke={LAYER_COLORS[index]}
                      strokeOpacity=".7"
                    />
                    <circle cx={x - 31} cy={95} r="3" fill={LAYER_COLORS[index]} />
                    <text
                      x={x + 2}
                      y={99}
                      fill="#F3F7FF"
                      textAnchor="middle"
                      fontFamily="var(--font-jetbrains), monospace"
                      fontSize="7.5"
                      letterSpacing=".02em"
                    >
                      {layer.name}
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </div>

          <div className="mt-4 grid grid-cols-3 divide-x divide-white/10 rounded-xl border border-white/[0.08] bg-white/[0.025] py-3">
            {[
              {
                label: siteContent.playground.metrics[0],
                value: latencyText,
                suffix: "ms",
              },
              {
                label: siteContent.playground.metrics[1],
                value: uptimeText,
                suffix: "%",
              },
              {
                label: siteContent.playground.metrics[2],
                value: requestsText,
                suffix: "",
              },
            ].map((metric) => (
              <div key={metric.label} className="flex min-w-0 flex-col items-center gap-1 px-1 text-center">
                <span className="font-technical text-[8px] tracking-[0.12em] text-white/40 sm:text-[9px]">
                  {metric.label}
                </span>
                <span className="font-technical text-xs tabular-nums text-white sm:text-sm">
                  <motion.span>{metric.value}</motion.span>
                  <span className="ml-0.5 text-accent">{metric.suffix}</span>
                </span>
              </div>
            ))}
          </div>
          <p className="sr-only" aria-live="polite">
            {activeLayers.length
              ? activeLayers.map(({ layer }) => layer.name).join(", ")
              : "No active system layers"}
          </p>
        </div>
      </motion.article>
    </section>
  );
}
