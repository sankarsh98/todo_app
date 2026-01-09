// Gamification Context - XP, Levels, Streaks, and Achievements
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const GamificationContext = createContext(null);

// XP rewards for different actions
const XP_REWARDS = {
    COMPLETE_TASK: 10,
    COMPLETE_HIGH_PRIORITY: 25,
    COMPLETE_WITH_SUBTASKS: 15,
    DAILY_STREAK: 50,
    FIRST_TASK_TODAY: 20,
    COMPLETE_ALL_TODAY: 100,
};

// Level thresholds
const LEVELS = [
    { level: 1, minXP: 0, title: 'Beginner', icon: '🌱' },
    { level: 2, minXP: 100, title: 'Starter', icon: '🌿' },
    { level: 3, minXP: 250, title: 'Organizer', icon: '🌳' },
    { level: 4, minXP: 500, title: 'Achiever', icon: '⭐' },
    { level: 5, minXP: 1000, title: 'Pro', icon: '🌟' },
    { level: 6, minXP: 2000, title: 'Master', icon: '💫' },
    { level: 7, minXP: 3500, title: 'Champion', icon: '🏆' },
    { level: 8, minXP: 5000, title: 'Legend', icon: '👑' },
    { level: 9, minXP: 7500, title: 'Mythic', icon: '🔥' },
    { level: 10, minXP: 10000, title: 'Grandmaster', icon: '💎' },
];

// Achievements
const ACHIEVEMENTS = [
    { id: 'first_task', title: 'First Steps', desc: 'Complete your first task', icon: '🎯', condition: (stats) => stats.totalCompleted >= 1 },
    { id: 'ten_tasks', title: 'Getting Started', desc: 'Complete 10 tasks', icon: '📝', condition: (stats) => stats.totalCompleted >= 10 },
    { id: 'fifty_tasks', title: 'Task Master', desc: 'Complete 50 tasks', icon: '🏅', condition: (stats) => stats.totalCompleted >= 50 },
    { id: 'hundred_tasks', title: 'Century', desc: 'Complete 100 tasks', icon: '💯', condition: (stats) => stats.totalCompleted >= 100 },
    { id: 'streak_3', title: 'On Fire', desc: '3 day streak', icon: '🔥', condition: (stats) => stats.currentStreak >= 3 },
    { id: 'streak_7', title: 'Week Warrior', desc: '7 day streak', icon: '⚡', condition: (stats) => stats.currentStreak >= 7 },
    { id: 'streak_30', title: 'Monthly Marvel', desc: '30 day streak', icon: '🌟', condition: (stats) => stats.currentStreak >= 30 },
    { id: 'early_bird', title: 'Early Bird', desc: 'Complete a task before 9 AM', icon: '🌅', condition: (stats) => stats.earlyBirdCount >= 1 },
    { id: 'night_owl', title: 'Night Owl', desc: 'Complete a task after 10 PM', icon: '🦉', condition: (stats) => stats.nightOwlCount >= 1 },
    { id: 'priority_master', title: 'Priority Master', desc: 'Complete 10 high priority tasks', icon: '⭐', condition: (stats) => stats.highPriorityCompleted >= 10 },
];

export const useGamification = () => {
    const context = useContext(GamificationContext);
    if (!context) {
        throw new Error('useGamification must be used within a GamificationProvider');
    }
    return context;
};

