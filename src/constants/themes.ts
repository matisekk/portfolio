export const themes = {
    green: {
        name: 'Grove',
        color: '#8FCBA4',
        image: '/themes/green.webp',
        imageHorizontal: '/themes/green-horizontal.webp',
    },
    teal: {
        name: 'Tide',
        color: '#7CCBC3',
        image: '/themes/teal.webp',
        imageHorizontal: '/themes/teal-horizontal.webp',
    },
    orange: {
        name: 'Flow',
        color: '#E58B6E',
        image: '/themes/orange.webp',
        imageHorizontal: '/themes/orange-horizontal.webp',
    },
    blue: {
        name: 'Frost',
        color: '#8FB4E8',
        image: '/themes/blue.webp',
        imageHorizontal: '/themes/blue-horizontal.webp',
    },
} as const;

export type AccentTheme = keyof typeof themes;