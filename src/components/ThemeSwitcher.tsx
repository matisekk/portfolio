import { useEffect, useRef, useState } from 'react';

import { themes, type AccentTheme } from '../constants/themes';

interface ThemeSwitcherProps {
    value: AccentTheme;
    onChange: (theme: AccentTheme) => void;
}

const ThemeSwitcher = ({ value, onChange }: ThemeSwitcherProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const switcherRef = useRef<HTMLDivElement>(null);
    const activeTheme = themes[value];

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: PointerEvent) => {
            if (
                switcherRef.current &&
                !switcherRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('pointerdown', handleClickOutside);

        return () => {
            document.removeEventListener('pointerdown', handleClickOutside);
        };
    }, [isOpen]);


    return (
        <div ref={switcherRef} className="fixed bottom-8 left-8 z-50 flex items-center rounded-full border border-(--border) bg-(--background)/80 p-2 backdrop-blur-md" >
            <button
                type="button"
                aria-label="Change color theme"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((prev) => !prev)}
                className="size-4 shrink-0 rounded-full ring-2 ring-(--foreground) ring-offset-2 ring-offset-(--background) transition-transform hover:scale-110"
                style={{ backgroundColor: activeTheme.color }}
            />

            <div
                className={`flex items-center overflow-hidden transition-all duration-300 ease-out
                ${isOpen
                        ? 'ml-4 max-w-32 gap-3 opacity-100'
                        : 'ml-0 max-w-0 gap-0 opacity-0'
                    }
            `}
            >
                {Object.entries(themes)
                    .filter(([key]) => key !== value)
                    .map(([key, theme]) => {
                        const themeKey = key as AccentTheme;

                        return (
                            <button
                                key={themeKey}
                                type="button"
                                aria-label={`Select ${theme.name} theme`}
                                onClick={() => onChange(themeKey)}
                                className="size-4 shrink-0 rounded-full opacity-60 transition-all duration-200 hover:scale-110 hover:opacity-100"
                                style={{ backgroundColor: theme.color }}
                            />
                        );
                    })}
            </div>
        </div>
    );
};

export default ThemeSwitcher;