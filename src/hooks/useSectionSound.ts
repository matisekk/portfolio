import { useEffect, useRef } from "react";

import { playSectionChangeSound } from "../utils/uiSounds";

export const useSectionSound = (sectionIds: string[]) => {
  const activeSectionRef = useRef<string | null>(null);

  useEffect(() => {
    const container = document.querySelector("[data-scroll-container]");

    if (!container) {
      return;
    }

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.6)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleEntry) {
          return;
        }

        const sectionId = visibleEntry.target.id;

        if (activeSectionRef.current === null) {
          activeSectionRef.current = sectionId;

          return;
        }

        if (activeSectionRef.current === sectionId) {
          return;
        }

        activeSectionRef.current = sectionId;

        playSectionChangeSound();
      },
      {
        root: container,
        threshold: [0.6, 0.7, 0.8],
      },
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds]);
};
