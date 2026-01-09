// Quick Add Task Component
import { useState, useRef, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useNaturalLanguage } from '../../hooks/useNaturalLanguage';
import './QuickAdd.css';

const QuickAdd = ({ isOpen, onClose, defaultInMyDay = false, defaultLabels = [] }) => {
    const [input, setInput] = useState('');
    const [parsedPreview, setParsedPreview] = useState(null);
    const inputRef = useRef(null);
    const { createTask, createLabel, labels } = useTasks();
    const { parseInput } = useNaturalLanguage();

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (input.trim()) {
            const parsed = parseInput(input, labels);
            setParsedPreview(parsed);
        } else {
            setParsedPreview(null);
        }
    }, [input, labels, parseInput]);

    // Listen for mobile add button - this event is dispatched but handled by parent view
    // Also focus input when the event is triggered
    useEffect(() => {
        const handleOpenQuickAdd = () => {
            if (inputRef.current) {
                inputRef.current.focus();
                inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };
        window.addEventListener('openQuickAdd', handleOpenQuickAdd);
        return () => window.removeEventListener('openQuickAdd', handleOpenQuickAdd);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!input.trim()) return;

        const parsed = parseInput(input, labels);

        // Auto-create labels that don't exist
        const labelIds = [...defaultLabels]; // Start with default labels

        // Extract label names from input using #labelname pattern
        const labelMatches = input.match(/#(\w+)/g);
        if (labelMatches) {
            for (const match of labelMatches) {
                const labelName = match.substring(1).toLowerCase();

                // Check if label exists
                let existingLabel = labels.find(l => l.name.toLowerCase() === labelName);

                // If not, create it
                if (!existingLabel) {
                    const colors = ['#ef4444', '#f97316', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    const newLabelId = await createLabel({
                        name: labelName.charAt(0).toUpperCase() + labelName.slice(1),
                        color: randomColor
                    });
                    labelIds.push(newLabelId);
                } else if (!labelIds.includes(existingLabel.id)) {
                    labelIds.push(existingLabel.id);
                }
            }
        }

        await createTask({
            title: parsed.title,
            dueDate: parsed.dueDate,
            priority: parsed.priority,
            labels: labelIds,
            inMyDay: defaultInMyDay,
            hasReminder: parsed.hasReminder,
            recurring: parsed.recurring,
        });

        setInput('');
        setParsedPreview(null);
        // Don't close QuickAdd after adding - keep it open for more tasks
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setInput('');
            onClose?.();
        }
    };

    if (!isOpen) return null;

    const formatPreviewDate = (date, hasReminder) => {
        if (!date) return null;
        const d = new Date(date);
        const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        if (hasReminder) {
            const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            return `${dateStr} @ ${timeStr}`;
        }
        return dateStr;
    };

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 1: return { label: 'High', className: 'priority-high' };
            case 2: return { label: 'Medium', className: 'priority-medium' };
            case 3: return { label: 'Low', className: 'priority-low' };
            default: return null;
        }
    };

    // Get label names for preview (including ones that will be created)
    const getPreviewLabels = () => {
        const previewLabels = [];

        // Add default labels
        defaultLabels.forEach(labelId => {
            const label = labels.find(l => l.id === labelId);
            if (label) previewLabels.push(label);
        });

        // Add labels from input
        const labelMatches = input.match(/#(\w+)/g);
        if (labelMatches) {
            labelMatches.forEach(match => {
                const labelName = match.substring(1);
                const existingLabel = labels.find(l => l.name.toLowerCase() === labelName.toLowerCase());
                if (existingLabel && !previewLabels.find(l => l.id === existingLabel.id)) {
                    previewLabels.push(existingLabel);
                } else if (!existingLabel) {
                    // Show as "will be created"
                    previewLabels.push({
                        id: `new-${labelName}`,
                        name: labelName.charAt(0).toUpperCase() + labelName.slice(1),
                        color: '#6366f1',
                        isNew: true
                    });
                }
            });
        }

        return previewLabels;
    };

    return (
        <div className="quick-add-container">
            <form className="quick-add" onSubmit={handleSubmit}>
                <div className="quick-add-input-wrapper">
                    <span className="quick-add-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Add a task... Try 'Buy milk tomorrow #shopping p1'"
                        className="quick-add-input"
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        className="quick-add-submit"
                        disabled={!input.trim()}
                    >
                        Add
                    </button>
                </div>

                {/* Preview of parsed input */}
                {parsedPreview && (input !== parsedPreview.title || defaultLabels.length > 0) && (
                    <div className="quick-add-preview animate-fade-in">
                        <span className="preview-label">Creating:</span>
                        <span className="preview-title">{parsedPreview.title || input}</span>

                        {parsedPreview.dueDate && (
                            <span className="preview-tag preview-date">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                {formatPreviewDate(parsedPreview.dueDate, parsedPreview.hasReminder)}
                                {parsedPreview.hasReminder && <span title="Reminder enabled"> 🔔</span>}
                            </span>
                        )}

                        {getPriorityLabel(parsedPreview.priority) && (
                            <span className={`preview-tag ${getPriorityLabel(parsedPreview.priority).className}`}>
                                {getPriorityLabel(parsedPreview.priority).label}
                            </span>
                        )}

                        {parsedPreview.recurring && (
                            <span className="preview-tag preview-recurring" title="Recurring task">
                                🔄 {parsedPreview.recurring.frequency}
                            </span>
                        )}

                        {getPreviewLabels().map(label => (
                            <span
                                key={label.id}
                                className="preview-tag"
                                style={{ background: `${label.color}20`, color: label.color }}
                            >
                                {label.name}
                                {label.isNew && <span className="new-label-indicator"> ✨</span>}
                            </span>
                        ))}
                    </div>
                )}
            </form>

            {/* Help text */}
            <div className="quick-add-help">
                <span>💡 Tips:</span>
                <code>today</code><code>26 jan</code><code>@3pm</code>
                <code>every day</code><code>weekly</code>
                <code>p1</code><code>#label</code>
            </div>
        </div>
    );
};

export default QuickAdd;
