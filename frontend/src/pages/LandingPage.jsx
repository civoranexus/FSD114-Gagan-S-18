import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/landing.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('access');
    const userRole = localStorage.getItem('role');

    const handleExplore = () => {
        if (isAuthenticated) {
            if (userRole === 'teacher') {
                navigate('/teacher/courses');
            } else if (userRole === 'student') {
                navigate('/student/courses');
            } else {
                navigate('/admin/dashboard');
            }
        } else {
            navigate('/login');
        }
    };

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div className="landing-page">
            {/* Navigation Bar */}
            <nav className="landing-navbar">
                <div className="navbar-container">
                    <div className="navbar-logo">
                        <span className="logo-icon">🎓</span>
                        <span className="logo-text">EduVillage</span>
                    </div>
                    <ul className="navbar-menu">
                        <li><a href="#hero" className="nav-link">Home</a></li>
                        <li><a href="#features" className="nav-link">Features</a></li>
                        <li><a href="#about" className="nav-link">About</a></li>
                        <li><a href="#contact" className="nav-link">Contact</a></li>
                        <li>
                            <button 
                                className="nav-login-btn"
                                onClick={handleLogin}
                            >
                                Login/Sign Up
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="hero" className="hero-section">
                <div className="hero-gradient-bg"></div>
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-headline">
                            Empowering Rural Education Digitally
                        </h1>
                        <p className="hero-subheading">
                            EduVillage connects students, teachers, and administrators 
                            to deliver quality education in underserved rural areas.
                        </p>
                        <div className="hero-cta-buttons">
                            <button 
                                className="cta-btn cta-primary"
                                onClick={handleExplore}
                            >
                                {isAuthenticated ? 'Go to Dashboard' : 'Explore Courses'}
                            </button>
                            {!isAuthenticated && (
                                <button 
                                    className="cta-btn cta-secondary"
                                    onClick={handleLogin}
                                >
                                    Get Started
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="visual-element element-1"></div>
                        <div className="visual-element element-2"></div>
                        <div className="visual-element element-3"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="section-container">
                    <h2 className="section-title">Why Choose EduVillage?</h2>
                    <div className="features-grid">
                        {/* Feature 1 */}
                        <div className="feature-card">
                            <div className="feature-icon">📚</div>
                            <h3 className="feature-title">Comprehensive Courses</h3>
                            <p className="feature-desc">
                                Access a wide range of courses designed for rural students 
                                with flexible learning paths.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="feature-card">
                            <div className="feature-icon">👨‍🏫</div>
                            <h3 className="feature-title">Expert Teachers</h3>
                            <p className="feature-desc">
                                Learn from experienced educators who are passionate about 
                                making education accessible.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="feature-card">
                            <div className="feature-icon">📊</div>
                            <h3 className="feature-title">Progress Tracking</h3>
                            <p className="feature-desc">
                                Monitor learning progress with detailed analytics and 
                                personalized feedback.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="feature-card">
                            <div className="feature-icon">🌍</div>
                            <h3 className="feature-title">Community Focused</h3>
                            <p className="feature-desc">
                                Join a global community of learners and educators committed 
                                to closing the education gap.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="about-section">
                <div className="section-container">
                    <div className="about-content">
                        <div className="about-text">
                            <h2 className="section-title">Our Mission</h2>
                            <p className="about-para">
                                EduVillage is dedicated to bridging the digital divide in education. 
                                We believe quality education should be accessible to everyone, 
                                regardless of geographic location or economic status.
                            </p>
                            <p className="about-para">
                                Through innovative technology and community partnerships, 
                                we're creating opportunities for students in rural areas to 
                                learn, grow, and succeed.
                            </p>
                        </div>
                        <div className="about-stats">
                            <div className="stat-item">
                                <span className="stat-number">1000+</span>
                                <span className="stat-label">Students</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">50+</span>
                                <span className="stat-label">Teachers</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">100+</span>
                                <span className="stat-label">Courses</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-container">
                    <p>&copy; 2024 EduVillage. Empowering education for all.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
