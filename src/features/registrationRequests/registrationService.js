import {
  createUserWithEmailAndPassword,
} from "firebase/auth";

import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
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