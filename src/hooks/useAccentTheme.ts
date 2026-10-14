import { useEffect, useState } from "react"
import type { AccentTheme } from "../constants/themes"

const THEME_CLASSES = [
    'theme-green',
    'theme-teal',
    'theme-orange',
    'theme-blue',
]

export const useAccentTheme = () => {
    const [accentTheme, setAccentTheme] = useState<AccentTheme>('blue');

    useEffect(() => {
        const root = document.documentElement;

        root.classList.remove(...THEME_CLASSES);
        root.classList.add(`theme-${accentTheme}`);
    }, [accentTheme])

    return {
        accentTheme,
        setAccentTheme,
    };
}