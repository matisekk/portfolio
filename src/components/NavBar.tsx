import classNames from "classnames";

import { useActiveSection } from "../hooks/useActiveSection";
import { useSmoothSectionNavigation } from "../hooks/useSmoothSectionNavigation";

const navItems = [
  { label: "about", href: "#about" },
  { label: "projects", href: "#projects" },
  { label: "contact", href: "#contact" },
];

const NavBar = () => {
  const activeSection = useActiveSection();
  const { navigateToSection } = useSmoothSectionNavigation();

  return (
    <nav className="absolute left-1/2 z-10 hidden h-full -translate-x-1/2 items-center gap-8 sm:flex">
      {navItems.map(({ label, href }) => {
        const sectionId = href.replace("#", "");

        const isActive = sectionId === activeSection;

        return (
          <a
            data-sound-hover
            key={href}
            href={href}
            className={classNames(
              "relative flex h-full items-center text-sm transition-colors",
              isActive ? "text-(--foreground)" : "text-(--muted) hover:text-(--foreground)",
            )}
            onClick={(event) => navigateToSection(event, sectionId)}
          >
            {label}

            <span
              className={classNames(
                "absolute right-0 bottom-2 left-0 h-px bg-(--accent) transition-all duration-300",
                isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0",
              )}
            />
          </a>
        );
      })}
    </nav>
  );
};

export default NavBar;
