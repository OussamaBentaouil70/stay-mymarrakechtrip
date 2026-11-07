import { ArrowRight } from "lucide-react";
import { reasons, whyIntro } from "../data/site";
import { ArchMark } from "./Logo";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/** 5 — Why STAY */
export function WhyStay() {
  return (
    <section id="why" aria-labelledby="why-title" className="section-pad scroll-mt-16 bg-charcoal text-ivory">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading id="why-title" tone="light" eyebrow={whyIntro.eyebrow} title={whyIntro.title} text={whyIntro.text} />
            <Reveal delay={200}>
              <a href="#contact" className="btn btn-light group mt-10">
                Request a consultation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Reveal>
          </div>
        </div>

        <ol className="grid gap-px bg-ivory/12 sm:grid-cols-2 lg:col-span-8">
          {reasons.map((reason, i) => (
            <Reveal
              as="li"
              key={reason.title}
              delay={(i % 2) * 80}
              className={`bg-charcoal p-8 sm:p-10 ${i === reasons.length - 1 ? "sm:col-span-2" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-[2.25rem] leading-none text-bronze-light">0{i + 1}</span>
                <ArchMark className="h-7 w-7 text-ivory/25" />
              </div>
              <h3 className="type-h4 mt-6 text-ivory">{reason.title}</h3>
              <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-ivory/70">{reason.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
