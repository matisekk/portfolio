import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { themes, type AccentTheme } from '../constants/themes';

interface ThemeSwitcherProps {
    value: AccentTheme;
    onChange: (theme: AccentTheme) => void;
}

const transition = {
    duration: 0.3,
    ease: [0.22, 1, 0.36, 1] as const,
};

const ThemeSwitcher = ({ value, onChange }: ThemeSwitcherProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const switcherRef = useRef<HTMLDivElement>(null);

    const [themeOrder, setThemeOrder] = useState<AccentTheme[]>(() => {
        const keys = Object.keys(themes) as AccentTheme[];

        return [...keys.filter((theme) => theme !== value), value];
    });

    const handleThemeChange = (theme: AccentTheme) => {
        if (theme === value) return;

        setThemeOrder((current) => {
            const next = [...current];

            const activeIndex = next.indexOf(value);
            const selectedIndex = next.indexOf(theme);

            [next[activeIndex], next[selectedIndex]] = [
                next[selectedIndex],
                next[activeIndex],
            ];

            return next;
        });

        onChange(theme);
    };

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

        return () =>
            document.removeEventListener('pointerdown', handleClickOutside);
    }, [isOpen]);

    return (
        <div
            ref={switcherRef}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            className="fixed bottom-8 left-8 z-50 flex flex-col"
        >
            {themeOrder.map((themeKey) => {
                const theme = themes[themeKey];
                const isActive = themeKey === value;
                const isVisible = isActive || isOpen;

                return (
                    <motion.div
                        key={themeKey}
                        layout="position"
                        animate={{
                            height: isVisible ? 40 : 0,
                            marginBottom: !isActive && isOpen ? 8 : 0,
                            opacity: isVisible ? 1 : 0,
                        }}
                        transition={transition}
                        className="overflow-hidden pr-2"
                        style={{
                            pointerEvents: isVisible ? 'auto' : 'none',
                        }}
                    >
                        <motion.button
                            type="button"
                            onClick={() =>
                                isActive
                                    ? setIsOpen((prev) => !prev)
                                    : handleThemeChange(themeKey)
                            }
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.2 }}
                            className="group flex h-10 items-center gap-4 whitespace-nowrap"
                        >
                            <span
                                className={`
                                    w-px shrink-0 transition-all duration-200
                                    ${isActive
                                        ? 'h-10 opacity-100'
                                        : 'h-8 opacity-60 group-hover:h-10 group-hover:opacity-100'
                                    }
                                `}
                                style={{ backgroundColor: theme.color }}
                            />

                            <span
                                className={`
                                    text-sm tracking-wide transition-colors duration-200
                                    ${isActive
                                        ? ''
                                        : 'text-(--muted) group-hover:text-(--foreground)'
                                    }
                                `}
                                style={isActive ? { color: theme.color } : undefined}
                            >
                                {theme.name}
                            </span>
                        </motion.button>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default ThemeSwitcher;