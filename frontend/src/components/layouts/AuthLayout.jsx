import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/layouts.css';

/**
 * AuthLayout - Wrapper for Login and Authentication pages
 * Features:
 * - Centered card UI with company branding
 * - Gradient background
 * - Logo and tagline
 * - Responsive design
 */
const AuthLayout = ({ children, title }) => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <div className="auth-layout">
            {/* Background gradient */}
            <div className="auth-bg-gradient"></div>

            {/* Main container */}
            <div className="auth-container">
                {/* Decorative shapes */}
                <div className="auth-shape auth-shape-1"></div>
                <div className="auth-shape auth-shape-2"></div>

                {/* Auth card */}
                <div className="auth-card">
                    {/* Header with logo */}
                    <div className="auth-header">
                        <button 
                            className="auth-logo-btn"
                            onClick={handleLogoClick}
                            type="button"
                        >
                            <span className="auth-logo-icon">🎓</span>
                            <span className="auth-logo-text">EduVillage</span>
                        </button>
                        <p className="auth-tagline">Empowering Rural Education</p>
                    </div>

                    {/* Title */}
                    {title && <h1 className="auth-title">{title}</h1>}

                    {/* Content (Login form, etc.) */}
                    <div className="auth-content">
                        {children}
                    </div>

                    {/* Footer links */}
                    <div className="auth-footer">
                        <p className="auth-footer-text">
                            © 2024 EduVillage. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
