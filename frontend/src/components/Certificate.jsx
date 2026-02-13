/**
 * Certificate Component
 * 
 * Clean, minimal course completion certificate
 * Matches EdTech design (Coursera/Udemy style)
 * Print-ready A4 landscape format
 * 
 * Usage:
 * <Certificate
 *   studentName="John Doe"
 *   courseName="Advanced React Development"
 *   instructorName="Jane Smith"
 *   issueDate="February 3, 2026"
 *   certificateId="CERT-2026-000123"
 * />
 */

import React from 'react';
import logoUrl from '../../../resources/branding/logos/short_logo.png';

const Certificate = ({ 
  studentName = "Student Name", 
  courseName = "Course Name", 
  instructorName = "Instructor Name",
  issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  certificateId = "CERT-XXXX-XXXXXX"
}) => {
  const styles = {
    container: {
      // A4 landscape: 297mm × 210mm = 1123px × 794px at 96dpi
      width: '100%',
      maxWidth: '1123px',
      height: '794px',
      margin: '0 auto',
      padding: 0,
      backgroundColor: '#FFFFFF',
      color: '#071426',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      position: 'relative',
      boxSizing: 'border-box',
      overflow: 'hidden',
      // Print styles
      boxShadow: '0 0 0 1px #E5E7EB',
    },

    // Header section with logo
    header: {
      display: 'flex',
      alignItems: 'center',
      padding: '40px 60px 0 60px',
      borderBottom: `2px solid #1B9AAA`,
      marginBottom: '40px',
    },

    logo: {
      height: '50px',
      width: 'auto',
      marginRight: 'auto',
    },

    // Main content area
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '0 60px',
    },

    // Certificate title
    title: {
      fontSize: '32px',
      fontWeight: '300',
      letterSpacing: '0.5px',
      color: '#142C52',
      margin: '0 0 60px 0',
      textTransform: 'uppercase',
      fontFamily: 'Georgia, serif',
    },

    // "This is to certify" subtitle
    subtitle: {
      fontSize: '14px',
      color: '#6B7280',
      letterSpacing: '0.3px',
      margin: '0 0 20px 0',
      fontWeight: '400',
    },

    // Student name (main focus)
    studentName: {
      fontSize: '48px',
      fontWeight: '600',
      color: '#1B9AAA',
      margin: '0 0 30px 0',
      letterSpacing: '0.2px',
      wordBreak: 'break-word',
    },

    // "has successfully completed" text
    completionText: {
      fontSize: '14px',
      color: '#6B7280',
      margin: '0 0 20px 0',
      letterSpacing: '0.3px',
    },

    // Course name
    courseName: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#071426',
      margin: '0 0 40px 0',
      letterSpacing: '0.2px',
      wordBreak: 'break-word',
      maxWidth: '800px',
    },

    // Footer section
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      padding: '0 60px 40px 60px',
      borderTop: `1px solid #E5E7EB`,
    },

    // Instructor and date info
    footerLeft: {
      textAlign: 'left',
      flex: 1,
    },

    instructorLabel: {
      fontSize: '10px',
      color: '#9CA3AF',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      margin: '0 0 4px 0',
    },

    instructorName: {
      fontSize: '13px',
      color: '#071426',
      fontWeight: '500',
      margin: '0 0 12px 0',
    },

    dateLabel: {
      fontSize: '10px',
      color: '#9CA3AF',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      margin: '0 0 4px 0',
    },

    date: {
      fontSize: '13px',
      color: '#071426',
      fontWeight: '500',
    },

    // Certificate ID
    footerRight: {
      textAlign: 'right',
      flex: 1,
      paddingLeft: '20px',
    },

    idLabel: {
      fontSize: '10px',
      color: '#9CA3AF',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      margin: '0 0 4px 0',
    },

    id: {
      fontSize: '13px',
      color: '#071426',
      fontFamily: 'Monaco, monospace',
      fontWeight: '500',
      letterSpacing: '0.5px',
    },
  };

  return (
    <div style={styles.container}>
      {/* Header with Logo */}
      <div style={styles.header}>
        <img 
          src={logoUrl} 
          alt="Civora Nexus Logo" 
          style={styles.logo}
        />
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        <h1 style={styles.title}>Certificate of Completion</h1>
        
        <p style={styles.subtitle}>This is to certify that</p>
        
        <p style={styles.studentName}>{studentName}</p>
        
        <p style={styles.completionText}>has successfully completed the course</p>
        
        <p style={styles.courseName}>{courseName}</p>
      </div>

      {/* Footer with Details */}
      <div style={styles.footer}>
        <div style={styles.footerLeft}>
          <p style={styles.instructorLabel}>Course Instructor</p>
          <p style={styles.instructorName}>{instructorName}</p>
          
          <p style={styles.dateLabel}>Date of Issue</p>
          <p style={styles.date}>{issueDate}</p>
        </div>

        <div style={styles.footerRight}>
          <p style={styles.idLabel}>Certificate ID</p>
          <p style={styles.id}>{certificateId}</p>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
