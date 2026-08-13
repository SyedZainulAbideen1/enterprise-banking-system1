import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  ShieldCheck,
} from "lucide-react";

import "./PendingApproval.css";

const RegistrationPending = () => {
  const location = useLocation();

  const email = location.state?.email;

  return (
    <main className="pending-page">
      <div className="pending-background" />

      <section className="pending-card">
        <div className="pending-brand">
          <div className="pending-brand__logo">
            <ShieldCheck size={23} />
          </div>

          <div>
            <strong>Enterprise Banking</strong>
            <span>Secure digital banking</span>
          </div>
        </div>

        <div className="pending-status">
          <div className="pending-status__icon">
            <Clock3 size={30} />
          </div>

          <span>REQUEST PENDING</span>
        </div>

        <h1>Account Request Submitted</h1>

        <p className="pending-intro">
          Your registration request has been submitted
          successfully and is now waiting for approval.
        </p>

        {email && (
          <div className="pending-email">
            <span>REQUEST SUBMITTED FOR</span>
            <strong>{email}</strong>
          </div>
        )}

        <div className="pending-timeline">
          <div className="pending-step pending-step--complete">
            <div className="pending-step__icon">
              <CheckCircle2 size={18} />
            </div>

            <div>
              <strong>Registration submitted</strong>
              <span>Your account request was received.</span>
            </div>
          </div>

          <div className="pending-line" />

          <div className="pending-step pending-step--active">
            <div className="pending-step__icon">
              <Clock3 size={18} />
            </div>

            <div>
              <strong>Administrator review</strong>
              <span>
                Your request is waiting for approval.
              </span>
            </div>
          </div>

          <div className="pending-line" />

          <div className="pending-step">
            <div className="pending-step__icon">
              <ShieldCheck size={18} />
            </div>

            <div>
              <strong>Account activation</strong>
              <span>
                Access becomes available after approval.
              </span>
            </div>
          </div>
        </div>

        <div className="pending-notice">
          <Clock3 size={17} />

          <p>
            Please try signing in again after your
            registration has been approved by the bank
            administrator.
          </p>
        </div>

        <Link
          to="/login"
          className="pending-login-button"
        >
          <ArrowLeft size={17} />
          Back to Login
        </Link>

        <div className="pending-security">
          <ShieldCheck size={15} />
          <span>Your registration is securely protected.</span>
        </div>
      </section>

      <p className="pending-footer">
        Enterprise Banking System
        <span>•</span>
        Secure digital financial services
      </p>
    </main>
  );
};

export default RegistrationPending;