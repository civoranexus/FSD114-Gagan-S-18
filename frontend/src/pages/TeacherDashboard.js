import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard-content.css";

/**
 * TeacherDashboard Component
 * Renders the main dashboard content for teachers
 * 
 * Note: This component is wrapped by DashboardLayout in App.js
 * The layout handles navbar, sidebar, and page structure
 */
function TeacherDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    activeAssignments: 0,
  });

  useEffect(() => {
    console.log("DEBUG TeacherDashboard - Component mounted");
    // TODO: Fetch real stats from backend API
    // For now, using placeholder data
  }, []);

  const quickActions = [
    {
      id: 'courses',
      title: 'My Courses',
      description: 'View and manage your courses',
      icon: '📚',
      action: () => navigate('/teacher/courses'),
      color: 'action-blue'
    },
    {
      id: 'add-content',
      title: 'Add Content',
      description: 'Upload course materials',
      icon: '➕',
      action: () => navigate('/teacher/add-content'),
      color: 'action-teal'
    },
    {
      id: 'student-progress',
      title: 'Student Progress',
      description: 'Track student learning',
      icon: '📊',
      action: () => navigate('/teacher/courses'),
      color: 'action-purple'
    },
  ];

  return (
    <div className="dashboard-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Teacher Dashboard</h1>
        <p className="page-subtitle">Manage your courses and track student progress</p>
      </div>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalCourses}</div>
            <div className="stat-label">Courses</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalStudents}</div>
            <div className="stat-label">Students</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-value">{stats.activeAssignments}</div>
            <div className="stat-label">Active</div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="dashboard-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="action-cards">
          {quickActions.map(action => (
            <button
              key={action.id}
              className={`action-card ${action.color}`}
              onClick={action.action}
            >
              <div className="card-icon">{action.icon}</div>
              <div className="card-title">{action.title}</div>
              <div className="card-description">{action.description}</div>
              <div className="card-arrow">→</div>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="dashboard-section">
        <h2 className="section-title">Recent Activity</h2>
        <div className="activity-placeholder">
          <p>No recent activity</p>
        </div>
      </section>
    </div>
  );
}

export default TeacherDashboard;