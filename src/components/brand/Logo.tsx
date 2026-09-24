import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const logoSrc = "/grainbazar-logo.webp";

export function Logo({
  to = "/",
  className,
}: {
  to?: string;
  className?: string;
  variant?: "light" | "dark";
}) {
  return (
    <Link
      to={to}
      className={cn("inline-flex shrink-0 items-center", className)}
      aria-label="GrainBazar home"
    >
      <img
        src={logoSrc}
        alt="GrainBazar — Your Business, Our Support"
        width={512}
        height={512}
        className="h-11 w-auto rounded-lg bg-white object-contain p-1 sm:h-12"
      />
      <span
        data-no-translate
        className="ml-2 hidden text-base font-extrabold tracking-wide text-white sm:inline sm:text-lg"
      >
        GRAIN BAZAR
      </span>
    </Link>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={logoSrc}
      alt="GrainBazar"
      width={512}
      height={512}
      className={cn("h-10 w-auto rounded-lg bg-white object-contain p-1", className)}
    />
  );
}
