import {
    type MouseEvent,
    useCallback,
    useEffect,
    useState,
} from 'react';

import { flushSync } from 'react-dom';

import { playUiSound } from '../utils/uiSounds';

type Theme = 'light' | 'dark';

type ViewTransition = {
    ready: Promise<void>;
    finished: Promise<void>;
};

type ViewTransitionDocument = Document & {
    startViewTransition?: (
        callback: () => void,
    ) => ViewTransition;
};

const getInitialTheme = (): Theme => {
    const savedTheme =
        localStorage.getItem('theme') as Theme | null;

    if (savedTheme) {
        return savedTheme;
    }

    return window.matchMedia(
        '(prefers-color-scheme: dark)',
    ).matches
        ? 'dark'
        : 'light';
};

export const useTheme = () => {
    const [theme, setTheme] =
        useState<Theme>(getInitialTheme);

    const applyTheme = useCallback(
        (nextTheme: Theme) => {
            document.documentElement.classList.toggle(
                'dark',
                nextTheme === 'dark',
            );

            localStorage.setItem(
                'theme',
                nextTheme,
            );
        },
        [],
    );

    useEffect(() => {
        applyTheme(theme);
    }, [theme, applyTheme]);

    const toggleTheme = async (
        event: MouseEvent<HTMLElement>,
    ) => {
        const nextTheme: Theme =
            theme === 'dark'
                ? 'light'
                : 'dark';

        void playUiSound(
            nextTheme === 'dark'
                ? 'theme-dark'
                : 'theme-light',
        );

        const prefersReducedMotion =
            window.matchMedia(
                '(prefers-reduced-motion: reduce)',
            ).matches;

        const viewTransitionDocument =
            document as ViewTransitionDocument;

        if (
            !viewTransitionDocument.startViewTransition ||
            prefersReducedMotion
        ) {
            setTheme(nextTheme);
            return;
        }


        const x = event.clientX;
        const y = event.clientY;


        const endRadius = Math.hypot(
            Math.max(
                x,
                window.innerWidth - x,
            ),
            Math.max(
                y,
                window.innerHeight - y,
            ),
        );

        const transition =
            viewTransitionDocument.startViewTransition(
                () => {
                    flushSync(() => {
                        setTheme(nextTheme);
                    });

                    applyTheme(nextTheme);
                },
            );

        await transition.ready;

        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${endRadius}px at ${x}px ${y}px)`,
                ],
            },
            {
                duration: 700,

                easing:
                    'cubic-bezier(0.22, 1, 0.36, 1)',

                pseudoElement:
                    '::view-transition-new(root)',
            },
        );
    };

    return {
        theme,
        toggleTheme,
    };
};