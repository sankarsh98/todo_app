// AmbientBackground - Theme-specific animated background elements
import { useEffect, useRef, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './AmbientBackground.css';

const AmbientBackground = ({ isDiscoMode = false }) => {
    const { theme } = useTheme();
    const containerRef = useRef(null);

    // Generate particles based on theme
    const particles = useMemo(() => {
        const count = 20;
        const result = [];

        for (let i = 0; i < count; i++) {
            result.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 1.5 + 0.5,
                delay: Math.random() * 5,
                duration: Math.random() * 10 + 10,
            });
        }

        return result;
    }, []);

    const getThemeElements = () => {
        switch (theme) {
            case 'space':
                return { emoji: '⭐', extra: '✨', className: 'space-particles' };
            case 'ocean':
                return { emoji: '🐠', extra: '🐚', className: 'ocean-particles' };
            case 'forest':
                return { emoji: '🍃', extra: '🌿', className: 'forest-particles' };
            case 'mountain':
                return { emoji: '❄️', extra: '🏔️', className: 'mountain-particles' };
            case 'desert':
                return { emoji: '🌵', extra: '🏜️', className: 'desert-particles' };
            case 'pokemon':
                return { emoji: '◓', extra: '⚡', className: 'pokemon-particles' };
            case 'pacman':
                return { emoji: '•', extra: '👻', className: 'pacman-particles' };
            default:
                return null;
        }
    };

    const themeElements = getThemeElements();

    // Disco mode rainbow cycling
    useEffect(() => {
        if (!isDiscoMode || !containerRef.current) return;

        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF69B4'];
        let colorIndex = 0;

        const interval = setInterval(() => {
            if (containerRef.current) {
                containerRef.current.style.backgroundColor = colors[colorIndex % colors.length];
                colorIndex++;
            }
        }, 300);

        return () => clearInterval(interval);
    }, [isDiscoMode]);

    if (isDiscoMode) {
        return (
            <div ref={containerRef} className="ambient-background disco-mode">
                {[...Array(30)].map((_, i) => (
                    <span
                        key={i}
                        className="disco-emoji"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            fontSize: `${Math.random() * 2 + 1}rem`
                        }}
                    >
                        {['🕺', '💃', '🪩', '✨', '🎉', '🎊'][i % 6]}
                    </span>
                ))}
            </div>
        );
    }

    if (!themeElements) return null;

    return (
        <div className={`ambient-background ${themeElements.className}`}>
            {particles.map(p => (
                <span
                    key={p.id}
                    className="ambient-particle"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        fontSize: `${p.size}rem`,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`,
                    }}
                >
                    {p.id % 3 === 0 ? themeElements.extra : themeElements.emoji}
                </span>
            ))}

            {theme === 'space' && (
                <div className="shooting-star-container">
                    <div className="shooting-star" />
                </div>
            )}

            {theme === 'ocean' && (
                <div className="wave-container">
                    <div className="wave wave-1" />
                    <div className="wave wave-2" />
                </div>
            )}

            {theme === 'forest' && (
                <div className="fireflies-container">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="firefly"
                            style={{
                                left: `${10 + Math.random() * 80}%`,
                                top: `${50 + Math.random() * 40}%`,
                                animationDelay: `${Math.random() * 5}s`,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AmbientBackground;
