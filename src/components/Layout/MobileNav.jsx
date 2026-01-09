// Mobile Bottom Navigation
import { useNavigate, useLocation } from 'react-router-dom';
import { useTasks } from '../../context/TaskContext';
import './MobileNav.css';

const MobileNav = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { getTasksByFilter } = useTasks();

    const navItems = [
        {
            id: 'myday',
            name: 'My Day',
            path: '/',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
            )
        },
        {
            id: 'important',
            name: 'Important',
            path: '/important',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            )
        },
        {
            id: 'add',
            name: 'Add',
            path: null,
            isAction: true,
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            )
        },
        {
            id: 'upcoming',
            name: 'Upcoming',
            path: '/upcoming',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
            )
        },
        {
            id: 'menu',
            name: 'Menu',
            path: null,
            isMenu: true,
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
            )
        },
    ];

    const isActive = (path) => path && location.pathname === path;

    const getTaskCount = (filterId) => {
        if (filterId === 'add' || filterId === 'menu') return 0;
        return getTasksByFilter(filterId).length;
    };

    const handleClick = (item) => {
        if (item.isMenu) {
            onMenuClick?.();
        } else if (item.isAction) {
            // Dispatch event to open quick add
            window.dispatchEvent(new CustomEvent('openQuickAdd'));
        } else {
            navigate(item.path);
        }
    };

    return (
        <nav className="mobile-nav hide-desktop">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''} ${item.isAction ? 'mobile-nav-add' : ''}`}
                    onClick={() => handleClick(item)}
                >
                    <span className="mobile-nav-icon">
                        {item.icon}
                        {getTaskCount(item.id) > 0 && (
                            <span className="mobile-nav-badge">{getTaskCount(item.id)}</span>
                        )}
                    </span>
                    <span className="mobile-nav-label">{item.name}</span>
                </button>
            ))}
        </nav>
    );
};

export default MobileNav;
