import type { HTMLAttributes, ReactNode } from "react";

type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
};

export function Chip({ children, className, ...props }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-line bg-white px-3 py-1.5 text-sm text-ink ${className ?? ""}`}
      {...props}
    >
      {children}
    </span>
  );
}
