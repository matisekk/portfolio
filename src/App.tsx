import Header from "./components/Header";
import PageSections from "./components/PageSections";
import ThemeBackground from "./components/ThemeBackgroud";

import { useAccentTheme } from "./hooks/useAccentTheme";
import { useHoverSounds } from "./hooks/useHoverSounds";
import { usePreloadThemeImages } from "./hooks/usePreloadThemeImages";
import { useSectionSound } from "./hooks/useSectionSound";

const sectionIds = ["about", "projects", "contact"];

const App = () => {
  useHoverSounds();
  useSectionSound(sectionIds);
  usePreloadThemeImages();

  const { accentTheme, setAccentTheme } = useAccentTheme();

  return (
    <div className="h-dvh overflow-hidden">
      <Header />

      <ThemeBackground accentTheme={accentTheme} onThemeChange={setAccentTheme} />

      <PageSections />
    </div>
  );
};

export default App;
