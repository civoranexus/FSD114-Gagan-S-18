import React from 'react';
import { markNotificationAsRead } from '../services/notificationService';
import './NotificationItem.css';

/**
 * NotificationItem Component - Displays a single notification
 */
const NotificationItem = ({ notification, onMarkRead, onDelete }) => {
  const handleClick = async () => {
    if (!notification.is_read) {
      try {
        await markNotificationAsRead(notification.id);
        onMarkRead(notification.id);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      admin_teacher_signup: '👨‍🏫',
      teacher_student_enrollment: '📚',
      teacher_approval: '✅',
      student_enrollment_confirmation: '🎓',
      student_new_content: '📝',
      student_certificate_ready: '🎖️',
    };
    return icons[type] || '📢';
  };

  const getNotificationClass = (type) => {
    const typeClasses = {
      admin_teacher_signup: 'notification-admin',
      teacher_student_enrollment: 'notification-teacher',
      teacher_approval: 'notification-approval',
      student_enrollment_confirmation: 'notification-success',
      student_new_content: 'notification-info',
      student_certificate_ready: 'notification-certificate',
    };
    return typeClasses[type] || 'notification-default';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`notification-item ${getNotificationClass(notification.notification_type)} ${
        !notification.is_read ? 'unread' : 'read'
      }`}
      onClick={handleClick}
    >
      <div className="notification-icon">
        {getNotificationIcon(notification.notification_type)}
      </div>
      
      <div className="notification-content">
        <div className="notification-title">{notification.title}</div>
        <div className="notification-message">{notification.message}</div>
        
        {(notification.related_course_title || notification.related_user_name) && (
          <div className="notification-meta">
            {notification.related_course_title && (
              <span className="meta-item">📖 {notification.related_course_title}</span>
            )}
            {notification.related_user_name && (
              <span className="meta-item">👤 {notification.related_user_name}</span>
            )}
          </div>
        )}
        
        <div className="notification-time">
          {formatDate(notification.created_at)}
        </div>
      </div>

      {!notification.is_read && <div className="unread-badge" />}
    </div>
  );
};

export default NotificationItem;
