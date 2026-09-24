import { Link } from "@tanstack/react-router";
import logo from "@/assets/grainbazar-logo.png.asset.json";
import { cn } from "@/lib/utils";

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
        src={logo.url}
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
      src={logo.url}
      alt="GrainBazar"
      width={512}
      height={512}
      className={cn("h-10 w-auto rounded-lg bg-white object-contain p-1", className)}
    />
  );
}
