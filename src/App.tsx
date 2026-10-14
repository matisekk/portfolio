import Divider from "./components/Divider";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { themes } from "./constants/themes";
import { useAccentTheme } from "./hooks/useAccentTheme";

const App = () => {
  const { accentTheme, setAccentTheme } = useAccentTheme();

  const currentTheme = themes[accentTheme];
  return (
    <>
      {/* LEFT */}
      <div className="fixed inset-y-0 left-0 hidden w-[40%] md:block">
        <img
          src={currentTheme.image}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      <ThemeSwitcher
        value={accentTheme}
        onChange={setAccentTheme}
      />

      <Divider orientation="vertical" className="hidden md:block fixed inset-y-0 left-[40%] z-40" />

      {/* RIGHT */}
      <div className="w-full md:ml-[40%] min-h-screen md:w-1/2">
        <Header />

        <main className="pt-16">
          <Hero />
        </main>
      </div>
    </>
  );
}

export default App;