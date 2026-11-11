import { useEffect } from "react";

import { playUiSound } from "../utils/uiSounds";

const HOVER_DELAY = 70;
const HOVER_COOLDOWN = 80;

export const useHoverSounds = () => {
  useEffect(() => {
    let hoverTimeout: number | null = null;
    let currentElement: HTMLElement | null = null;
    let lastPlayedAt = 0;

    const clearHoverTimeout = () => {
      if (hoverTimeout !== null) {
        window.clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
    };

    const handlePointerOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }

      const target = event.target as HTMLElement;

      const element = target.closest<HTMLElement>("[data-sound-hover]");

      if (!element) {
        return;
      }

      const relatedTarget = event.relatedTarget as Node | null;

      if (relatedTarget && element.contains(relatedTarget)) {
        return;
      }

      clearHoverTimeout();

      currentElement = element;

      hoverTimeout = window.setTimeout(() => {
        if (currentElement !== element) {
          return;
        }

        const now = performance.now();

        if (now - lastPlayedAt < HOVER_COOLDOWN) {
          return;
        }

        lastPlayedAt = now;

        void playUiSound("hover");
      }, HOVER_DELAY);
    };

    const handlePointerOut = (event: PointerEvent) => {
      const target = event.target as HTMLElement;

      const element = target.closest<HTMLElement>("[data-sound-hover]");

      if (!element) {
        return;
      }

      const relatedTarget = event.relatedTarget as Node | null;

      if (relatedTarget && element.contains(relatedTarget)) {
        return;
      }

      if (currentElement === element) {
        currentElement = null;
        clearHoverTimeout();
      }
    };

    document.addEventListener("pointerover", handlePointerOver);

    document.addEventListener("pointerout", handlePointerOut);

    return () => {
      clearHoverTimeout();

      document.removeEventListener("pointerover", handlePointerOver);

      document.removeEventListener("pointerout", handlePointerOut);
    };
  }, []);
};
