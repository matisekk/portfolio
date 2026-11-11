export const animateAccentTransition = (x: number, y: number, color: string) => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    return;
  }

  const overlay = document.createElement("div");

  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  Object.assign(overlay.style, {
    position: "fixed",
    inset: "0",
    pointerEvents: "none",
    zIndex: "45",
    opacity: "0",
    clipPath: `circle(0px at ${x}px ${y}px)`,

    background: `
        radial-gradient(
            circle at ${x}px ${y}px,
            color-mix(in srgb, ${color} 12%, transparent) 0%,
            color-mix(in srgb, ${color} 7%, transparent) 32%,
            color-mix(in srgb, ${color} 3%, transparent) 55%,
            transparent 75%
        )
        `,
  });

  document.body.appendChild(overlay);

  const animation = overlay.animate(
    [
      {
        clipPath: `circle(0px at ${x}px ${y}px)`,
        opacity: 0,
      },
      {
        opacity: 0.35,
        offset: 0.18,
      },
      {
        clipPath: `circle(${radius}px at ${x}px ${y}px)`,
        opacity: 0.22,
        offset: 0.72,
      },
      {
        clipPath: `circle(${radius}px at ${x}px ${y}px)`,
        opacity: 0,
      },
    ],
    {
      duration: 900,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "forwards",
    },
  );

  animation.finished.finally(() => {
    overlay.remove();
  });
};
