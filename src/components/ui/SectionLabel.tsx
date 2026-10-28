type SectionLabelProps = {
  children: string;
  className?: string;
};

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p
      className={`flex items-center gap-3 font-technical text-xs uppercase tracking-[0.16em] text-ink/70 ${className ?? ""}`}
    >
      <span aria-hidden="true" className="h-px w-8 bg-accent" />
      {children}
    </p>
  );
}
