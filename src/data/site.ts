/* ------------------------------------------------------------------ */
/*  STAY by My Marrakech Trip — all editable content lives here.        */
/*  Change text, images and contact settings in this file only.         */
/* ------------------------------------------------------------------ */

export interface Photo {
  /** Pexels photo id (temporary stock) or a full URL / "/images/…" path for your own photos. */
  src: string | number;
  alt: string;
}

/* ----------------------------- Settings ----------------------------- */

export const site = {
  name: "STAY",
  fullName: "STAY by My Marrakech Trip",
  tagline: "Hospitality Commercial Management",
  url: "https://stay.mymarrakechtrip.com",
  city: "Marrakech",
  country: "Morocco",
};

export const contact = {
  /** ⚠️ Placeholder — replace with the real inbox that should receive enquiries. */
  email: "contact@mymarrakechtrip.com",
  /** WhatsApp number in international format, digits only, e.g. "212600000000". Leave empty to hide the number. */
  whatsappNumber: "212771444668",
  whatsappMessage: "Hello STAY, I would like to discuss commercial management for my property.",
  /**
   * Form delivery endpoint. Set to "/api/send-inquiry.php" to use the PHPMailer backend.
   * Leave empty to fall back to the visitor's email app (mailto:).
   */
  formEndpoint: "/api/send-inquiry.php",
  /** Not used with PHPMailer backend — kept for compatibility with Web3Forms/Formspree. */
  formAccessKey: "",
};

export const whatsappLink = (message = contact.whatsappMessage) =>
  `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`;

/** Human-readable WhatsApp number, e.g. "+212 771 444 668". */
export const whatsappDisplay = contact.whatsappNumber
  ? `+${contact.whatsappNumber.replace(/^(\d{3})(\d{3})(\d{3})(\d{3})$/, "$1 $2 $3 $4")}`
  : "Quick questions and consultation requests";

/** Builds a responsive Pexels URL, or returns your own image path unchanged. */
export const imageUrl = (src: Photo["src"], width: number) =>
  typeof src === "number"
    ? `https://images.pexels.com/photos/${src}/pexels-photo-${src}.jpeg?auto=compress&cs=tinysrgb&w=${width}`
    : src;

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Who we work with", href: "#clients" },
  { label: "Why STAY", href: "#why" },
  { label: "Contact", href: "#contact" },
];

/* ------------------------------ Hero -------------------------------- */

export const hero = {
  eyebrow: "Hospitality commercial management · Marrakech",
  title: "Commercial, revenue and distribution management for",
  titleAccent: "hotels and riads.",
  intro:
    "STAY is the outsourced commercial partner for hotel and riad owners. We combine revenue strategy, OTA performance and international B2B partnerships to help your property sell better, earn more and depend less on any single channel.",
  primaryCta: "Request a consultation",
  secondaryCta: "Explore our services",
  photo: { src: 38891222, alt: "A Marrakech riad courtyard with carved arches, drapery and tilework" } as Photo,
};

/* ------------------------------ About ------------------------------- */

export const about = {
  eyebrow: "About STAY",
  title: "A dedicated commercial team, without building one in-house",
  paragraphs: [
    "STAY by My Marrakech Trip provides commercial, revenue and distribution management to hotels, boutique hotels and independent riads. We work alongside owners and managers as an extension of their team, taking responsibility for how the property is priced, distributed and sold.",
    "Our approach is practical and transparent: understand the property and its market, set clear commercial objectives, then manage pricing, channels and partnerships day to day — with regular reporting so you always know what is working.",
  ],
  steps: [
    {
      title: "Assess",
      text: "A commercial audit of your pricing, channels, positioning and competitors to identify where revenue is being lost.",
    },
    {
      title: "Plan",
      text: "A tailored strategy with financial objectives, a distribution mix and a pricing approach built for your property.",
    },
    {
      title: "Manage & report",
      text: "Ongoing management of rates, OTAs and partners, with clear performance reports and regular reviews.",
    },
  ],
  outcomesTitle: "How we help properties improve",
  outcomes: [
    "Increase revenue and average daily rate",
    "Improve visibility and conversion on online channels",
    "Develop international tour operator and agency partnerships",
    "Reduce dependence on a single booking channel",
    "Make decisions with clear, regular performance data",
  ],
  photo: { src: 4502973, alt: "A riad courtyard pool framed by ornate Moroccan arches in Marrakech" } as Photo,
};

/* ----------------------------- Services ----------------------------- */

export interface Service {
  id: string;
  number: string;
  title: string;
  summary: string;
  items: string[];
  photo: Photo;
}

export const servicesIntro = {
  eyebrow: "Our services",
  title: "Five areas of expertise, one commercial partner",
  text: "Choose a complete commercial management service or the specific support your property needs today.",
};

