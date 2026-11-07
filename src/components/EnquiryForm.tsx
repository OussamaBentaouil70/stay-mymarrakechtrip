import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { contact, contactIntro, emptyEnquiry, whatsappLink, type Enquiry } from "../data/site";
import { navigate } from "../router";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { cn } from "../utils/cn";

type Errors = Partial<Record<keyof Enquiry, string>>;
type Status = "idle" | "sending" | "sent" | "mailto" | "error";

function validate(values: Enquiry): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your name.";
  if (values.property.trim().length < 2) errors.property = "Please enter your property name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) errors.email = "Please enter a valid email address.";
  if (values.phone.trim() && !/^[+()\d\s.-]{6,20}$/.test(values.phone.trim())) errors.phone = "Please enter a valid phone number.";
  if (values.message.trim().length < 10) errors.message = "Please tell us a little more (at least 10 characters).";
  return errors;
}

/** Sends the enquiry to the PHPMailer backend, or falls back to the visitor's email app. */
async function deliver(values: Enquiry, source: string): Promise<"sent" | "mailto"> {
  const fields = {
    name: values.name.trim(),
    property: values.property.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    message: values.message.trim(),
    botcheck: "", // honeypot
  };

  if (contact.formEndpoint) {
    const response = await fetch(contact.formEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        ...fields,
        source,
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data?.ok === false) {
      // Surface validation errors from the server if present
      if (data?.errors) {
        const errorMessages = Object.values(data.errors).join(". ");
        throw new Error(errorMessages || data.message || "Delivery failed");
      }
      throw new Error(data?.message || "Delivery failed");
    }
    return "sent";
  }

  // Fallback: open visitor's email app
  const subject = `New STAY enquiry — ${fields.property}`;
  const body = [
    `Name: ${fields.name}`,
    `Property: ${fields.property}`,
    `Email: ${fields.email}`,
    `Phone: ${fields.phone || "—"}`,
    "",
    fields.message,
  ].join("\n");
  window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return "mailto";
}

/**
 * Enquiry form used in the hero (compact) and the contact section (full).
 * Each instance has its own ids, state and status.
 */
