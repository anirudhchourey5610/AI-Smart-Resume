import React, { memo, useEffect, useRef, useState } from "react";

const QUOTE_INTERVAL_MS = 7000;

function QuoteCard({ quotes }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const quoteRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const node = quoteRef.current;

    if (!node || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || quotes.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setIsFading(true);

      timeoutRef.current = window.setTimeout(() => {
        setActiveIndex((current) => (current + 1) % quotes.length);
        setIsFading(false);
      }, 250);
    }, QUOTE_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, quotes.length]);

  const activeQuote = quotes[activeIndex] ?? quotes[0];

  return (
    <section ref={quoteRef} className="dash-quote-card" aria-live="polite">
      <p className="dash-quote-card__eyebrow">Keep Going 🚀</p>
      <div className={`dash-quote-card__body${isFading ? " is-fading" : ""}`}>
        <p className="dash-quote-card__title">{activeQuote.title}</p>
        <p className="dash-quote-card__subtitle">{activeQuote.subtitle}</p>
      </div>
    </section>
  );
}

export default memo(QuoteCard);
