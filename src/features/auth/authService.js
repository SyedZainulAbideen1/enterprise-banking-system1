import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../../api/firebaseConfig";

/**
 * Register a new Firebase Authentication user.
 */
export const registerUser = async (email, password) => {
  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  return userCredential.user;
};

/**
 * Login an existing Firebase Authentication user.
 */
export const loginUser = async (email, password) => {
  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  return userCredential.user;
};

/**
 * Logout the currently authenticated user.
 */
export const logoutUser = async () => {
  await signOut(auth);
};

/**
 * Get a user's Firestore profile.
 */
export const getUserProfile = async (uid) => {
  if (!uid) {
    throw new Error("User UID is required.");
  }

  const userRef = doc(db, "users", uid);

  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    throw new Error("User profile was not found.");
  }

  return {
    id: userSnapshot.id,
    ...userSnapshot.data(),
  };
};

/**
 * Create a basic user profile in Firestore.
 */
export const createUserProfile = async ({
  uid,
  email,
  fullName,
  role = "customer",
  status = "pending",
}) => {
  if (!uid) {
    throw new Error("User UID is required.");
  }

  const userRef = doc(db, "users", uid);

  await setDoc(userRef, {
    uid,
    email,
    fullName,
    role,
    status,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    uid,
    email,
    fullName,
    role,
    status,
  };
};