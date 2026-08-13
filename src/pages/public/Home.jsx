import {
  ArrowRight,
  Building2,
  CreditCard,
  Landmark,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
  WalletCards,
  Zap,
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

import "./Home.css";

const Home = () => {
  const services = [
    {
      icon: WalletCards,
      title: "Smart Accounts",
      description:
        "Manage your banking accounts with a simple, secure and reliable digital experience.",
    },
    {
      icon: CreditCard,
      title: "Easy Transactions",
      description:
        "Handle deposits, withdrawals and transfers through a controlled banking workflow.",
    },
    {
      icon: Landmark,
      title: "Flexible Loans",
      description:
        "Submit loan requests and track their approval progress through the banking system.",
    },
    {
      icon: Smartphone,
      title: "Digital Banking",
      description:
        "Access essential banking services through a modern and responsive online platform.",
    },
  ];

  const securityFeatures = [
    {
      icon: ShieldCheck,
      title: "Secure by Design",
      description:
        "Banking operations are designed around controlled access and role-based permissions.",
    },
    {
      icon: LockKeyhole,
      title: "Protected Access",
      description:
        "Customer, employee and manager areas remain separated according to their responsibilities.",
    },
    {
      icon: Zap,
      title: "Approval Workflow",
      description:
        "Important financial requests follow structured approval processes instead of uncontrolled balance changes.",
    },
  ];

  return (
    <div className="home-page">
      <Navbar />

      <main>
        {/* =================================================
            HERO
        ================================================= */}

        <section
          id="home"
          className="home-hero"
        >
          <div className="home-container">
            <div className="home-hero__grid">

              <div className="home-hero__content">
                <div className="home-hero__badge">
                  <ShieldCheck size={16} />
                  <span>
                    Secure digital banking
                  </span>
                </div>

                <h1>
                  Banking built for
                  <span> confidence.</span>
                </h1>

                <p>
                  A modern enterprise banking
                  platform designed to make
                  accounts, transactions and
                  financial requests simpler,
                  safer and more transparent.
                </p>

                <div className="home-hero__actions">
                  <Link
                    to="/login"
                    className="home-button home-button--primary"
                  >
                    Access Banking
                    <ArrowRight size={18} />
                  </Link>

                  <a
                    href="#services"
                    className="home-button home-button--secondary"
                  >
                    Explore Services
                  </a>
                </div>

                <div className="home-hero__trust">
                  <div className="home-hero__trust-item">
                    <ShieldCheck size={17} />
                    <span>
                      Secure access
                    </span>
                  </div>

                  <div className="home-hero__trust-item">
                    <LockKeyhole size={17} />
                    <span>
                      Role-based security
                    </span>
                  </div>
                </div>
              </div>

              <div className="home-hero__visual">
                <div className="home-hero__glow" />

                <div className="home-bank-card">
                  <div className="home-bank-card__top">
                    <div>
                      <span className="home-bank-card__label">
                        ENTERPRISE
                      </span>

                      <strong>
                        Banking System
                      </strong>
                    </div>

                    <ShieldCheck size={28} />
                  </div>

                  <div className="home-bank-card__chip">
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className="home-bank-card__number">
                    •••• &nbsp; •••• &nbsp; •••• &nbsp; 2026
                  </div>

                  <div className="home-bank-card__bottom">
                    <span>SECURE BANKING</span>
                    <span>EB</span>
                  </div>
                </div>

                <div className="home-floating-card home-floating-card--one">
                  <div className="home-floating-card__icon">
                    <ShieldCheck size={18} />
                  </div>

                  <div>
                    <strong>
                      Protected
                    </strong>

                    <span>
                      Banking environment
                    </span>
                  </div>
                </div>

                <div className="home-floating-card home-floating-card--two">
                  <span className="home-floating-card__dot" />

                  <div>
                    <strong>
                      Digital Banking
                    </strong>

                    <span>
                      Available anytime
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            STATS
        ================================================= */}

        <section className="home-stats">
          <div className="home-container">
            <div className="home-stats__grid">

              <div className="home-stat">
                <strong>Secure</strong>
                <span>
                  Banking architecture
                </span>
              </div>

              <div className="home-stat">
                <strong>24/7</strong>
                <span>
                  Digital accessibility
                </span>
              </div>

              <div className="home-stat">
                <strong>3</strong>
                <span>
                  Dedicated user roles
                </span>
              </div>

              <div className="home-stat">
                <strong>100%</strong>
                <span>
                  Approval-focused workflow
                </span>
              </div>

            </div>
          </div>
        </section>

        {/* =================================================
            ABOUT
        ================================================= */}

        <section
          id="about"
          className="home-section home-about"
        >
          <div className="home-container">
            <div className="home-about__grid">

              <div className="home-about__visual">
                <div className="home-about__panel">
                  <div className="home-about__panel-header">
                    <Building2 size={21} />

                    <span>
                      Enterprise Banking
                    </span>
                  </div>

                  <div className="home-about__line">
                    <span />
                    <span />
                  </div>

                  <div className="home-about__mini-cards">
                    <div />
                    <div />
                    <div />
                  </div>
                </div>
              </div>

              <div className="home-section__content">
                <span className="home-eyebrow">
                  ABOUT OUR PLATFORM
                </span>

                <h2>
                  Banking technology
                  <br />
                  designed around trust.
                </h2>

                <p>
                  Enterprise Banking System brings
                  essential banking operations into one
                  structured digital environment.
                </p>

                <p>
                  From customer account activity to
                  employee and manager approvals, every
                  role works through a controlled and
                  transparent workflow.
                </p>

                <a
                  href="#security"
                  className="home-text-link"
                >
                  Discover our security approach
                  <ArrowRight size={17} />
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* =================================================
            SERVICES
        ================================================= */}

        <section
          id="services"
          className="home-section home-services"
        >
          <div className="home-container">

            <div className="home-section__header">
              <span className="home-eyebrow">
                BANKING SERVICES
              </span>

              <h2>
                Everything you need for
                <br />
                modern banking.
              </h2>

              <p>
                Essential financial services brought
                together in one professional digital
                banking experience.
              </p>
            </div>

            <div className="home-services__grid">
              {services.map(
                ({
                  icon: Icon,
                  title,
                  description,
                }) => (
                  <article
                    key={title}
                    className="home-service-card"
                  >
                    <div className="home-service-card__icon">
                      <Icon size={23} />
                    </div>

                    <h3>{title}</h3>

                    <p>{description}</p>

                    <a href="#contact">
                      Learn more
                      <ArrowRight size={15} />
                    </a>
                  </article>
                )
              )}
            </div>

          </div>
        </section>

        {/* =================================================
            SECURITY
        ================================================= */}

        <section
          id="security"
          className="home-section home-security"
        >
          <div className="home-container">

            <div className="home-security__header">
              <span className="home-eyebrow">
                SECURITY FIRST
              </span>

              <h2>
                Your banking deserves
                <br />
                a secure foundation.
              </h2>

              <p>
                Financial operations should be
                controlled, traceable and protected.
              </p>
            </div>

            <div className="home-security__grid">
              {securityFeatures.map(
                ({
                  icon: Icon,
                  title,
                  description,
                }) => (
                  <article
                    key={title}
                    className="home-security-card"
                  >
                    <div className="home-security-card__icon">
                      <Icon size={22} />
                    </div>

                    <h3>{title}</h3>

                    <p>{description}</p>
                  </article>
                )
              )}
            </div>

          </div>
        </section>

        {/* =================================================
            CTA
        ================================================= */}

        <section className="home-cta">
          <div className="home-container">
            <div className="home-cta__box">

              <div>
                <span className="home-cta__eyebrow">
                  READY TO GET STARTED?
                </span>

                <h2>
                  Take control of your
                  <br />
                  digital banking experience.
                </h2>

                <p>
                  Sign in to your account and access
                  the banking services available to you.
                </p>
              </div>

              <Link
                to="/login"
                className="home-cta__button"
              >
                Login to Banking
                <ArrowRight size={18} />
              </Link>

            </div>
          </div>
        </section>

        {/* =================================================
            CONTACT
        ================================================= */}

        <section
          id="contact"
          className="home-contact"
        >
          <div className="home-container">

            <div className="home-contact__content">
              <span className="home-eyebrow">
                CONTACT
              </span>

              <h2>
                Need assistance?
              </h2>

              <p>
                Our support team is here to help
                with your banking experience.
              </p>

              <a
                href="mailto:support@enterprisebank.com"
                className="home-contact__button"
              >
                Contact Support
                <ArrowRight size={17} />
              </a>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;