export function EnquiryForm({ variant }: { variant: "hero" | "contact" }) {
  const hero = variant === "hero";
  const prefix = `${variant}-enquiry`;
  const id = (key: keyof Enquiry) => `${prefix}-${key}`;

  const [values, setValues] = useState<Enquiry>(emptyEnquiry);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [honeypot, setHoneypot] = useState("");

  const update = (key: keyof Enquiry, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    if (status === "error" || status === "mailto") setStatus("idle");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    // Bots get a silent "success" without any delivery.
    if (honeypot) {
      navigate("/thank-you", { via: "endpoint" });
      return;
    }
    const found = validate(values);
    setErrors(found);
    const first = (Object.keys(found) as (keyof Enquiry)[])[0];
    if (first) {
      document.getElementById(id(first))?.focus();
      return;
    }
    setStatus("sending");
    const source = hero ? "Hero form" : "Contact form";
    try {
      const result = await deliver(values, source);
      const reference = `STAY-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const moved = navigate("/thank-you", {
        name: values.name.trim(),
        property: values.property.trim(),
        reference,
        via: result === "sent" ? "endpoint" : "email",
        source,
      });
      // Inline confirmation only if navigation is unavailable in this environment.
      if (!moved) {
        setStatus(result);
        if (result === "sent") setValues(emptyEnquiry());
      }
    } catch {
      setStatus("error");
    }
  };

  const errorText = (key: keyof Enquiry) =>
    errors[key] ? (
      <p id={`${id(key)}-error`} className="mt-1.5 text-[0.8125rem] text-[#a33a2c]">
        {errors[key]}
      </p>
    ) : null;

  const input = (
    key: Exclude<keyof Enquiry, "message">,
    label: string,
    opts: { type?: string; autoComplete?: string; required?: boolean; placeholder?: string } = {},
  ) => (
    <div>
      <label htmlFor={id(key)} className="field-label">
        {label}
        {opts.required ? <span className="text-bronze"> *</span> : <span className="font-normal text-muted"> (optional)</span>}
      </label>
      <input
        id={id(key)}
        name={key}
        type={opts.type ?? "text"}
        autoComplete={opts.autoComplete}
        placeholder={opts.placeholder}
        required={opts.required}
        className="field"
        value={values[key]}
        onChange={(e) => update(key, e.target.value)}
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errors[key] ? `${id(key)}-error` : undefined}
      />
      {errorText(key)}
    </div>
  );

  return (
    <div
      id={hero ? "hero-form" : undefined}
      className={cn("scroll-mt-24 border border-stone bg-white shadow-card", hero ? "p-6 sm:p-8" : "p-6 sm:p-10")}
    >
      {status === "sent" ? (
        <div role="status" className="py-4">
          <span className="grid h-12 w-12 place-items-center border border-bronze text-bronze">
            <Check className="h-5 w-5" />
          </span>
          <h3 className="type-h3 mt-6 text-charcoal">Thank you — your enquiry has been sent.</h3>
          <p className="mt-3 text-muted">We'll be in touch shortly to arrange a consultation.</p>
          <button type="button" onClick={() => setStatus("idle")} className="btn btn-outline mt-8">
            Send another enquiry
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate aria-labelledby={`${prefix}-title`}>
          <h2 id={`${prefix}-title`} className={cn("text-charcoal", hero ? "type-h4 text-[1.6rem]" : "type-h3")}>
            Request a consultation
          </h2>
          <p className="mt-2 text-[0.9375rem] text-muted">
            {hero
              ? "Tell us about your property — we'll get back to you shortly."
              : <>Fields marked <span className="text-bronze">*</span> are required.</>}
          </p>

          <div className={cn("grid sm:grid-cols-2", hero ? "mt-6 gap-4 lg:grid-cols-1 xl:grid-cols-2" : "mt-8 gap-5")}>
            {input("name", "Name", { autoComplete: "name", required: true })}
            {input("property", "Property name", { autoComplete: "organization", required: true })}
            {input("email", "Email", { type: "email", autoComplete: "email", required: true })}
            {input("phone", "Phone number", { type: "tel", autoComplete: "tel", placeholder: "+212 6 00 00 00 00" })}
            <div className="col-span-full">
              <label htmlFor={id("message")} className="field-label">
                Message<span className="text-bronze"> *</span>
              </label>
              <textarea
                id={id("message")}
                name="message"
                required
                rows={hero ? 3 : 5}
                placeholder="Tell us about your property (type, number of rooms) and your goals."
                className={cn("field resize-y", hero ? "min-h-[6rem]" : "min-h-[9rem]")}
                value={values.message}
                onChange={(e) => update("message", e.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? `${id("message")}-error` : undefined}
              />
              {errorText("message")}
            </div>
            {/* Spam trap — hidden from people, tempting for bots */}
            <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
              <label htmlFor={`${prefix}-website`}>Website</label>
              <input
                id={`${prefix}-website`}
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>
          </div>

          <div className={cn("flex flex-col gap-4", hero ? "mt-6" : "mt-8 sm:flex-row sm:items-center sm:justify-between")}>
            <button
              type="submit"
              disabled={status === "sending"}
              className={cn("btn btn-primary group w-full disabled:opacity-70", !hero && "sm:w-auto")}
            >
              {status === "sending" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  {hero ? "Let's work together" : contactIntro.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "inline-flex items-center gap-2 text-[0.875rem] font-medium text-charcoal underline-offset-4 hover:underline",
                hero && "justify-center",
              )}
            >
              <WhatsAppIcon className="h-4 w-4 text-bronze" /> Prefer WhatsApp? Chat with us
            </a>
          </div>

          <div aria-live="polite">
            {status === "mailto" && (
              <p className="mt-5 border-l-2 border-bronze bg-ivory px-4 py-3 text-[0.875rem] text-charcoal">
                Your email app should now open with your enquiry ready to send. If it didn't, please email us at{" "}
                <a href={`mailto:${contact.email}`} className="font-semibold underline underline-offset-2">
                  {contact.email}
                </a>
                .
              </p>
            )}
            {status === "error" && (
              <p role="alert" className="mt-5 border-l-2 border-[#a33a2c] bg-[#fbf1ef] px-4 py-3 text-[0.875rem] text-charcoal">
                Sorry, your enquiry couldn't be sent. Please try again, or contact us on WhatsApp or at{" "}
                <a href={`mailto:${contact.email}`} className="font-semibold underline underline-offset-2">
                  {contact.email}
                </a>
                .
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
