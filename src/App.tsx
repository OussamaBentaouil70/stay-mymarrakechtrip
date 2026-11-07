import { useEffect, useRef, useState } from "react";
import { About } from "./components/About";
import { Clients } from "./components/Clients";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { Services } from "./components/Services";
import { ThankYou } from "./components/ThankYou";
import { WhatsAppIcon } from "./components/WhatsAppIcon";
import { WhyStay } from "./components/WhyStay";
import { whatsappLink } from "./data/site";
import { getRoute, onRouteChange, type AppRoute } from "./router";

const HOME_TITLE = document.title;
const THANK_YOU_TITLE = "Thank You | STAY by My Marrakech Trip";

function setRobots(content: string) {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "robots";
    document.head.appendChild(meta);
  }
  meta.content = content;
}

export default function App() {
  const [route, setRoute] = useState<AppRoute>(getRoute);
  const homeScroll = useRef(0);
  const previousRoute = useRef<AppRoute>(route);

  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    return onRouteChange(() => setRoute(getRoute()));
  }, []);

  useEffect(() => {
    const previous = previousRoute.current;
    previousRoute.current = route;
    if (route === "thank-you") {
      if (previous === "home") homeScroll.current = window.scrollY;
      document.title = THANK_YOU_TITLE;
      setRobots("noindex, follow");
      window.scrollTo(0, 0);
    } else {
      document.title = HOME_TITLE;
      setRobots("index, follow");
      const y = previous === "thank-you" ? homeScroll.current : 0;
      requestAnimationFrame(() => window.scrollTo(0, y));
    }
  }, [route]);

  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-charcoal focus:px-4 focus:py-2 focus:text-ivory"
      >
        Skip to content
      </a>

      {route === "thank-you" ? (
        <ThankYou />
      ) : (
        <>
          <Navbar />
          <main id="main">
            <Hero />
            <About />
            <Services />
            <Clients />
            <WhyStay />
            <Contact />
          </main>
          <Footer />
        </>
      )}

      {/* Floating WhatsApp contact (the thank-you page has its own WhatsApp CTA) */}
      {route !== "thank-you" && (
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noreferrer"
          aria-label="Contact STAY on WhatsApp"
          className="fixed right-4 bottom-4 z-40 grid h-13 w-13 place-items-center bg-espresso text-ivory shadow-card transition-colors hover:bg-charcoal sm:right-6 sm:bottom-6"
        >
          <WhatsAppIcon className="h-6 w-6" />
        </a>
      )}
    </div>
  );
}
