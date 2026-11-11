import { themes } from "../constants/themes";
import Divider from "./Divider";
import ThemeSwitcher from "./ThemeSwitcher";
import ThemeVisual from "./ThemeVisual";

type AccentTheme = keyof typeof themes;

interface ThemeBackgroundProps {
  accentTheme: AccentTheme;
  onThemeChange: (theme: AccentTheme) => void;
}

const ThemeBackground = ({ accentTheme, onThemeChange }: ThemeBackgroundProps) => {
  const currentTheme = themes[accentTheme];

  return (
    <>
      {/* MOBILE / TABLET VISUAL */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden md:hidden">
        {Object.entries(themes).map(([key, theme]) => (
          <img
            key={key}
            src={theme.image}
            alt=""
            draggable={false}
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-in-out ${
              accentTheme === key ? "scale-100 opacity-20" : "scale-[1.02] opacity-0"
            }`}
          />
        ))}
      </div>

      {/* DESKTOP VISUAL */}
      <div className="fixed inset-y-0 left-0 hidden w-[40%] overflow-hidden bg-(--background) md:block">
        <ThemeVisual image={currentTheme.image} color={currentTheme.color} />
      </div>

      {/* DIVIDER */}
      <Divider orientation="vertical" className="fixed inset-y-0 left-[40%] z-40 hidden md:block" />

      {/* THEME SWITCHER */}
      <ThemeSwitcher value={accentTheme} onChange={onThemeChange} />

      {/* AMBIENT BACKGROUND */}
      <div className="ambient-background pointer-events-none fixed inset-0 z-5 md:left-[40%]" />
    </>
  );
};

export default ThemeBackground;
