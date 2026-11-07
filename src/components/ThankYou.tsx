import { ArrowLeft, ArrowRight, Check, Mail } from "lucide-react";
import { contact, hero, site, whatsappDisplay, whatsappLink } from "../data/site";
import { getThankYouState, navigate } from "../router";
import { StayLogo } from "./Logo";
import { Picture } from "./Picture";
import { Reveal } from "./Reveal";
import { WhatsAppIcon } from "./WhatsAppIcon";

const nextSteps = [
  { number: "01", title: "We review", text: "Your property details and commercial goals are reviewed by our team." },
  { number: "02", title: "We prepare", text: "We look at your positioning, channels and opportunities before we speak." },
  { number: "03", title: "We schedule", text: "We contact you to arrange your consultation at a time that suits you." },
];

/** Confirmation page shown at /thank-you after an enquiry is submitted. */
export function ThankYou() {
  const state = getThankYouState();
  const firstName = state.name?.trim().split(/\s+/)[0];
  const viaEmail = state.via === "email";

  const goHome = (event: React.MouseEvent) => {
    event.preventDefault();
    navigate("/");
  };

  const waMessage = `Hello STAY, I've just submitted an enquiry${state.property ? ` for ${state.property}` : ""}${
    state.reference ? ` (ref ${state.reference})` : ""
  }. I'd like to discuss commercial management for my property.`;

  return (
    <div className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-charcoal text-ivory">
      {/* Hero imagery, consistent with the homepage */}
      <div className="absolute inset-0 -z-10">
        <Picture photo={hero.photo} sizes="100vw" priority />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(36,32,29,0.88)_0%,rgba(36,32,29,0.78)_55%,rgba(36,32,29,0.9)_100%)]" />

      {/* Slim header */}
      <header className="border-b border-ivory/15">
        <div className="container-page flex h-[76px] items-center justify-between gap-6">
          <a href={window.location.pathname} onClick={goHome} aria-label="STAY by My Marrakech Trip — homepage">
            <StayLogo variant="mark" tone="light" className="h-11 w-auto" />
          </a>
          <a
            href={window.location.pathname}
            onClick={goHome}
            className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-ivory/85 transition-colors hover:text-ivory"
          >
            <ArrowLeft className="h-4 w-4" /> Back to homepage
          </a>
        </div>
      </header>

      {/* Confirmation */}
      <main className="container-page flex flex-1 items-center justify-center py-16 lg:py-20">
        <div className="w-full max-w-2xl text-center">
          <Reveal>
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-bronze-light/60 bg-charcoal/40 text-bronze-light backdrop-blur-sm">
              <Check className="h-8 w-8" strokeWidth={1.8} />
            </span>
          </Reveal>

          <Reveal delay={80}>
            <p className="type-eyebrow mt-8 flex items-center justify-center gap-3 text-bronze-light">
              <span aria-hidden="true" className="h-px w-8 bg-bronze-light" />
              Enquiry received
              <span aria-hidden="true" className="h-px w-8 bg-bronze-light" />
            </p>
          </Reveal>

          <Reveal delay={140}>
            <h1 className="type-display mt-5 text-ivory">
              Thank you{firstName ? <>, <em className="font-normal text-bronze-light">{firstName}</em></> : ""}.
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="type-lead mx-auto mt-6 max-w-xl text-ivory/85">
              {state.property
                ? `Your enquiry for ${state.property} has been received.`
                : "Your enquiry has been received."}{" "}
              The STAY team will review your property details and get back to you shortly to
              arrange your consultation.
            </p>
          </Reveal>

          {state.reference && (
            <Reveal delay={240}>
              <p className="mt-6 inline-block border border-ivory/25 px-4 py-2 text-[0.8125rem] tracking-[0.14em] text-ivory/80 uppercase">
                Reference&nbsp;&nbsp;<span className="font-semibold text-ivory">{state.reference}</span>
              </p>
            </Reveal>
          )}

          {viaEmail && (
            <Reveal delay={260}>
              <p className="mx-auto mt-6 max-w-xl border-l-2 border-bronze-light bg-ivory/10 px-4 py-3 text-left text-[0.875rem] leading-relaxed text-ivory/90">
                One last step: your email app opened with your enquiry ready to send — please
                press <strong>send</strong> to complete it. If it didn't open, email us at{" "}
                <a href={`mailto:${contact.email}`} className="font-semibold underline underline-offset-2">
                  {contact.email}
                </a>
                .
              </p>
            </Reveal>
          )}

          {/* The two CTAs */}
          <Reveal delay={300} className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <a href={window.location.pathname} onClick={goHome} className="btn btn-light group">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to homepage
            </a>
            <a href={whatsappLink(waMessage)} target="_blank" rel="noreferrer" className="btn btn-outline-light">
              <WhatsAppIcon className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </Reveal>

          <Reveal delay={340}>
            <p className="mt-6 text-[0.875rem] text-ivory/70">
              Prefer to talk now? {whatsappDisplay} ·{" "}
              <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline">
                <Mail className="h-3.5 w-3.5" /> {contact.email}
              </a>
            </p>
          </Reveal>
        </div>
      </main>

      {/* What happens next */}
      <div className="border-t border-ivory/15">
        <div className="container-page py-8">
          <p className="type-eyebrow text-bronze-light">What happens next</p>
          <ol className="mt-5 grid gap-6 sm:grid-cols-3">
            {nextSteps.map((step, i) => (
              <Reveal as="li" key={step.number} delay={i * 80} className="flex gap-4">
                <span className="font-serif text-[1.5rem] leading-none text-bronze-light">{step.number}</span>
                <span>
                  <span className="block text-[0.9375rem] font-semibold text-ivory">{step.title}</span>
                  <span className="mt-1 block text-[0.8125rem] leading-relaxed text-ivory/70">{step.text}</span>
                </span>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>

      <footer className="border-t border-ivory/10">
        <div className="container-page flex flex-col gap-2 py-5 text-[0.8125rem] text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.fullName}
          </p>
          <a
            href={window.location.pathname}
            onClick={goHome}
            className="inline-flex items-center gap-1.5 tracking-[0.12em] uppercase transition-colors hover:text-ivory"
          >
            {site.url.replace("https://", "")} <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </footer>
    </div>
  );
}
