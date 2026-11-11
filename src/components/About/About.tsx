import { ArrowUpRight, Download } from "lucide-react";

import AnimatedDivider from "../animations/AnimatedDivider";
import AnimatedStack from "../animations/AnimatedStack";
import FadeIn from "../animations/FadeIn";
import Typewriter from "../animations/Typewriter";

import AboutSidePanel from "./AboutSidePanel";

const stack = ["React", "TypeScript", "Next.js", "Node.js", "Python", "Playwright"];

const About = () => {
  return (
    <div className="flex h-full w-full items-center px-6 md:px-10 xl:px-14 2xl:px-20">
      <div className="grid w-full max-w-5xl grid-cols-1 gap-12 xl:grid-cols-[minmax(0,1fr)_220px] xl:gap-16">
        {/* MAIN CONTENT */}
        <div className="min-w-0">
          <p className="font-typewriter mb-5 text-[25px] font-medium tracking-[0.12em] text-(--accent)">
            <Typewriter text="Hello - I'm Mateusz" delay={0.2} speed={0.055} cursor />
          </p>

          {/* DESCRIPTION */}
          <div className="mt-7 max-w-2xl space-y-3 text-base leading-7 text-(--muted) xl:text-lg">
            <p className="text-(--foreground-secondary)">
              <Typewriter
                text="I enjoy building digital products that feel clear, thoughtful and easy to use."
                delay={1.45}
                speed={0.018}
              />
            </p>

            <p>
              <Typewriter
                text="I care about the details, but I also like stepping back and understanding how all the pieces fit together."
                delay={2.95}
                speed={0.015}
              />
            </p>
          </div>

          {/* PERSONAL NOTE */}
          <p className="mt-5 max-w-xl font-mono text-xs leading-6 text-(--muted) xl:text-sm">
            <Typewriter
              text="Outside of code - gym, ice skating & probably too much coffee"
              delay={4.7}
              speed={0.018}
            />
          </p>

          {/* ACTIONS */}
          <FadeIn delay={5.8} className="mt-8 flex flex-wrap items-center gap-6">
            <a
              href="/cv/mateusz-przewoznik-cv.pdf"
              download
              data-sound-hover
              className="group flex items-center gap-2.5 rounded-md bg-(--accent) px-4 py-2.5 text-sm font-medium text-(--accent-foreground) transition-[opacity,transform] duration-200 hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0"
            >
              Download CV
              <Download
                size={15}
                strokeWidth={1.8}
                className="transition-transform duration-200 group-hover:-translate-y-0.5"
              />
            </a>

            <a
              href="#contact"
              data-sound-hover
              className="group flex items-center gap-1.5 text-sm font-medium text-(--foreground-secondary) transition-colors duration-200 hover:text-(--accent)"
            >
              Let's talk
              <ArrowUpRight
                size={16}
                strokeWidth={1.8}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </FadeIn>

          <AnimatedDivider delay={6.1} className="my-9 h-px w-full max-w-xl bg-(--border)" />

          {/* STACK */}
          <FadeIn delay={6.35}>
            <p className="mb-4 font-mono text-[12px] font-medium tracking-[0.18em] text-(--accent) uppercase">
              <Typewriter text="Selected stack" delay={6.35} speed={0.04} />
            </p>

            <AnimatedStack items={stack} delay={6.85} />
          </FadeIn>
        </div>

        <AboutSidePanel />
      </div>
    </div>
  );
};

export default About;
