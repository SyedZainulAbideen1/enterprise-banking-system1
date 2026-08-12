import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../../api/firebaseConfig";

const transactionsCollection = collection(
  db,
  "transactions"
);

const transactionRequestsCollection = collection(
  db,
  "transactionRequests"
);

/*
 * CUSTOMER
 *
 * Create a deposit request.
 *
 * This does NOT change the customer's balance.
 * Balance is changed only after employee approval.
 */
export const createDepositRequest = async ({
  customerId,
  customerName,
  amount,
  source,
  description,
}) => {
  if (!customerId) {
    throw new Error("Customer ID is required.");
  }

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error(
      "Deposit amount must be greater than zero."
    );
  }

  if (!source?.trim()) {
    throw new Error(
      "Deposit source is required."
    );
  }

  const requestRef = doc(
    transactionRequestsCollection
  );

  await runTransaction(db, async (transaction) => {
    transaction.set(requestRef, {
      customerId,
      customerName:
        customerName?.trim() || "Customer",

      type: "deposit",

      amount: numericAmount,

      source: source.trim(),

      description:
        description?.trim() || "",

      status: "pending",

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  return {
    id: requestRef.id,
    customerId,
    type: "deposit",
    amount: numericAmount,
    status: "pending",
  };
};

/*
 * EMPLOYEE
 *
 * Fetch pending transaction requests.
 */
export const getPendingTransactionRequests =
  async () => {
    const requestsQuery = query(
      transactionRequestsCollection,
      where("status", "==", "pending")
    );

    const snapshot = await getDocs(
      requestsQuery
    );

    const requests = snapshot.docs.map(
      (requestDoc) => ({
        id: requestDoc.id,
        ...requestDoc.data(),
      })
    );

    requests.sort((a, b) => {
      const aTime = a.createdAt?.toMillis
        ? a.createdAt.toMillis()
        : 0;

      const bTime = b.createdAt?.toMillis
        ? b.createdAt.toMillis()
        : 0;

      return bTime - aTime;
    });

    return requests;
  };

/*
 * EMPLOYEE
 *
 * Approve a deposit request.
 *
 * This operation atomically:
 *
 * 1. Reads the customer.
 * 2. Reads the pending request.
 * 3. Updates customer balance.
 * 4. Creates a completed transaction.
 * 5. Marks request as approved.
 */
export const approveDepositRequest = async ({
  requestId,
  employeeId,
}) => {
  if (!requestId) {
    throw new Error(
      "Transaction request ID is required."
    );
  }

  if (!employeeId) {
    throw new Error(
      "Employee ID is required."
    );
  }

  const requestRef = doc(
    db,
    "transactionRequests",
    requestId
  );

  const transactionRef = doc(
    transactionsCollection
  );

  await runTransaction(db, async (transaction) => {
    const requestSnapshot =
      await transaction.get(requestRef);

    if (!requestSnapshot.exists()) {
      throw new Error(
        "Transaction request was not found."
      );
    }

    const request =
      requestSnapshot.data();

    if (request.status !== "pending") {
      throw new Error(
        "This request has already been processed."
      );
    }

    if (request.type !== "deposit") {
      throw new Error(
        "Only deposit requests can be approved here."
      );
    }

    const amount = Number(request.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error(
        "Invalid deposit amount."
      );
    }

    const customerRef = doc(
      db,
      "users",
      request.customerId
    );

    const customerSnapshot =
      await transaction.get(customerRef);

    if (!customerSnapshot.exists()) {
      throw new Error(
        "Customer account was not found."
      );
    }

    const customer =
      customerSnapshot.data();

    const currentBalance =
      Number(customer.balance || 0);

    if (
      !Number.isFinite(currentBalance) ||
      currentBalance < 0
    ) {
      throw new Error(
        "Customer balance is invalid."
      );
    }

    const newBalance =
      currentBalance + amount;

    transaction.update(customerRef, {
      balance: newBalance,
      updatedAt: serverTimestamp(),
    });

    transaction.set(transactionRef, {
      customerId: request.customerId,

      customerName:
        request.customerName ||
        customer.fullName ||
        "Customer",

      type: "deposit",

      amount,

      source: request.source || "",

      description:
        request.description || "",

      status: "completed",

      processedBy: employeeId,

      createdAt: serverTimestamp(),

      requestId,
    });

    transaction.update(requestRef, {
      status: "approved",

      processedBy: employeeId,

      processedAt: serverTimestamp(),

      updatedAt: serverTimestamp(),
    });
  });

  return {
    requestId,
    status: "approved",
  };
};

/*
 * EMPLOYEE
 *
 * Reject a deposit request.
 *
 * Customer balance is NOT changed.
 */
export const rejectTransactionRequest =
  async ({
    requestId,
    employeeId,
  }) => {
    if (!requestId) {
      throw new Error(
        "Transaction request ID is required."
      );
    }

    if (!employeeId) {
      throw new Error(
        "Employee ID is required."
      );
    }

    const requestRef = doc(
      db,
      "transactionRequests",
      requestId
    );

    await runTransaction(
      db,
      async (transaction) => {
        const requestSnapshot =
          await transaction.get(requestRef);

        if (!requestSnapshot.exists()) {
          throw new Error(
            "Transaction request was not found."
          );
        }

        const request =
          requestSnapshot.data();

        if (request.status !== "pending") {
          throw new Error(
            "This request has already been processed."
          );
        }

        transaction.update(requestRef, {
          status: "rejected",

          processedBy: employeeId,

          processedAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),
        });
      }
    );

    return {
      requestId,
      status: "rejected",
    };
  };

/*
 * CUSTOMER
 *
 * Fetch only the authenticated customer's
 * completed transactions.
 */
export const getCustomerTransactions =
  async (customerId) => {
    if (!customerId) {
      throw new Error(
        "Customer ID is required."
      );
    }

    const transactionsQuery = query(
      transactionsCollection,
      where(
        "customerId",
        "==",
        customerId
      )
    );

    const snapshot = await getDocs(
      transactionsQuery
    );

    const transactions =
      snapshot.docs.map(
        (transactionDoc) => ({
          id: transactionDoc.id,
          ...transactionDoc.data(),
        })
      );

    transactions.sort((a, b) => {
      const aTime = a.createdAt?.toMillis
        ? a.createdAt.toMillis()
        : 0;

      const bTime = b.createdAt?.toMillis
        ? b.createdAt.toMillis()
        : 0;

      return bTime - aTime;
    });

    return transactions;
  };