import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks, whatsappLink } from "../data/site";
import { StayLogo } from "./Logo";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { cn } from "../utils/cn";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    navLinks.forEach((l) => {
      const el = document.getElementById(l.href.slice(1));
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300",
        open
            ? "border-b border-stone bg-ivory"
            : solid
              ? "border-b border-stone bg-ivory/95 backdrop-blur-md"
              : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-page flex h-[76px] items-center justify-between gap-6">
        <a href="#top" className="flex items-center gap-4" aria-label="STAY by My Marrakech Trip — back to top">
          <StayLogo variant="mark" tone={solid ? "dark" : "light"} className="h-11 w-auto" />
          <span
            className={cn(
              "hidden border-l pl-4 text-[0.625rem] leading-[1.55] font-semibold tracking-[0.22em] uppercase xl:block",
              solid ? "border-stone text-muted" : "border-ivory/30 text-ivory/80",
            )}
          >
            By My Marrakech Trip
            <br />
            Hospitality commercial management
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const isActive = active === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative py-2 text-[0.875rem] font-medium transition-colors",
                  solid ? "text-charcoal hover:text-bronze" : "text-ivory/90 hover:text-ivory",
                )}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute bottom-0 left-0 h-px w-full origin-left transition-transform duration-300",
                    solid ? "bg-bronze" : "bg-ivory",
                    isActive ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            aria-label="Contact STAY on WhatsApp"
            className={cn(
              "hidden h-11 w-11 place-items-center border transition-colors md:grid",
              solid
                ? "border-stone text-charcoal hover:border-charcoal"
                : "border-ivory/40 text-ivory hover:border-ivory",
            )}
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" />
          </a>
          <a href="#contact" className={cn("btn hidden sm:inline-flex", solid ? "btn-primary" : "btn-light")}>
            Let's work together
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className={cn(
              "grid h-11 w-11 place-items-center border lg:hidden",
              solid ? "border-stone text-charcoal" : "border-ivory/40 text-ivory",
            )}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="h-[calc(100dvh-76px)] overflow-y-auto border-t border-stone bg-ivory lg:hidden">
          <nav aria-label="Mobile" className="container-page flex flex-col py-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-stone py-4 font-serif text-[1.75rem] text-charcoal"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-8 flex flex-col gap-3">
              <a href="#contact" onClick={() => setOpen(false)} className="btn btn-primary">
                Request a consultation
              </a>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn btn-outline">
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
