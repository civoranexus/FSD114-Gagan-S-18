import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * StudentDashboard Component - Main student learning dashboard
 * 
 * Features:
 * - Welcome greeting section
 * - Summary stats (courses, contents, assignments, hours)
 * - Continue Learning section
 * - My Courses overview
 * - Certificates section
 */
function StudentDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Learner";
  
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    availableContents: 0,
    pendingAssignments: 0,
    hoursLearned: 0,
  });

  const [courses, setCourses] = useState([]);
  const [recentCourse, setRecentCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('access');
      if (!token) return;

      // Fetch student courses
      const coursesRes = await axios.get(
        'http://127.0.0.1:8000/api/courses/student/my-courses/',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourses(coursesRes.data);

      // Calculate stats
      let totalContents = 0;
      let totalAssignments = 0;
      
      // Fetch content count and assignments for each course
      for (const course of coursesRes.data) {
        try {
          const contentRes = await axios.get(
            `http://127.0.0.1:8000/api/courses/student/${course.id}/contents/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          totalContents += contentRes.data.contents?.length || 0;
          // Count assignments
          totalAssignments += contentRes.data.contents?.filter(c => c.content_type === 'assignment').length || 0;
        } catch (err) {
          console.warn(`Error fetching content for course ${course.id}:`, err);
        }
      }

      setStats({
        enrolledCourses: coursesRes.data.length,
        availableContents: totalContents,
        pendingAssignments: totalAssignments,
        hoursLearned: coursesRes.data.length * 5, // Placeholder calculation
      });

      // Set first course as recent
      if (coursesRes.data.length > 0) {
        setRecentCourse(coursesRes.data[0]);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Welcome Section */}
      <section style={styles.welcomeSection}>
        <div>
          <h1 style={styles.greeting}>Hi, {username}! 👋</h1>
          <p style={styles.subtitle}>Continue your learning journey today</p>
        </div>
        <button
          style={styles.ctaButton}
          onClick={() => navigate('/student/courses')}
        >
          Continue Learning →
        </button>
      </section>

      {/* Summary Cards */}
      <section style={styles.statsGrid}>
        <StatCard
          icon="📚"
          label="Enrolled Courses"
          value={stats.enrolledCourses}
          color="#1B9AAA"
        />
        <StatCard
          icon="📺"
          label="Available Contents"
          value={stats.availableContents}
          color="#16808D"
        />
        <StatCard
          icon="📝"
          label="Pending Assignments"
          value={stats.pendingAssignments}
          color="#F97316"
        />
        <StatCard
          icon="⏱️"
          label="Hours Learned"
          value={stats.hoursLearned}
          color="#22C55E"
        />
      </section>

      {/* Continue Learning Section */}
      {recentCourse && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Continue Learning</h2>
          <div style={styles.continueLearningCard}>
            <div style={styles.continueLearningContent}>
              <h3 style={styles.courseTitle}>{recentCourse.title}</h3>
              <p style={styles.courseInstructor}>with {recentCourse.instructor}</p>
              <div style={styles.progressContainer}>
                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: '35%' }}></div>
                </div>
                <span style={styles.progressText}>35% Complete</span>
              </div>
            </div>
            <button
              style={styles.resumeButton}
              onClick={() => navigate(`/student/courses/${recentCourse.id}`)}
            >
              Resume Course
            </button>
          </div>
        </section>
      )}

      {/* My Courses Section */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>My Courses ({courses.length})</h2>
          <button
            style={styles.viewAllLink}
            onClick={() => navigate('/student/courses')}
          >
            View All →
          </button>
        </div>

        {loading ? (
          <p style={styles.loading}>Loading courses...</p>
        ) : courses.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📚</div>
            <p style={styles.emptyText}>No courses enrolled yet</p>
            <p style={styles.emptySubtext}>Browse the catalog to find courses that interest you</p>
          </div>
        ) : (
          <div style={styles.courseGrid}>
            {courses.slice(0, 3).map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onViewCourse={() => navigate(`/student/courses/${course.id}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Certificates Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Certificates</h2>
        <div style={styles.certificatesContainer}>
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🏆</div>
            <p style={styles.emptyText}>No certificates yet</p>
            <p style={styles.emptySubtext}>Complete courses to earn certificates</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Stat Card Component
const StatCard = ({ icon, label, value, color }) => (
  <div style={{
    ...styles.statCard,
    borderLeftColor: color
  }}>
    <div style={styles.statIcon}>{icon}</div>
    <div style={styles.statContent}>
      <p style={styles.statLabel}>{label}</p>
      <p style={{...styles.statValue, color}}>{value}</p>
    </div>
  </div>
);

// Course Card Component
const CourseCard = ({ course, onViewCourse }) => (
  <div style={styles.courseCard}>
    <div style={styles.courseCardHeader}>
      <h3 style={styles.courseCardTitle}>{course.title}</h3>
      <div style={styles.courseCardInstructor}>{course.instructor}</div>
    </div>
    <div style={styles.courseCardProgress}>
      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: '45%' }}></div>
      </div>
      <span style={styles.progressPercentage}>45%</span>
    </div>
    <div style={styles.courseCardActions}>
      <button
        style={{...styles.cardButton, ...styles.secondaryButton}}
        onClick={onViewCourse}
      >
        View Course
      </button>
      <button
        style={{...styles.cardButton, ...styles.primaryButton}}
        onClick={onViewCourse}
      >
        Continue
      </button>
    </div>
  </div>
);

// Styles
const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#F4F7FA',
    minHeight: '100vh',
  },
  
  // Welcome Section
  welcomeSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '2px solid rgba(27, 154, 170, 0.1)',
  },
  greeting: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#142C52',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#666',
    margin: '0',
  },
  ctaButton: {
    backgroundColor: '#1B9AAA',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    whiteSpace: 'nowrap',
  },

  // Stats Grid
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    borderLeft: '4px solid',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  statIcon: {
    fontSize: '2rem',
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    margin: '0',
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: '500',
  },
  statValue: {
    margin: '0.5rem 0 0 0',
    fontSize: '1.8rem',
    fontWeight: 'bold',
  },

  // Section
  section: {
    marginBottom: '2rem',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#142C52',
    margin: '0',
  },
  viewAllLink: {
    backgroundColor: 'transparent',
    color: '#1B9AAA',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: '0.5rem 1rem',
  },

  // Continue Learning
  continueLearningCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2rem',
    backgroundColor: 'linear-gradient(135deg, #1B9AAA 0%, #16808D 100%)',
    borderRadius: '8px',
    color: 'white',
  },
  continueLearningContent: {
    flex: 1,
  },
  courseTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: '0 0 0.5rem 0',
  },
  courseInstructor: {
    margin: '0 0 1rem 0',
    opacity: 0.9,
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  progressBar: {
    flex: 1,
    height: '8px',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: '4px',
  },
  progressText: {
    whiteSpace: 'nowrap',
    fontSize: '0.9rem',
  },
  resumeButton: {
    backgroundColor: 'white',
    color: '#1B9AAA',
    border: 'none',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },

  // Course Grid
  courseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  courseCard: {
    padding: '1.5rem',
    backgroundColor: '#F8FAFB',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    transition: 'box-shadow 0.2s, transform 0.2s',
  },
  courseCardHeader: {
    marginBottom: '1rem',
  },
  courseCardTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    margin: '0 0 0.5rem 0',
    color: '#142C52',
  },
  courseCardInstructor: {
    fontSize: '0.85rem',
    color: '#666',
  },
  courseCardProgress: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  progressPercentage: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: '#1B9AAA',
    whiteSpace: 'nowrap',
  },
  courseCardActions: {
    display: 'flex',
    gap: '0.75rem',
  },
  cardButton: {
    flex: 1,
    padding: '0.6rem 1rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  primaryButton: {
    backgroundColor: '#1B9AAA',
    color: 'white',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    border: '1px solid #1B9AAA',
    color: '#1B9AAA',
  },

  // Empty State
  emptyState: {
    textAlign: 'center',
    padding: '3rem 2rem',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  emptyText: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#142C52',
    margin: '0 0 0.5rem 0',
  },
  emptySubtext: {
    color: '#666',
    margin: '0',
  },

  // Certificates
  certificatesContainer: {
    minHeight: '200px',
    display: 'flex',
    alignItems: 'center',
  },

  // Loading
  loading: {
    textAlign: 'center',
    color: '#666',
    padding: '2rem',
  },
};

export default StudentDashboard;