export const GamificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [gamificationEnabled, setGamificationEnabled] = useState(() => {
        const saved = localStorage.getItem('gamificationEnabled');
        return saved ? JSON.parse(saved) : false;
    });

    const [stats, setStats] = useState(() => {
        const saved = localStorage.getItem('gamificationStats');
        return saved ? JSON.parse(saved) : {
            xp: 0,
            totalCompleted: 0,
            currentStreak: 0,
            bestStreak: 0,
            lastCompletedDate: null,
            todayCompleted: 0,
            highPriorityCompleted: 0,
            earlyBirdCount: 0,
            nightOwlCount: 0,
            unlockedAchievements: [],
        };
    });

    const [xpGain, setXpGain] = useState(null); // For XP animation
    const [newAchievement, setNewAchievement] = useState(null); // For achievement popup
    const [levelUp, setLevelUp] = useState(null); // For level up animation

    // Save settings to localStorage
    useEffect(() => {
        localStorage.setItem('gamificationEnabled', JSON.stringify(gamificationEnabled));
    }, [gamificationEnabled]);

    useEffect(() => {
        localStorage.setItem('gamificationStats', JSON.stringify(stats));
    }, [stats]);

    // Reset user stats when user changes
    useEffect(() => {
        if (user) {
            const userStats = localStorage.getItem(`gamificationStats_${user.uid}`);
            if (userStats) {
                setStats(JSON.parse(userStats));
            }
        }
    }, [user]);

    // Save user-specific stats
    useEffect(() => {
        if (user) {
            localStorage.setItem(`gamificationStats_${user.uid}`, JSON.stringify(stats));
        }
    }, [stats, user]);

    // Get current level info
    const getCurrentLevel = useCallback(() => {
        for (let i = LEVELS.length - 1; i >= 0; i--) {
            if (stats.xp >= LEVELS[i].minXP) {
                return LEVELS[i];
            }
        }
        return LEVELS[0];
    }, [stats.xp]);

    // Get next level info
    const getNextLevel = useCallback(() => {
        const current = getCurrentLevel();
        const nextIndex = LEVELS.findIndex(l => l.level === current.level) + 1;
        return nextIndex < LEVELS.length ? LEVELS[nextIndex] : null;
    }, [getCurrentLevel]);

    // Get XP progress to next level
    const getXPProgress = useCallback(() => {
        const current = getCurrentLevel();
        const next = getNextLevel();
        if (!next) return 100;
        const xpIntoLevel = stats.xp - current.minXP;
        const xpForLevel = next.minXP - current.minXP;
        return Math.round((xpIntoLevel / xpForLevel) * 100);
    }, [stats.xp, getCurrentLevel, getNextLevel]);

    // Check and unlock achievements
    const checkAchievements = useCallback((newStats) => {
        const newlyUnlocked = [];
        ACHIEVEMENTS.forEach(achievement => {
            if (!newStats.unlockedAchievements.includes(achievement.id) && achievement.condition(newStats)) {
                newlyUnlocked.push(achievement);
                newStats.unlockedAchievements.push(achievement.id);
            }
        });
        if (newlyUnlocked.length > 0) {
            setNewAchievement(newlyUnlocked[0]);
            setTimeout(() => setNewAchievement(null), 4000);
        }
        return newStats;
    }, []);

    // Award XP for completing a task
    const awardTaskCompletion = useCallback((task) => {
        if (!gamificationEnabled) return;

        const now = new Date();
        const today = now.toDateString();
        const hour = now.getHours();

        setStats(prev => {
            let xpGained = XP_REWARDS.COMPLETE_TASK;
            const previousLevel = getCurrentLevel();

            // Bonus for high priority
            if (task.priority === 1) {
                xpGained += XP_REWARDS.COMPLETE_HIGH_PRIORITY;
            }

            // Bonus for subtasks
            if (task.subtasks?.length > 0) {
                xpGained += XP_REWARDS.COMPLETE_WITH_SUBTASKS;
            }

            let newStats = { ...prev };
            newStats.xp += xpGained;
            newStats.totalCompleted += 1;

            // Check if first task today
            if (prev.lastCompletedDate !== today) {
                newStats.todayCompleted = 1;
                xpGained += XP_REWARDS.FIRST_TASK_TODAY;
                newStats.xp += XP_REWARDS.FIRST_TASK_TODAY;

                // Update streak
                const lastDate = prev.lastCompletedDate ? new Date(prev.lastCompletedDate) : null;
                if (lastDate) {
                    const yesterday = new Date(now);
                    yesterday.setDate(yesterday.getDate() - 1);
                    if (lastDate.toDateString() === yesterday.toDateString()) {
                        newStats.currentStreak += 1;
                        if (newStats.currentStreak > newStats.bestStreak) {
                            newStats.bestStreak = newStats.currentStreak;
                        }
                        // Streak bonus
                        xpGained += XP_REWARDS.DAILY_STREAK;
                        newStats.xp += XP_REWARDS.DAILY_STREAK;
                    } else if (lastDate.toDateString() !== today) {
                        newStats.currentStreak = 1;
                    }
                } else {
                    newStats.currentStreak = 1;
                }
            } else {
                newStats.todayCompleted += 1;
            }

            newStats.lastCompletedDate = today;

            // Track time-based achievements
            if (hour < 9) {
                newStats.earlyBirdCount = (prev.earlyBirdCount || 0) + 1;
            }
            if (hour >= 22) {
                newStats.nightOwlCount = (prev.nightOwlCount || 0) + 1;
            }

            // Track priority tasks
            if (task.priority === 1) {
                newStats.highPriorityCompleted = (prev.highPriorityCompleted || 0) + 1;
            }

            // Check for achievements
            newStats = checkAchievements(newStats);

            // Show XP animation
            setXpGain({ amount: xpGained, x: Math.random() * 100, y: Math.random() * 100 });
            setTimeout(() => setXpGain(null), 1500);

            // Check for level up
            const newLevel = LEVELS.find(l => newStats.xp >= l.minXP && stats.xp < l.minXP);
            if (newLevel && newLevel.level > previousLevel.level) {
                setLevelUp(newLevel);
                setTimeout(() => setLevelUp(null), 3000);
            }

            return newStats;
        });
    }, [gamificationEnabled, getCurrentLevel, checkAchievements, stats.xp]);

    // Toggle gamification mode
    const toggleGamification = useCallback(() => {
        setGamificationEnabled(prev => !prev);
    }, []);

    // Get all achievements with unlock status
    const getAllAchievements = useCallback(() => {
        return ACHIEVEMENTS.map(a => ({
            ...a,
            unlocked: stats.unlockedAchievements.includes(a.id)
        }));
    }, [stats.unlockedAchievements]);

    const value = {
        gamificationEnabled,
        toggleGamification,
        stats,
        xpGain,
        newAchievement,
        levelUp,
        getCurrentLevel,
        getNextLevel,
        getXPProgress,
        awardTaskCompletion,
        getAllAchievements,
        LEVELS,
    };

    return (
        <GamificationContext.Provider value={value}>
            {children}
        </GamificationContext.Provider>
    );
};

export default GamificationContext;
