/**
 * Cloudflare Pages Function — POST /api/send-inquiry
 *
 * Sends two emails through an SMTP mailbox using Nodemailer:
 *   1. Admin notification (reply-to set to the visitor)
 *   2. Client thank-you
 *
 * Requires the `nodejs_compat` compatibility flag (see wrangler.toml), which
 * gives Workers `node:net` / `node:tls` so Nodemailer can open the SMTP
 * connection.
 *
 * Required environment variables (Pages → Settings → Environment variables):
 *   MAIL_HOST, MAIL_USERNAME, MAIL_PASSWORD, MAIL_FROM_ADDRESS, ADMIN_EMAIL
 * Optional:
 *   MAIL_PORT, MAIL_ENCRYPTION, MAIL_FROM_NAME, ADMIN_NAME, SITE_URL, WHATSAPP_NUMBER
 *
 * Local development: put the same values in `.dev.vars` (gitignored).
 */

import nodemailer from "nodemailer";

interface Env {
  MAIL_HOST?: string;
  MAIL_PORT?: string;
  MAIL_ENCRYPTION?: string;
  MAIL_USERNAME?: string;
  MAIL_PASSWORD?: string;
  MAIL_FROM_ADDRESS?: string;
  MAIL_FROM_NAME?: string;
  ADMIN_EMAIL?: string;
  ADMIN_NAME?: string;
  SITE_URL?: string;
  WHATSAPP_NUMBER?: string;
}

interface Payload {
  name?: unknown;
  property?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
  botcheck?: unknown;
  website?: unknown;
}

interface Enquiry {
  name: string;
  property: string;
  email: string;
  phone: string;
  message: string;
}

interface TemplateData extends Enquiry {
  firstName: string;
  submittedAt: string;
  ipAddress: string;
  siteUrl: string;
  whatsappLink: string;
  year: number;
  brandName: string;
  adminEmail: string;
}

interface MailOptions {
  from: string;
  to: string[];
  replyTo: string;
  subject: string;
  html: string;
  text: string;
}

const BRAND = "STAY by My Marrakech Trip";
const INK = "#24201d";
const IVORY = "#f8f5f0";
const BRONZE = "#c39466";

const json = (status: number, body: unknown): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });

/** Escape every user value before it reaches HTML. */
const esc = (value: unknown): string =>
  String(value ?? "").replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });

const text = (value: unknown): string => (typeof value === "string" ? value : value == null ? "" : String(value));

/** Length in code points, matching mb_strlen(). */
const cpLength = (value: string): number => Array.from(value).length;

const oneLine = (value: string): string => value.replace(/[\r\n]+/g, " ").trim();

const str = (value: unknown): string => (typeof value === "string" ? value : "");

function validate(payload: Payload): { values: Enquiry; errors: Record<string, string> } {
  const values: Enquiry = {
    name: str(payload.name).trim(),
    property: str(payload.property).trim(),
    email: str(payload.email).trim(),
    phone: str(payload.phone).trim(),
    message: str(payload.message).trim(),
  };

  const errors: Record<string, string> = {};

  if (cpLength(values.name) < 2 || cpLength(values.name) > 120) {
    errors.name = "Please enter your full name.";
  }
  if (cpLength(values.property) < 2 || cpLength(values.property) > 120) {
    errors.property = "Please enter your property name.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email) || cpLength(values.email) > 190) {
    errors.email = "Please enter a valid email address.";
  }
  if (cpLength(values.phone) > 40) {
    errors.phone = "Please enter a valid phone number.";
  }
  if (cpLength(values.message) < 10 || cpLength(values.message) > 3000) {
    errors.message = "Please tell us a little more (at least 10 characters, max 3000).";
  }

  return { values, errors };
}

