// Sidebar Navigation Component
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { useTheme } from '../../context/ThemeContext';
import { useGamification } from '../../context/GamificationContext';
import { signOut } from '../../firebase/auth';
import GamificationPanel from '../Gamification/GamificationPanel';
import ThemeSelector from './ThemeSelector';
import './Sidebar.css';

// Icons as components
const SunIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);

const StarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const CalendarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const ListIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const ChartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
);

const TagIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
);

const MoonIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

const LogoutIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

const ChevronLeftIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const Sidebar = ({ isOpen, onToggle }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { labels, getTasksByFilter, getOverdueTasks } = useTasks();
    const { theme, toggleTheme } = useTheme();
    const { gamificationEnabled, toggleGamification } = useGamification();
    const [labelsExpanded, setLabelsExpanded] = useState(true);

    const smartLists = [
        { id: 'myday', name: 'My Day', icon: <SunIcon />, path: '/' },
        { id: 'important', name: 'Important', icon: <StarIcon />, path: '/important' },
        { id: 'upcoming', name: 'Upcoming', icon: <CalendarIcon />, path: '/upcoming' },
        { id: 'all', name: 'All Tasks', icon: <ListIcon />, path: '/all' },
        { id: 'completed', name: 'Completed', icon: <CheckCircleIcon />, path: '/completed' },
        { id: 'summary', name: 'Summary', icon: <ChartIcon />, path: '/summary' },
    ];

    const getTaskCount = (filterId) => {
        return getTasksByFilter(filterId).length;
    };

    const overdueCount = getOverdueTasks().length;

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && <div className="sidebar-overlay hide-desktop" onClick={onToggle} />}

            <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                            <rect width="48" height="48" rx="12" fill="url(#sidebar-logo-gradient)" />
                            <path d="M14 24L20 30L34 16" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <defs>
                                <linearGradient id="sidebar-logo-gradient" x1="0" y1="0" x2="48" y2="48">
                                    <stop stopColor="#6366f1" />
                                    <stop offset="1" stopColor="#8b5cf6" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span className="sidebar-logo-text">TaskFlow</span>
                    </div>
                    <button className="sidebar-toggle hide-mobile" onClick={onToggle}>
                        <ChevronLeftIcon />
                    </button>
                </div>

                <div className="sidebar-content">
                    {/* User Profile */}
                    {user && (
                        <div className="sidebar-user">
                            <img
                                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=6366f1&color=fff`}
                                alt={user.displayName}
                                className="sidebar-user-avatar"
                            />
                            <div className="sidebar-user-info">
                                <span className="sidebar-user-name">{user.displayName}</span>
                                <span className="sidebar-user-email">{user.email}</span>
                            </div>
                            <div className="sidebar-user-actions">
                                <button
                                    className={`user-action-btn ${gamificationEnabled ? 'active' : ''}`}
                                    onClick={toggleGamification}
                                    title={gamificationEnabled ? 'Disable Game Mode' : 'Enable Game Mode'}
                                >
                                    🎮
                                </button>
                                <button className="user-action-btn" onClick={toggleTheme} title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}>
                                    {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                                </button>
                                <button className="user-action-btn logout-btn" onClick={handleLogout} title="Sign Out">
                                    <LogoutIcon />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Overdue Warning */}
                    {overdueCount > 0 && (
                        <div className="sidebar-overdue-alert">
                            <span className="overdue-count">{overdueCount}</span>
                            <span>overdue task{overdueCount !== 1 ? 's' : ''}</span>
                        </div>
                    )}

                    {/* Gamification Panel */}
                    <GamificationPanel />

                    {/* Smart Lists */}
                    <nav className="sidebar-nav">
                        <span className="sidebar-section-title">Smart Lists</span>
                        {smartLists.map((list) => (
                            <button
                                key={list.id}
                                className={`sidebar-nav-item ${isActive(list.path) ? 'active' : ''}`}
                                onClick={() => navigate(list.path)}
                            >
                                <span className="sidebar-nav-icon">{list.icon}</span>
                                <span className="sidebar-nav-label">{list.name}</span>
                                {getTaskCount(list.id) > 0 && (
                                    <span className="sidebar-nav-count">{getTaskCount(list.id)}</span>
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Labels */}
                    <div className="sidebar-labels">
                        <button
                            className="sidebar-section-header"
                            onClick={() => setLabelsExpanded(!labelsExpanded)}
                        >
                            <TagIcon />
                            <span>Labels</span>
                            <span className={`expand-icon ${labelsExpanded ? 'expanded' : ''}`}>
                                <ChevronLeftIcon />
                            </span>
                        </button>

                        {labelsExpanded && (
                            <div className="sidebar-labels-list">
                                {labels.map((label) => (
                                    <button
                                        key={label.id}
                                        className={`sidebar-label-item ${isActive(`/label/${label.id}`) ? 'active' : ''}`}
                                        onClick={() => navigate(`/label/${label.id}`)}
                                    >
                                        <span
                                            className="sidebar-label-color"
                                            style={{ background: label.color }}
                                        />
                                        <span className="sidebar-label-name">{label.name}</span>
                                    </button>
                                ))}
                                <button
                                    className="sidebar-add-label"
                                    onClick={() => navigate('/labels')}
                                >
                                    <PlusIcon />
                                    <span>Add Label</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Theme Selector */}
                <div className="sidebar-footer">
                    <ThemeSelector />
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
