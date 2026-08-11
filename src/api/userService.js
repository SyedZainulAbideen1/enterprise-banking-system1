import { doc, getDoc } from "firebase/firestore";

import { db } from "./firebaseConfig";

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

export const getUserStatus = async (uid) => {
  const userProfile = await getUserProfile(uid);

  return userProfile.status;
};

export const getUserRole = async (uid) => {
  const userProfile = await getUserProfile(uid);

  return userProfile.role;
};
