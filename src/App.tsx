import About from './components/About';
import Divider from './components/Divider';
import Header from './components/Header';
import ThemeSwitcher from './components/ThemeSwitcher';
import { themes } from './constants/themes';
import { useAccentTheme } from './hooks/useAccentTheme';

const App = () => {
  const { accentTheme, setAccentTheme } = useAccentTheme();

  return (
    <div className="h-dvh overflow-hidden">
      <Header />

      {/* MOBILE / TABLET VISUAL */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden md:hidden">
        {Object.entries(themes).map(([key, theme]) => (
          <img
            key={key}
            src={theme.image}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-in-out ${accentTheme === key
              ? 'scale-100 opacity-20'
              : 'scale-[1.02] opacity-0'
              }`}
          />
        ))}
      </div>

      {/* DESKTOP VISUAL */}
      <div className="fixed inset-y-0 left-0 hidden w-[40%] overflow-hidden md:block">
        {Object.entries(themes).map(([key, theme]) => (
          <img
            key={key}
            src={theme.image}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-in-out ${accentTheme === key
              ? 'scale-100 opacity-100'
              : 'scale-[1.02] opacity-0'
              }`}
          />
        ))}
      </div>

      <Divider
        orientation="vertical"
        className="fixed inset-y-0 left-[40%] z-40 hidden md:block"
      />

      <ThemeSwitcher
        value={accentTheme}
        onChange={setAccentTheme}
      />

      {/* BACKGROUND PATERN */}
      <div
        className="
          ambient-background
          pointer-events-none fixed inset-0 z-5
          md:left-[40%]
        "
      />
      {/* SCROLLABLE CONTENT */}
      <main
        className="
          fixed top-16 right-0 bottom-0 left-0 z-10
          snap-y snap-mandatory
          overflow-y-auto overscroll-contain
          md:left-[40%]
        "
      >
        <section id="about" className="h-full snap-start snap-always">
          <About />
        </section>

        <section
          id="projects"
          className="flex h-full snap-start snap-always items-center"
        >
          Projects
        </section>

        <section
          id="contact"
          className="flex h-full snap-start snap-always items-center"
        >
          Contact
        </section>
      </main>
    </div>
  );
};

export default App;