// Label View - Tasks filtered by label
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { useIsMobile } from '../hooks/useIsMobile';
import QuickAdd from '../components/Tasks/QuickAdd';
import TaskList from '../components/Tasks/TaskList';
import TaskModal from '../components/Tasks/TaskModal';
import './Views.css';

const LabelView = () => {
    const { labelId } = useParams();
    const { getTasksByLabel, labels } = useTasks();
    const isMobile = useIsMobile();
    const [selectedTask, setSelectedTask] = useState(null);
    const [quickAddOpen, setQuickAddOpen] = useState(!isMobile);

    const label = labels.find(l => l.id === labelId);
    const tasks = getTasksByLabel(labelId);

    useEffect(() => {
        const handleOpenQuickAdd = () => setQuickAddOpen(true);
        window.addEventListener('openQuickAdd', handleOpenQuickAdd);
        return () => window.removeEventListener('openQuickAdd', handleOpenQuickAdd);
    }, []);

    if (!label) {
        return (
            <div className="view-container">
                <div className="empty-state">
                    <h3>Label not found</h3>
                    <p>This label may have been deleted</p>
                </div>
            </div>
        );
    }

    return (
        <div className="view-container">
            <div className="view-header">
                <div className="view-header-content">
                    <h1 className="view-title" style={{ color: label.color }}>
                        {label.name}
                    </h1>
                    <p className="view-subtitle">{tasks.length} tasks</p>
                </div>
                <div
                    className="view-header-icon label-icon"
                    style={{ background: `${label.color}20`, color: label.color }}
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                </div>
            </div>

            <QuickAdd
                isOpen={quickAddOpen}
                onClose={() => setQuickAddOpen(false)}
                defaultLabels={[labelId]}
            />

            <TaskList
                tasks={tasks}
                emptyMessage={`No tasks with "${label.name}" label`}
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

export default LabelView;
