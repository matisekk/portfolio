import { useEffect, useState } from "react"

type Theme = 'light' | 'dark'

export const useTheme = () => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null;

        const preferedTheme = savedTheme ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

        setTheme(preferedTheme);
    }, [])

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', 'dark');
    }, [theme])

    const toggleTheme = () => {
        setTheme(current => current === 'dark' ? 'light' : 'dark');
    }

    return {
        theme,
        toggleTheme
    }
}