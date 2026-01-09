// Completed Tasks View
import { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskList from '../components/Tasks/TaskList';
import TaskModal from '../components/Tasks/TaskModal';
import './Views.css';

const Completed = () => {
    const { getTasksByFilter } = useTasks();
    const [selectedTask, setSelectedTask] = useState(null);

    const completedTasks = getTasksByFilter('completed');

    return (
        <div className="view-container">
            <div className="view-header">
                <div className="view-header-content">
                    <h1 className="view-title">Completed</h1>
                    <p className="view-subtitle">{completedTasks.length} tasks done</p>
                </div>
                <div className="view-header-icon completed-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                </div>
            </div>

            <TaskList
                tasks={completedTasks}
                emptyMessage="No completed tasks yet"
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

export default Completed;
