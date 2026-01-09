// Theme Selector Component
import { useState } from 'react';
import { useTheme, THEMES } from '../../context/ThemeContext';
import './ThemeSelector.css';

const ThemeSelector = () => {
    const { theme, setTheme, getCurrentTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const currentTheme = getCurrentTheme();

    return (
        <div className="theme-selector">
            <button
                className="theme-selector-trigger"
                onClick={() => setIsOpen(!isOpen)}
                title="Change Theme"
            >
                <span className="theme-icon">{currentTheme.icon}</span>
                <span className="theme-name">{currentTheme.name}</span>
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

            {isOpen && (
                <div className="theme-dropdown">
                    <div className="theme-dropdown-header">
                        <span>Choose Theme</span>
                    </div>
                    <div className="theme-options">
                        {THEMES.map((t) => (
                            <button
                                key={t.id}
                                className={`theme-option ${theme === t.id ? 'active' : ''}`}
                                onClick={() => {
                                    setTheme(t.id);
                                    setIsOpen(false);
                                }}
                            >
                                <span className="theme-option-icon">{t.icon}</span>
                                <div className="theme-option-info">
                                    <span className="theme-option-name">{t.name}</span>
                                    <span className="theme-option-desc">{t.description}</span>
                                </div>
                                {theme === t.id && (
                                    <svg className="theme-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {isOpen && <div className="theme-backdrop" onClick={() => setIsOpen(false)} />}
        </div>
    );
};

export default ThemeSelector;
