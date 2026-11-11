import { MapPin } from "lucide-react";

import FadeIn from "../animations/FadeIn";

const AboutSidePanel = () => {
  return (
    <FadeIn
      delay={7.35}
      x={12}
      y={0}
      duration={0.6}
      className="hidden border-l border-(--border) pl-8 xl:flex xl:flex-col xl:justify-center"
    >
      <div className="w-full">
        <FadeIn delay={7.55} className="border-b border-(--border) pb-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-[10px] tracking-[0.18em] text-(--accent) uppercase">
              Based in
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-(--foreground-secondary)">
            <MapPin size={13} strokeWidth={1.8} className="text-(--accent)" />
            Poland
          </div>
        </FadeIn>

        <FadeIn delay={7.8} className="border-b border-(--border) py-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-[10px] tracking-[0.18em] text-(--accent) uppercase">
              Current focus
            </p>
          </div>

          <p className="max-w-42.5 text-sm leading-6 text-(--foreground-secondary)">
            Building better interfaces and exploring what happens beyond the frontend.
          </p>
        </FadeIn>

        <FadeIn delay={8.05} className="pt-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-[10px] tracking-[0.18em] text-(--accent) uppercase">
              Availability
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-(--border) px-3 py-1.5 text-xs text-(--foreground-secondary)">
            <span className="size-1.5 shrink-0 rounded-full bg-(--accent) shadow-[0_0_8px_var(--accent)]" />
            Open to opportunities
          </div>
        </FadeIn>
      </div>
    </FadeIn>
  );
};

export default AboutSidePanel;
