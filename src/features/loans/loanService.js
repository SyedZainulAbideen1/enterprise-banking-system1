import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "../../api/firebaseConfig";

const loansCollection = collection(db, "loans");

/*
 * CUSTOMER
 *
 * Create a new loan request.
 *
 * Creating the request does NOT change
 * the customer's balance.
 */
export const createLoanRequest = async ({
  customerId,
  customerName,
  amount,
  purpose,
  duration,
  notes,
}) => {
  if (!customerId) {
    throw new Error("Customer ID is required.");
  }

  const numericAmount = Number(amount);

  if (
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0
  ) {
    throw new Error(
      "Loan amount must be greater than zero."
    );
  }

  if (!purpose?.trim()) {
    throw new Error("Loan purpose is required.");
  }

  const numericDuration = Number(duration);

  if (
    !Number.isFinite(numericDuration) ||
    numericDuration <= 0
  ) {
    throw new Error(
      "Loan duration must be greater than zero."
    );
  }

  const loanRef = doc(loansCollection);

  await runTransaction(db, async (transaction) => {
    transaction.set(loanRef, {
      customerId,

      customerName:
        customerName?.trim() || "Customer",

      amount: numericAmount,

      purpose: purpose.trim(),

      duration: numericDuration,

      notes: notes?.trim() || "",

      status: "pending",

      createdAt: serverTimestamp(),

      updatedAt: serverTimestamp(),
    });
  });

  return {
    id: loanRef.id,
    customerId,
    customerName:
      customerName?.trim() || "Customer",
    amount: numericAmount,
    purpose: purpose.trim(),
    duration: numericDuration,
    notes: notes?.trim() || "",
    status: "pending",
  };
};


/*
 * CUSTOMER / GENERAL
 *
 * Get loans belonging to one customer.
 */
export const getCustomerLoans = async (
  customerId
) => {
  if (!customerId) {
    throw new Error("Customer ID is required.");
  }

  const loansQuery = query(
    loansCollection,
    where(
      "customerId",
      "==",
      customerId
    )
  );

  const snapshot =
    await getDocs(loansQuery);

  const loans = snapshot.docs.map(
    (loanDoc) => ({
      id: loanDoc.id,
      ...loanDoc.data(),
    })
  );

  loans.sort((a, b) => {
    const aTime =
      a.createdAt?.toMillis
        ? a.createdAt.toMillis()
        : 0;

    const bTime =
      b.createdAt?.toMillis
        ? b.createdAt.toMillis()
        : 0;

    return bTime - aTime;
  });

  return loans;
};


/*
 * EMPLOYEE
 *
 * Get pending loans that are within
 * the Employee approval limit.
 *
 * Employee limit:
 * <= 1,000,000
 */
export const getPendingLoanRequests =
  async () => {
    const loansQuery = query(
      loansCollection,
      where(
        "status",
        "==",
        "pending"
      )
    );

    const snapshot =
      await getDocs(loansQuery);

    const requests =
      snapshot.docs
        .map((loanDoc) => ({
          id: loanDoc.id,
          ...loanDoc.data(),
        }))
        .filter((loan) => {
          const amount =
            Number(loan.amount);

          return (
            Number.isFinite(amount) &&
            amount <= 1000000
          );
        });

    requests.sort((a, b) => {
      const aTime =
        a.createdAt?.toMillis
          ? a.createdAt.toMillis()
          : 0;

      const bTime =
        b.createdAt?.toMillis
          ? b.createdAt.toMillis()
          : 0;

      return bTime - aTime;
    });

    return requests;
  };


/*
 * EMPLOYEE
 *
 * Approve a loan <= 1,000,000.
 *
 * Atomically:
 * 1. Read the pending loan.
 * 2. Read customer account.
 * 3. Update customer balance.
 * 4. Mark loan approved.
 */
export const approveLoanRequest =
  async ({
    loanId,
    employeeId,
  }) => {
    if (!loanId) {
      throw new Error(
        "Loan ID is required."
      );
    }

    if (!employeeId) {
      throw new Error(
        "Employee ID is required."
      );
    }

    const loanRef = doc(
      db,
      "loans",
      loanId
    );

    await runTransaction(
      db,
      async (transaction) => {
        const loanSnapshot =
          await transaction.get(
            loanRef
          );

        if (!loanSnapshot.exists()) {
          throw new Error(
            "Loan request was not found."
          );
        }

        const loan =
          loanSnapshot.data();

        if (loan.status !== "pending") {
          throw new Error(
            "This loan has already been processed."
          );
        }

        const amount =
          Number(loan.amount);

        if (
          !Number.isFinite(amount) ||
          amount <= 0
        ) {
          throw new Error(
            "Invalid loan amount."
          );
        }

        if (amount > 1000000) {
          throw new Error(
            "Loans above PKR 1,000,000 require Manager approval."
          );
        }

        if (!loan.customerId) {
          throw new Error(
            "Loan customer ID is missing."
          );
        }

        const customerRef =
          doc(
            db,
            "users",
            loan.customerId
          );

        const customerSnapshot =
          await transaction.get(
            customerRef
          );

        if (!customerSnapshot.exists()) {
          throw new Error(
            "Customer account was not found."
          );
        }

        const customer =
          customerSnapshot.data();

        const currentBalance =
          Number(
            customer.balance || 0
          );

        if (
          !Number.isFinite(
            currentBalance
          ) ||
          currentBalance < 0
        ) {
          throw new Error(
            "Customer balance is invalid."
          );
        }

        const newBalance =
          currentBalance + amount;

        transaction.update(
          customerRef,
          {
            balance: newBalance,
            updatedAt:
              serverTimestamp(),
          }
        );

        transaction.update(
          loanRef,
          {
            status: "approved",

            approvedBy:
              employeeId,

            approvedAt:
              serverTimestamp(),

            updatedAt:
              serverTimestamp(),
          }
        );
      }
    );

    return {
      loanId,
      status: "approved",
    };
  };


/*
 * EMPLOYEE
 *
 * Reject a loan request.
 *
 * Customer balance is NOT changed.
 */
export const rejectLoanRequest =
  async ({
    loanId,
    employeeId,
  }) => {
    if (!loanId) {
      throw new Error(
        "Loan ID is required."
      );
    }

    if (!employeeId) {
      throw new Error(
        "Employee ID is required."
      );
    }

    const loanRef = doc(
      db,
      "loans",
      loanId
    );

    await runTransaction(
      db,
      async (transaction) => {
        const loanSnapshot =
          await transaction.get(
            loanRef
          );

        if (!loanSnapshot.exists()) {
          throw new Error(
            "Loan request was not found."
          );
        }

        const loan =
          loanSnapshot.data();

        if (loan.status !== "pending") {
          throw new Error(
            "This loan has already been processed."
          );
        }

        const amount =
          Number(loan.amount);

        if (
          Number.isFinite(amount) &&
          amount > 1000000
        ) {
          throw new Error(
            "High-value loans require Manager processing."
          );
        }

        transaction.update(
          loanRef,
          {
            status: "rejected",

            rejectedBy:
              employeeId,

            rejectedAt:
              serverTimestamp(),

            updatedAt:
              serverTimestamp(),
          }
        );
      }
    );

    return {
      loanId,
      status: "rejected",
    };
  };