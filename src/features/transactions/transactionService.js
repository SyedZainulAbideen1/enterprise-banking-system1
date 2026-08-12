import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../api/firebaseConfig";

const transactionsCollection = collection(
  db,
  "transactions"
);

export const getCustomerTransactions = async (
  customerId
) => {
  if (!customerId) {
    throw new Error("Customer ID is required.");
  }

  const transactionsQuery = query(
    transactionsCollection,
    where("customerId", "==", customerId)
  );

  const snapshot = await getDocs(
    transactionsQuery
  );

  const transactions = snapshot.docs.map(
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