import { ArrowRight, Mail, MapPin } from "lucide-react";
import { contact, contactIntro, site, whatsappDisplay, whatsappLink } from "../data/site";
import { EnquiryForm } from "./EnquiryForm";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { WhatsAppIcon } from "./WhatsAppIcon";

/** 6 — Contact */
export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="section-pad scroll-mt-16 bg-ivory">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading id="contact-title" eyebrow={contactIntro.eyebrow} title={contactIntro.title} text={contactIntro.text} />

          <Reveal delay={200} className="mt-10 space-y-4">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 border border-stone bg-white p-5 transition-colors hover:border-charcoal"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center bg-espresso text-ivory">
                <WhatsAppIcon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.9375rem] font-semibold text-charcoal">Chat with us on WhatsApp</span>
                <span className="block text-[0.875rem] text-muted">{whatsappDisplay}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-bronze transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="group flex items-center gap-4 border border-stone bg-white p-5 transition-colors hover:border-charcoal"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center border border-stone text-bronze">
                <Mail className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.9375rem] font-semibold text-charcoal">Email</span>
                <span className="block truncate text-[0.875rem] text-muted">{contact.email}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-bronze transition-transform group-hover:translate-x-1" />
            </a>
            <p className="flex items-center gap-3 px-1 pt-2 text-[0.875rem] text-muted">
              <MapPin className="h-4 w-4 text-bronze" />
              {site.city}, {site.country}
            </p>
          </Reveal>
        </div>

        <Reveal delay={120} className="lg:col-span-7">
          <EnquiryForm variant="contact" />
        </Reveal>
      </div>
    </section>
  );
}
