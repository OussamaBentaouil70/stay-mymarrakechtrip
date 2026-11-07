import { clients, clientsIntro } from "../data/site";
import { Picture } from "./Picture";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/** 4 — Who we work with */
export function Clients() {
  return (
    <section id="clients" aria-labelledby="clients-title" className="section-pad scroll-mt-16 bg-sand">
      <div className="container-page">
        <SectionHeading id="clients-title" eyebrow={clientsIntro.eyebrow} title={clientsIntro.title} text={clientsIntro.text} />

        <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 xl:grid-cols-5">
          {clients.map((client, i) => (
            <Reveal as="li" key={client.title} delay={i * 70}>
              <div className="aspect-[3/4] overflow-hidden bg-stone sm:aspect-[4/5] xl:aspect-[3/4]">
                <Picture photo={client.photo} sizes="(min-width: 1280px) 20vw, (min-width: 640px) 50vw, 100vw" />
              </div>
              <h3 className="type-h4 mt-5 text-charcoal">{client.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{client.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
