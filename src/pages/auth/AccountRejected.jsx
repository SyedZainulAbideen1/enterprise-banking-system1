import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  CircleAlert,
  Mail,
  ShieldAlert,
} from "lucide-react";

import "./AccountRejected.css";

const AccountRejected = () => {
  const location = useLocation();

  const email = location.state?.email;

  return (
    <main className="rejected-page">
      <div className="rejected-background" />

      <section className="rejected-card">
        <div className="rejected-brand">
          <div className="rejected-brand__logo">
            <ShieldAlert size={23} />
          </div>

          <div>
            <strong>Enterprise Banking</strong>
            <span>Secure digital banking</span>
          </div>
        </div>

        <div className="rejected-status">
          <div className="rejected-status__icon">
            <CircleAlert size={32} />
          </div>

          <span>REQUEST REJECTED</span>
        </div>

        <h1>Account Request Rejected</h1>

        <p className="rejected-intro">
          Your account registration request has been
          reviewed and rejected by the bank administrator.
        </p>

        {email && (
          <div className="rejected-email">
            <div className="rejected-email__icon">
              <Mail size={17} />
            </div>

            <div>
              <span>REQUEST SUBMITTED FOR</span>
              <strong>{email}</strong>
            </div>
          </div>
        )}

        <div className="rejected-alert">
          <CircleAlert size={18} />

          <div>
            <strong>Banking access unavailable</strong>

            <p>
              You cannot access the banking system with this
              account at this time.
            </p>
          </div>
        </div>

        <div className="rejected-help">
          <h2>Need assistance?</h2>

          <p>
            If you believe this decision was made in error,
            please contact the bank administrator for
            further assistance.
          </p>
        </div>

        <Link
          to="/login"
          className="rejected-login-button"
        >
          <ArrowLeft size={17} />
          Back to Login
        </Link>

        <div className="rejected-security">
          <ShieldAlert size={15} />
          <span>
            Your account information remains protected.
          </span>
        </div>
      </section>

      <p className="rejected-footer">
        Enterprise Banking System
        <span>•</span>
        Secure digital financial services
      </p>
    </main>
  );
};

export default AccountRejected;