// Theme Context Provider - Multiple theme support
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

// Available themes with their display info
export const THEMES = [
    { id: 'light', name: 'Light', icon: '☀️', description: 'Clean and bright' },
    { id: 'dark', name: 'Dark', icon: '🌙', description: 'Easy on the eyes' },
    { id: 'forest', name: 'Forest', icon: '🌲', description: 'Earthy greens' },
    { id: 'desert', name: 'Desert', icon: '🏜️', description: 'Warm sands' },
    { id: 'mountain', name: 'Mountain', icon: '🏔️', description: 'Cool grays' },
    { id: 'ocean', name: 'Ocean', icon: '🌊', description: 'Deep blues' },
    { id: 'space', name: 'Space', icon: '🚀', description: 'Cosmic purple' },
];

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Check localStorage first
        const saved = localStorage.getItem('theme');
        if (saved && THEMES.find(t => t.id === saved)) return saved;

        // Check system preference for dark mode
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    useEffect(() => {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Listen for system preference changes only if on light/dark
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            const saved = localStorage.getItem('theme');
            // Only auto-switch if user hasn't selected a custom theme
            if (!saved || saved === 'light' || saved === 'dark') {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Toggle between light and dark (for quick toggle)
    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    // Set a specific theme
    const setSpecificTheme = (themeId) => {
        if (THEMES.find(t => t.id === themeId)) {
            setTheme(themeId);
        }
    };

    // Get current theme info
    const getCurrentTheme = () => {
        return THEMES.find(t => t.id === theme) || THEMES[0];
    };

    const value = {
        theme,
        toggleTheme,
        setTheme: setSpecificTheme,
        getCurrentTheme,
        themes: THEMES,
        isDark: theme !== 'light' && theme !== 'desert', // Most themes are dark-ish
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
