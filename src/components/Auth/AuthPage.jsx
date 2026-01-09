// Premium Auth Landing Page with Google Sign-in
import { useState } from 'react';
import { signInWithGoogle } from '../../firebase/auth';
import './AuthPage.css';

const AuthPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            setError(null);
            await signInWithGoogle();
        } catch (err) {
            console.error('Sign in error:', err);
            setError('Failed to sign in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Background decorations */}
            <div className="auth-bg-decoration">
                <div className="auth-bg-blob auth-bg-blob-1"></div>
                <div className="auth-bg-blob auth-bg-blob-2"></div>
                <div className="auth-bg-blob auth-bg-blob-3"></div>
            </div>

            <div className="auth-container">
                {/* Left side - Hero */}
                <div className="auth-hero">
                    <div className="auth-hero-content">
                        <div className="auth-logo">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <rect width="48" height="48" rx="12" fill="url(#logo-gradient)" />
                                <path d="M14 24L20 30L34 16" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                <defs>
                                    <linearGradient id="logo-gradient" x1="0" y1="0" x2="48" y2="48">
                                        <stop stopColor="#6366f1" />
                                        <stop offset="1" stopColor="#8b5cf6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <span className="auth-logo-text">TaskFlow</span>
                        </div>

                        <h1 className="auth-title">
                            Organize your life,<br />
                            <span className="auth-title-gradient">one task at a time</span>
                        </h1>

                        <p className="auth-subtitle">
                            The smarter way to manage tasks. Natural language input,
                            real-time sync across all your devices, and a beautiful
                            interface that makes productivity feel effortless.
                        </p>

                        <div className="auth-features">
                            <div className="auth-feature">
                                <div className="auth-feature-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                    </svg>
                                </div>
                                <div className="auth-feature-text">
                                    <strong>Multi-device Sync</strong>
                                    <span>Access tasks from anywhere</span>
                                </div>
                            </div>

                            <div className="auth-feature">
                                <div className="auth-feature-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                        <line x1="12" y1="17" x2="12.01" y2="17" />
                                    </svg>
                                </div>
                                <div className="auth-feature-text">
                                    <strong>Natural Language</strong>
                                    <span>Type "meeting tomorrow 3pm"</span>
                                </div>
                            </div>

                            <div className="auth-feature">
                                <div className="auth-feature-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                </div>
                                <div className="auth-feature-text">
                                    <strong>Smart Lists</strong>
                                    <span>My Day, Upcoming, Important</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Sign in */}
                <div className="auth-form-container">
                    <div className="auth-form glass-card">
                        <h2 className="auth-form-title">Welcome Back</h2>
                        <p className="auth-form-subtitle">
                            Sign in to sync your tasks across all devices
                        </p>

                        {error && (
                            <div className="auth-error">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <button
                            className="auth-google-btn"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="auth-spinner"></div>
                            ) : (
                                <>
                                    <svg className="google-icon" viewBox="0 0 24 24" width="24" height="24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </>
                            )}
                        </button>

                        <div className="auth-divider">
                            <span>Secure sign-in powered by Firebase</span>
                        </div>

                        <p className="auth-terms">
                            By signing in, you agree to our{' '}
                            <a href="#terms">Terms of Service</a> and{' '}
                            <a href="#privacy">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
