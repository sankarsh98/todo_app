// Calendar View Component - Monthly calendar with task planning
import { useState, useMemo } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    addMonths,
    subMonths,
    isSameMonth,
    isSameDay,
    isToday
} from 'date-fns';
import { useTasks } from '../context/TaskContext';
import TaskModal from '../components/Tasks/TaskModal';
import QuickAdd from '../components/Tasks/QuickAdd';
import './Calendar.css';

const Calendar = () => {
    const { tasks } = useTasks();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [quickAddDate, setQuickAddDate] = useState(null);

    // Get tasks grouped by date
    const tasksByDate = useMemo(() => {
        const grouped = {};
        tasks.forEach(task => {
            if (task.dueDate && !task.completed) {
                const dateKey = format(new Date(task.dueDate), 'yyyy-MM-dd');
                if (!grouped[dateKey]) {
                    grouped[dateKey] = [];
                }
                grouped[dateKey].push(task);
            }
        });
        return grouped;
    }, [tasks]);

    // Generate calendar days
    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

        const days = [];
        let day = startDate;

        while (day <= endDate) {
            days.push(day);
            day = addDays(day, 1);
        }

        return days;
    }, [currentMonth]);

    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const handleToday = () => setCurrentMonth(new Date());

    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    const handleAddTask = (date) => {
        setQuickAddDate(date);
        setShowQuickAdd(true);
    };

    const getTasksForDate = (date) => {
        if (!date) return [];
        const dateKey = format(new Date(date), 'yyyy-MM-dd');
        return tasksByDate[dateKey] || [];
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 1: return 'var(--color-priority-1)';
            case 2: return 'var(--color-priority-2)';
            case 3: return 'var(--color-priority-3)';
            default: return 'var(--color-priority-4)';
        }
    };

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="calendar-view">
            <header className="calendar-header">
                <div className="calendar-title">
                    <h1>📅 Calendar</h1>
                    <p className="calendar-subtitle">Plan your tasks visually</p>
                </div>
            </header>

            {/* Month Navigation */}
            <div className="calendar-nav">
                <button className="nav-btn" onClick={handlePrevMonth}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
                <div className="month-display">
                    <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
                    <button className="today-btn" onClick={handleToday}>Today</button>
                </div>
                <button className="nav-btn" onClick={handleNextMonth}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="calendar-grid">
                {/* Week day headers */}
                {weekDays.map(day => (
                    <div key={day} className="calendar-weekday">{day}</div>
                ))}

                {/* Calendar days */}
                {calendarDays.map((day, index) => {
                    const dayTasks = getTasksForDate(day);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isTodayDate = isToday(day);

                    return (
                        <div
                            key={index}
                            className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isSelected ? 'selected' : ''} ${isTodayDate ? 'today' : ''}`}
                            onClick={() => handleDateClick(day)}
                        >
                            <div className="day-header">
                                <span className="day-number">{format(day, 'd')}</span>
                                {isCurrentMonth && (
                                    <button
                                        className="add-task-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddTask(day);
                                        }}
                                        title="Add task"
                                    >
                                        +
                                    </button>
                                )}
                            </div>
                            <div className="day-tasks">
                                {dayTasks.slice(0, 3).map(task => (
                                    <div
                                        key={task.id}
                                        className="calendar-task"
                                        style={{ borderLeftColor: getPriorityColor(task.priority) }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedTask(task);
                                        }}
                                        title={task.title}
                                    >
                                        <span className="task-title">{task.title}</span>
                                    </div>
                                ))}
                                {dayTasks.length > 3 && (
                                    <div className="more-tasks">+{dayTasks.length - 3} more</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Selected Date Panel */}
            {selectedDate && (
                <div className="selected-date-panel">
                    <div className="panel-header">
                        <h3>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</h3>
                        <button className="close-panel" onClick={() => setSelectedDate(null)}>×</button>
                    </div>
                    <div className="panel-tasks">
                        {getTasksForDate(selectedDate).length === 0 ? (
                            <div className="no-tasks">
                                <span>🎉</span>
                                <p>No tasks for this day</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleAddTask(selectedDate)}
                                >
                                    Add a task
                                </button>
                            </div>
                        ) : (
                            getTasksForDate(selectedDate).map(task => (
                                <div
                                    key={task.id}
                                    className="panel-task-item"
                                    onClick={() => setSelectedTask(task)}
                                >
                                    <div
                                        className="priority-dot"
                                        style={{ background: getPriorityColor(task.priority) }}
                                    />
                                    <span className="task-title">{task.title}</span>
                                    {task.labels?.length > 0 && (
                                        <span className="task-labels-count">{task.labels.length} labels</span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                    <button
                        className="add-task-panel-btn"
                        onClick={() => handleAddTask(selectedDate)}
                    >
                        + Add task for this day
                    </button>
                </div>
            )}

            {/* Task Detail Modal */}
            {selectedTask && (
                <TaskModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                />
            )}

            {/* Quick Add Modal */}
            {showQuickAdd && (
                <div className="quick-add-overlay" onClick={() => setShowQuickAdd(false)}>
                    <div className="quick-add-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add task for {quickAddDate && format(quickAddDate, 'MMM d, yyyy')}</h3>
                            <button onClick={() => setShowQuickAdd(false)}>×</button>
                        </div>
                        <QuickAdd
                            isOpen={true}
                            onClose={() => setShowQuickAdd(false)}
                            defaultDate={quickAddDate}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
