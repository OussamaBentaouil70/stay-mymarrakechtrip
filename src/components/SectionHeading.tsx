import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { cn } from "../utils/cn";

/** Eyebrow + heading + optional intro, used at the top of each section. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  text,
  tone = "dark",
  align = "left",
  className,
}: {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  text?: string;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
}) {
  const light = tone === "light";
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-3xl", className)}>
      <Reveal>
        <p
          className={cn(
            "type-eyebrow flex items-center gap-3",
            align === "center" && "justify-center",
            light ? "text-bronze-light" : "text-bronze",
          )}
        >
          <span aria-hidden="true" className={cn("h-px w-8", light ? "bg-bronze-light" : "bg-bronze")} />
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={80}>
        <h2 id={id} className={cn("type-h2 mt-5", light ? "text-ivory" : "text-charcoal")}>
          {title}
        </h2>
      </Reveal>
      {text && (
        <Reveal delay={160}>
          <p className={cn("type-lead mt-5", light ? "text-ivory/75" : "text-muted")}>{text}</p>
        </Reveal>
      )}
    </div>
  );
}
