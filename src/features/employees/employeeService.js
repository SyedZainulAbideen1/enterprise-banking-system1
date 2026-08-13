import {
  initializeApp,
  getApps,
  getApp,
} from "firebase/app";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "../../api/firebaseConfig";

const employeeCollection = collection(
  db,
  "employees"
);

// Secondary Firebase app.
// This keeps the Manager's login session safe.
const firebaseConfig = {
  apiKey: "AIzaSyCJheaH3fg661F3nqVu1a42sij0YFg5sCw",
  authDomain:
    "enterprise-banking-syste-976dd.firebaseapp.com",
  projectId:
    "enterprise-banking-syste-976dd",
  storageBucket:
    "enterprise-banking-syste-976dd.firebasestorage.app",
  messagingSenderId: "676423646904",
  appId:
    "1:676423646904:web:6fe562305be536f9707e4d",
};

const employeeApp =
  getApps().some(
    (app) => app.name === "employeeApp"
  )
    ? getApp("employeeApp")
    : initializeApp(
        firebaseConfig,
        "employeeApp"
      );

const employeeAuth = getAuth(employeeApp);


// --------------------------------------------------
// GET ALL EMPLOYEES
// --------------------------------------------------

export const getEmployees = async () => {
  const employeesQuery = query(
    employeeCollection,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(
    employeesQuery
  );

  return snapshot.docs.map((employeeDoc) => ({
    id: employeeDoc.id,
    ...employeeDoc.data(),
  }));
};


// --------------------------------------------------
// GET ONE EMPLOYEE
// --------------------------------------------------

export const getEmployee = async (uid) => {
  if (!uid) {
    throw new Error(
      "Employee UID is required."
    );
  }

  const employeeRef = doc(
    db,
    "employees",
    uid
  );

  const snapshot = await getDoc(
    employeeRef
  );

  if (!snapshot.exists()) {
    throw new Error(
      "Employee record was not found."
    );
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};


// --------------------------------------------------
// CREATE EMPLOYEE
// --------------------------------------------------

export const createEmployee = async ({
  name,
  email,
  password,
  salary,
  responsibility,
}) => {

  if (!name?.trim()) {
    throw new Error(
      "Employee name is required."
    );
  }

  if (!email?.trim()) {
    throw new Error(
      "Employee email is required."
    );
  }

  if (!password) {
    throw new Error(
      "Employee password is required."
    );
  }

  if (password.length < 6) {
    throw new Error(
      "Employee password must be at least 6 characters."
    );
  }

  if (
    salary === undefined ||
    salary === null ||
    Number.isNaN(Number(salary)) ||
    Number(salary) < 0
  ) {
    throw new Error(
      "Valid employee salary is required."
    );
  }

  if (!responsibility?.trim()) {
    throw new Error(
      "Employee responsibility is required."
    );
  }

  try {

    // Create Firebase Authentication account
    // using the secondary Firebase instance.
    const userCredential =
      await createUserWithEmailAndPassword(
        employeeAuth,
        email.trim().toLowerCase(),
        password
      );

    const uid = userCredential.user.uid;

    // Employee Firestore profile
    const employeeData = {
      uid,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: "employee",
      status: "active",
      salary: Number(salary),
      responsibility:
        responsibility.trim(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(
      doc(db, "employees", uid),
      employeeData
    );

    // Main user profile
    await setDoc(
      doc(db, "users", uid),
      {
        uid,
        email: email.trim().toLowerCase(),
        fullName: name.trim(),
        role: "employee",
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    );

    return {
      id: uid,
      ...employeeData,
    };

  } finally {

    // Sign out only the secondary employee
    // authentication session.
    await signOut(employeeAuth);
  }
};