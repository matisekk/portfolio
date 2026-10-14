import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "../hooks/useTheme"

const ToggleTheme = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="flex items-center gap-4">
            <div className="hidden 2xl:block h-5 w-px bg-(--border)" />

            <div className="flex items-center gap-2" onClick={toggleTheme}>
                {isDark ? (
                    <MoonIcon size={16} className="text-(--accent)" />
                ) : (
                    <SunIcon size={16} className="text-(--accent)" />
                )}

                {/* <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label="Toggle color mode"
                    aria-pressed={isDark}
                    className="relative h-5 w-9 rounded-full bg-(--accent) transition-colors"
                >
                    <span
                        className={`absolute top-0.5 size-4 rounded-full
                        bg-white shadow-sm transition-transform duration-200
                        ${isDark ? 'translate-x-0.5' : '-translate-x-4.5'}`}
                    />
                </button> */}
            </div>
        </div>
    )
}

export default ToggleTheme