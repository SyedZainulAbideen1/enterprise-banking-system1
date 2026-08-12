import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    /*
     * Actual employee records will be loaded from
     * employeeService.js and Firestore during the
     * functionality integration phase.
     *
     * No fake employee records are created here.
     */

    setLoading(false);
    setEmployees([]);
  }, []);

  return (
    <main>
      <section>
        <h1>Employee Management</h1>

        <p>
          Manage employee accounts and review employee
          information.
        </p>

        <Link to="/manager">
          Back to Manager Dashboard
        </Link>
      </section>

      <section>
        {loading && (
          <p>Loading employees...</p>
        )}

        {error && (
          <p role="alert">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          employees.length === 0 && (
            <div>
              <h2>No Employees Found</h2>

              <p>
                There are currently no employee records
                available for management.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          employees.length > 0 && (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
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
                        <button
                          type="button"
                          disabled
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </section>
    </main>
  );
};

export default EmployeeManagement;