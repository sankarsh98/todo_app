// Task Context Provider - Real-time sync with Firestore
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
    subscribeTasks,
    subscribeLabels,
    createTask as createTaskDB,
    updateTask as updateTaskDB,
    deleteTask as deleteTaskDB,
    toggleTaskComplete as toggleCompleteDB,
    reorderTasks as reorderTasksDB,
    createLabel as createLabelDB,
    updateLabel as updateLabelDB,
    deleteLabel as deleteLabelDB,
} from '../firebase/firestore';

const TaskContext = createContext(null);

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
};

export const TaskProvider = ({ children }) => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [labels, setLabels] = useState([]);
    const [loading, setLoading] = useState(true);

    // Subscribe to tasks when user is authenticated
    useEffect(() => {
        if (!user) {
            setTasks([]);
            setLabels([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        const unsubscribeTasks = subscribeTasks(user.uid, (fetchedTasks) => {
            setTasks(fetchedTasks);
            setLoading(false);
        });

        const unsubscribeLabels = subscribeLabels(user.uid, (fetchedLabels) => {
            setLabels(fetchedLabels);
        });

        return () => {
            unsubscribeTasks();
            unsubscribeLabels();
        };
    }, [user]);

    // Task operations
    const createTask = useCallback(async (taskData) => {
        if (!user) return;
        return createTaskDB(user.uid, taskData);
    }, [user]);

    const updateTask = useCallback(async (taskId, updates) => {
        return updateTaskDB(taskId, updates);
    }, []);

    const deleteTask = useCallback(async (taskId) => {
        return deleteTaskDB(taskId);
    }, []);

    const toggleTaskComplete = useCallback(async (taskId, completed) => {
        // Find the task to check if it's recurring
        const task = tasks.find(t => t.id === taskId);

        if (completed && task?.recurring) {
            // If completing a recurring task, create the next occurrence
            const recurring = task.recurring;
            let nextDueDate = task.dueDate ? new Date(task.dueDate) : new Date();

            // Calculate next due date based on frequency
            switch (recurring.frequency) {
                case 'daily':
                    nextDueDate.setDate(nextDueDate.getDate() + (recurring.interval || 1));
                    break;
                case 'weekly':
                    nextDueDate.setDate(nextDueDate.getDate() + 7 * (recurring.interval || 1));
                    break;
                case 'monthly':
                    nextDueDate.setMonth(nextDueDate.getMonth() + (recurring.interval || 1));
                    break;
                case 'yearly':
                    nextDueDate.setFullYear(nextDueDate.getFullYear() + (recurring.interval || 1));
                    break;
                case 'weekday':
                    // Skip to next weekday
                    do {
                        nextDueDate.setDate(nextDueDate.getDate() + 1);
                    } while (nextDueDate.getDay() === 0 || nextDueDate.getDay() === 6);
                    break;
                case 'weekend':
                    // Skip to next weekend day
                    do {
                        nextDueDate.setDate(nextDueDate.getDate() + 1);
                    } while (nextDueDate.getDay() !== 0 && nextDueDate.getDay() !== 6);
                    break;
                default:
                    nextDueDate.setDate(nextDueDate.getDate() + 1);
            }

            // Create the next occurrence
            await createTask({
                title: task.title,
                description: task.description,
                priority: task.priority,
                dueDate: nextDueDate,
                recurring: task.recurring,
                labels: task.labels,
                inMyDay: false,
                hasReminder: task.hasReminder,
            });
        }

        return toggleCompleteDB(taskId, completed);
    }, [tasks, createTask]);

    const reorderTasks = useCallback(async (taskOrders) => {
        return reorderTasksDB(taskOrders);
    }, []);

    // Label operations
    const createLabel = useCallback(async (labelData) => {
        if (!user) return;
        return createLabelDB(user.uid, labelData);
    }, [user]);

    const updateLabel = useCallback(async (labelId, updates) => {
        return updateLabelDB(labelId, updates);
    }, []);

    const deleteLabel = useCallback(async (labelId) => {
        return deleteLabelDB(labelId);
    }, []);

    // Computed task lists
    const getTasksByFilter = useCallback((filter) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        switch (filter) {
            case 'myday':
                return tasks.filter(t => t.inMyDay && !t.completed);
            case 'important':
                return tasks.filter(t => t.priority === 1 && !t.completed);
            case 'upcoming':
                return tasks.filter(t => t.dueDate && !t.completed).sort((a, b) =>
                    new Date(a.dueDate) - new Date(b.dueDate)
                );
            case 'completed':
                return tasks.filter(t => t.completed);
            case 'today':
                return tasks.filter(t => {
                    if (!t.dueDate || t.completed) return false;
                    const dueDate = new Date(t.dueDate);
                    return dueDate >= today && dueDate < tomorrow;
                });
            case 'all':
            default:
                return tasks.filter(t => !t.completed);
        }
    }, [tasks]);

    const getTasksByLabel = useCallback((labelId) => {
        return tasks.filter(t => t.labels.includes(labelId) && !t.completed);
    }, [tasks]);

    const getOverdueTasks = useCallback(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return tasks.filter(t => {
            if (!t.dueDate || t.completed) return false;
            return new Date(t.dueDate) < today;
        });
    }, [tasks]);

    const value = {
        tasks,
        labels,
        loading,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        reorderTasks,
        createLabel,
        updateLabel,
        deleteLabel,
        getTasksByFilter,
        getTasksByLabel,
        getOverdueTasks,
    };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
};

export default TaskContext;
