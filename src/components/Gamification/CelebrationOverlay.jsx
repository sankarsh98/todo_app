// CelebrationOverlay - Full-screen celebration for major achievements
import { useState, useEffect } from 'react';
import Confetti from '../Effects/Confetti';
import './CelebrationOverlay.css';

const RALPH_QUOTES = [
    "I'm helping!",
    "Me fail English? That's unpossible!",
    "I bent my wookie.",
    "My cat's breath smells like cat food.",
    "I'm a unitard!",
    "When I grow up, I'm going to Bovine University!",
    "That's where I saw the leprechaun!",
    "Look Big Daddy, it's regular Daddy!",
];

const INSPIRATIONAL_QUOTES = [
    "You're unstoppable! 🚀",
    "Excellence achieved! ⭐",
    "Pure productivity magic! ✨",
    "You crushed it! 💪",
    "Legendary performance! 🏆",
    "On fire today! 🔥",
    "Champion mindset! 👑",
    "Absolutely brilliant! 💎",
];

const CelebrationOverlay = ({
    isVisible,
    onClose,
    type = 'levelUp',
    data = {},
    isRalphMode = false
}) => {
    const [confettiTrigger, setConfettiTrigger] = useState(0);
    const [animationPhase, setAnimationPhase] = useState('enter');

    useEffect(() => {
        if (isVisible) {
            setAnimationPhase('enter');
            setConfettiTrigger(prev => prev + 1);

            // Auto-close after animation
            const timer = setTimeout(() => {
                setAnimationPhase('exit');
                setTimeout(onClose, 500);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    const getContent = () => {
        const quote = isRalphMode
            ? RALPH_QUOTES[Math.floor(Math.random() * RALPH_QUOTES.length)]
            : INSPIRATIONAL_QUOTES[Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length)];

        switch (type) {
            case 'levelUp':
                return {
                    emoji: isRalphMode ? '🍕' : '🎉',
                    title: isRalphMode ? 'I leveled up!' : 'LEVEL UP!',
                    subtitle: `Level ${data.level || '?'}`,
                    quote,
                    className: 'level-up'
                };
            case 'streak':
                return {
                    emoji: isRalphMode ? '🖍️' : '🔥',
                    title: isRalphMode ? 'I did it again!' : `${data.streak || 0} Day Streak!`,
                    subtitle: 'Keep the momentum!',
                    quote,
                    className: 'streak'
                };
            case 'allComplete':
                return {
                    emoji: isRalphMode ? '🌈' : '🏆',
                    title: isRalphMode ? 'I finished my chores!' : 'ALL TASKS COMPLETE!',
                    subtitle: 'Perfect day achieved',
                    quote,
                    className: 'all-complete'
                };
            case 'achievement':
                return {
                    emoji: data.emoji || '🏅',
                    title: data.name || 'Achievement Unlocked!',
                    subtitle: data.description || '',
                    quote,
                    className: 'achievement'
                };
            case 'epic':
                return {
                    emoji: '👑',
                    title: 'LEGENDARY!',
                    subtitle: 'You are absolutely crushing it!',
                    quote,
                    className: 'epic'
                };
            default:
                return {
                    emoji: '⭐',
                    title: 'Awesome!',
                    subtitle: 'Great work!',
                    quote,
                    className: 'default'
                };
        }
    };

    const content = getContent();

    return (
        <div className={`celebration-overlay ${animationPhase} ${content.className} ${isRalphMode ? 'ralph-mode' : ''}`}>
            <Confetti trigger={confettiTrigger} intensity="epic" />

            <div className="celebration-content">
                <div className="celebration-emoji">
                    {content.emoji}
                </div>

                <h1 className="celebration-title">
                    {content.title}
                </h1>

                {content.subtitle && (
                    <p className="celebration-subtitle">
                        {content.subtitle}
                    </p>
                )}

                <p className="celebration-quote">
                    "{content.quote}"
                </p>

                <div className="celebration-particles">
                    {[...Array(12)].map((_, i) => (
                        <span
                            key={i}
                            className="particle"
                            style={{
                                '--delay': `${i * 0.1}s`,
                                '--angle': `${i * 30}deg`
                            }}
                        >
                            {['✨', '⭐', '💫', '🌟'][i % 4]}
                        </span>
                    ))}
                </div>
            </div>

            <button className="celebration-close" onClick={onClose}>
                Continue →
            </button>
        </div>
    );
};

export default CelebrationOverlay;
