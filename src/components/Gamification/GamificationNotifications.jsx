// Gamification Notifications - XP gains, level ups, achievements
import { useGamification } from '../../context/GamificationContext';
import './Gamification.css';

const GamificationNotifications = () => {
    const { gamificationEnabled, xpGain, newAchievement, levelUp } = useGamification();

    if (!gamificationEnabled) return null;

    return (
        <>
            {/* XP Gain Animation */}
            {xpGain && (
                <div className="xp-popup" key={Date.now()}>
                    <span className="xp-amount">+{xpGain.amount} XP</span>
                </div>
            )}

            {/* Level Up Celebration */}
            {levelUp && (
                <div className="level-up-overlay">
                    <div className="level-up-content">
                        <div className="level-up-icon">{levelUp.icon}</div>
                        <h2 className="level-up-title">Level Up!</h2>
                        <p className="level-up-text">
                            You are now <strong>{levelUp.title}</strong>
                        </p>
                        <span className="level-up-level">Level {levelUp.level}</span>
                    </div>
                </div>
            )}

            {/* Achievement Unlocked */}
            {newAchievement && (
                <div className="achievement-popup">
                    <span className="achievement-popup-icon">{newAchievement.icon}</span>
                    <div className="achievement-popup-content">
                        <span className="achievement-popup-label">Achievement Unlocked!</span>
                        <span className="achievement-popup-title">{newAchievement.title}</span>
                    </div>
                </div>
            )}
        </>
    );
};

export default GamificationNotifications;
