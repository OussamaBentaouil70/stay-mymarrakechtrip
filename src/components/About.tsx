import { Check } from "lucide-react";
import { about } from "../data/site";
import { Picture } from "./Picture";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/** 2 — About STAY: introduction, approach and outcomes */
export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section-pad scroll-mt-16 bg-white">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <SectionHeading id="about-title" eyebrow={about.eyebrow} title={about.title} />
          <div className="mt-8 max-w-2xl space-y-5">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 60}>
                <p className="text-muted">{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={100}>
            <h3 className="type-eyebrow mt-14 text-charcoal">Our approach</h3>
          </Reveal>
          <ol className="mt-6 grid gap-px border border-stone bg-stone sm:grid-cols-3">
            {about.steps.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 80} className="bg-white p-6">
                <span className="font-serif text-[2rem] leading-none text-bronze">0{i + 1}</span>
                <h4 className="type-h4 mt-4 text-charcoal">{step.title}</h4>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-5">
          <Reveal className="relative">
            <div className="aspect-[4/5] overflow-hidden bg-sand">
              <Picture photo={about.photo} sizes="(min-width: 1024px) 40vw, 100vw" />
            </div>
          </Reveal>
          <Reveal delay={100} className="mt-8 border-t border-stone pt-8">
            <h3 className="type-h4 text-charcoal">{about.outcomesTitle}</h3>
            <ul className="mt-5 space-y-3.5">
              {about.outcomes.map((item) => (
                <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-charcoal">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-bronze" strokeWidth={2.2} />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
