// Task List Component
import TaskItem from './TaskItem';
import './TaskList.css';

const TaskList = ({ tasks, emptyMessage = "No tasks here", onEditTask }) => {
    if (tasks.length === 0) {
        return (
            <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <h3>{emptyMessage}</h3>
                <p>Add a task to get started with your productivity journey</p>
            </div>
        );
    }

    return (
        <div className="task-list">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={onEditTask}
                />
            ))}
        </div>
    );
};

export default TaskList;
