import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                navy: {
                    800: '#14253A',
                    850: '#0F1E30',
                    900: '#0C1929',
                    950: '#081421',
                },
                brand: {
                    50: '#EEF4FF',
                    100: '#DBEAFE',
                    200: '#BFDBFE',
                    500: '#3B6FE8',
                    600: '#2557D6',
                    700: '#1D4ED8',
                },
                ink: '#101828',
                muted: '#667085',
                'border-soft': '#EEF0F3',
                surface: '#FFFFFF',
                page: '#F7F7F5',
                'section-soft': '#F3F5F7',
            },
        },
    },

    plugins: [forms],
};
