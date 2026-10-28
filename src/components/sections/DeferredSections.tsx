"use client";

import dynamic from "next/dynamic";

export const DeferredArchitecturePlayground = dynamic(
  () =>
    import("./ArchitecturePlayground").then(
      (module) => module.ArchitecturePlayground,
    ),
);

export const DeferredDelivery = dynamic(
  () => import("./Delivery").then((module) => module.Delivery),
);
