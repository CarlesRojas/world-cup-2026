"use client";

import { useEffect, useRef } from "react";
import MatchCard, { type MatchCardData } from "./MatchCard";

/**
 * Horizontal, scroll-snap carousel of match cards.
 * On load it scrolls so the "next" match (focusIndex) sits in the CENTER, with
 * past matches to the left and upcoming ones to the right.
 */
export default function RiskCarousel({
  cards,
  focusIndex,
}: {
  cards: MatchCardData[];
  focusIndex: number;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const focusedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const focused = focusedRef.current;
    if (!scroller || !focused) return;
    // Center the focused card within the scroller (no smooth scroll on first paint).
    const left =
      focused.offsetLeft - scroller.clientWidth / 2 + focused.clientWidth / 2;
    scroller.scrollTo({ left, behavior: "auto" });
  }, [focusIndex]);

  return (
    <div
      ref={scrollerRef}
      className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-[9vw] pb-2"
    >
      {cards.map((card, i) => (
        <div key={card.id} ref={i === focusIndex ? focusedRef : undefined}>
          <MatchCard data={card} focused={i === focusIndex} />
        </div>
      ))}
    </div>
  );
}
