import {
    MoonIcon,
    SunIcon,
} from 'lucide-react';

import { useTheme } from '../hooks/useTheme';

const ToggleTheme = () => {
    const {
        theme,
        toggleTheme,
    } = useTheme();

    const isDark =
        theme === 'dark';

    return (
        <div className="flex items-center gap-4">
            <div className="hidden h-5 w-px bg-(--border) 2xl:block" />

            <button
                data-sound-hover
                type="button"
                onClick={toggleTheme}
                aria-label={
                    isDark
                        ? 'Switch to light mode'
                        : 'Switch to dark mode'
                }
                className="
          flex cursor-pointer
          items-center gap-2
          rounded-full
          transition-transform
          duration-200
          hover:scale-105
          active:scale-95
        "
            >
                {isDark ? (
                    <MoonIcon
                        size={16}
                        className="text-(--accent)"
                    />
                ) : (
                    <SunIcon
                        size={16}
                        className="text-(--accent)"
                    />
                )}
            </button>
        </div>
    );
};

export default ToggleTheme;