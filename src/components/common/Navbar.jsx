import { useState } from "react";
import {
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="public-navbar">
      <div className="public-navbar__container">
        <Link
          to="/"
          className="public-navbar__brand"
          onClick={closeMenu}
          aria-label="Enterprise Bank home"
        >
          <span className="public-navbar__logo">
            <ShieldCheck size={24} strokeWidth={2.4} />
          </span>

          <span className="public-navbar__brand-text">
            <strong>Enterprise</strong>
            <small>Banking System</small>
          </span>
        </Link>

        <button
          type="button"
          className="public-navbar__mobile-toggle"
          onClick={() =>
            setMenuOpen((current) => !current)
          }
          aria-label={
            menuOpen
              ? "Close navigation"
              : "Open navigation"
          }
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>

        <nav
          className={`public-navbar__nav ${
            menuOpen
              ? "public-navbar__nav--open"
              : ""
          }`}
          aria-label="Main navigation"
        >
          <div className="public-navbar__links">
            <a
              href="/#home"
              onClick={closeMenu}
            >
              Home
            </a>

            <a
              href="/#about"
              onClick={closeMenu}
            >
              About
            </a>

            <a
              href="/#services"
              onClick={closeMenu}
            >
              Services
            </a>

            <a
              href="/#security"
              onClick={closeMenu}
            >
              Security
            </a>

            <a
              href="/#contact"
              onClick={closeMenu}
            >
              Contact
            </a>
          </div>

          <div className="public-navbar__actions">
            <Link
              to="/login"
              className="public-navbar__login"
              onClick={closeMenu}
            >
              Login
            </Link>

            <Link
              to="/register"
              className="public-navbar__signup"
              onClick={closeMenu}
            >
              <span>Get Started</span>
              <ChevronDown
                size={15}
                className="public-navbar__signup-icon"
              />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;