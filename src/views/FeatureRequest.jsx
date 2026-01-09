// Feature Request / Feedback Component
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import './FeatureRequest.css';

const FeatureRequest = () => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('feature'); // feature, bug, improvement
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            await addDoc(collection(db, 'feature_requests'), {
                userId: user.uid,
                userEmail: user.email,
                title: title.trim(),
                description: description.trim(),
                type,
                status: 'new',
                createdAt: serverTimestamp()
            });

            setSubmitted(true);
            setTitle('');
            setDescription('');
            setType('feature');
        } catch (err) {
            console.error('Error submitting feedback:', err);
            setError('Failed to submit feedback. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="feature-request-view">
                <div className="success-container">
                    <div className="success-icon">🎉</div>
                    <h2>Thank You!</h2>
                    <p>Your feedback has been submitted successfully.</p>
                    <p className="sub-text">We read every request to make TaskFlow better for you.</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => setSubmitted(false)}
                    >
                        Submit Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="feature-request-view">
            <header className="page-header">
                <div className="header-content">
                    <h1>💡 Feature Request</h1>
                    <p>Have an idea or found a bug? Let us know!</p>
                </div>
            </header>

            <form className="feedback-form" onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="type">Request Type</label>
                    <div className="type-selector">
                        <button
                            type="button"
                            className={`type-btn ${type === 'feature' ? 'active' : ''}`}
                            onClick={() => setType('feature')}
                        >
                            ✨ Feature
                        </button>
                        <button
                            type="button"
                            className={`type-btn ${type === 'improvement' ? 'active' : ''}`}
                            onClick={() => setType('improvement')}
                        >
                            🚀 Improvement
                        </button>
                        <button
                            type="button"
                            className={`type-btn ${type === 'bug' ? 'active' : ''}`}
                            onClick={() => setType('bug')}
                        >
                            🐛 Bug Report
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Add dark mode for calendar"
                        required
                        maxLength={100}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Tell us more about your idea or what happened..."
                        required
                        rows={6}
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary submit-btn"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </form>

            <div className="info-card">
                <h3>📢 Development Roadmap</h3>
                <ul>
                    <li className="done">✅ Calendar View</li>
                    <li className="done">✅ Mascots & Themes</li>
                    <li className="in-progress">🚧 Mobile App (React Native)</li>
                    <li className="planned">📅 Team Collaboration</li>
                </ul>
            </div>
        </div>
    );
};

export default FeatureRequest;
