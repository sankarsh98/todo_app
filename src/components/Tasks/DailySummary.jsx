import { useState, useEffect } from 'react';
import { requestGmailPermissions } from '../../firebase/auth';
import { fetchTodayEmails } from '../../services/gmailService';
import { generateSmartSummary } from '../../services/aiService';
import './DailySummary.css';

const DailySummary = ({ tasks }) => {
    const [enabled, setEnabled] = useState(() => {
        return localStorage.getItem('dailySummaryEnabled') === 'true';
    });
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleEnable = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // 1. Get permissions & token
            const token = await requestGmailPermissions();
            
            // 2. Fetch data
            const emails = await fetchTodayEmails(token);
            
            // 3. Generate Summary
            const generatedSummary = await generateSmartSummary(emails, tasks);
            
            setSummary(generatedSummary);
            setEnabled(true);
            localStorage.setItem('dailySummaryEnabled', 'true');
            
        } catch (err) {
            console.error(err);
            setError('Failed to generate summary. Please ensure permissions are granted.');
            // If permission denied, maybe disable
            if (err.code === 'auth/popup-closed-by-user') {
                setEnabled(false);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        handleEnable();
    };

    // Auto-refresh if enabled on mount
    useEffect(() => {
        if (enabled && !summary && !loading) {
            // We need a token. Since we can't silently get a new Gmail scope token 
            // without user interaction easily if it expired, we might need a button if it fails.
            // For now, let's try to run it. If it fails due to auth, we show a "Refresh" button.
            // Actually, best UX for "on load" with sensitive scopes is tricky. 
            // We'll show the "Ready to summarize" state or just the last summary?
            // Let's just ask user to "Refresh Daily Briefing" to confirm intent and get token.
        }
    }, [enabled]);

    if (!enabled) {
        return (
            <div className="enable-summary-card">
                <div className="enable-summary-text">
                    <span className="enable-summary-title">Get your Daily Briefing</span>
                    <span className="enable-summary-desc">Connect Gmail to see a summary of your day</span>
                </div>
                <button 
                    className="btn-summary-action"
                    onClick={handleEnable}
                    disabled={loading}
                >
                    {loading ? 'Connecting...' : 'Enable'}
                </button>
            </div>
        );
    }

    return (
        <div className="daily-summary-container">
            <div className="daily-summary-header">
                <div className="daily-summary-title">
                    <span className="summary-icon">✨</span>
                    Daily Briefing
                </div>
                <button 
                    className="btn-summary-action" 
                    style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                    onClick={handleRefresh}
                    disabled={loading}
                >
                    {loading ? 'Thinking...' : 'Refresh'}
                </button>
            </div>
            
            {error && (
                <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    {error}
                </div>
            )}

            <div className="summary-content">
                {summary ? (
                    summary
                ) : (
                    <div className="summary-loading">
                        {loading ? 'Analyzing your schedule and inbox...' : 'Ready to generate your daily briefing.'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailySummary;
