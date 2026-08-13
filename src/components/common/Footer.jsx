import {
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="public-footer">
      <div className="public-footer__main">
        <div className="public-footer__container">
          <div className="public-footer__grid">

            {/* Brand */}
            <div className="public-footer__brand">
              <Link
                to="/"
                className="public-footer__logo"
              >
                <span className="public-footer__logo-icon">
                  <ShieldCheck
                    size={23}
                    strokeWidth={2.4}
                  />
                </span>

                <span>
                  <strong>Enterprise</strong>
                  <small>Banking System</small>
                </span>
              </Link>

              <p>
                Secure, reliable and professional
                banking services designed to make
                modern financial management simple.
              </p>

              <div className="public-footer__trust">
                <ShieldCheck size={17} />
                <span>
                  Security-first banking
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="public-footer__column">
              <h3>Quick Links</h3>

              <nav>
                <a href="/#home">Home</a>
                <a href="/#about">About</a>
                <a href="/#services">Services</a>
                <a href="/#security">Security</a>
                <a href="/#contact">Contact</a>
              </nav>
            </div>

            {/* Banking */}
            <div className="public-footer__column">
              <h3>Banking</h3>

              <nav>
                <Link to="/login">
                  Customer Login
                </Link>

                <Link to="/register">
                  Get Started
                </Link>

                <a href="/#services">
                  Accounts
                </a>

                <a href="/#services">
                  Transactions
                </a>

                <a href="/#services">
                  Loans
                </a>
              </nav>
            </div>

            {/* Contact */}
            <div className="public-footer__column public-footer__contact">
              <h3>Contact Us</h3>

              <div className="public-footer__contact-item">
                <span>
                  <MapPin size={17} />
                </span>

                <p>
                  Enterprise Banking Centre
                  <br />
                  Pakistan
                </p>
              </div>

              <div className="public-footer__contact-item">
                <span>
                  <Phone size={17} />
                </span>

                <a href="tel:+923000000000">
                  +92 300 0000000
                </a>
              </div>

              <div className="public-footer__contact-item">
                <span>
                  <Mail size={17} />
                </span>

                <a href="mailto:support@enterprisebank.com">
                  support@enterprisebank.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="public-footer__bottom">
        <div className="public-footer__container">
          <div className="public-footer__bottom-content">

            <p>
              © {currentYear} Enterprise Banking
              System. All rights reserved.
            </p>

            <div className="public-footer__legal">
              <a href="/#security">
                Privacy
              </a>

              <a href="/#security">
                Security
              </a>

              <a href="/#contact">
                Support
              </a>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;