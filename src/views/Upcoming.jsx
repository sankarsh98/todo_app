// Upcoming View - Tasks sorted by due date
import { useState, useEffect } from 'react';
import { format, isToday, isTomorrow, isThisWeek, addDays, startOfDay } from 'date-fns';
import { useTasks } from '../context/TaskContext';
import QuickAdd from '../components/Tasks/QuickAdd';
import TaskList from '../components/Tasks/TaskList';
import TaskModal from '../components/Tasks/TaskModal';
import './Views.css';

const Upcoming = () => {
    const { getTasksByFilter, getOverdueTasks } = useTasks();
    const [selectedTask, setSelectedTask] = useState(null);
    const [quickAddOpen, setQuickAddOpen] = useState(true);

    const upcomingTasks = getTasksByFilter('upcoming');
    const overdueTasks = getOverdueTasks();

    useEffect(() => {
        const handleOpenQuickAdd = () => setQuickAddOpen(true);
        window.addEventListener('openQuickAdd', handleOpenQuickAdd);
        return () => window.removeEventListener('openQuickAdd', handleOpenQuickAdd);
    }, []);

    // Group tasks by date
    const today = startOfDay(new Date());
    const tomorrow = startOfDay(addDays(today, 1));

    const groupedTasks = upcomingTasks.reduce((groups, task) => {
        if (!task.dueDate) return groups;

        const dueDate = startOfDay(new Date(task.dueDate));
        let groupKey;

        if (isToday(dueDate)) {
            groupKey = 'Today';
        } else if (isTomorrow(dueDate)) {
            groupKey = 'Tomorrow';
        } else if (isThisWeek(dueDate)) {
            groupKey = format(dueDate, 'EEEE');
        } else {
            groupKey = format(dueDate, 'MMMM d');
        }

        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }
        groups[groupKey].push(task);
        return groups;
    }, {});

    return (
        <div className="view-container">
            <div className="view-header">
                <div className="view-header-content">
                    <h1 className="view-title">Upcoming</h1>
                    <p className="view-subtitle">Tasks with due dates</p>
                </div>
                <div className="view-header-icon upcoming-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                </div>
            </div>

            <QuickAdd
                isOpen={quickAddOpen}
                onClose={() => setQuickAddOpen(false)}
            />

            {/* Overdue Section */}
            {overdueTasks.length > 0 && (
                <div className="task-section overdue">
                    <div className="task-section-header">
                        <span className="task-section-title">Overdue</span>
                        <span className="task-section-count">{overdueTasks.length}</span>
                    </div>
                    <TaskList
                        tasks={overdueTasks}
                        onEditTask={setSelectedTask}
                    />
                </div>
            )}

            {/* Grouped by date */}
            {Object.entries(groupedTasks).map(([date, tasks]) => (
                <div key={date} className="task-section">
                    <div className="task-section-header">
                        <span className="task-section-title">{date}</span>
                        <span className="task-section-count">{tasks.length}</span>
                    </div>
                    <TaskList
                        tasks={tasks}
                        onEditTask={setSelectedTask}
                    />
                </div>
            ))}

            {upcomingTasks.length === 0 && overdueTasks.length === 0 && (
                <div className="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <h3>No upcoming tasks</h3>
                    <p>Add a due date to your tasks to see them here</p>
                </div>
            )}

            <TaskModal
                task={selectedTask}
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
            />
        </div>
    );
};

export default Upcoming;
