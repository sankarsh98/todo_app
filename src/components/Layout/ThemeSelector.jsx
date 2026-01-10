// Theme Selector Component with Mascots and Animations
import { useState, useEffect } from 'react';
import { useTheme, THEMES } from '../../context/ThemeContext';
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
    pokemon: { emoji: '⚡', name: 'Sparky', greeting: 'Pika Pika!' },
    pacman: { emoji: '🍒', name: 'Waka', greeting: 'Nom nom nom!' },
};

const ThemeSelector = () => {
    const { theme, setTheme, getCurrentTheme, soundEnabled, toggleSound } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [showMascot, setShowMascot] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(
        "Notification" in window && Notification.permission === "granted"
    );
    
    // Sound effects
    const { playClick, playThemeSwitch, playSuccess } = useSound();

    const currentTheme = getCurrentTheme();
    const mascot = MASCOTS[theme] || MASCOTS.light;

    const handleThemeChange = (themeId) => {
        setTheme(themeId);
        setIsOpen(false);
        playThemeSwitch();
        // Show mascot greeting
        setShowMascot(true);
        // Play success sound for the greeting
        setTimeout(() => playSuccess(), 200);
        setTimeout(() => setShowMascot(false), 2000);
    };

    const toggleOpen = () => {
        playClick();
        setIsOpen(!isOpen);
    };

    const requestNotifications = async () => {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notifications");
            return;
        }
        
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            setNotificationsEnabled(true);
            new Notification("Notifications enabled!", { body: "You will now receive reminders for your tasks." });
            playSuccess();
        }
    };

    return (
        <div className={`theme-selector theme-${theme}`}>
            <button
                className="theme-selector-trigger"
                onClick={toggleOpen}
                title="Change Theme & Settings"
            >
                <span className="theme-mascot-icon bounce">{mascot.emoji}</span>
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
                    <span className="mascot-greeting-emoji wiggle">{mascot.emoji}</span>
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
                                        <span className="mascot-emoji float">{themeMascot?.emoji}</span>
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
                    
                    <div className="theme-preferences">
                        <div className="preference-item">
                            <span>🔊 Sounds</span>
                            <button 
                                className={`preference-toggle ${soundEnabled ? 'active' : ''}`}
                                onClick={toggleSound}
                            >
                                <div className="toggle-handle" />
                            </button>
                        </div>
                        <div className="preference-item">
                            <span>🔔 Reminders</span>
                            {notificationsEnabled ? (
                                <span className="preference-status">On</span>
                            ) : (
                                <button className="btn-xs btn-primary" onClick={requestNotifications}>
                                    Enable
                                </button>
                            )}
                        </div>
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
