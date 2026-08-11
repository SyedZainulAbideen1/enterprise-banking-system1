import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "./firebaseConfig";
import { registerWithEmailAndPassword } from "./authService";

export const createRegistrationRequest = async ({
  name,
  email,
  password,
}) => {
  if (!name?.trim()) {
    throw new Error("Name is required.");
  }

  if (!email?.trim()) {
    throw new Error("Email is required.");
  }

  if (!password) {
    throw new Error("Password is required.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  // --------------------------------------------------
  // 1. Create Firebase Authentication account
  // --------------------------------------------------

  const firebaseUser = await registerWithEmailAndPassword(
    normalizedEmail,
    password
  );

  const uid = firebaseUser.uid;

  // --------------------------------------------------
  // 2. Create pending user profile
  // --------------------------------------------------

  const userRef = doc(db, "users", uid);

  await setDoc(userRef, {
    uid,
    name: normalizedName,
    email: normalizedEmail,
    role: "customer",
    status: "pending",
    createdAt: serverTimestamp(),
  });

  // --------------------------------------------------
  // 3. Create registration request
  // --------------------------------------------------

  const requestRef = await addDoc(
    collection(db, "registrationRequests"),
    {
      uid,
      name: normalizedName,
      email: normalizedEmail,
      requestedRole: "customer",
      status: "pending",
      createdAt: serverTimestamp(),
      reviewedAt: null,
      reviewedBy: null,
      rejectionReason: null,
    }
  );

  return {
    uid,
    requestId: requestRef.id,
    status: "pending",
  };
};