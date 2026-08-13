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

const loansCollection = collection(
  db,
  "loans"
);

const loanRepaymentsCollection = collection(
  db,
  "loanRepayments"
);

const EMPLOYEE_LOAN_LIMIT = 1000000;


/*
 * CUSTOMER
 *
 * Create a loan request.
 *
 * This only creates the request.
 * Customer balance is NOT changed here.
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
    throw new Error(
      "Customer ID is required."
    );
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
    throw new Error(
      "Loan purpose is required."
    );
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

  const loanRef = doc(
    loansCollection
  );

  await runTransaction(
    db,
    async (transaction) => {
      transaction.set(loanRef, {
        customerId,

        customerName:
          customerName?.trim() ||
          "Customer",

        amount: numericAmount,

        purpose:
          purpose.trim(),

        duration:
          numericDuration,

        notes:
          notes?.trim() || "",

        status: "pending",

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),
      });
    }
  );

  return {
    id: loanRef.id,

    customerId,

    customerName:
      customerName?.trim() ||
      "Customer",

    amount:
      numericAmount,

    purpose:
      purpose.trim(),

    duration:
      numericDuration,

    notes:
      notes?.trim() || "",

    status: "pending",
  };
};


/*
 * CUSTOMER
 *
 * Get all loans belonging to one customer.
 */