function adminHtml(data: TemplateData): string {
  const replyHref = `mailto:${esc(data.email)}?subject=${encodeURIComponent("Re: Your STAY enquiry")}`;
  const row = (label: string, value: string, bold = false): string => `
                <tr>
                  <td style="padding:10px 14px;font-size:12px;color:#6b625a;border-bottom:1px solid #eeeeee;width:32%;">${label}</td>
                  <td style="padding:10px 14px;font-size:13px;${bold ? "font-weight:bold;" : ""}border-bottom:1px solid #eeeeee;">${value}</td>
                </tr>`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>New enquiry</title>
</head>
<body style="margin:0;padding:0;background-color:#eeeeee;font-family:Arial,Helvetica,sans-serif;color:#333333;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eeeeee;">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#ffffff;border:1px solid #dddddd;border-radius:6px;overflow:hidden;">
          <tr>
            <td style="background-color:${INK};padding:26px 32px;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;letter-spacing:0.14em;color:${IVORY};text-transform:uppercase;">${esc(data.brandName)}</div>
              <div style="margin-top:6px;font-size:10px;letter-spacing:0.24em;color:${BRONZE};text-transform:uppercase;">New enquiry</div>
            </td>
          </tr>
          <tr>
            <td style="padding:30px 40px 6px;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.3;font-weight:normal;color:${INK};">
                New enquiry from ${esc(data.name)}
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #dddddd;">
                ${row("Name", esc(data.name), true)}
                ${row("Property", esc(data.property), true)}
                ${row("Email", `<a href="mailto:${esc(data.email)}" style="color:${INK};">${esc(data.email)}</a>`)}
                ${row("Phone", esc(data.phone || "Not provided"))}
                ${row("Submitted", esc(data.submittedAt))}
                ${row("IP", esc(data.ipAddress))}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f7f7f7;border-left:3px solid ${INK};">
                <tr>
                  <td style="padding:16px 18px;">
                    <span style="display:block;margin-bottom:6px;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#6b625a;">Message</span>
                    <span style="font-size:13px;line-height:1.7;color:#444444;">${esc(data.message).replace(/\n/g, "<br />")}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:26px 40px 8px;">
              <a href="${replyHref}" style="display:inline-block;background-color:${INK};color:${IVORY};text-decoration:none;padding:13px 26px;border-radius:4px;font-size:12px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;">
                Reply to ${esc(data.firstName)}
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 40px 26px;">
              <div style="border-top:1px solid #dddddd;padding-top:16px;text-align:center;">
                <p style="margin:0;font-size:11px;color:#999999;">Sent from ${esc(data.brandName)}${data.siteUrl ? ` · ${esc(data.siteUrl)}` : ""}</p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function clientHtml(data: TemplateData): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Thank you</title>
</head>
<body style="margin:0;padding:0;background-color:#eeeeee;font-family:Arial,Helvetica,sans-serif;color:#333333;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eeeeee;">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#ffffff;border:1px solid #dddddd;border-radius:6px;overflow:hidden;">
          <tr>
            <td style="background-color:${INK};padding:28px 32px;text-align:center;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:21px;letter-spacing:0.14em;color:${IVORY};text-transform:uppercase;">${esc(data.brandName)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:34px 40px 8px;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:bold;letter-spacing:0.22em;text-transform:uppercase;color:#777777;">Thank you</p>
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:27px;line-height:1.3;font-weight:normal;color:${INK};">
                Thank you, ${esc(data.firstName)}.
              </h1>
              <p style="margin:16px 0 0;font-size:15px;line-height:1.7;color:#555555;">
                We have received your enquiry regarding <strong style="color:${INK};">${esc(data.property)}</strong> and our team will reply within
                <strong style="color:${INK};">24–48 hours</strong>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f7f7f7;border-left:3px solid ${INK};">
                <tr>
                  <td style="padding:16px 18px;">
                    <span style="display:block;margin-bottom:6px;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#777777;">Your message</span>
                    <span style="font-size:13px;line-height:1.7;color:#444444;">${esc(data.message).replace(/\n/g, "<br />")}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${
            data.whatsappLink
              ? `<tr>
            <td align="center" style="padding:28px 40px 8px;">
              <a href="${esc(data.whatsappLink)}" style="display:inline-block;background-color:${INK};color:${IVORY};text-decoration:none;padding:13px 26px;border-radius:4px;font-size:12px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;">
                Chat on WhatsApp
              </a>
            </td>
          </tr>`
              : ""
          }
          <tr>
            <td style="padding:24px 40px 28px;">
              <div style="border-top:1px solid #dddddd;padding-top:18px;text-align:center;">
                ${data.siteUrl ? `<p style="margin:0 0 8px;font-size:12px;"><a href="${esc(data.siteUrl)}" style="color:${INK};text-decoration:underline;">${esc(data.siteUrl)}</a></p>` : ""}
                <p style="margin:0;font-size:11px;color:#999999;">© ${esc(data.year)} ${esc(data.brandName)}</p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function adminText(data: TemplateData): string {
  return [
    "New enquiry",
    "",
    `Name: ${data.name}`,
    `Property: ${data.property}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "Not provided"}`,
    `Submitted: ${data.submittedAt}`,
    "",
    "Message:",
    data.message,
  ].join("\n");
}

function clientText(data: TemplateData): string {
  return [
    `Thank you, ${data.firstName}.`,
    "",
    "We have received your message and will reply within 24-48 hours.",
    "",
    `Property: ${data.property}`,
    ...(data.whatsappLink ? [`WhatsApp: ${data.whatsappLink}`] : []),
    ...(data.siteUrl ? [`Website: ${data.siteUrl}`] : []),
  ].join("\n");
}

/** Builds a Nodemailer SMTP transport from the environment. */
function createTransport(env: Env) {
  const encryption = (env.MAIL_ENCRYPTION || "ssl").toLowerCase();
  const secure = encryption === "ssl" || encryption === "smtps";
  const configuredPort = Number.parseInt(env.MAIL_PORT || "", 10);
  const port = Number.isFinite(configuredPort) && configuredPort > 0 ? configuredPort : secure ? 465 : 587;

  return nodemailer.createTransport({
    host: env.MAIL_HOST,
    port,
    secure,
    // Force STARTTLS when using port 587 / tls.
    requireTLS: !secure && encryption !== "none",
    auth: {
      user: env.MAIL_USERNAME,
      pass: env.MAIL_PASSWORD,
    },
    connectionTimeout: 20_000,
    greetingTimeout: 15_000,
    socketTimeout: 30_000,
    tls: { rejectUnauthorized: true },
  });
}

async function sendEmail(env: Env, message: MailOptions): Promise<void> {
  const transport = createTransport(env);
  try {
    await transport.sendMail(message);
  } finally {
    transport.close();
  }
}

export async function onRequest(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { request, env } = context;

  if (request.method !== "POST") {
    return json(405, { ok: false, message: "Method not allowed." });
  }

  /* ----------------------------- Payload ----------------------------- */

  let payload: Payload = {};
  try {
    payload = (await request.json()) as Payload;
  } catch {
    try {
      payload = Object.fromEntries(await request.formData()) as Payload;
    } catch {
      payload = {};
    }
  }

  /* ----------------------------- Honeypot ---------------------------- */

  const trap = `${text(payload.botcheck)}${text(payload.website)}`.trim();
  if (trap !== "") {
    // Pretend success so bots do not learn the trap.
    return json(200, { ok: true });
  }

  /* ---------------------------- Validation --------------------------- */

  const { values, errors } = validate(payload);
  if (Object.keys(errors).length > 0) {
    return json(422, {
      ok: false,
      message: "Please check the form and try again.",
      errors,
    });
  }

  /* --------------------------- Configuration ------------------------- */

  const fromAddress = (env.MAIL_FROM_ADDRESS || "").trim();
  const fromName = (env.MAIL_FROM_NAME || BRAND).trim();
  const adminEmail = (env.ADMIN_EMAIL || "").trim();
  const adminName = (env.ADMIN_NAME || fromName).trim();

  if (
    !env.MAIL_HOST ||
    !env.MAIL_USERNAME ||
    !env.MAIL_PASSWORD ||
    !fromAddress ||
    !adminEmail
  ) {
    console.error("[inquiry] Missing MAIL_HOST, MAIL_USERNAME, MAIL_PASSWORD, MAIL_FROM_ADDRESS or ADMIN_EMAIL.");
    return json(503, {
      ok: false,
      message: "The form is not available right now. Please contact us directly.",
    });
  }

  /* ------------------------------ Data ------------------------------- */

  const nameParts = values.name.split(/\s+/u).filter(Boolean);
  const firstName = nameParts[0] || values.name;

  const siteUrl = (env.SITE_URL || "").replace(/\/+$/, "");
  const whatsappNumber = (env.WHATSAPP_NUMBER || "").replace(/\D+/g, "");
  const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "";

  const data: TemplateData = {
    ...values,
    firstName,
    submittedAt: new Intl.DateTimeFormat("en-GB", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "Africa/Casablanca",
    }).format(new Date()),
    ipAddress: request.headers.get("CF-Connecting-IP") || "Unknown",
    siteUrl,
    whatsappLink,
    year: new Date().getUTCFullYear(),
    brandName: fromName,
    adminEmail,
  };

  const sender = `${fromName} <${fromAddress}>`;
  const subjectName = oneLine(values.name);
  const subjectProperty = oneLine(values.property);

  /* -------------------------- Admin notification --------------------- */

  try {
    await sendEmail(env, {
      from: sender,
      to: adminEmail.split(",").map((address) => address.trim()).filter(Boolean),
      replyTo: values.email,
      subject: `New STAY enquiry: ${subjectProperty} - ${subjectName}`,
      html: adminHtml(data),
      text: adminText(data),
    });
  } catch (error) {
    console.error("[inquiry] Admin email failed:", error);
    return json(500, {
      ok: false,
      message: "We could not send your message. Please try again or contact us directly.",
    });
  }

  /* --------------------------- Client thank-you ---------------------- */

  try {
    await sendEmail(env, {
      from: sender,
      to: [values.email],
      replyTo: adminEmail.split(",")[0]?.trim() || adminEmail,
      subject: "Thank you for your enquiry — STAY by My Marrakech Trip",
      html: clientHtml(data),
      text: clientText(data),
    });
  } catch (error) {
    // The admin already has the lead; do not block the visitor.
    console.error("[inquiry] Client email failed:", error);
  }

  return json(200, {
    ok: true,
    message: "Thank you. Your enquiry has been sent.",
  });
}
