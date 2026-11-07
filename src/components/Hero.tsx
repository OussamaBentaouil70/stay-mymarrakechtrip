import { ArrowRight } from "lucide-react";
import { hero, services, whatsappDisplay, whatsappLink } from "../data/site";
import { EnquiryForm } from "./EnquiryForm";
import { Picture } from "./Picture";
import { Reveal } from "./Reveal";
import { WhatsAppIcon } from "./WhatsAppIcon";

/** 1 — Hero: positioning on the left, consultation form on the right */
export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-charcoal text-ivory">
      <div className="absolute inset-0 -z-10">
        <Picture photo={hero.photo} sizes="100vw" priority />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(36,32,29,0.9)_0%,rgba(36,32,29,0.74)_50%,rgba(36,32,29,0.5)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(36,32,29,0.85),rgba(36,32,29,0)_45%)]" />

      <div className="container-page grid flex-1 items-center gap-12 pt-32 pb-16 lg:grid-cols-12 lg:gap-14 lg:pt-36">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="type-eyebrow flex items-center gap-3 text-bronze-light">
              <span aria-hidden="true" className="h-px w-8 bg-bronze-light" />
              {hero.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 id="hero-title" className="type-display mt-6 text-ivory">
              {hero.title} <em className="font-normal text-bronze-light">{hero.titleAccent}</em>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="type-lead mt-7 max-w-2xl text-ivory/85">{hero.intro}</p>
          </Reveal>
          <Reveal delay={240} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href="#services" className="btn btn-outline-light group">
              {hero.secondaryCta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 text-[0.9375rem] text-ivory/85 transition-colors hover:text-ivory"
            >
              <WhatsAppIcon className="h-5 w-5 text-bronze-light" />
              {whatsappDisplay}
            </a>
          </Reveal>
        </div>

        <Reveal delay={200} className="lg:col-span-5">
          <EnquiryForm variant="hero" />
        </Reveal>
      </div>

      {/* Service strip */}
      <div className="border-t border-ivory/15">
        <ul className="container-page grid grid-cols-2 gap-x-6 gap-y-3 py-6 sm:grid-cols-3 lg:grid-cols-5">
          {services.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="group flex items-baseline gap-2.5 text-[0.8125rem] text-ivory/80 transition-colors hover:text-ivory">
                <span className="font-serif text-[0.95rem] text-bronze-light">{s.number}</span>
                <span className="font-medium">{s.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