export const getCustomerLoans =
  async (customerId) => {
    if (!customerId) {
      throw new Error(
        "Customer ID is required."
      );
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

    const loans =
      snapshot.docs.map(
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
 * Get pending loans that Employee can process.
 *
 * Employee limit:
 * <= PKR 1,000,000
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
            amount <=
              EMPLOYEE_LOAN_LIMIT
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
 * MANAGER
 *
 * Get pending high-value loans.
 *
 * High-value:
 * > PKR 1,000,000
 */
export const getPendingManagerLoanRequests =
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
            amount >
              EMPLOYEE_LOAN_LIMIT
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
 * Approve normal loan.
 *
 * Maximum:
 * PKR 1,000,000
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

        if (
          loan.status !== "pending"
        ) {
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

        if (
          amount >
          EMPLOYEE_LOAN_LIMIT
        ) {
          throw new Error(
            "Loans above PKR 1,000,000 require Manager approval."
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

        if (
          !customerSnapshot.exists()
        ) {
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

        transaction.update(
          customerRef,
          {
            balance:
              currentBalance +
              amount,

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

            processedBy:
              employeeId,

            processedAt:
              serverTimestamp(),

            outstandingAmount:
              amount,

            paidAmount: 0,

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
 * MANAGER
 *
 * Approve high-value loan.
 *
 * Required amount:
 * > PKR 1,000,000
 */
export const approveManagerLoanRequest =
  async ({
    loanId,
    managerId,
  }) => {
    if (!loanId) {
      throw new Error(
        "Loan ID is required."
      );
    }

    if (!managerId) {
      throw new Error(
        "Manager ID is required."
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

        if (
          loan.status !== "pending"
        ) {
          throw new Error(
            "This loan has already been processed."
          );
        }

        const amount =
          Number(loan.amount);

        if (
          !Number.isFinite(amount) ||
          amount <=
            EMPLOYEE_LOAN_LIMIT
        ) {
          throw new Error(
            "This loan does not require Manager approval."
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

        if (
          !customerSnapshot.exists()
        ) {
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

        transaction.update(
          customerRef,
          {
            balance:
              currentBalance +
              amount,

            updatedAt:
              serverTimestamp(),
          }
        );

        transaction.update(
          loanRef,
          {
            status: "approved",

            approvedBy:
              managerId,

            approvedAt:
              serverTimestamp(),

            processedBy:
              managerId,

            processedAt:
              serverTimestamp(),

            approvedByRole:
              "manager",

            outstandingAmount:
              amount,

            paidAmount: 0,

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
 * Reject normal loan.
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

        if (
          loan.status !== "pending"
        ) {
          throw new Error(
            "This loan has already been processed."
          );
        }

        const amount =
          Number(loan.amount);

        if (
          !Number.isFinite(amount) ||
          amount >
            EMPLOYEE_LOAN_LIMIT
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

            processedBy:
              employeeId,

            processedAt:
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


/*
 * MANAGER
 *
 * Reject high-value loan.
 */
export const rejectManagerLoanRequest =
  async ({
    loanId,
    managerId,
  }) => {
    if (!loanId) {
      throw new Error(
        "Loan ID is required."
      );
    }

    if (!managerId) {
      throw new Error(
        "Manager ID is required."
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

        if (
          loan.status !== "pending"
        ) {
          throw new Error(
            "This loan has already been processed."
          );
        }

        const amount =
          Number(loan.amount);

        if (
          !Number.isFinite(amount) ||
          amount <=
            EMPLOYEE_LOAN_LIMIT
        ) {
          throw new Error(
            "This loan does not require Manager approval."
          );
        }

        transaction.update(
          loanRef,
          {
            status: "rejected",

            rejectedBy:
              managerId,

            rejectedAt:
              serverTimestamp(),

            processedBy:
              managerId,

            processedAt:
              serverTimestamp(),

            rejectedByRole:
              "manager",

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


/*
 * ==================================================
 * LOAN REPAYMENT
 * ==================================================
 */


/*
 * CUSTOMER
 *
 * Create a loan repayment request.
 *
 * Customer balance is NOT changed here.
 * Balance changes only after Employee approval.
 */
export const createLoanRepaymentRequest =
  async ({
    loanId,
    customerId,
    amount,
    notes,
  }) => {
    if (!loanId) {
      throw new Error(
        "Loan ID is required."
      );
    }

    if (!customerId) {
      throw new Error(
        "Customer ID is required."
      );
    }

    const numericAmount =
      Number(amount);

    if (
      !Number.isFinite(
        numericAmount
      ) ||
      numericAmount <= 0
    ) {
      throw new Error(
        "Repayment amount must be greater than zero."
      );
    }

    const loanRef = doc(
      db,
      "loans",
      loanId
    );

    const repaymentRef =
      doc(
        loanRepaymentsCollection
      );

    await runTransaction(
      db,
      async (transaction) => {
        const loanSnapshot =
          await transaction.get(
            loanRef
          );

        if (
          !loanSnapshot.exists()
        ) {
          throw new Error(
            "Loan was not found."
          );
        }

        const loan =
          loanSnapshot.data();

        if (
          loan.customerId !==
          customerId
        ) {
          throw new Error(
            "You are not authorized for this loan."
          );
        }

        if (
          loan.status !== "approved"
        ) {
          throw new Error(
            "Only approved loans can be repaid."
          );
        }

        const outstanding =
          Number(
            loan.outstandingAmount ??
              loan.amount ??
              0
          );

        if (
          !Number.isFinite(
            outstanding
          ) ||
          outstanding <= 0
        ) {
          throw new Error(
            "This loan has no outstanding balance."
          );
        }

        if (
          numericAmount >
          outstanding
        ) {
          throw new Error(
            "Repayment cannot exceed outstanding loan balance."
          );
        }

        transaction.set(
          repaymentRef,
          {
            loanId,

            customerId,

            amount:
              numericAmount,

            notes:
              notes?.trim() || "",

            status: "pending",

            createdAt:
              serverTimestamp(),

            updatedAt:
              serverTimestamp(),
          }
        );
      }
    );

    return {
      id: repaymentRef.id,

      loanId,

      customerId,

      amount:
        numericAmount,

      notes:
        notes?.trim() || "",

      status: "pending",
    };
  };


/*
 * EMPLOYEE
 *
 * Get pending loan repayment requests.
 */
export const getPendingLoanRepayments =
  async () => {
    const repaymentsQuery =
      query(
        loanRepaymentsCollection,
        where(
          "status",
          "==",
          "pending"
        )
      );

    const snapshot =
      await getDocs(
        repaymentsQuery
      );

    const repayments =
      snapshot.docs.map(
        (repaymentDoc) => ({
          id:
            repaymentDoc.id,
          ...repaymentDoc.data(),
        })
      );

    repayments.sort(
      (a, b) => {
        const aTime =
          a.createdAt?.toMillis
            ? a.createdAt.toMillis()
            : 0;

        const bTime =
          b.createdAt?.toMillis
            ? b.createdAt.toMillis()
            : 0;

        return bTime - aTime;
      }
    );

    return repayments;
  };


/*
 * EMPLOYEE
 *
 * Approve a loan repayment.
 *
 * Atomically:
 *
 * 1. Reads repayment.
 * 2. Reads loan.
 * 3. Reads customer.
 * 4. Deducts repayment from customer balance.
 * 5. Reduces loan outstanding amount.
 * 6. Marks repayment approved.
 *
 * If outstanding becomes zero,
 * loan becomes "paid".
 */
export const approveLoanRepayment =
  async ({
    repaymentId,
    employeeId,
  }) => {
    if (!repaymentId) {
      throw new Error(
        "Repayment ID is required."
      );
    }

    if (!employeeId) {
      throw new Error(
        "Employee ID is required."
      );
    }

    const repaymentRef =
      doc(
        db,
        "loanRepayments",
        repaymentId
      );

    await runTransaction(
      db,
      async (transaction) => {
        const repaymentSnapshot =
          await transaction.get(
            repaymentRef
          );

        if (
          !repaymentSnapshot.exists()
        ) {
          throw new Error(
            "Repayment request was not found."
          );
        }

        const repayment =
          repaymentSnapshot.data();

        if (
          repayment.status !==
          "pending"
        ) {
          throw new Error(
            "This repayment has already been processed."
          );
        }

        const amount =
          Number(
            repayment.amount
          );

        if (
          !Number.isFinite(amount) ||
          amount <= 0
        ) {
          throw new Error(
            "Invalid repayment amount."
          );
        }

        const loanRef =
          doc(
            db,
            "loans",
            repayment.loanId
          );

        const customerRef =
          doc(
            db,
            "users",
            repayment.customerId
          );

        const loanSnapshot =
          await transaction.get(
            loanRef
          );

        if (
          !loanSnapshot.exists()
        ) {
          throw new Error(
            "Loan was not found."
          );
        }

        const loan =
          loanSnapshot.data();

        if (
          loan.status !==
          "approved"
        ) {
          throw new Error(
            "Only approved loans can receive repayments."
          );
        }

        const outstanding =
          Number(
            loan.outstandingAmount ??
              loan.amount ??
              0
          );

        if (
          !Number.isFinite(
            outstanding
          ) ||
          outstanding <= 0
        ) {
          throw new Error(
            "This loan has no outstanding balance."
          );
        }

        if (
          amount >
          outstanding
        ) {
          throw new Error(
            "Repayment exceeds the outstanding loan amount."
          );
        }

        const customerSnapshot =
          await transaction.get(
            customerRef
          );

        if (
          !customerSnapshot.exists()
        ) {
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

        if (
          currentBalance <
          amount
        ) {
          throw new Error(
            "Customer does not have enough balance for this repayment."
          );
        }

        const newOutstanding =
          outstanding - amount;

        const previousPaid =
          Number(
            loan.paidAmount || 0
          );

        const newPaid =
          (
            Number.isFinite(
              previousPaid
            )
              ? previousPaid
              : 0
          ) + amount;

        const newLoanStatus =
          newOutstanding <= 0
            ? "paid"
            : "approved";

        transaction.update(
          customerRef,
          {
            balance:
              currentBalance -
              amount,

            updatedAt:
              serverTimestamp(),
          }
        );

        transaction.update(
          loanRef,
          {
            outstandingAmount:
              newOutstanding,

            paidAmount:
              newPaid,

            status:
              newLoanStatus,

            updatedAt:
              serverTimestamp(),
          }
        );

        transaction.update(
          repaymentRef,
          {
            status: "approved",

            processedBy:
              employeeId,

            processedAt:
              serverTimestamp(),

            updatedAt:
              serverTimestamp(),
          }
        );
      }
    );

    return {
      repaymentId,

      status:
        "approved",
    };
  };


/*
 * EMPLOYEE
 *
 * Reject a loan repayment.
 *
 * Customer balance is NOT changed.
 * Loan balance is NOT changed.
 */
export const rejectLoanRepayment =
  async ({
    repaymentId,
    employeeId,
  }) => {
    if (!repaymentId) {
      throw new Error(
        "Repayment ID is required."
      );
    }

    if (!employeeId) {
      throw new Error(
        "Employee ID is required."
      );
    }

    const repaymentRef =
      doc(
        db,
        "loanRepayments",
        repaymentId
      );

    await runTransaction(
      db,
      async (transaction) => {
        const repaymentSnapshot =
          await transaction.get(
            repaymentRef
          );

        if (
          !repaymentSnapshot.exists()
        ) {
          throw new Error(
            "Repayment request was not found."
          );
        }

        const repayment =
          repaymentSnapshot.data();

        if (
          repayment.status !==
          "pending"
        ) {
          throw new Error(
            "This repayment has already been processed."
          );
        }

        transaction.update(
          repaymentRef,
          {
            status: "rejected",

            processedBy:
              employeeId,

            processedAt:
              serverTimestamp(),

            updatedAt:
              serverTimestamp(),
          }
        );
      }
    );

    return {
      repaymentId,

      status:
        "rejected",
    };
  };