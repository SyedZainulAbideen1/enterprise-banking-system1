import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  createEmployee,
  getEmployees,
} from "../../features/employees/employeeService";

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

  return (
    <main>
      <section>
        <h1>Employee Management</h1>

        <p>
          Create and manage employee accounts.
        </p>

        <Link to="/manager">
          Back to Manager Dashboard
        </Link>
      </section>

      <section>
        <h2>Create Employee</h2>

        <form onSubmit={handleSubmit}>
          <div>
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
              disabled={saving}
            />
          </div>

          <div>
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="employee@example.com"
              disabled={saving}
            />
          </div>

          <div>
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
              disabled={saving}
            />
          </div>

          <div>
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

          <div>
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

          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Creating Employee..."
              : "Create Employee"}
          </button>
        </form>

        {error && (
          <p role="alert">
            {error}
          </p>
        )}

        {success && (
          <p role="status">
            {success}
          </p>
        )}
      </section>

      <section>
        <h2>Employees</h2>

        {loading && (
          <p>Loading employees...</p>
        )}

        {!loading &&
          !error &&
          employees.length === 0 && (
            <div>
              <h3>No Employees Found</h3>

              <p>
                There are currently no employee
                records available.
              </p>
            </div>
          )}

        {!loading &&
          employees.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Salary</th>
                  <th>Responsibility</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      {employee.name}
                    </td>

                    <td>
                      {employee.email}
                    </td>

                    <td>
                      {employee.role}
                    </td>

                    <td>
                      {employee.status}
                    </td>

                    <td>
                      {employee.salary}
                    </td>

                    <td>
                      {employee.responsibility}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </section>
    </main>
  );
};

export default EmployeeManagement;