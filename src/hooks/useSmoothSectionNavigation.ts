import { type MouseEvent, useCallback, useRef } from "react";

import { playNavigationClickSound } from "../utils/uiSounds";

const DURATION = 700;

const easeInOutCubic = (progress: number) => {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
};

export const useSmoothSectionNavigation = () => {
  const animationFrameRef = useRef<number | null>(null);

  const navigateToSection = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      event.preventDefault();

      const container = document.querySelector<HTMLElement>("[data-scroll-container]");

      const section = document.getElementById(sectionId);

      if (!container || !section) {
        return;
      }

      playNavigationClickSound();

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      const start = container.scrollTop;

      const target = section.offsetTop;

      const distance = target - start;

      if (Math.abs(distance) < 1) {
        return;
      }

      const startedAt = performance.now();

      const previousSnapType = container.style.scrollSnapType;

      container.style.scrollSnapType = "none";

      const animateScroll = (time: number) => {
        const elapsed = time - startedAt;

        const progress = Math.min(elapsed / DURATION, 1);

        const easedProgress = easeInOutCubic(progress);

        container.scrollTop = start + distance * easedProgress;

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animateScroll);

          return;
        }

        animationFrameRef.current = null;

        container.scrollTop = target;

        container.style.scrollSnapType = previousSnapType;

        window.history.replaceState(null, "", `#${sectionId}`);
      };

      animationFrameRef.current = requestAnimationFrame(animateScroll);
    },
    [],
  );

  return {
    navigateToSection,
  };
};
