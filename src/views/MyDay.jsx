// My Day View - Today's focused tasks
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useTasks } from '../context/TaskContext';
import { useIsMobile } from '../hooks/useIsMobile';
import QuickAdd from '../components/Tasks/QuickAdd';
import TaskList from '../components/Tasks/TaskList';
import TaskModal from '../components/Tasks/TaskModal';
import DailySummary from '../components/Tasks/DailySummary';
import './Views.css';

const MyDay = () => {
    const { getTasksByFilter, getOverdueTasks } = useTasks();
    const isMobile = useIsMobile();
    const [selectedTask, setSelectedTask] = useState(null);
    const [quickAddOpen, setQuickAddOpen] = useState(!isMobile);

    const myDayTasks = getTasksByFilter('myday');
    const overdueTasks = getOverdueTasks();

    const today = new Date();
    const dateString = format(today, 'EEEE, MMMM d');

    // Listen for mobile add button
    useEffect(() => {
        const handleOpenQuickAdd = () => {
            setQuickAddOpen(true);
        };
        window.addEventListener('openQuickAdd', handleOpenQuickAdd);
        return () => window.removeEventListener('openQuickAdd', handleOpenQuickAdd);
    }, []);

    return (
        <div className="view-container">
            <div className="view-header">
                <div className="view-header-content">
                    <h1 className="view-title">My Day</h1>
                    <p className="view-subtitle">{dateString}</p>
                </div>
                <div className="view-header-icon myday-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                </div>
            </div>

            <DailySummary tasks={myDayTasks} />

            <QuickAdd
                isOpen={quickAddOpen}
                onClose={() => setQuickAddOpen(false)}
                defaultInMyDay={true}
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

            {/* My Day Tasks */}
            <TaskList
                tasks={myDayTasks}
                emptyMessage="Focus on what matters today"
                onEditTask={setSelectedTask}
            />

            <TaskModal
                task={selectedTask}
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
            />
        </div>
    );
};

export default MyDay;
