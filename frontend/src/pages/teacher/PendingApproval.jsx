import { useNavigate } from "react-router-dom";
import "../../styles/pending-approval.css";

/**
 * PendingApproval Page
 * Shown to teachers whose account is awaiting admin approval
 */
function PendingApproval() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("teacher_status");
    navigate("/login");
  };

  return (
    <div className="pending-approval-container">
      <div className="pending-approval-card">
        {/* Icon */}
        <div className="pending-icon">⏳</div>

        {/* Title */}
        <h1 className="pending-title">Account Under Review</h1>

        {/* Message */}
        <div className="pending-content">
          <p className="pending-message">
            Thank you for registering as a teacher on <strong>EduVillage</strong>.
          </p>
          <p className="pending-message">
            Your teacher account is currently <strong>under review</strong> by our admin team.
            We will verify your qualifications and experience.
          </p>
          <p className="pending-message">
            You will receive an email notification once your account is <strong>approved</strong>.
            This usually takes 24-48 hours.
          </p>
        </div>

        {/* Info boxes */}
        <div className="pending-info-box">
          <div className="info-item">
            <span className="info-icon">✓</span>
            <span className="info-text">Application received</span>
          </div>
          <div className="info-item">
            <span className="info-icon">🔄</span>
            <span className="info-text">Under admin review</span>
          </div>
          <div className="info-item">
            <span className="info-icon">📧</span>
            <span className="info-text">Approval via email</span>
          </div>
        </div>

        {/* FAQ section */}
        <div className="pending-faq">
          <h3>What happens next?</h3>
          <ul className="faq-list">
            <li>Admin team reviews your qualifications</li>
            <li>Your credentials are verified</li>
            <li>You receive an approval/rejection email</li>
            <li>Approved accounts can immediately login and access the dashboard</li>
          </ul>
        </div>

        {/* Contact support */}
        <div className="pending-support">
          <p className="support-text">
            Questions? Contact our support team at <strong>support@eduvillage.com</strong>
          </p>
        </div>

        {/* Logout button */}
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default PendingApproval;