export const services: Service[] = [
  {
    id: "revenue-management",
    number: "01",
    title: "Revenue Management",
    summary: "Data-led pricing and inventory decisions, so every room is sold at the right rate, at the right time.",
    items: [
      "Revenue strategy and financial objectives.",
      "Dynamic pricing and rate optimisation.",
      "Competitor and market analysis.",
      "Seasonality and demand analysis.",
      "Room inventory and availability management.",
      "Pricing performance monitoring.",
      "Revenue reports and analysis.",
    ],
    photo: { src: 7948008, alt: "Revenue charts and performance data on a laptop" },
  },
  {
    id: "ota-management",
    number: "02",
    title: "OTA Management",
    summary: "Stronger visibility, better rankings and higher conversion on Booking.com, Expedia and other online channels.",
    items: [
      "Booking.com and Expedia account management.",
      "Creation and configuration of OTA accounts.",
      "Listing optimisation.",
      "Rates and availability management.",
      "Promotional campaigns.",
      "Channel manager configuration.",
      "Online reputation monitoring.",
    ],
    photo: { src: 574089, alt: "Managing online channels from a laptop" },
  },
  {
    id: "b2b-distribution",
    number: "03",
    title: "B2B Sales and Distribution",
    summary: "International partnerships that bring steady, contracted business beyond online channels.",
    items: [
      "Partnerships with international tour operators.",
      "DMC partnerships.",
      "Travel agency contracts.",
      "Commercial rate negotiation.",
      "Wholesale distribution.",
      "Corporate and group business development.",
      "B2B account management.",
    ],
    photo: { src: 6918529, alt: "Two business partners shaking hands after a meeting" },
  },
  {
    id: "commercial-strategy",
    number: "04",
    title: "Commercial Strategy and Consulting",
    summary: "A clear commercial plan, measurable objectives and a team equipped to deliver them.",
    items: [
      "Commercial audits.",
      "Sales and financial objectives.",
      "Market and competitor research.",
      "Distribution strategy.",
      "Direct booking development.",
      "Commercial performance analysis.",
      "Sales team training.",
    ],
    photo: { src: 590011, alt: "Reviewing commercial performance charts on paper" },
  },
  {
    id: "digital-marketing",
    number: "05",
    title: "Digital Marketing and Content",
    summary: "Content and campaigns that present your property at its best and support direct bookings.",
    items: [
      "Social media strategy.",
      "Instagram content creation.",
      "Promotional campaigns.",
      "Property photography coordination.",
      "Online visibility and reputation.",
    ],
    photo: { src: 8368748, alt: "Creating social media content with a smartphone" },
  },
];

/* -------------------------- Who we work with ------------------------- */

export interface ClientType {
  title: string;
  text: string;
  photo: Photo;
}

export const clientsIntro = {
  eyebrow: "Who we work with",
  title: "Built for independent and luxury hospitality",
  text: "Our initial focus is Marrakech, with a structure designed to support properties across Morocco.",
};

export const clients: ClientType[] = [
  {
    title: "Independent riads",
    text: "Characterful properties that need expert commercial support without a large in-house team.",
    photo: { src: 10573397, alt: "A traditional riad courtyard with a pool and plants" },
  },
  {
    title: "Boutique hotels",
    text: "Distinctive hotels looking to grow rate, visibility and direct bookings.",
    photo: { src: 7391720, alt: "A boutique hotel courtyard with greenery and a decorative pool" },
  },
  {
    title: "Luxury hotels",
    text: "Premium properties that require refined positioning and high-value distribution.",
    photo: { src: 7556764, alt: "An ornate luxury hotel restaurant in Marrakech" },
  },
  {
    title: "Resorts",
    text: "Larger properties balancing leisure, group and international partner business.",
    photo: { src: 31111360, alt: "A resort pool lined with palm trees near Marrakech" },
  },
  {
    title: "Independent hospitality properties",
    text: "Guesthouses, villas and other independent stays seeking a structured commercial approach.",
    photo: { src: 27945047, alt: "A courtyard with a pool, plants and traditional architecture" },
  },
];

/* ------------------------------ Why STAY ----------------------------- */

export const whyIntro = {
  eyebrow: "Why STAY",
  title: "Hospitality expertise with local roots",
  text: "We understand the Marrakech market from the inside — and how to connect your property with the right guests and partners.",
};

export const reasons = [
  {
    title: "Local market knowledge",
    text: "In-depth understanding of Marrakech demand, seasonality, guest profiles and the competitive landscape.",
  },
  {
    title: "Commercial expertise",
    text: "Proven revenue, distribution and sales methods adapted to the realities of independent hospitality.",
  },
  {
    title: "International distribution opportunities",
    text: "Access to tour operators, DMCs and travel agencies that bring new markets and steady business.",
  },
  {
    title: "Tailored strategies",
    text: "No templates — every plan is built around your property, positioning, objectives and capacity.",
  },
  {
    title: "Dedicated support",
    text: "A committed point of contact, regular performance reviews and fast, responsive communication.",
  },
];

/* ------------------------------ Contact ------------------------------ */

export const contactIntro = {
  eyebrow: "Contact",
  title: "Let's talk about your property's performance",
  text: "Tell us about your hotel or riad and what you would like to achieve. We'll get back to you to arrange a consultation.",
  cta: "Send enquiry",
};

export interface Enquiry {
  name: string;
  property: string;
  email: string;
  phone: string;
  message: string;
}

export const emptyEnquiry = (): Enquiry => ({ name: "", property: "", email: "", phone: "", message: "" });
