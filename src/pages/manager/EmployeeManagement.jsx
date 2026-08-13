import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  createEmployee,
  getEmployees,
} from "../../features/employees/employeeService";

import "./EmployeeManagement.css";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    salary: "",
    responsibility: "",
  });

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getEmployees();

      setEmployees(data);
    } catch (err) {
      console.error("Employee loading error:", err);

      setError(
        err.message ||
          "Unable to load employee records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.salary ||
      !form.responsibility.trim()
    ) {
      setError(
        "Please complete all employee fields."
      );

      return;
    }

    if (form.password.length < 6) {
      setError(
        "Employee password must be at least 6 characters."
      );

      return;
    }

    try {
      setSaving(true);

      await createEmployee({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        salary: Number(form.salary),
        responsibility:
          form.responsibility.trim(),
      });

      setSuccess(
        "Employee created successfully."
      );

      setForm({
        name: "",
        email: "",
        password: "",
        salary: "",
        responsibility: "",
      });

      await loadEmployees();
    } catch (err) {
      console.error(
        "Employee creation error:",
        err
      );

      setError(
        err.message ||
          "Unable to create employee."
      );
    } finally {
      setSaving(false);
    }
  };

  const formatSalary = (salary) => {
    const numericSalary = Number(salary);

    if (!Number.isFinite(numericSalary)) {
      return salary || "Not available";
    }

    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(numericSalary);
  };

  return (
    <main className="manager-employee-management">
      <section className="manager-employee-management__hero">
        <div className="manager-employee-management__hero-content">
          <Link
            to="/manager"
            className="manager-employee-management__back-link"
          >
            <span aria-hidden="true">←</span>
            Back to Manager Dashboard
          </Link>

          <div className="manager-employee-management__eyebrow">
            <span />
            Employee Administration
          </div>

          <h1>Employee Management</h1>

          <p>
            Create employee accounts and review
            existing employee records from the
            manager portal.
          </p>
        </div>

        <div className="manager-employee-management__hero-icon">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              cx="9"
              cy="8"
              r="3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            />

            <path
              d="M3.5 20v-1.5A3.5 3.5 0 017 15h4a3.5 3.5 0 013.5 3.5V20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />

            <path
              d="M16 7h5M18.5 4.5v5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </section>

      <section className="manager-employee-management__content">
        <div className="manager-employee-management__section-heading">
          <div>
            <span>Account Administration</span>

            <h2>Create Employee</h2>
          </div>

          <div className="manager-employee-management__record-count">
            <strong>{employees.length}</strong>
            <span>Employees</span>
          </div>
        </div>

        <div className="manager-employee-management__form-card">
          <div className="manager-employee-management__form-heading">
            <div className="manager-employee-management__form-icon">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M12 3v18M3 12h18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div>
              <h3>New Employee Account</h3>

              <p>
                Enter the employee information below
                to create an account.
              </p>
            </div>
          </div>

          <form
            className="manager-employee-management__form"
            onSubmit={handleSubmit}
          >
            <div className="manager-employee-management__form-grid">
              <div className="manager-employee-management__field">
                <label htmlFor="name">
                  Employee Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter employee name"
                  autoComplete="name"
                  disabled={saving}
                />
              </div>

              <div className="manager-employee-management__field">
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="employee@example.com"
                  autoComplete="email"
                  disabled={saving}
                />
              </div>

              <div className="manager-employee-management__field">
                <label htmlFor="password">
                  Temporary Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  disabled={saving}
                />

                <span className="manager-employee-management__field-hint">
                  Password must contain at least 6
                  characters.
                </span>
              </div>

              <div className="manager-employee-management__field">
                <label htmlFor="salary">
                  Salary
                </label>

                <input
                  id="salary"
                  name="salary"
                  type="number"
                  min="0"
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="Enter salary"
                  disabled={saving}
                />
              </div>

              <div className="manager-employee-management__field manager-employee-management__field--full">
                <label htmlFor="responsibility">
                  Responsibility
                </label>

                <input
                  id="responsibility"
                  name="responsibility"
                  type="text"
                  value={form.responsibility}
                  onChange={handleChange}
                  placeholder="e.g. Deposit processing"
                  disabled={saving}
                />
              </div>
            </div>

            {error && (
              <div
                className="manager-employee-management__message manager-employee-management__message--error"
                role="alert"
              >
                <span>!</span>
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div
                className="manager-employee-management__message manager-employee-management__message--success"
                role="status"
              >
                <span>✓</span>
                <p>{success}</p>
              </div>
            )}

            <div className="manager-employee-management__form-actions">
              <button
                type="submit"
                className="manager-employee-management__submit"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="manager-employee-management__button-spinner" />
                    Creating Employee...
                  </>
                ) : (
                  <>
                    <span>+</span>
                    Create Employee
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="manager-employee-management__content manager-employee-management__content--records">
        <div className="manager-employee-management__section-heading">
          <div>
            <span>Employee Directory</span>

            <h2>Employees</h2>
          </div>

          <div className="manager-employee-management__directory-status">
            <span />
            Active Directory
          </div>
        </div>

        <div className="manager-employee-management__table-card">
          {loading && (
            <div
              className="manager-employee-management__state"
              aria-live="polite"
            >
              <div className="manager-employee-management__spinner" />

              <h3>Loading Employees</h3>

              <p>
                Employee records are being loaded.
              </p>
            </div>
          )}

          {!loading &&
            employees.length === 0 && (
              <div className="manager-employee-management__state">
                <div className="manager-employee-management__empty-icon">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      cx="9"
                      cy="8"
                      r="3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />

                    <path
                      d="M3.5 20v-1.5A3.5 3.5 0 017 15h4a3.5 3.5 0 013.5 3.5V20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />

                    <path
                      d="M16 8h5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <span className="manager-employee-management__state-label">
                  Employee Directory
                </span>

                <h3>No Employees Found</h3>

                <p>
                  There are currently no employee
                  records available.
                </p>
              </div>
            )}

          {!loading &&
            employees.length > 0 && (
              <div className="manager-employee-management__table-wrapper">
                <table className="manager-employee-management__table">
                  <thead>
                    <tr>
                      <th scope="col">Employee</th>
                      <th scope="col">Email</th>
                      <th scope="col">Role</th>
                      <th scope="col">Status</th>
                      <th scope="col">Salary</th>
                      <th scope="col">
                        Responsibility
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee.id}>
                        <td>
                          <div className="manager-employee-management__employee">
                            <div className="manager-employee-management__avatar">
                              {employee.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "E"}
                            </div>

                            <div>
                              <strong>
                                {employee.name}
                              </strong>

                              <span>
                                Employee Account
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="manager-employee-management__table-text">
                            {employee.email}
                          </span>
                        </td>

                        <td>
                          <span className="manager-employee-management__role-badge">
                            {employee.role}
                          </span>
                        </td>

                        <td>
                          <span className="manager-employee-management__status-badge">
                            <span />
                            {employee.status}
                          </span>
                        </td>

                        <td>
                          <strong className="manager-employee-management__salary">
                            {formatSalary(
                              employee.salary
                            )}
                          </strong>
                        </td>

                        <td>
                          <span className="manager-employee-management__responsibility">
                            {employee.responsibility}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      </section>
    </main>
  );
};

export default EmployeeManagement;