import {
  createUserWithEmailAndPassword,
} from "firebase/auth";

import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { auth, db } from "../../api/firebaseConfig";

export const registerNewUser = async ({
  email,
  password,
  fullName,
}) => {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedFullName = fullName.trim();

  if (!normalizedEmail) {
    throw new Error("Email is required.");
  }

  if (!password) {
    throw new Error("Password is required.");
  }

  if (!normalizedFullName) {
    throw new Error("Full name is required.");
  }

  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      normalizedEmail,
      password
    );

  const firebaseUser = userCredential.user;

  const userProfileRef = doc(
    db,
    "users",
    firebaseUser.uid
  );

  await setDoc(userProfileRef, {
    uid: firebaseUser.uid,
    email: normalizedEmail,
    fullName: normalizedFullName,
    role: "customer",
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await addDoc(
    collection(db, "registrationRequests"),
    {
      uid: firebaseUser.uid,
      email: normalizedEmail,
      fullName: normalizedFullName,
      requestedRole: "customer",
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );

  return {
    uid: firebaseUser.uid,
    email: normalizedEmail,
    fullName: normalizedFullName,
    role: "customer",
    status: "pending",
  };
};

/*
 * Fetch all registration requests that are
 * currently waiting for Manager approval.
 */
export const getPendingRegistrationRequests = async () => {
  const requestsQuery = query(
    collection(db, "registrationRequests"),
    where("status", "==", "pending")
  );

  const snapshot = await getDocs(requestsQuery);

  return snapshot.docs.map((requestDoc) => ({
    id: requestDoc.id,
    ...requestDoc.data(),
  }));
};

/*
 * Approve a registration request.
 *
 * Both documents are updated together:
 *
 * registrationRequests/{requestId}
 *       status -> approved
 *
 * users/{uid}
 *       status -> active
 */
export const approveRegistrationRequest = async ({
  requestId,
  uid,
}) => {
  if (!requestId) {
    throw new Error("Registration request ID is required.");
  }

  if (!uid) {
    throw new Error("User UID is required.");
  }

  const batch = writeBatch(db);

  const requestRef = doc(
    db,
    "registrationRequests",
    requestId
  );

  const userRef = doc(
    db,
    "users",
    uid
  );

  batch.update(requestRef, {
    status: "approved",
    updatedAt: serverTimestamp(),
  });

  batch.update(userRef, {
    status: "active",
    updatedAt: serverTimestamp(),
  });

  await batch.commit();

  return {
    requestId,
    uid,
    status: "approved",
  };
};

/*
 * Reject a registration request.
 *
 * Both documents are updated together:
 *
 * registrationRequests/{requestId}
 *       status -> rejected
 *
 * users/{uid}
 *       status -> rejected
 */
export const rejectRegistrationRequest = async ({
  requestId,
  uid,
}) => {
  if (!requestId) {
    throw new Error("Registration request ID is required.");
  }

  if (!uid) {
    throw new Error("User UID is required.");
  }

  const batch = writeBatch(db);

  const requestRef = doc(
    db,
    "registrationRequests",
    requestId
  );

  const userRef = doc(
    db,
    "users",
    uid
  );

  batch.update(requestRef, {
    status: "rejected",
    updatedAt: serverTimestamp(),
  });

  batch.update(userRef, {
    status: "rejected",
    updatedAt: serverTimestamp(),
  });

  await batch.commit();

  return {
    requestId,
    uid,
    status: "rejected",
  };
};