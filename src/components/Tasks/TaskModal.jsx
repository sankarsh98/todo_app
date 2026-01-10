// Task Modal - Full editing modal for tasks
import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { useTasks } from '../../context/TaskContext';
import './TaskModal.css';

const TaskModal = ({ task, isOpen, onClose }) => {
    const { updateTask, deleteTask, labels, createLabel } = useTasks();
    const [editedTask, setEditedTask] = useState(null);
    const [newSubtask, setNewSubtask] = useState('');
    const [showLabelPicker, setShowLabelPicker] = useState(false);
    const [newLabelName, setNewLabelName] = useState('');
    const [enableReminder, setEnableReminder] = useState(false);
    const titleRef = useRef(null);

    useEffect(() => {
        if (task && isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setEditedTask({ ...task });
            if (task.dueDate) {
                const d = new Date(task.dueDate);
                setEnableReminder(d.getHours() !== 0 || d.getMinutes() !== 0);
            } else {
                setEnableReminder(false);
            }
        }
    }, [task, isOpen]);

    useEffect(() => {
        if (isOpen && titleRef.current) {
            titleRef.current.focus();
        }
    }, [isOpen]);

    if (!isOpen || !editedTask) return null;

    const handleSave = async () => {
        await updateTask(editedTask.id, {
            title: editedTask.title,
            description: editedTask.description,
            priority: editedTask.priority,
            dueDate: editedTask.dueDate,
            recurring: editedTask.recurring,
            labels: editedTask.labels,
            subtasks: editedTask.subtasks,
            inMyDay: editedTask.inMyDay,
        });
        onClose();
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            await deleteTask(editedTask.id);
            onClose();
        }
    };

    const handleAddSubtask = () => {
        if (!newSubtask.trim()) return;
        const subtask = {
            id: Date.now().toString(),
            title: newSubtask.trim(),
            completed: false,
        };
        setEditedTask({
            ...editedTask,
            subtasks: [...(editedTask.subtasks || []), subtask],
        });
        setNewSubtask('');
    };

    const handleToggleSubtask = (subtaskId) => {
        setEditedTask({
            ...editedTask,
            subtasks: editedTask.subtasks.map(s =>
                s.id === subtaskId ? { ...s, completed: !s.completed } : s
            ),
        });
    };

    const handleDeleteSubtask = (subtaskId) => {
        setEditedTask({
            ...editedTask,
            subtasks: editedTask.subtasks.filter(s => s.id !== subtaskId),
        });
    };

    const handleToggleLabel = (labelId) => {
        const hasLabel = editedTask.labels.includes(labelId);
        setEditedTask({
            ...editedTask,
            labels: hasLabel
                ? editedTask.labels.filter(id => id !== labelId)
                : [...editedTask.labels, labelId],
        });
    };

    const handleCreateLabel = async () => {
        if (!newLabelName.trim()) return;
        const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const labelId = await createLabel({ name: newLabelName.trim(), color: randomColor });
        setEditedTask({
            ...editedTask,
            labels: [...editedTask.labels, labelId],
        });
        setNewLabelName('');
    };

    const priorities = [
        { value: 1, label: 'High', color: 'var(--color-priority-1)' },
        { value: 2, label: 'Medium', color: 'var(--color-priority-2)' },
        { value: 3, label: 'Low', color: 'var(--color-priority-3)' },
        { value: 4, label: 'None', color: 'var(--color-priority-4)' },
    ];

    const recurringOptions = [
        { value: null, label: 'No repeat' },
        { value: { frequency: 'daily', interval: 1 }, label: 'Daily' },
        { value: { frequency: 'weekly', interval: 1 }, label: 'Weekly' },
        { value: { frequency: 'monthly', interval: 1 }, label: 'Monthly' },
    ];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal task-modal" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="task-modal-header">
                    <button
                        className={`modal-myday-btn ${editedTask.inMyDay ? 'active' : ''}`}
                        onClick={() => setEditedTask({ ...editedTask, inMyDay: !editedTask.inMyDay })}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={editedTask.inMyDay ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                        {editedTask.inMyDay ? 'In My Day' : 'Add to My Day'}
                    </button>
                    <button className="modal-close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="task-modal-content">
                    {/* Title */}
                    <input
                        ref={titleRef}
                        type="text"
                        value={editedTask.title}
                        onChange={e => setEditedTask({ ...editedTask, title: e.target.value })}
                        className="task-modal-title"
                        placeholder="Task title"
                    />

                    {/* Description */}
                    <textarea
                        value={editedTask.description || ''}
                        onChange={e => setEditedTask({ ...editedTask, description: e.target.value })}
                        className="task-modal-description"
                        placeholder="Add notes..."
                        rows={3}
                    />

                    {/* Properties */}
                    <div className="task-modal-properties">
                        {/* Due Date & Reminder */}
                        <div className="task-property">
                            <label className="task-property-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                Due Date
                            </label>
                            <div className="schedule-controls">
                                <input
                                    type="date"
                                    value={editedTask.dueDate ? format(new Date(editedTask.dueDate), "yyyy-MM-dd") : ''}
                                    onChange={e => {
                                        const dateVal = e.target.value;
                                        if (!dateVal) {
                                            setEditedTask({ ...editedTask, dueDate: null });
                                            return;
                                        }
                                        const [y, m, d] = dateVal.split('-').map(Number);
                                        const newDate = editedTask.dueDate ? new Date(editedTask.dueDate) : new Date();
                                        newDate.setFullYear(y);
                                        newDate.setMonth(m - 1);
                                        newDate.setDate(d);
                                        
                                        if (!editedTask.dueDate) {
                                            // Set default time based on reminder setting
                                            newDate.setHours(enableReminder ? 9 : 0, 0, 0, 0);
                                        }
                                        setEditedTask({ ...editedTask, dueDate: newDate });
                                    }}
                                    className="task-property-input date-input"
                                />
                                
                                <div className="reminder-row">
                                    <label className="reminder-toggle">
                                        <input
                                            type="checkbox"
                                            checked={enableReminder}
                                            onChange={e => {
                                                const isEnabled = e.target.checked;
                                                setEnableReminder(isEnabled);
                                                if (editedTask.dueDate) {
                                                    const newDate = new Date(editedTask.dueDate);
                                                    if (isEnabled) {
                                                        newDate.setHours(9, 0); // Default to 9 AM
                                                    } else {
                                                        newDate.setHours(0, 0); // Reset to midnight
                                                    }
                                                    setEditedTask({ ...editedTask, dueDate: newDate });
                                                }
                                            }}
                                        />
                                        <span>Set time</span>
                                    </label>
                                    
                                    {enableReminder && (
                                        <input
                                            type="time"
                                            value={editedTask.dueDate ? format(new Date(editedTask.dueDate), "HH:mm") : '09:00'}
                                            onChange={e => {
                                                if (!editedTask.dueDate) return;
                                                const [h, m] = e.target.value.split(':').map(Number);
                                                const newDate = new Date(editedTask.dueDate);
                                                newDate.setHours(h, m);
                                                setEditedTask({ ...editedTask, dueDate: newDate });
                                            }}
                                            className="task-property-input time-input"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Priority */}
                        <div className="task-property">
                            <label className="task-property-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" />
                                </svg>
                                Priority
                            </label>
                            <div className="priority-options">
                                {priorities.map(p => (
                                    <button
                                        key={p.value}
                                        className={`priority-option ${editedTask.priority === p.value ? 'selected' : ''}`}
                                        style={{ '--priority-color': p.color }}
                                        onClick={() => setEditedTask({ ...editedTask, priority: p.value })}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Recurring */}
                        <div className="task-property">
                            <label className="task-property-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                                </svg>
                                Repeat
                            </label>
                            <select
                                value={JSON.stringify(editedTask.recurring)}
                                onChange={e => setEditedTask({ ...editedTask, recurring: JSON.parse(e.target.value) })}
                                className="task-property-input"
                            >
                                {recurringOptions.map((opt, idx) => (
                                    <option key={idx} value={JSON.stringify(opt.value)}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Labels */}
                        <div className="task-property">
                            <label className="task-property-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
                                </svg>
                                Labels
                            </label>
                            <button
                                className="label-picker-trigger"
                                onClick={() => setShowLabelPicker(!showLabelPicker)}
                            >
                                {editedTask.labels.length > 0 ? (
                                    <div className="selected-labels">
                                        {editedTask.labels.map(labelId => {
                                            const label = labels.find(l => l.id === labelId);
                                            return label ? (
                                                <span
                                                    key={label.id}
                                                    className="selected-label"
                                                    style={{ background: label.color }}
                                                />
                                            ) : null;
                                        })}
                                        <span>+{editedTask.labels.length}</span>
                                    </div>
                                ) : (
                                    <span>Add labels</span>
                                )}
                            </button>

                            {showLabelPicker && (
                                <div className="label-picker">
                                    {labels.map(label => (
                                        <button
                                            key={label.id}
                                            className={`label-option ${editedTask.labels.includes(label.id) ? 'selected' : ''}`}
                                            onClick={() => handleToggleLabel(label.id)}
                                        >
                                            <span className="label-color" style={{ background: label.color }} />
                                            <span>{label.name}</span>
                                            {editedTask.labels.includes(label.id) && (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                    <div className="label-create">
                                        <input
                                            type="text"
                                            value={newLabelName}
                                            onChange={e => setNewLabelName(e.target.value)}
                                            placeholder="New label..."
                                            onKeyDown={e => e.key === 'Enter' && handleCreateLabel()}
                                        />
                                        <button onClick={handleCreateLabel}>Add</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Subtasks */}
                    <div className="task-modal-subtasks">
                        <h4 className="subtasks-title">Subtasks</h4>
                        <div className="subtasks-list">
                            {editedTask.subtasks?.map(subtask => (
                                <div key={subtask.id} className="subtask-item">
                                    <button
                                        className={`subtask-checkbox ${subtask.completed ? 'checked' : ''}`}
                                        onClick={() => handleToggleSubtask(subtask.id)}
                                    >
                                        {subtask.completed && (
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        )}
                                    </button>
                                    <span className={`subtask-title ${subtask.completed ? 'completed' : ''}`}>
                                        {subtask.title}
                                    </span>
                                    <button
                                        className="subtask-delete"
                                        onClick={() => handleDeleteSubtask(subtask.id)}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="subtask-add">
                            <input
                                type="text"
                                value={newSubtask}
                                onChange={e => setNewSubtask(e.target.value)}
                                placeholder="Add a subtask..."
                                onKeyDown={e => e.key === 'Enter' && handleAddSubtask()}
                            />
                            <button onClick={handleAddSubtask} disabled={!newSubtask.trim()}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="task-modal-footer">
                    <button className="btn-ghost" onClick={handleDelete}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        Delete
                    </button>
                    <div className="modal-footer-actions">
                        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSave}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
