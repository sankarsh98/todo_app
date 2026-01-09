// All Tasks View with Label Filters
import { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import QuickAdd from '../components/Tasks/QuickAdd';
import TaskList from '../components/Tasks/TaskList';
import TaskModal from '../components/Tasks/TaskModal';
import './Views.css';

const AllTasks = () => {
    const { getTasksByFilter, labels } = useTasks();
    const [selectedTask, setSelectedTask] = useState(null);
    const [quickAddOpen, setQuickAddOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLabels, setSelectedLabels] = useState([]);

    let allTasks = getTasksByFilter('all');

    // Filter by search query
    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        allTasks = allTasks.filter(task =>
            task.title.toLowerCase().includes(query) ||
            task.description?.toLowerCase().includes(query)
        );
    }

    // Filter by selected labels
    if (selectedLabels.length > 0) {
        allTasks = allTasks.filter(task =>
            task.labels?.some(labelId => selectedLabels.includes(labelId))
        );
    }

    useEffect(() => {
        const handleOpenQuickAdd = () => setQuickAddOpen(true);
        window.addEventListener('openQuickAdd', handleOpenQuickAdd);
        return () => window.removeEventListener('openQuickAdd', handleOpenQuickAdd);
    }, []);

    const toggleLabel = (labelId) => {
        setSelectedLabels(prev =>
            prev.includes(labelId)
                ? prev.filter(id => id !== labelId)
                : [...prev, labelId]
        );
    };

    const clearFilters = () => {
        setSelectedLabels([]);
        setSearchQuery('');
    };

    return (
        <div className="view-container">
            <div className="view-header">
                <div className="view-header-content">
                    <h1 className="view-title">All Tasks</h1>
                    <p className="view-subtitle">{allTasks.length} active tasks</p>
                </div>
                <div className="view-header-icon all-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                </div>
            </div>

            {/* Search */}
            <div className="view-search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks..."
                    className="view-search-input"
                />
                {searchQuery && (
                    <button
                        className="view-search-clear"
                        onClick={() => setSearchQuery('')}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Label Filters */}
            {labels.length > 0 && (
                <div className="label-filters">
                    <span className="label-filters-title">Filter by label:</span>
                    <div className="label-filter-chips">
                        {labels.map(label => (
                            <button
                                key={label.id}
                                className={`label-filter-chip ${selectedLabels.includes(label.id) ? 'active' : ''}`}
                                onClick={() => toggleLabel(label.id)}
                                style={{
                                    '--label-color': label.color,
                                    background: selectedLabels.includes(label.id) ? `${label.color}20` : undefined,
                                    borderColor: selectedLabels.includes(label.id) ? label.color : undefined,
                                    color: selectedLabels.includes(label.id) ? label.color : undefined,
                                }}
                            >
                                <span className="label-chip-dot" style={{ background: label.color }} />
                                {label.name}
                            </button>
                        ))}
                        {(selectedLabels.length > 0 || searchQuery) && (
                            <button className="clear-filters-btn" onClick={clearFilters}>
                                Clear filters
                            </button>
                        )}
                    </div>
                </div>
            )}

            <QuickAdd
                isOpen={quickAddOpen}
                onClose={() => setQuickAddOpen(false)}
            />

            <TaskList
                tasks={allTasks}
                emptyMessage={searchQuery || selectedLabels.length > 0 ? "No matching tasks" : "No tasks yet"}
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

export default AllTasks;
