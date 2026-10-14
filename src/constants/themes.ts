export const themes = {
    green: {
        name: 'Green',
        color: '#8FCBA4',
        image: '/themes/green.webp',
    },
    teal: {
        name: 'Teal',
        color: '#7CCBC3',
        image: '/themes/teal.webp',
    },
    orange: {
        name: 'Orange',
        color: '#E58B6E',
        image: '/themes/orange.webp',
    },
    blue: {
        name: 'Blue',
        color: '#8FB4E8',
        image: '/themes/blue.webp',
    },
} as const;

export type AccentTheme = keyof typeof themes;