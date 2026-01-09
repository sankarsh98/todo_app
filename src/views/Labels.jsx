// Labels Management View
import { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import './Views.css';
import './Labels.css';

const Labels = () => {
    const { labels, createLabel, updateLabel, deleteLabel } = useTasks();
    const [newLabelName, setNewLabelName] = useState('');
    const [newLabelColor, setNewLabelColor] = useState('#6366f1');
    const [editingLabel, setEditingLabel] = useState(null);

    const predefinedColors = [
        '#ef4444', '#f97316', '#f59e0b', '#eab308',
        '#84cc16', '#10b981', '#14b8a6', '#06b6d4',
        '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
        '#d946ef', '#ec4899', '#f43f5e', '#64748b'
    ];

    const handleCreateLabel = async (e) => {
        e.preventDefault();
        if (!newLabelName.trim()) return;

        await createLabel({
            name: newLabelName.trim(),
            color: newLabelColor
        });

        setNewLabelName('');
        setNewLabelColor('#6366f1');
    };

    const handleUpdateLabel = async (labelId, updates) => {
        await updateLabel(labelId, updates);
        setEditingLabel(null);
    };

    const handleDeleteLabel = async (labelId) => {
        if (window.confirm('Delete this label? Tasks with this label will not be deleted.')) {
            await deleteLabel(labelId);
        }
    };

    return (
        <div className="view-container">
            <div className="view-header">
                <div className="view-header-content">
                    <h1 className="view-title">Labels</h1>
                    <p className="view-subtitle">Organize your tasks with labels</p>
                </div>
                <div className="view-header-icon" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', color: '#d97706' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                </div>
            </div>

            {/* Create New Label */}
            <div className="label-create-card card">
                <h3>Create New Label</h3>
                <form onSubmit={handleCreateLabel} className="label-create-form">
                    <div className="label-form-row">
                        <input
                            type="text"
                            value={newLabelName}
                            onChange={(e) => setNewLabelName(e.target.value)}
                            placeholder="Label name (e.g., Shopping, Work, Personal)"
                            className="label-name-input"
                            maxLength={30}
                        />
                        <div className="label-color-picker">
                            <input
                                type="color"
                                value={newLabelColor}
                                onChange={(e) => setNewLabelColor(e.target.value)}
                                className="label-color-input"
                            />
                            <span className="label-color-preview" style={{ background: newLabelColor }} />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={!newLabelName.trim()}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Create
                        </button>
                    </div>

                    {/* Predefined Colors */}
                    <div className="predefined-colors">
                        {predefinedColors.map(color => (
                            <button
                                key={color}
                                type="button"
                                className={`color-swatch ${newLabelColor === color ? 'selected' : ''}`}
                                style={{ background: color }}
                                onClick={() => setNewLabelColor(color)}
                                title={color}
                            />
                        ))}
                    </div>
                </form>
            </div>

            {/* Labels List */}
            <div className="labels-list">
                {labels.length === 0 ? (
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
                        </svg>
                        <h3>No labels yet</h3>
                        <p>Create labels to organize your tasks by category</p>
                    </div>
                ) : (
                    labels.map(label => (
                        <div key={label.id} className="label-item card">
                            {editingLabel === label.id ? (
                                <div className="label-edit-form">
                                    <input
                                        type="text"
                                        defaultValue={label.name}
                                        onBlur={(e) => {
                                            if (e.target.value.trim() && e.target.value !== label.name) {
                                                handleUpdateLabel(label.id, { name: e.target.value.trim() });
                                            } else {
                                                setEditingLabel(null);
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.target.blur();
                                            } else if (e.key === 'Escape') {
                                                setEditingLabel(null);
                                            }
                                        }}
                                        autoFocus
                                        className="label-edit-input"
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className="label-info">
                                        <span
                                            className="label-color-dot"
                                            style={{ background: label.color }}
                                        />
                                        <span className="label-name">{label.name}</span>
                                    </div>

                                    <div className="label-actions">
                                        <div className="label-color-picker-inline">
                                            <input
                                                type="color"
                                                value={label.color}
                                                onChange={(e) => handleUpdateLabel(label.id, { color: e.target.value })}
                                                className="label-color-input-small"
                                                title="Change color"
                                            />
                                        </div>

                                        <button
                                            className="icon-btn"
                                            onClick={() => setEditingLabel(label.id)}
                                            title="Rename label"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </button>

                                        <button
                                            className="icon-btn delete-btn"
                                            onClick={() => handleDeleteLabel(label.id)}
                                            title="Delete label"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Usage Tip */}
            {labels.length > 0 && (
                <div className="label-tip">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <div>
                        <strong>Quick Tip:</strong> Use labels when creating tasks with the <code>#</code> symbol.
                        For example: <code>"Buy groceries #shopping"</code>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Labels;
