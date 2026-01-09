// Important View - High priority tasks
import { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { useIsMobile } from '../hooks/useIsMobile';
import QuickAdd from '../components/Tasks/QuickAdd';
import TaskList from '../components/Tasks/TaskList';
import TaskModal from '../components/Tasks/TaskModal';
import './Views.css';

const Important = () => {
    const { getTasksByFilter } = useTasks();
    const isMobile = useIsMobile();
    const [selectedTask, setSelectedTask] = useState(null);
    const [quickAddOpen, setQuickAddOpen] = useState(!isMobile);

    const importantTasks = getTasksByFilter('important');

    useEffect(() => {
        const handleOpenQuickAdd = () => setQuickAddOpen(true);
        window.addEventListener('openQuickAdd', handleOpenQuickAdd);
        return () => window.removeEventListener('openQuickAdd', handleOpenQuickAdd);
    }, []);

    return (
        <div className="view-container">
            <div className="view-header">
                <div className="view-header-content">
                    <h1 className="view-title">Important</h1>
                    <p className="view-subtitle">High priority tasks</p>
                </div>
                <div className="view-header-icon important-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                </div>
            </div>

            <QuickAdd
                isOpen={quickAddOpen}
                onClose={() => setQuickAddOpen(false)}
            />

            <TaskList
                tasks={importantTasks}
                emptyMessage="No high priority tasks"
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

export default Important;
