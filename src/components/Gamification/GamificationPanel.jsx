// Gamification Panel Component - Shows XP, Level, Streaks, Achievements
import { useState } from 'react';
import { useGamification } from '../../context/GamificationContext';
import './Gamification.css';

const GamificationPanel = () => {
    const {
        gamificationEnabled,
        stats,
        getCurrentLevel,
        getNextLevel,
        getXPProgress,
        getAllAchievements,
    } = useGamification();

    const [showAchievements, setShowAchievements] = useState(false);

    if (!gamificationEnabled) return null;

    const currentLevel = getCurrentLevel();
    const nextLevel = getNextLevel();
    const progress = getXPProgress();
    const achievements = getAllAchievements();
    const unlockedCount = achievements.filter(a => a.unlocked).length;

    return (
        <>
            <div className="gamification-panel">
                {/* Level Badge */}
                <div className="level-badge">
                    <span className="level-icon">{currentLevel.icon}</span>
                    <div className="level-info">
                        <span className="level-title">{currentLevel.title}</span>
                        <span className="level-number">Level {currentLevel.level}</span>
                    </div>
                </div>

                {/* XP Progress */}
                <div className="xp-section">
                    <div className="xp-header">
                        <span className="xp-label">XP</span>
                        <span className="xp-value">{stats.xp.toLocaleString()}</span>
                    </div>
                    <div className="xp-bar">
                        <div className="xp-bar-fill" style={{ width: `${progress}%` }} />
                    </div>
                    {nextLevel && (
                        <span className="xp-next">
                            {nextLevel.minXP - stats.xp} XP to {nextLevel.title}
                        </span>
                    )}
                </div>

                {/* Stats Row */}
                <div className="stats-row">
                    <div className="stat-item">
                        <span className="stat-icon">🔥</span>
                        <span className="stat-value">{stats.currentStreak}</span>
                        <span className="stat-text">Streak</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-icon">✅</span>
                        <span className="stat-value">{stats.totalCompleted}</span>
                        <span className="stat-text">Done</span>
                    </div>
                    <div className="stat-item" onClick={() => setShowAchievements(true)} style={{ cursor: 'pointer' }}>
                        <span className="stat-icon">🏆</span>
                        <span className="stat-value">{unlockedCount}/{achievements.length}</span>
                        <span className="stat-text">Badges</span>
                    </div>
                </div>
            </div>

            {/* Achievements Modal */}
            {showAchievements && (
                <div className="achievements-overlay" onClick={() => setShowAchievements(false)}>
                    <div className="achievements-modal" onClick={e => e.stopPropagation()}>
                        <div className="achievements-header">
                            <h2>🏆 Achievements</h2>
                            <button className="close-btn" onClick={() => setShowAchievements(false)}>×</button>
                        </div>
                        <div className="achievements-grid">
                            {achievements.map(achievement => (
                                <div
                                    key={achievement.id}
                                    className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                                >
                                    <span className="achievement-icon">{achievement.icon}</span>
                                    <span className="achievement-title">{achievement.title}</span>
                                    <span className="achievement-desc">{achievement.desc}</span>
                                    {achievement.unlocked && <span className="achievement-check">✓</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GamificationPanel;
