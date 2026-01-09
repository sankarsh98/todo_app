// Monthly Summary View - Task statistics for the current month
import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, isWithinInterval, subMonths, addMonths } from 'date-fns';
import { useTasks } from '../context/TaskContext';
import './Views.css';
import './Summary.css';

const Summary = () => {
    const { tasks, labels } = useTasks();
    const [selectedMonth, setSelectedMonth] = useState(new Date());

    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    const monthName = format(selectedMonth, 'MMMM yyyy');

    // Calculate statistics for the selected month
    const stats = useMemo(() => {
        const monthTasks = tasks.filter(task => {
            if (!task.createdAt) return false;
            const createdDate = new Date(task.createdAt);
            return isWithinInterval(createdDate, { start: monthStart, end: monthEnd });
        });

        const completedTasks = monthTasks.filter(t => t.completed);
        const openTasks = monthTasks.filter(t => !t.completed);

        // Tasks completed this month (regardless of when created)
        const completedThisMonth = tasks.filter(task => {
            if (!task.completed || !task.updatedAt) return false;
            const completedDate = new Date(task.updatedAt);
            return isWithinInterval(completedDate, { start: monthStart, end: monthEnd });
        });

        // Priority breakdown
        const priorityBreakdown = {
            high: monthTasks.filter(t => t.priority === 1).length,
            medium: monthTasks.filter(t => t.priority === 2).length,
            low: monthTasks.filter(t => t.priority === 3).length,
            none: monthTasks.filter(t => t.priority === 4).length,
        };

        // Label breakdown
        const labelStats = labels.map(label => ({
            ...label,
            count: monthTasks.filter(t => t.labels?.includes(label.id)).length,
        })).filter(l => l.count > 0).sort((a, b) => b.count - a.count);

        // Completion rate
        const completionRate = monthTasks.length > 0
            ? Math.round((completedTasks.length / monthTasks.length) * 100)
            : 0;

        return {
            total: monthTasks.length,
            completed: completedTasks.length,
            open: openTasks.length,
            completedThisMonth: completedThisMonth.length,
            completionRate,
            priorityBreakdown,
            labelStats,
            openTasks,
            completedTasks,
        };
    }, [tasks, labels, monthStart, monthEnd]);

    const navigateMonth = (direction) => {
        setSelectedMonth(prev =>
            direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
        );
    };

    const isCurrentMonth = format(selectedMonth, 'yyyy-MM') === format(new Date(), 'yyyy-MM');

    return (
        <div className="view-container">
            <div className="view-header">
                <div className="view-header-content">
                    <h1 className="view-title">Monthly Summary</h1>
                    <div className="month-navigator">
                        <button className="month-nav-btn" onClick={() => navigateMonth('prev')}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>
                        <span className="month-label">{monthName}</span>
                        <button
                            className="month-nav-btn"
                            onClick={() => navigateMonth('next')}
                            disabled={isCurrentMonth}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="view-header-icon summary-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card stat-total">
                    <div className="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Total Tasks</span>
                    </div>
                </div>

                <div className="stat-card stat-open">
                    <div className="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.open}</span>
                        <span className="stat-label">Open Tasks</span>
                    </div>
                </div>

                <div className="stat-card stat-completed">
                    <div className="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.completedThisMonth}</span>
                        <span className="stat-label">Completed</span>
                    </div>
                </div>

                <div className="stat-card stat-rate">
                    <div className="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.completionRate}%</span>
                        <span className="stat-label">Completion Rate</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-section">
                <h3 className="section-title">Progress</h3>
                <div className="progress-bar-container">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${stats.completionRate}%` }}
                    />
                </div>
                <div className="progress-labels">
                    <span>{stats.completed} completed</span>
                    <span>{stats.open} remaining</span>
                </div>
            </div>

            {/* Priority Breakdown */}
            <div className="breakdown-section">
                <h3 className="section-title">Priority Breakdown</h3>
                <div className="priority-bars">
                    {[
                        { key: 'high', label: 'High', color: '#ef4444', count: stats.priorityBreakdown.high },
                        { key: 'medium', label: 'Medium', color: '#f59e0b', count: stats.priorityBreakdown.medium },
                        { key: 'low', label: 'Low', color: '#3b82f6', count: stats.priorityBreakdown.low },
                        { key: 'none', label: 'None', color: '#6b7280', count: stats.priorityBreakdown.none },
                    ].map(({ key, label, color, count }) => (
                        <div key={key} className="priority-bar-row">
                            <span className="priority-label" style={{ color }}>{label}</span>
                            <div className="priority-bar-track">
                                <div
                                    className="priority-bar-fill"
                                    style={{
                                        width: stats.total > 0 ? `${(count / stats.total) * 100}%` : '0%',
                                        backgroundColor: color
                                    }}
                                />
                            </div>
                            <span className="priority-count">{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Label Stats */}
            {stats.labelStats.length > 0 && (
                <div className="breakdown-section">
                    <h3 className="section-title">Tasks by Label</h3>
                    <div className="label-stats">
                        {stats.labelStats.map(label => (
                            <div key={label.id} className="label-stat-item">
                                <span
                                    className="label-stat-color"
                                    style={{ backgroundColor: label.color }}
                                />
                                <span className="label-stat-name">{label.name}</span>
                                <span className="label-stat-count">{label.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Open Tasks List */}
            {stats.openTasks.length > 0 && (
                <div className="task-list-section">
                    <h3 className="section-title">Open Tasks ({stats.openTasks.length})</h3>
                    <div className="summary-task-list">
                        {stats.openTasks.slice(0, 5).map(task => (
                            <div key={task.id} className="summary-task-item">
                                <span className={`priority-dot priority-${task.priority}`} />
                                <span className="task-title">{task.title}</span>
                                {task.dueDate && (
                                    <span className="task-due">{format(new Date(task.dueDate), 'MMM d')}</span>
                                )}
                            </div>
                        ))}
                        {stats.openTasks.length > 5 && (
                            <p className="more-tasks">+{stats.openTasks.length - 5} more tasks</p>
                        )}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {stats.total === 0 && (
                <div className="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <p>No tasks created in {monthName}</p>
                </div>
            )}
        </div>
    );
};

export default Summary;
