import { servicesIntro, services } from "../data/site";
import { Picture } from "./Picture";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { cn } from "../utils/cn";

/** 3 — Our services: five categories in alternating editorial rows */
export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section-pad scroll-mt-16 bg-ivory">
      <div className="container-page">
        <SectionHeading id="services-title" eyebrow={servicesIntro.eyebrow} title={servicesIntro.title} text={servicesIntro.text} />

        <div className="mt-16 border-t border-stone lg:mt-20">
          {services.map((service, index) => {
            const flip = index % 2 === 1;
            return (
              <article
                key={service.id}
                id={service.id}
                aria-labelledby={`${service.id}-title`}
                className="grid scroll-mt-24 gap-8 border-b border-stone py-12 lg:grid-cols-12 lg:gap-14 lg:py-16"
              >
                <Reveal className={cn("lg:col-span-5", flip && "lg:order-2 lg:col-start-8")}>
                  <div className="aspect-[4/3] overflow-hidden bg-sand">
                    <Picture photo={service.photo} sizes="(min-width: 1024px) 40vw, 100vw" />
                  </div>
                </Reveal>

                <div className={cn("lg:col-span-7", flip && "lg:order-1 lg:col-start-1")}>
                  <Reveal>
                    <p className="font-serif text-[1.125rem] text-bronze">{service.number}</p>
                    <h3 id={`${service.id}-title`} className="type-h3 mt-2 text-charcoal">
                      {service.title}
                    </h3>
                    <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-muted">{service.summary}</p>
                  </Reveal>
                  <Reveal delay={100}>
                    <ul className="mt-8 grid gap-x-10 sm:grid-cols-2">
                      {service.items.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 border-t border-stone py-3 text-[0.9375rem] leading-snug text-charcoal"
                        >
                          <span aria-hidden="true" className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-bronze" />
                          {item.replace(/\.$/, "")}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
