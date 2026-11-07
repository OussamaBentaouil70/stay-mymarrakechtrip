import { Mail } from "lucide-react";
import { contact, navLinks, services, site, whatsappLink } from "../data/site";
import { StayLogo } from "./Logo";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function Footer() {
  return (
    <footer className="bg-charcoal-soft text-ivory">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12 lg:py-20">
        <div className="md:col-span-5">
          <a href="#top" aria-label="Back to top" className="inline-block">
            <StayLogo variant="full" tone="light" className="w-[230px] max-w-full" />
          </a>
          <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-ivory/70">
            Commercial, revenue and distribution management for hotels, boutique hotels and independent riads in {site.city}.
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-2">
          <h2 className="type-eyebrow text-bronze-light">Explore</h2>
          <ul className="mt-5 space-y-2.5">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-[0.9375rem] text-ivory/80 transition-colors hover:text-ivory">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h2 className="type-eyebrow text-bronze-light">Services</h2>
          <ul className="mt-5 space-y-2.5">
            {services.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-[0.9375rem] text-ivory/80 transition-colors hover:text-ivory">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h2 className="type-eyebrow text-bronze-light">Contact</h2>
          <ul className="mt-5 space-y-3 text-[0.9375rem]">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-ivory/80 hover:text-ivory">
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 break-all text-ivory/80 hover:text-ivory">
                <Mail className="h-4 w-4 shrink-0" /> Email us
              </a>
            </li>
            <li className="text-ivory/60">
              {site.city}, {site.country}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-page flex flex-col gap-2 py-6 text-[0.8125rem] text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.fullName}. All rights reserved.
          </p>
          <p>{site.url.replace("https://", "")}</p>
        </div>
      </div>
    </footer>
  );
}
