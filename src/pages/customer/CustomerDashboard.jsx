import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowUpRight,
  Banknote,
  CircleCheck,
  CreditCard,
  History,
  Landmark,
  ReceiptText,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import "./CustomerDashboard.css";

const CustomerDashboard = () => {
  const { user, profile } = useSelector(
    (state) => state.auth
  );

  const customerName =
    profile?.fullName ||
    profile?.name ||
    user?.displayName ||
    "Customer";

  const email =
    profile?.email ||
    user?.email ||
    "No email available";

  const role = profile?.role || "customer";

  const accountStatus =
    profile?.status || "active";

  const balance =
    typeof profile?.balance === "number"
      ? profile.balance
      : 0;

  const formattedBalance = new Intl.NumberFormat(
    "en-PK",
    {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 2,
    }
  ).format(balance);

  const services = [
    {
      title: "Transactions",
      description:
        "View your complete banking transaction history.",
      icon: History,
      to: "/customer/transactions",
    },
    {
      title: "Loan Details",
      description:
        "View your existing loans and their status.",
      icon: ReceiptText,
      to: "/customer/loan",
    },
    {
      title: "Request a Loan",
      description:
        "Submit a new loan request for approval.",
      icon: CreditCard,
      to: "/customer/loan/request",
    },
    {
      title: "Deposit",
      description:
        "Submit a request to deposit funds.",
      icon: Banknote,
      to: "/customer/deposit",
    },
    {
      title: "Withdraw",
      description:
        "Submit a request to withdraw funds.",
      icon: WalletCards,
      to: "/customer/withdraw",
    },
    {
      title: "Donation",
      description:
        "Submit and manage your donation requests.",
      icon: Landmark,
      to: "/customer/donation",
    },
  ];

  return (
    <main className="customer-dashboard">
      <div className="customer-dashboard__container">

        {/* Header */}
        <section className="customer-dashboard__header">
          <div>
            <p className="customer-dashboard__eyebrow">
              CUSTOMER PORTAL
            </p>

            <h1>
              Welcome back, {customerName}
            </h1>

            <p className="customer-dashboard__subtitle">
              Manage your accounts, transactions and
              banking services from one secure place.
            </p>
          </div>

          <div className="customer-dashboard__secure">
            <ShieldCheck size={18} />
            <span>Secure Banking</span>
          </div>
        </section>

        {/* Balance */}
        <section className="customer-dashboard__balance-grid">

          <div className="balance-card">
            <div className="balance-card__top">
              <div>
                <span className="balance-card__label">
                  AVAILABLE BALANCE
                </span>

                <p className="balance-card__amount">
                  {formattedBalance}
                </p>
              </div>

              <div className="balance-card__icon">
                <WalletCards size={24} />
              </div>
            </div>

            <div className="balance-card__bottom">
              <span>Primary account</span>

              <span className="balance-card__status">
                <CircleCheck size={14} />
                Active
              </span>
            </div>
          </div>

          <div className="status-card">
            <div className="status-card__icon">
              <ShieldCheck size={22} />
            </div>

            <div>
              <span>ACCOUNT STATUS</span>

              <strong>
                {accountStatus}
              </strong>

              <p>
                Your banking account is currently
                available.
              </p>
            </div>
          </div>

        </section>

        {/* Quick Actions */}
        <section className="customer-section">
          <div className="customer-section__heading">
            <div>
              <span>QUICK ACCESS</span>
              <h2>Banking Services</h2>
            </div>

            <p>
              Choose a service to continue.
            </p>
          </div>

          <div className="service-grid">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <Link
                  key={service.title}
                  to={service.to}
                  className="service-card"
                >
                  <div className="service-card__icon">
                    <Icon size={21} />
                  </div>

                  <div className="service-card__content">
                    <h3>{service.title}</h3>

                    <p>
                      {service.description}
                    </p>
                  </div>

                  <ArrowUpRight
                    className="service-card__arrow"
                    size={18}
                  />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Account Information */}
        <section className="customer-section">

          <div className="customer-section__heading">
            <div>
              <span>ACCOUNT</span>
              <h2>Account Information</h2>
            </div>
          </div>

          <div className="account-info">

            <div className="account-info__item">
              <span>FULL NAME</span>
              <strong>{customerName}</strong>
            </div>

            <div className="account-info__item">
              <span>EMAIL ADDRESS</span>
              <strong>{email}</strong>
            </div>

            <div className="account-info__item">
              <span>ACCOUNT ROLE</span>
              <strong>{role}</strong>
            </div>

            <div className="account-info__item">
              <span>ACCOUNT STATUS</span>

              <strong className="account-info__active">
                <CircleCheck size={15} />
                {accountStatus}
              </strong>
            </div>

          </div>
        </section>

        {/* Security Banner */}
        <section className="customer-security">
          <div className="customer-security__icon">
            <ShieldCheck size={23} />
          </div>

          <div>
            <h2>Your banking security matters</h2>

            <p>
              Never share your password, verification
              codes or banking credentials with anyone.
            </p>
          </div>
        </section>

      </div>
    </main>
  );
};

export default CustomerDashboard;