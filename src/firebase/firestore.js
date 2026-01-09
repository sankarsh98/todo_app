// Firestore Database Operations for Tasks
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    writeBatch
} from 'firebase/firestore';
import { db } from './config';

const TASKS_COLLECTION = 'tasks';
const LABELS_COLLECTION = 'labels';

// ============ TASK OPERATIONS ============

/**
 * Subscribe to user's tasks in real-time
 * @param {string} userId - User's Firebase UID
 * @param {Function} callback - Callback with tasks array
 * @returns {Function} Unsubscribe function
 */
export const subscribeTasks = (userId, callback) => {
    const q = query(
        collection(db, TASKS_COLLECTION),
        where('userId', '==', userId),
        orderBy('order', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
        const tasks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            dueDate: doc.data().dueDate?.toDate() || null,
            createdAt: doc.data().createdAt?.toDate() || null,
            updatedAt: doc.data().updatedAt?.toDate() || null,
        }));
        callback(tasks);
    }, (error) => {
        console.error('Error subscribing to tasks:', error);
        callback([]);
    });
};

/**
 * Create a new task
 * @param {string} userId - User's Firebase UID
 * @param {Object} taskData - Task data
 * @returns {Promise<string>} New task ID
 */
export const createTask = async (userId, taskData) => {
    try {
        const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
            userId,
            title: taskData.title,
            description: taskData.description || '',
            completed: false,
            priority: taskData.priority || 4,
            dueDate: taskData.dueDate || null,
            recurring: taskData.recurring || null,
            hasReminder: taskData.hasReminder || false,
            labels: taskData.labels || [],
            subtasks: taskData.subtasks || [],
            inMyDay: taskData.inMyDay || false,
            order: taskData.order || Date.now(),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
};

/**
 * Update an existing task
 * @param {string} taskId - Task ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateTask = async (taskId, updates) => {
    try {
        const taskRef = doc(db, TASKS_COLLECTION, taskId);
        await updateDoc(taskRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
};

/**
 * Toggle task completion status
 * @param {string} taskId - Task ID
 * @param {boolean} completed - New completion status
 * @returns {Promise<void>}
 */
export const toggleTaskComplete = async (taskId, completed) => {
    return updateTask(taskId, { completed });
};

/**
 * Delete a task
 * @param {string} taskId - Task ID
 * @returns {Promise<void>}
 */
export const deleteTask = async (taskId) => {
    try {
        const taskRef = doc(db, TASKS_COLLECTION, taskId);
        await deleteDoc(taskRef);
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
};

/**
 * Reorder tasks (batch update)
 * @param {Array<{id: string, order: number}>} taskOrders - Array of task IDs with new orders
 * @returns {Promise<void>}
 */
export const reorderTasks = async (taskOrders) => {
    try {
        const batch = writeBatch(db);

        taskOrders.forEach(({ id, order }) => {
            const taskRef = doc(db, TASKS_COLLECTION, id);
            batch.update(taskRef, { order, updatedAt: serverTimestamp() });
        });

        await batch.commit();
    } catch (error) {
        console.error('Error reordering tasks:', error);
        throw error;
    }
};

// ============ LABEL OPERATIONS ============

/**
 * Subscribe to user's labels in real-time
 * @param {string} userId - User's Firebase UID
 * @param {Function} callback - Callback with labels array
 * @returns {Function} Unsubscribe function
 */
export const subscribeLabels = (userId, callback) => {
    const q = query(
        collection(db, LABELS_COLLECTION),
        where('userId', '==', userId),
        orderBy('name', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
        const labels = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(labels);
    }, (error) => {
        console.error('Error subscribing to labels:', error);
        callback([]);
    });
};

/**
 * Create a new label
 * @param {string} userId - User's Firebase UID
 * @param {Object} labelData - Label data
 * @returns {Promise<string>} New label ID
 */
export const createLabel = async (userId, labelData) => {
    try {
        const docRef = await addDoc(collection(db, LABELS_COLLECTION), {
            userId,
            name: labelData.name,
            color: labelData.color || '#6366f1',
        });
        return docRef.id;
    } catch (error) {
        console.error('Error creating label:', error);
        throw error;
    }
};

/**
 * Update a label
 * @param {string} labelId - Label ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateLabel = async (labelId, updates) => {
    try {
        const labelRef = doc(db, LABELS_COLLECTION, labelId);
        await updateDoc(labelRef, updates);
    } catch (error) {
        console.error('Error updating label:', error);
        throw error;
    }
};

/**
 * Delete a label
 * @param {string} labelId - Label ID
 * @returns {Promise<void>}
 */
export const deleteLabel = async (labelId) => {
    try {
        const labelRef = doc(db, LABELS_COLLECTION, labelId);
        await deleteDoc(labelRef);
    } catch (error) {
        console.error('Error deleting label:', error);
        throw error;
    }
};
