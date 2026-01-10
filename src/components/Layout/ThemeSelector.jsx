// Theme Selector Component with Mascots and Animations
import { useState } from 'react';
import { useTheme, THEMES } from '../../context/ThemeContext';
import pikachuIcon from '../../assets/pikachu.svg';
import useSound from '../../hooks/useSound';
import './ThemeSelector.css';

// Theme mascots - playful characters for each theme
const MASCOTS = {
    light: { emoji: '🌻', name: 'Sunny', greeting: 'Rise and shine!' },
    dark: { emoji: '🦉', name: 'Noctis', greeting: 'Night productivity!' },
    forest: { emoji: '🦊', name: 'Felix', greeting: 'Into the woods!' },
    desert: { emoji: '🦎', name: 'Sandy', greeting: 'Desert vibes!' },
    mountain: { emoji: '🦅', name: 'Summit', greeting: 'Reach new heights!' },
    ocean: { emoji: '🐬', name: 'Splash', greeting: 'Dive deep!' },
    space: { emoji: '👽', name: 'Cosmo', greeting: 'To infinity!' },
    pokemon: { emoji: pikachuIcon, name: 'Sparky', greeting: 'Pika Pika!', isImage: true },
};

const ThemeSelector = () => {
    const { theme, setTheme, getCurrentTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [showMascot, setShowMascot] = useState(false);
    const { playThemeSwitch } = useSound();

    const currentTheme = getCurrentTheme();
    const mascot = MASCOTS[theme] || MASCOTS.light;

    const handleThemeChange = (themeId) => {
        setTheme(themeId);
        setIsOpen(false);
        playThemeSwitch();
        // Show mascot greeting
        setShowMascot(true);
        setTimeout(() => setShowMascot(false), 2000);
    };

    const renderMascotIcon = (mascotData, className = "") => {
        if (mascotData?.isImage) {
            return <img src={mascotData.emoji} alt={mascotData.name} className={`mascot-image ${className}`} />;
        }
        return <span className={`theme-mascot-icon ${className}`}>{mascotData?.emoji}</span>;
    };

    return (
        <div className={`theme-selector theme-${theme}`}>
            <button
                className="theme-selector-trigger"
                onClick={() => setIsOpen(!isOpen)}
                title="Change Theme"
            >
                {renderMascotIcon(mascot, "bounce")}
                <div className="theme-trigger-content">
                    <span className="theme-name">{currentTheme.name}</span>
                    <span className="theme-mascot-name">with {mascot.name}</span>
                </div>
                <svg
                    className={`chevron ${isOpen ? 'open' : ''}`}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {/* Mascot Greeting Popup */}
            {showMascot && (
                <div className="mascot-greeting">
                    {renderMascotIcon(mascot, "wiggle")}
                    <span className="mascot-greeting-text">{mascot.greeting}</span>
                </div>
            )}

            {isOpen && (
                <div className="theme-dropdown">
                    <div className="theme-dropdown-header">
                        <span>✨ Choose Your Adventure</span>
                    </div>
                    <div className="theme-options">
                        {THEMES.map((t) => {
                            const themeMascot = MASCOTS[t.id];
                            return (
                                <button
                                    key={t.id}
                                    className={`theme-option ${theme === t.id ? 'active' : ''}`}
                                    onClick={() => handleThemeChange(t.id)}
                                >
                                    <div className="theme-option-mascot">
                                        {renderMascotIcon(themeMascot, "float")}
                                    </div>
                                    <div className="theme-option-info">
                                        <span className="theme-option-name">
                                            {t.icon} {t.name}
                                        </span>
                                        <span className="theme-option-desc">
                                            {themeMascot?.name} says "{themeMascot?.greeting}"
                                        </span>
                                    </div>
                                    {theme === t.id && (
                                        <div className="theme-check-wrap">
                                            <svg className="theme-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    <div className="theme-dropdown-footer">
                        <span className="sparkles">✨</span> Pick a theme, pick a friend! <span className="sparkles">✨</span>
                    </div>
                </div>
            )}

            {isOpen && <div className="theme-backdrop" onClick={() => setIsOpen(false)} />}
        </div>
    );
};

export default ThemeSelector;
