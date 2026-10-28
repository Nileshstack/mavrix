import { ArrowUpRight } from "lucide-react";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant = "primary" | "outline" | "light";

type SharedProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type ButtonProps = SharedProps &
  (
    | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">)
    | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
  );

const variantClasses: Record<ButtonVariant, string> = {
  primary: "border-navy bg-navy text-white hover:bg-accent hover:text-navy",
  outline: "border-line bg-transparent text-ink hover:border-accent hover:bg-accent/10",
  light: "border-white bg-white text-navy hover:bg-accent hover:border-accent",
};

const baseClasses =
  "group inline-flex min-h-12 items-center justify-center gap-4 rounded-full border px-6 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

function buttonClassName(variant: ButtonVariant, className?: string) {
  return `${baseClasses} ${variantClasses[variant]} ${className ?? ""}`;
}

export function Button(props: ButtonProps) {
  const icon = (
    <ArrowUpRight
      aria-hidden="true"
      className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
    />
  );

  if (typeof props.href === "string") {
    const {
      href,
      children,
      variant = "primary",
      className,
      ...anchorProps
    } = props;
    return (
      <a href={href} className={buttonClassName(variant, className)} {...anchorProps}>
        <span>{children}</span>
        {icon}
      </a>
    );
  }

  const { children, variant = "primary", className, ...buttonProps } = props;
  return (
    <button
      className={buttonClassName(variant, className)}
      {...(buttonProps as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      <span>{children}</span>
      {icon}
    </button>
  );
}
