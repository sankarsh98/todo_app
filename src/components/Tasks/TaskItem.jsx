// Task Item Component
import { useState } from 'react';
import { format, isToday, isTomorrow, isPast, isThisWeek } from 'date-fns';
import { useTasks } from '../../context/TaskContext';
import { useGamification } from '../../context/GamificationContext';
import useSound from '../../hooks/useSound';
import './TaskItem.css';

const TaskItem = ({ task, onEdit }) => {
    const { toggleTaskComplete, updateTask, deleteTask, labels } = useTasks();
    const { awardTaskCompletion } = useGamification();
    const { playSuccess, playRemove } = useSound();
    const [isHovered, setIsHovered] = useState(false);

    const handleComplete = async (e) => {
        e.stopPropagation();
        const nowCompleting = !task.completed;
        await toggleTaskComplete(task.id, nowCompleting);
        // Award XP when completing (not uncompleting)
        if (nowCompleting) {
            awardTaskCompletion(task);
            playSuccess();
        }
    };

    const handleMyDayToggle = async (e) => {
        e.stopPropagation();
        await updateTask(task.id, { inMyDay: !task.inMyDay });
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (window.confirm('Delete this task?')) {
            playRemove();
            await deleteTask(task.id);
        }
    };

    const formatDueDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        const timeStr = format(d, 'p');
        const hasTime = d.getHours() !== 0 || d.getMinutes() !== 0;

        let dateStr = '';
        if (isToday(d)) dateStr = 'Today';
        else if (isTomorrow(d)) dateStr = 'Tomorrow';
        else if (isThisWeek(d)) dateStr = format(d, 'EEEE');
        else dateStr = format(d, 'MMM d');
        
        return hasTime ? `${dateStr}, ${timeStr}` : dateStr;
    };

    const getDueDateClass = (date) => {
        if (!date) return '';
        const d = new Date(date);
        if (isPast(d) && !isToday(d)) return 'overdue';
        if (isToday(d)) return 'today';
        return '';
    };

    const taskLabels = task.labels
        .map(labelId => labels.find(l => l.id === labelId))
        .filter(Boolean);

    const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
    const totalSubtasks = task.subtasks?.length || 0;

    return (
        <div
            className={`task-item ${task.completed ? 'completed' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onEdit?.(task)}
        >
            {/* Priority Indicator */}
            <div className={`priority-indicator priority-${task.priority}`} />

            {/* Checkbox */}
            <button
                className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                onClick={handleComplete}
                aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
            >
                {task.completed && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                )}
            </button>

            {/* Content */}
            <div className="task-content">
                <div className="task-header">
                    <span className="task-title">{task.title}</span>
                </div>

                {/* Meta info */}
                <div className="task-meta">
                    {task.dueDate && (
                        <span className={`task-due-date ${getDueDateClass(task.dueDate)}`}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            {formatDueDate(task.dueDate)}
                        </span>
                    )}

                    {totalSubtasks > 0 && (
                        <span className="task-subtasks-count">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                            </svg>
                            {completedSubtasks}/{totalSubtasks}
                        </span>
                    )}

                    {task.recurring && (
                        <span className="task-recurring">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                            </svg>
                        </span>
                    )}

                    {taskLabels.length > 0 && (
                        <div className="task-labels">
                            {taskLabels.map(label => (
                                <span
                                    key={label.id}
                                    className="task-label"
                                    style={{ background: `${label.color}20`, color: label.color }}
                                >
                                    {label.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className={`task-actions ${isHovered ? 'visible' : ''}`}>
                <button
                    className={`task-action-btn ${task.inMyDay ? 'active' : ''}`}
                    onClick={handleMyDayToggle}
                    title={task.inMyDay ? 'Remove from My Day' : 'Add to My Day'}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={task.inMyDay ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                </button>
                <button
                    className="task-action-btn delete"
                    onClick={handleDelete}
                    title="Delete task"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default TaskItem;
